import { Router } from "express";
import { z } from "zod";

import { prisma } from "../prisma/client";
import { validateBody } from "../middleware/validate";
import { HttpError } from "../utils/httpError";
import { verifyPassword, signToken, hashPassword } from "../services/authService";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
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

authRouter.post("/signup", validateBody(signupSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof signupSchema>;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email already exists");

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "CONTENT_MANAGER"
    }
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});
