import { Router } from "express";

import { authenticate, requireRole } from "../middleware/auth";
import { prisma } from "../prisma/client";

export const dashboardRouter = Router();
dashboardRouter.use(authenticate);
dashboardRouter.use(requireRole(["ADMIN", "CONTENT_MANAGER"]));

dashboardRouter.get("/summary", async (_req, res) => {
  const [
    events,
    announcements,
    ministries,
    people,
    gallery,
    testimonials,
    banners,
    services,
    giving,
    stats,
    notices,
    schedule,
    prayerNew,
    volunteerNew,
    prayerTotal,
    volunteerTotal
  ] = await Promise.all([
    prisma.event.groupBy({ by: ["status"], _count: true }),
    prisma.announcement.groupBy({ by: ["status"], _count: true }),
    prisma.ministry.groupBy({ by: ["status"], _count: true }),
    prisma.person.groupBy({ by: ["status"], _count: true }),
    prisma.galleryItem.groupBy({ by: ["status"], _count: true }),
    prisma.testimonial.groupBy({ by: ["status"], _count: true }),
    prisma.banner.groupBy({ by: ["status"], _count: true }),
    prisma.service.groupBy({ by: ["status"], _count: true }),
    prisma.givingAccount.groupBy({ by: ["status"], _count: true }),
    prisma.stat.groupBy({ by: ["status"], _count: true }),
    prisma.notice.groupBy({ by: ["status"], _count: true }),
    prisma.scheduleItem.groupBy({ by: ["status"], _count: true }),
    prisma.prayerRequest.count({ where: { status: "NEW" } }),
    prisma.volunteerApplication.count({ where: { status: "NEW" } }),
    prisma.prayerRequest.count(),
    prisma.volunteerApplication.count()
  ]);

  const recentPrayers = await prisma.prayerRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  const recentVolunteers = await prisma.volunteerApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const summarize = (rows: { status: string; _count: number }[]) => {
    const map = { DRAFT: 0, IN_REVIEW: 0, PUBLISHED: 0, total: 0 };
    for (const row of rows) {
      map[row.status as keyof typeof map] = row._count;
      map.total += row._count;
    }
    return map;
  };

  return res.json({
    content: {
      events: summarize(events),
      announcements: summarize(announcements),
      ministries: summarize(ministries),
      people: summarize(people),
      gallery: summarize(gallery),
      testimonials: summarize(testimonials),
      banners: summarize(banners),
      services: summarize(services),
      giving: summarize(giving),
      stats: summarize(stats),
      notices: summarize(notices),
      schedule: summarize(schedule)
    },
    inbox: {
      prayerNew,
      volunteerNew,
      prayerTotal,
      volunteerTotal
    },
    recent: {
      prayers: recentPrayers,
      volunteers: recentVolunteers
    }
  });
});
