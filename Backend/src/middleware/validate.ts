import type { NextFunction, Request, Response } from "express";
import type { ZodIssue, ZodSchema } from "zod";

import { HttpError } from "../utils/httpError";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(
        400,
        parsed.error.issues.map((i: ZodIssue) => i.message).join(", ")
      );
    }

    req.body = parsed.data;
    next();
  };
};
