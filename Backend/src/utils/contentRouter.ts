import { Router, type Request, type Response } from "express";
import { z } from "zod";

import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { prisma } from "../prisma/client";
import {
  assertCanPublish,
  assertCanReject,
  assertCanRequestReview,
  assertNotPublished,
  assertOwnerOrAdmin
} from "../services/workflowService";
import { HttpError } from "../utils/httpError";

type ContentDelegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

type MapBody = (body: Record<string, unknown>, userId: string) => Record<string, unknown>;

type Options = {
  name: string;
  delegate: ContentDelegate;
  upsertSchema: z.ZodTypeAny;
  mapCreate: MapBody;
  mapUpdate: MapBody;
  listArgs?: unknown;
  getArgs?: (id: string) => unknown;
  createArgs?: (data: Record<string, unknown>) => unknown;
  updateInclude?: unknown;
  /** Optional Kinyarwanda text columns accepted alongside the English fields */
  rwFields?: string[];
};

const pickRw = (body: Record<string, unknown>, fields: string[], forCreate: boolean) => {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const value = body[field];
    if (value === undefined) {
      if (forCreate) out[field] = null;
      continue;
    }
    out[field] = typeof value === "string" && value.trim() ? value.trim() : null;
  }
  return out;
};

export const createContentRouter = (options: Options) => {
  const router = Router();
  router.use(authenticate);

  const rwFields = options.rwFields ?? [];
  const upsertSchema = rwFields.length
    ? (options.upsertSchema as z.AnyZodObject).extend(
        Object.fromEntries(rwFields.map((field) => [field, z.string().optional().nullable()]))
      )
    : options.upsertSchema;

  router.get("/", async (_req, res) => {
    const items = await options.delegate.findMany(options.listArgs ?? { orderBy: { updatedAt: "desc" } });
    return res.json(items);
  });

  router.get("/:id", async (req, res) => {
    const item = await options.delegate.findUnique(
      options.getArgs?.(req.params.id) ?? { where: { id: req.params.id } }
    );
    if (!item) throw new HttpError(404, `${options.name} not found`);
    return res.json(item);
  });

  router.post("/", validateBody(upsertSchema), async (req: AuthenticatedRequest, res) => {
    if (!req.user) throw new HttpError(401, "Unauthorized");
    const body = req.body as Record<string, unknown>;
    const data = { ...options.mapCreate(body, req.user.id), ...pickRw(body, rwFields, true) };
    const created = await options.delegate.create(
      options.createArgs?.(data) ?? { data }
    );
    return res.status(201).json(created);
  });

  router.put("/:id", validateBody(upsertSchema), async (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const existing = (await options.delegate.findUnique({ where: { id } })) as
      | { createdById: string; status: string }
      | null;
    if (!existing) throw new HttpError(404, `${options.name} not found`);

    assertOwnerOrAdmin(req.user, existing.createdById);
    assertNotPublished(existing.status as "DRAFT" | "IN_REVIEW" | "PUBLISHED", req.user);

    const body = req.body as Record<string, unknown>;
    const data = { ...options.mapUpdate(body, req.user.id), ...pickRw(body, rwFields, false) };
    const updated = await options.delegate.update({
      where: { id },
      data,
      ...(options.updateInclude ? { include: options.updateInclude } : {})
    });
    return res.json(updated);
  });

  router.delete("/:id", async (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const existing = (await options.delegate.findUnique({ where: { id } })) as
      | { createdById: string; status: string }
      | null;
    if (!existing) throw new HttpError(404, `${options.name} not found`);

    assertOwnerOrAdmin(req.user, existing.createdById);
    if (existing.status === "PUBLISHED" && req.user.role !== "ADMIN") {
      throw new HttpError(403, "Only admins can delete published content");
    }

    await options.delegate.delete({ where: { id } });
    return res.status(204).send();
  });

  router.post("/:id/request-review", async (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    if (!req.user) throw new HttpError(401, "Unauthorized");

    const existing = (await options.delegate.findUnique({ where: { id } })) as
      | { createdById: string; status: string }
      | null;
    if (!existing) throw new HttpError(404, `${options.name} not found`);

    assertOwnerOrAdmin(req.user, existing.createdById);
    assertCanRequestReview(existing.status as "DRAFT" | "IN_REVIEW" | "PUBLISHED");

    const updated = await options.delegate.update({ where: { id }, data: { status: "IN_REVIEW" } });
    return res.json(updated);
  });

  router.post("/:id/reject", requireRole(["ADMIN"]), async (req: Request, res: Response) => {
    const id = req.params.id;
    const existing = (await options.delegate.findUnique({ where: { id } })) as { status: string } | null;
    if (!existing) throw new HttpError(404, `${options.name} not found`);
    assertCanReject(existing.status as "DRAFT" | "IN_REVIEW" | "PUBLISHED");
    const updated = await options.delegate.update({ where: { id }, data: { status: "DRAFT" } });
    return res.json(updated);
  });

  router.post("/:id/publish", async (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    if (!req.user) throw new HttpError(401, "Unauthorized");
    assertCanPublish(req.user);

    const existing = (await options.delegate.findUnique({ where: { id } })) as { status: string } | null;
    if (!existing) throw new HttpError(404, `${options.name} not found`);
    if (existing.status === "PUBLISHED") throw new HttpError(409, "Already published");

    const updated = await options.delegate.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        publishedById: req.user.id
      }
    });
    return res.json(updated);
  });

  return router;
};

export const optionalUrl = z.union([z.string().min(1), z.literal(""), z.null()]).optional();
