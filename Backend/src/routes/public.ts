import { Router } from "express";
import { z } from "zod";

import { prisma } from "../prisma/client";
import { validateBody } from "../middleware/validate";

export const publicRouter = Router();

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

const prayerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  request: z.string().min(1)
});

publicRouter.post("/prayer-requests", validateBody(prayerSchema), async (req, res) => {
  const body = req.body as z.infer<typeof prayerSchema>;
  const created = await prisma.prayerRequest.create({ data: body });
  return res.status(201).json({ id: created.id, message: "Prayer request received" });
});

const volunteerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  areaOfInterest: z.string().min(1),
  message: z.string().optional().nullable()
});

publicRouter.post("/volunteers", validateBody(volunteerSchema), async (req, res) => {
  const body = req.body as z.infer<typeof volunteerSchema>;
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
