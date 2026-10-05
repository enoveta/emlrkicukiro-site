import "express-async-errors";
import path from "path";

import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  // Behind nginx on the VPS: trust the first proxy so rate limits see real client IPs.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin: env.corsOrigins.length ? env.corsOrigins : env.isProduction ? false : true
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.isProduction ? "combined" : "dev"));

  // Old page addresses that lived under /media (shared links keep working).
  app.get(/^\/media\/(news|gallery|tv)(\/.*)?$/i, (req, res) => {
    res.redirect(301, req.path.replace(/^\/media/i, "").toLowerCase());
  });

  // In production nginx serves /media directly; this is the fallback (and the dev server).
  app.use("/media", express.static(path.join(process.cwd(), "public", "media"), { maxAge: "30d" }));
  app.use("/media", (_req, res) => res.status(404).json({ message: "File not found" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
};
