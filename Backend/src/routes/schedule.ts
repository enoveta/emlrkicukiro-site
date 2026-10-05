import { z } from "zod";

import { createContentRouter } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

export const SCHEDULE_CATEGORIES = ["service", "prayer", "choir", "fellowship", "youth", "children", "meeting", "other"] as const;
export const SCHEDULE_RECURRENCE = ["every", "first", "second", "third", "fourth", "last"] as const;

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, e.g. 08:00 or 18:30");

const upsertSchema = z.object({
  title: z.string().min(1),
  category: z.enum(SCHEDULE_CATEGORIES).optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  recurrence: z.enum(SCHEDULE_RECURRENCE).optional(),
  startTime: time,
  endTime: z.union([time, z.literal(""), z.null()]).optional(),
  location: z.string().optional().nullable(),
  leader: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sortOrder: z.number().int().optional()
});

const mapItem = (body: Record<string, unknown>) => ({
  title: body.title,
  category: body.category ?? "service",
  dayOfWeek: Number(body.dayOfWeek),
  recurrence: body.recurrence ?? "every",
  startTime: body.startTime,
  endTime: body.endTime || null,
  location: body.location || null,
  leader: body.leader || null,
  notes: body.notes || null,
  sortOrder: Number(body.sortOrder ?? 0)
});

export const scheduleRouter = createContentRouter({
  name: "Schedule item",
  delegate: prisma.scheduleItem as never,
  upsertSchema,
  rwFields: ["titleRw", "locationRw", "notesRw"],
  listArgs: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
  mapCreate: (body, userId) => ({ ...mapItem(body), createdById: userId }),
  mapUpdate: (body) => mapItem(body)
});
