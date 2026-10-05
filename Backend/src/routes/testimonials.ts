import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  role: z.string().optional(),
  imageUrl: optionalUrl,
  sortOrder: z.number().int().optional()
});

export const testimonialsRouter = createContentRouter({
  name: "Testimonial",
  delegate: prisma.testimonial as never,
  upsertSchema,
  listArgs: { orderBy: { sortOrder: "asc" } },
  mapCreate: (body, userId) => ({
    text: body.text,
    author: body.author,
    role: body.role ?? "",
    imageUrl: body.imageUrl || null,
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    text: body.text,
    author: body.author,
    role: body.role ?? "",
    imageUrl: body.imageUrl || null,
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
