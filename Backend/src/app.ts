import "express-async-errors";
import path from "path";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  app.use("/media", express.static(path.join(process.cwd(), "public", "media")));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
};
