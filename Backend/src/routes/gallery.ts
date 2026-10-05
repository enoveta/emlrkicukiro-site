import { z } from "zod";

import { createContentRouter } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  imageUrl: z.string().min(1),
  alt: z.string().optional(),
  caption: z.string().optional(),
  sortOrder: z.number().int().optional()
});

export const galleryRouter = createContentRouter({
  name: "Gallery item",
  delegate: prisma.galleryItem as never,
  upsertSchema,
  rwFields: ["altRw", "captionRw"],
  listArgs: { orderBy: { sortOrder: "asc" } },
  mapCreate: (body, userId) => ({
    imageUrl: body.imageUrl,
    alt: body.alt ?? "",
    caption: body.caption ?? "",
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    imageUrl: body.imageUrl,
    alt: body.alt ?? "",
    caption: body.caption ?? "",
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
