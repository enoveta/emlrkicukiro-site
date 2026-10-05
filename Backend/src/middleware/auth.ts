import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export type AuthUser = {
  id: string;
  role: "ADMIN" | "CONTENT_MANAGER";
  email: string;
};

export type AuthenticatedRequest = Request & { user?: AuthUser };

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) throw new HttpError(401, "Missing Authorization header");

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) throw new HttpError(401, "Invalid auth header");

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.user = payload;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
};

export const requireRole = (roles: Array<AuthUser["role"]>) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) throw new HttpError(401, "Unauthorized");
    if (!roles.includes(req.user.role)) throw new HttpError(403, "Forbidden");
    next();
  };
};
