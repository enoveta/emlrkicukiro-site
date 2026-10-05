import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

export const NOTICE_CATEGORIES = ["daily", "weekly", "monthly", "urgent"] as const;

const upsertSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.enum(NOTICE_CATEGORIES).optional(),
  publishDate: z.string().min(1),
  expiresAt: z.string().optional().nullable(),
  pinned: z.boolean().optional(),
  attachmentUrl: optionalUrl
});

const toDate = (value: unknown) => (value ? new Date(String(value)) : null);

const mapNotice = (body: Record<string, unknown>) => ({
  title: body.title,
  body: body.body,
  category: body.category ?? "weekly",
  publishDate: new Date(String(body.publishDate)),
  expiresAt: toDate(body.expiresAt),
  pinned: Boolean(body.pinned),
  attachmentUrl: body.attachmentUrl || null
});

export const noticesRouter = createContentRouter({
  name: "Notice",
  delegate: prisma.notice as never,
  upsertSchema,
  rwFields: ["titleRw", "bodyRw"],
  listArgs: { orderBy: [{ pinned: "desc" }, { publishDate: "desc" }] },
  mapCreate: (body, userId) => ({ ...mapNotice(body), createdById: userId }),
  mapUpdate: (body) => mapNotice(body)
});
