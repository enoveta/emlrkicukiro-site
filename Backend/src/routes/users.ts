import { Router } from "express";
import { z } from "zod";

import { prisma } from "../prisma/client";
import { authenticate, requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { HttpError } from "../utils/httpError";

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.use(requireRole(["ADMIN"]));

usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" }
  });

  return res.json(users);
});

const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "CONTENT_MANAGER"])
});

usersRouter.patch("/:id/role", validateBody(updateUserRoleSchema), async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) throw new HttpError(401, "Unauthorized");

  const { role } = req.body as z.infer<typeof updateUserRoleSchema>;

  if (req.user.id === id && role !== "ADMIN") {
    throw new HttpError(409, "You cannot change your own role");
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "User not found");

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  return res.json(user);
});
