import fs from "fs";
import path from "path";

import { Router } from "express";
import multer from "multer";
import sharp from "sharp";

import { authenticate, requireRole } from "../middleware/auth";
import { HttpError } from "../utils/httpError";

const mediaRoot = path.join(process.cwd(), "public", "media");
const uploadsDir = path.join(mediaRoot, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// SVG is intentionally not accepted: it can carry scripts.
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".mov"]);
const OPTIMIZABLE = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_WIDTH = 1920;

/** Resize large photos and re-encode as WebP so the public site stays fast. Returns the final filename. */
const optimizeImage = async (file: Express.Multer.File): Promise<{ filename: string; size: number }> => {
  const ext = path.extname(file.filename).toLowerCase();
  if (!OPTIMIZABLE.has(ext)) return { filename: file.filename, size: file.size };
  const outName = `${path.basename(file.filename, ext)}.webp`;
  const outPath = path.join(uploadsDir, outName);
  try {
    const info = await sharp(file.path)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outPath);
    // Card-sized copy used by the public site for thumbnails (name-800.webp).
    await sharp(file.path)
      .rotate()
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(outPath.replace(/\.webp$/, "-800.webp"));
    if (outPath !== file.path) fs.unlinkSync(file.path);
    return { filename: outName, size: info.size };
  } catch {
    return { filename: file.filename, size: file.size };
  }
};

const describe = async (file: Express.Multer.File) => {
  const { filename, size } = await optimizeImage(file);
  return {
    url: `/media/uploads/${filename}`,
    filename,
    size,
    type: file.mimetype.startsWith("video/") ? "video" : "image"
  };
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!IMAGE_EXT.has(ext)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  }
});

const fileMeta = (absolutePath: string, urlPath: string) => {
  const stat = fs.statSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();
  return {
    name: path.basename(absolutePath),
    url: urlPath,
    size: stat.size,
    updatedAt: stat.mtime.toISOString(),
    type: [".mp4", ".webm", ".mov"].includes(ext) ? "video" : "image"
  };
};

export const uploadsRouter = Router();
uploadsRouter.use(authenticate);
uploadsRouter.use(requireRole(["ADMIN", "CONTENT_MANAGER"]));

uploadsRouter.get("/", (_req, res) => {
  const items: ReturnType<typeof fileMeta>[] = [];

  const walk = (dir: string, urlBase: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "uploads") walk(full, `${urlBase}/uploads`);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXT.has(ext) || /-800\.webp$/i.test(entry.name) || /-poster\.jpg$/i.test(entry.name)) continue;
      items.push(fileMeta(full, `${urlBase}/${entry.name}`));
    }
  };

  walk(mediaRoot, "/media");
  walk(uploadsDir, "/media/uploads");

  // de-dupe by url
  const unique = Array.from(new Map(items.map((i) => [i.url, i])).values());
  unique.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return res.json(unique);
});

uploadsRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) throw new HttpError(400, "No file uploaded");
  return res.status(201).json(await describe(req.file));
});

uploadsRouter.post("/many", upload.array("files", 20), async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) throw new HttpError(400, "No files uploaded");
  const results = [];
  for (const file of files) results.push(await describe(file));
  return res.status(201).json(results);
});

uploadsRouter.delete("/", async (req, res) => {
  const url = String(req.query.url || "");
  if (!url.startsWith("/media/uploads/")) {
    throw new HttpError(400, "Only uploaded files can be deleted");
  }
  const filename = path.basename(url);
  const full = path.join(uploadsDir, filename);
  if (!fs.existsSync(full)) throw new HttpError(404, "File not found");
  fs.unlinkSync(full);
  const variant = full.replace(/\.webp$/i, "-800.webp");
  if (variant !== full && fs.existsSync(variant)) fs.unlinkSync(variant);
  return res.status(204).send();
});
