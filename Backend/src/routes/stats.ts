import { z } from "zod";

import { createContentRouter } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  number: z.string().min(1),
  label: z.string().min(1),
  sortOrder: z.number().int().optional()
});

export const statsRouter = createContentRouter({
  name: "Stat",
  delegate: prisma.stat as never,
  upsertSchema,
  rwFields: ["labelRw"],
  listArgs: { orderBy: { sortOrder: "asc" } },
  mapCreate: (body, userId) => ({
    number: body.number,
    label: body.label,
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    number: body.number,
    label: body.label,
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
