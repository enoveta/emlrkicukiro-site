import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
