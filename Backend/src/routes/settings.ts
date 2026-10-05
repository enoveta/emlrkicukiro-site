import { Router } from "express";
import { z } from "zod";

import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { prisma } from "../prisma/client";
import { HttpError } from "../utils/httpError";

export const settingsRouter = Router();
settingsRouter.use(authenticate);
settingsRouter.use(requireRole(["ADMIN", "CONTENT_MANAGER"]));

settingsRouter.get("/", async (_req, res) => {
  const items = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  return res.json(items);
});

const upsertSchema = z.object({
  key: z.string().min(1),
  value: z.string()
});

settingsRouter.put("/", validateBody(upsertSchema), async (req: AuthenticatedRequest, res) => {
  const body = req.body as z.infer<typeof upsertSchema>;
  const item = await prisma.siteSetting.upsert({
    where: { key: body.key },
    create: { key: body.key, value: body.value },
    update: { value: body.value }
  });
  return res.json(item);
});

const bulkSchema = z.object({
  settings: z.array(upsertSchema).min(1)
});

settingsRouter.put("/bulk", validateBody(bulkSchema), async (req, res) => {
  const body = req.body as z.infer<typeof bulkSchema>;
  const results = [];
  for (const setting of body.settings) {
    results.push(
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        create: { key: setting.key, value: setting.value },
        update: { value: setting.value }
      })
    );
  }
  return res.json(results);
});

settingsRouter.delete("/:key", requireRole(["ADMIN"]), async (req, res) => {
  const existing = await prisma.siteSetting.findUnique({ where: { key: req.params.key } });
  if (!existing) throw new HttpError(404, "Setting not found");
  await prisma.siteSetting.delete({ where: { key: req.params.key } });
  return res.status(204).send();
});
