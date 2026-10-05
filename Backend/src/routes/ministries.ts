import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  shortDescription: z.string().min(1),
  body: z.string().min(1),
  heroImageUrl: optionalUrl,
  aboutImageUrl: optionalUrl,
  scheduleLabel: z.string().optional().nullable(),
  youtubeUrl: optionalUrl,
  featuredOnHome: z.boolean().optional(),
  homeOrder: z.number().int().optional(),
  sortOrder: z.number().int().optional()
});

export const ministriesRouter = createContentRouter({
  name: "Ministry",
  delegate: prisma.ministry as never,
  upsertSchema,
  rwFields: ["nameRw", "shortDescriptionRw", "bodyRw", "scheduleLabelRw"],
  listArgs: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
  mapCreate: (body, userId) => ({
    slug: body.slug,
    name: body.name,
    category: body.category ?? "general",
    shortDescription: body.shortDescription,
    body: body.body,
    heroImageUrl: body.heroImageUrl || null,
    aboutImageUrl: body.aboutImageUrl || null,
    scheduleLabel: body.scheduleLabel ?? null,
    youtubeUrl: body.youtubeUrl || null,
    featuredOnHome: Boolean(body.featuredOnHome),
    homeOrder: Number(body.homeOrder ?? 0),
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    slug: body.slug,
    name: body.name,
    category: body.category ?? "general",
    shortDescription: body.shortDescription,
    body: body.body,
    heroImageUrl: body.heroImageUrl || null,
    aboutImageUrl: body.aboutImageUrl || null,
    scheduleLabel: body.scheduleLabel ?? null,
    youtubeUrl: body.youtubeUrl || null,
    featuredOnHome: Boolean(body.featuredOnHome),
    homeOrder: Number(body.homeOrder ?? 0),
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
