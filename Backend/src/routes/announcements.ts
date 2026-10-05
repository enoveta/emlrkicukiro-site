import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  imageUrl: optionalUrl
});

export const announcementsRouter = createContentRouter({
  name: "Announcement",
  delegate: prisma.announcement as never,
  upsertSchema,
  listArgs: { orderBy: { date: "desc" } },
  mapCreate: (body, userId) => ({
    title: body.title,
    content: body.content,
    date: new Date(String(body.date)),
    imageUrl: body.imageUrl || null,
    createdById: userId
  }),
  mapUpdate: (body) => ({
    title: body.title,
    content: body.content,
    date: new Date(String(body.date)),
    imageUrl: body.imageUrl || null
  })
});
