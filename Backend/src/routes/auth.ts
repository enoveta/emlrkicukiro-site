import { Router } from "express";
import { z } from "zod";

import { prisma } from "../prisma/client";
import { validateBody } from "../middleware/validate";
import { HttpError } from "../utils/httpError";
import { verifyPassword, signToken, hashPassword } from "../services/authService";
import { authenticate, type AuthenticatedRequest } from "../middleware/auth";
import { loginLimiter } from "../middleware/rateLimit";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post("/login", loginLimiter, validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

// Accounts are created by an admin via POST /api/users (public sign-up is disabled).

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(10)
});

authRouter.post(
  "/password",
  authenticate,
  validateBody(passwordSchema),
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) throw new HttpError(401, "Unauthorized");
    const { currentPassword, newPassword } = req.body as z.infer<typeof passwordSchema>;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
      throw new HttpError(400, "Current password is incorrect");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) }
    });
    return res.status(204).send();
  }
);
