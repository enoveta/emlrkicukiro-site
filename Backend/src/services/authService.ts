import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import type { AuthUser } from "../middleware/auth";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash);
};

export const signToken = (user: AuthUser) => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(user, env.jwtSecret, options);
};
