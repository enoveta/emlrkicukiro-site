import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  serviceTitle: z.string().min(1),
  topic: z.string().min(1),
  preacherName: z.string().min(1),
  verse: z.string().min(1),
  date: z.string().min(1),
  imageUrl: optionalUrl
});

export const servicesRouter = createContentRouter({
  name: "Service",
  delegate: prisma.service as never,
  upsertSchema,
  listArgs: { orderBy: { date: "desc" } },
  mapCreate: (body, userId) => ({
    serviceTitle: body.serviceTitle,
    topic: body.topic,
    preacherName: body.preacherName,
    verse: body.verse,
    date: new Date(String(body.date)),
    imageUrl: body.imageUrl || null,
    createdById: userId
  }),
  mapUpdate: (body) => ({
    serviceTitle: body.serviceTitle,
    topic: body.topic,
    preacherName: body.preacherName,
    verse: body.verse,
    date: new Date(String(body.date)),
    imageUrl: body.imageUrl || null
  })
});
