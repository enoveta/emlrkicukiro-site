import { Router } from "express";
import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().optional().nullable(),
  imageUrl: optionalUrl
});

export const eventsRouter = createContentRouter({
  name: "Event",
  delegate: prisma.event as never,
  upsertSchema,
  rwFields: ["titleRw", "descriptionRw", "timeRw", "locationRw"],
  listArgs: { orderBy: { date: "desc" } },
  mapCreate: (body, userId) => ({
    title: body.title,
    description: body.description,
    date: new Date(String(body.date)),
    time: body.time,
    location: body.location ?? null,
    imageUrl: body.imageUrl || null,
    createdById: userId
  }),
  mapUpdate: (body) => ({
    title: body.title,
    description: body.description,
    date: new Date(String(body.date)),
    time: body.time,
    location: body.location ?? null,
    imageUrl: body.imageUrl || null
  })
});
