import fs from "fs";
import path from "path";

import { Router } from "express";
import multer from "multer";

import { authenticate, requireRole } from "../middleware/auth";
import { HttpError } from "../utils/httpError";

const mediaRoot = path.join(process.cwd(), "public", "media");
const uploadsDir = path.join(mediaRoot, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4", ".webm", ".mov"]);

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
      if (!IMAGE_EXT.has(ext)) continue;
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

uploadsRouter.post("/", upload.single("file"), (req, res) => {
  if (!req.file) throw new HttpError(400, "No file uploaded");
  const url = `/media/uploads/${req.file.filename}`;
  return res.status(201).json({
    url,
    filename: req.file.filename,
    size: req.file.size,
    type: req.file.mimetype.startsWith("video/") ? "video" : "image"
  });
});

uploadsRouter.post("/many", upload.array("files", 20), (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) throw new HttpError(400, "No files uploaded");
  return res.status(201).json(
    files.map((file) => ({
      url: `/media/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      type: file.mimetype.startsWith("video/") ? "video" : "image"
    }))
  );
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
  return res.status(204).send();
});
