import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { prisma } from "../prisma/client";
import {
  assertCanPublish,
  assertCanReject,
  assertCanRequestReview,
  assertNotPublished,
  assertOwnerOrAdmin
} from "../services/workflowService";
import { HttpError } from "../utils/httpError";
import { optionalUrl } from "../utils/contentRouter";

export const bannersRouter = Router();
bannersRouter.use(authenticate);

const slideSchema = z.object({
  imageUrl: z.string().min(1),
  mediaType: z.enum(["image", "video"]).optional(),
  text: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  highlight: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  cta1: z.string().optional().nullable(),
  cta1Link: z.string().optional().nullable(),
  cta2: z.string().optional().nullable(),
  cta2Rw: z.string().optional().nullable(),
  cta2Link: z.string().optional().nullable(),
  titleRw: z.string().optional().nullable(),
  highlightRw: z.string().optional().nullable(),
  subtitleRw: z.string().optional().nullable(),
  cta1Rw: z.string().optional().nullable(),
  duration: z.number().int().optional(),
  hasBlur: z.boolean().optional(),
  order: z.number().int().min(0)
});

const upsertSchema = z.object({
  slides: z.array(slideSchema).min(1)
});

const mapSlide = (s: z.infer<typeof slideSchema>) => ({
  imageUrl: s.imageUrl,
  mediaType: s.mediaType ?? "image",
  text: s.text ?? null,
  title: s.title ?? null,
  highlight: s.highlight ?? null,
  subtitle: s.subtitle ?? null,
  titleRw: s.titleRw ?? null,
  highlightRw: s.highlightRw ?? null,
  subtitleRw: s.subtitleRw ?? null,
  cta1: s.cta1 ?? null,
  cta1Rw: s.cta1Rw ?? null,
  cta1Link: s.cta1Link ?? null,
  cta2: s.cta2 ?? null,
  cta2Rw: s.cta2Rw ?? null,
  cta2Link: s.cta2Link ?? null,
  duration: s.duration ?? 8000,
  hasBlur: s.hasBlur ?? true,
  order: s.order
});

bannersRouter.get("/", async (_req, res) => {
  const items = await prisma.banner.findMany({
    include: { slides: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" }
  });
  return res.json(items);
});

bannersRouter.get("/:id", async (req, res) => {
  const item = await prisma.banner.findUnique({
    where: { id: req.params.id },
    include: { slides: { orderBy: { order: "asc" } } }
  });
  if (!item) throw new HttpError(404, "Banner not found");
  return res.json(item);
});

bannersRouter.post("/", validateBody(upsertSchema), async (req: AuthenticatedRequest, res) => {
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const body = req.body as z.infer<typeof upsertSchema>;
  const created = await prisma.banner.create({
    data: {
      createdById: req.user.id,
      slides: { create: body.slides.map(mapSlide) }
    },
    include: { slides: { orderBy: { order: "asc" } } }
  });
  return res.status(201).json(created);
});

bannersRouter.put("/:id", validateBody(upsertSchema), async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Banner not found");
  assertOwnerOrAdmin(req.user, existing.createdById);
  assertNotPublished(existing.status, req.user);
  const body = req.body as z.infer<typeof upsertSchema>;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.bannerSlide.deleteMany({ where: { bannerId: id } });
    await tx.bannerSlide.createMany({
      data: body.slides.map((s) => ({ ...mapSlide(s), bannerId: id }))
    });
    return tx.banner.findUnique({
      where: { id },
      include: { slides: { orderBy: { order: "asc" } } }
    });
  });

  return res.json(updated);
});

bannersRouter.delete("/:id", async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Banner not found");
  assertOwnerOrAdmin(req.user, existing.createdById);
  if (existing.status === "PUBLISHED" && req.user.role !== "ADMIN") {
    throw new HttpError(403, "Only admins can delete published content");
  }
  await prisma.banner.delete({ where: { id } });
  return res.status(204).send();
});

bannersRouter.post("/:id/request-review", async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Banner not found");
  assertOwnerOrAdmin(req.user, existing.createdById);
  assertCanRequestReview(existing.status);
  return res.json(await prisma.banner.update({ where: { id }, data: { status: "IN_REVIEW" } }));
});

bannersRouter.post("/:id/reject", requireRole(["ADMIN"]), async (req, res) => {
  const id = req.params.id;
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Banner not found");
  assertCanReject(existing.status);
  return res.json(await prisma.banner.update({ where: { id }, data: { status: "DRAFT" } }));
});

bannersRouter.post("/:id/publish", async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) throw new HttpError(401, "Unauthorized");
  assertCanPublish(req.user);
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Banner not found");
  if (existing.status === "PUBLISHED") throw new HttpError(409, "Already published");
  return res.json(
    await prisma.banner.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date(), publishedById: req.user.id },
      include: { slides: { orderBy: { order: "asc" } } }
    })
  );
});

// silence unused import if tree-shaken
void optionalUrl;
