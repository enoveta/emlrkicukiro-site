import { z } from "zod";

import { createContentRouter, optionalUrl } from "../utils/contentRouter";
import { prisma } from "../prisma/client";

const upsertSchema = z.object({
  purposeKey: z.string().min(1),
  purposeName: z.string().min(1),
  mtnNumber: optionalUrl,
  airtelNumber: optionalUrl,
  mobileName: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  accountName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  swift: z.string().optional().nullable(),
  sortOrder: z.number().int().optional()
});

export const givingRouter = createContentRouter({
  name: "Giving account",
  delegate: prisma.givingAccount as never,
  upsertSchema,
  rwFields: ["purposeNameRw"],
  listArgs: { orderBy: { sortOrder: "asc" } },
  mapCreate: (body, userId) => ({
    purposeKey: body.purposeKey,
    purposeName: body.purposeName,
    mtnNumber: body.mtnNumber || null,
    airtelNumber: body.airtelNumber || null,
    mobileName: body.mobileName ?? null,
    bankName: body.bankName ?? null,
    accountName: body.accountName ?? null,
    accountNumber: body.accountNumber ?? null,
    swift: body.swift ?? null,
    sortOrder: Number(body.sortOrder ?? 0),
    createdById: userId
  }),
  mapUpdate: (body) => ({
    purposeKey: body.purposeKey,
    purposeName: body.purposeName,
    mtnNumber: body.mtnNumber || null,
    airtelNumber: body.airtelNumber || null,
    mobileName: body.mobileName ?? null,
    bankName: body.bankName ?? null,
    accountName: body.accountName ?? null,
    accountNumber: body.accountNumber ?? null,
    swift: body.swift ?? null,
    sortOrder: Number(body.sortOrder ?? 0)
  })
});
