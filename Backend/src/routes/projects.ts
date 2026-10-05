import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  goalAmount: z.union([z.number(), z.string()]),
  amountReached: z.union([z.number(), z.string()]).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  imageUrl: optionalUrl
});

export const projectsRouter = createContentRouter({
  name: "Project",
  delegate: prisma.project as never,
  upsertSchema,
  listArgs: { orderBy: { startDate: "desc" } },
  mapCreate: (body, userId) => ({
    title: body.title,
    description: body.description,
    goalAmount: body.goalAmount,
    amountReached: body.amountReached ?? 0,
    startDate: new Date(String(body.startDate)),
    endDate: new Date(String(body.endDate)),
    imageUrl: body.imageUrl || null,
    createdById: userId
  }),
  mapUpdate: (body) => ({
    title: body.title,
    description: body.description,
    goalAmount: body.goalAmount,
    amountReached: body.amountReached ?? 0,
    startDate: new Date(String(body.startDate)),
    endDate: new Date(String(body.endDate)),
    imageUrl: body.imageUrl || null
  })
});
