import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  name: z.string().min(1),
  position: z.string().optional(),
  imageUrl: optionalUrl,
  team: z.enum(["NATIONAL", "PARISH", "OTHER"]).optional(),
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  sortOrder: z.number().int().optional()
});

export const peopleRouter = createContentRouter({
  name: "Person",
  delegate: prisma.person as never,
  upsertSchema,
  rwFields: ["positionRw"],
  listArgs: { orderBy: [{ team: "asc" }, { sortOrder: "asc" }] },
  mapCreate: (body, userId) => ({
    name: body.name,
    position: body.position ?? "",
    imageUrl: body.imageUrl || null,
    team: body.team ?? "PARISH",
    bio: body.bio ?? null,
    phone: body.phone ?? null,
    email: body.email ?? null,
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    name: body.name,
    position: body.position ?? "",
    imageUrl: body.imageUrl || null,
    team: body.team ?? "PARISH",
    bio: body.bio ?? null,
    phone: body.phone ?? null,
    email: body.email ?? null,
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
