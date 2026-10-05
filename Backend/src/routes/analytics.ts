import crypto from "crypto";
import { Router, type Request } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import { env } from "../config/env";
import { authenticate, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { prisma } from "../prisma/client";

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch/i;

const deviceOf = (ua: string) =>
  /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";

/** Same person + same day → same key; nothing reversible is stored. */
const visitorKey = (req: Request) =>
  crypto
    .createHash("sha256")
    .update(`${req.ip}|${req.get("user-agent") ?? ""}|${new Date().toISOString().slice(0, 10)}|${env.jwtSecret}`)
    .digest("hex")
    .slice(0, 24);

export const trackRouter = Router();

const trackSchema = z.object({
  path: z.string().min(1).max(200).regex(/^\//),
  lang: z.enum(["en", "rw"]).default("en")
});

trackRouter.post(
  "/",
  rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false }),
  validateBody(trackSchema),
  async (req, res) => {
    const ua = req.get("user-agent") ?? "";
    const { path, lang } = req.body as z.infer<typeof trackSchema>;
    if (!BOT.test(ua) && !path.startsWith("/admin")) {
      await prisma.pageView.create({
        data: { path: path.split("?")[0].replace(/\/+$/, "") || "/", lang, device: deviceOf(ua), visitorKey: visitorKey(req) }
      });
    }
    return res.status(204).send();
  }
);

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);
analyticsRouter.use(requireRole(["ADMIN", "CONTENT_MANAGER"]));

const DAY = 86_400_000;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

analyticsRouter.get("/", async (req, res) => {
  const days = [7, 30, 90].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) + DAY);
  const start = new Date(end.getTime() - days * DAY);
  const prevStart = new Date(start.getTime() - days * DAY);

  const [views, prevViews, prayers, volunteers, prevPrayers, prevVolunteers] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: { gte: start, lt: end } }, select: { path: true, lang: true, device: true, visitorKey: true, createdAt: true } }),
    prisma.pageView.findMany({ where: { createdAt: { gte: prevStart, lt: start } }, select: { visitorKey: true } }),
    prisma.prayerRequest.findMany({ where: { createdAt: { gte: start, lt: end } }, select: { createdAt: true } }),
    prisma.volunteerApplication.findMany({ where: { createdAt: { gte: start, lt: end } }, select: { createdAt: true } }),
    prisma.prayerRequest.count({ where: { createdAt: { gte: prevStart, lt: start } } }),
    prisma.volunteerApplication.count({ where: { createdAt: { gte: prevStart, lt: start } } })
  ]);

  const daily = new Map<string, { views: number; visitors: Set<string>; prayers: number; volunteers: number }>();
  for (let t = start.getTime(); t < end.getTime(); t += DAY) {
    daily.set(dayKey(new Date(t)), { views: 0, visitors: new Set(), prayers: 0, volunteers: 0 });
  }
  const pages = new Map<string, number>();
  const langs = new Map<string, number>();
  const devices = new Map<string, number>();
  const visitors = new Set<string>();
  for (const v of views) {
    const d = daily.get(dayKey(v.createdAt));
    if (d) {
      d.views += 1;
      d.visitors.add(v.visitorKey);
    }
    visitors.add(v.visitorKey);
    pages.set(v.path, (pages.get(v.path) ?? 0) + 1);
    langs.set(v.lang, (langs.get(v.lang) ?? 0) + 1);
    devices.set(v.device, (devices.get(v.device) ?? 0) + 1);
  }
  for (const p of prayers) {
    const d = daily.get(dayKey(p.createdAt));
    if (d) d.prayers += 1;
  }
  for (const v of volunteers) {
    const d = daily.get(dayKey(v.createdAt));
    if (d) d.volunteers += 1;
  }

  const toList = (m: Map<string, number>) =>
    [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);

  return res.json({
    days,
    totals: {
      views: views.length,
      visitors: visitors.size,
      prayers: prayers.length,
      volunteers: volunteers.length
    },
    previous: {
      views: prevViews.length,
      visitors: new Set(prevViews.map((v) => v.visitorKey)).size,
      prayers: prevPrayers,
      volunteers: prevVolunteers
    },
    daily: [...daily.entries()].map(([date, d]) => ({
      date,
      views: d.views,
      visitors: d.visitors.size,
      prayers: d.prayers,
      volunteers: d.volunteers
    })),
    topPages: toList(pages).slice(0, 8),
    languages: toList(langs),
    devices: toList(devices)
  });
});
