import { Router } from "express";
import { z } from "zod";

import { prisma } from "../prisma/client";
import { validateBody } from "../middleware/validate";
import { askAssistant } from "../services/chatService";
import { getPlaylistVideos } from "../services/youtubeService";
import { HttpError } from "../utils/httpError";
import { chatLimiter, formLimiter } from "../middleware/rateLimit";

export const publicRouter = Router();

// Let browsers/CDN reuse public content briefly and serve it stale while refreshing.
publicRouter.use((req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=86400");
  next();
});

const getSetting = async (key: string) =>
  (await prisma.siteSetting.findUnique({ where: { key } }))?.value ?? null;

publicRouter.get("/events", async (_req, res) => {
  const data = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { date: "asc" }
  });
  return res.json(data);
});

publicRouter.get("/announcements", async (_req, res) => {
  const data = await prisma.announcement.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { date: "desc" }
  });
  return res.json(data);
});

publicRouter.get("/announcements/:id", async (req, res) => {
  const item = await prisma.announcement.findFirst({
    where: { id: req.params.id, status: "PUBLISHED" }
  });
  if (!item) return res.status(404).json({ message: "News item not found" });
  return res.json(item);
});

publicRouter.get("/notices", async (_req, res) => {
  const data = await prisma.notice.findMany({
    where: { status: "PUBLISHED", publishDate: { lte: new Date() } },
    orderBy: [{ pinned: "desc" }, { publishDate: "desc" }],
    take: 300
  });
  return res.json(data);
});

publicRouter.get("/schedule", async (_req, res) => {
  const data = await prisma.scheduleItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }, { sortOrder: "asc" }]
  });
  return res.json(data);
});

publicRouter.get("/services", async (_req, res) => {
  const data = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { date: "desc" }
  });
  return res.json(data);
});

publicRouter.get("/projects", async (_req, res) => {
  const data = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startDate: "desc" }
  });
  return res.json(data);
});

publicRouter.get("/banners", async (_req, res) => {
  const data = await prisma.banner.findMany({
    where: { status: "PUBLISHED" },
    include: { slides: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" }
  });
  return res.json(data);
});

publicRouter.get("/ministries", async (_req, res) => {
  const data = await prisma.ministry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
  return res.json(data);
});

publicRouter.get("/ministries/:slug", async (req, res) => {
  const item = await prisma.ministry.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" }
  });
  if (!item) return res.status(404).json({ message: "Ministry not found" });
  return res.json(item);
});

publicRouter.get("/people", async (_req, res) => {
  const data = await prisma.person.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ team: "asc" }, { sortOrder: "asc" }]
  });
  return res.json(data);
});

publicRouter.get("/gallery", async (_req, res) => {
  const data = await prisma.galleryItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" }
  });
  return res.json(data);
});

publicRouter.get("/testimonials", async (_req, res) => {
  // Hidden site-wide unless an admin turns the section on in Site settings.
  if ((await getSetting("showTestimonials")) !== "true") return res.json([]);
  const data = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" }
  });
  return res.json(data);
});

publicRouter.get("/stats", async (_req, res) => {
  const data = await prisma.stat.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" }
  });
  return res.json(data);
});

publicRouter.get("/giving", async (_req, res) => {
  const data = await prisma.givingAccount.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" }
  });
  return res.json(data);
});

publicRouter.get("/settings", async (_req, res) => {
  const items = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const item of items) map[item.key] = item.value;
  return res.json(map);
});

const playlistIdSchema = z.string().regex(/^[A-Za-z0-9_-]{10,64}$/);

publicRouter.get("/youtube/playlists/:id", async (req, res) => {
  const parsed = playlistIdSchema.safeParse(req.params.id);
  if (!parsed.success) throw new HttpError(400, "Invalid playlist id");
  res.set("Cache-Control", "public, max-age=600, stale-while-revalidate=86400");
  return res.json(await getPlaylistVideos(parsed.data));
});

const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().min(1).max(1000) }))
    .min(1)
    .max(12)
});

publicRouter.post("/chat", chatLimiter, validateBody(chatSchema), async (req, res) => {
  const body = req.body as z.infer<typeof chatSchema>;
  res.set("Cache-Control", "no-store");
  return res.json({ reply: await askAssistant(body.messages) });
});

const prayerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  request: z.string().trim().min(1).max(4000),
  website: z.string().optional() // honeypot: real visitors never fill this
});

const isBot = (body: { website?: string }) => Boolean(body.website && body.website.trim());

publicRouter.post("/prayer-requests", formLimiter, validateBody(prayerSchema), async (req, res) => {
  const { website, ...body } = req.body as z.infer<typeof prayerSchema>;
  if (isBot({ website })) return res.status(201).json({ message: "Prayer request received" });
  const created = await prisma.prayerRequest.create({ data: body });
  return res.status(201).json({ id: created.id, message: "Prayer request received" });
});

const volunteerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(40),
  areaOfInterest: z.string().trim().min(1).max(120),
  message: z.string().max(4000).optional().nullable(),
  website: z.string().optional()
});

publicRouter.post("/volunteers", formLimiter, validateBody(volunteerSchema), async (req, res) => {
  const body = req.body as z.infer<typeof volunteerSchema>;
  if (isBot(body)) return res.status(201).json({ message: "Volunteer application received" });
  const created = await prisma.volunteerApplication.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      areaOfInterest: body.areaOfInterest,
      message: body.message ?? null
    }
  });
  return res.status(201).json({ id: created.id, message: "Volunteer application received" });
});
