import { Router } from "express";
import { z } from "zod";

import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { prisma } from "../prisma/client";
import { HttpError } from "../utils/httpError";

export const submissionsRouter = Router();
submissionsRouter.use(authenticate);
submissionsRouter.use(requireRole(["ADMIN", "CONTENT_MANAGER"]));

submissionsRouter.get("/prayer-requests", async (_req, res) => {
  const items = await prisma.prayerRequest.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(items);
});

submissionsRouter.get("/volunteers", async (_req, res) => {
  const items = await prisma.volunteerApplication.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(items);
});

const statusSchema = z.object({
  status: z.enum(["NEW", "READ", "ARCHIVED"])
});

submissionsRouter.patch("/prayer-requests/:id", validateBody(statusSchema), async (req, res) => {
  const existing = await prisma.prayerRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "Prayer request not found");
  const body = req.body as z.infer<typeof statusSchema>;
  return res.json(await prisma.prayerRequest.update({ where: { id: req.params.id }, data: { status: body.status } }));
});

submissionsRouter.patch("/volunteers/:id", validateBody(statusSchema), async (req, res) => {
  const existing = await prisma.volunteerApplication.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "Volunteer application not found");
  const body = req.body as z.infer<typeof statusSchema>;
  return res.json(
    await prisma.volunteerApplication.update({ where: { id: req.params.id }, data: { status: body.status } })
  );
});

submissionsRouter.delete("/prayer-requests/:id", requireRole(["ADMIN"]), async (req: AuthenticatedRequest, res) => {
  await prisma.prayerRequest.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});

submissionsRouter.delete("/volunteers/:id", requireRole(["ADMIN"]), async (req, res) => {
  await prisma.volunteerApplication.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
