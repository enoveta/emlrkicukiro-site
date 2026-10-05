import { Router } from "express";

import { authRouter } from "./auth";
import { usersRouter } from "./users";
import { eventsRouter } from "./events";
import { announcementsRouter } from "./announcements";
import { noticesRouter } from "./notices";
import { scheduleRouter } from "./schedule";
import { servicesRouter } from "./services";
import { projectsRouter } from "./projects";
import { bannersRouter } from "./banners";
import { ministriesRouter } from "./ministries";
import { peopleRouter } from "./people";
import { galleryRouter } from "./gallery";
import { testimonialsRouter } from "./testimonials";
import { statsRouter } from "./stats";
import { givingRouter } from "./giving";
import { settingsRouter } from "./settings";
import { submissionsRouter } from "./submissions";
import { uploadsRouter } from "./uploads";
import { dashboardRouter } from "./dashboard";
import { publicRouter } from "./public";
import { swaggerRouter } from "./swagger";
import { analyticsRouter, trackRouter } from "./analytics";

export const apiRouter = Router();

apiRouter.use("/docs", swaggerRouter);

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/dashboard", dashboardRouter);

apiRouter.use("/events", eventsRouter);
apiRouter.use("/announcements", announcementsRouter);
apiRouter.use("/notices", noticesRouter);
apiRouter.use("/schedule", scheduleRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/banners", bannersRouter);
apiRouter.use("/ministries", ministriesRouter);
apiRouter.use("/people", peopleRouter);
apiRouter.use("/gallery", galleryRouter);
apiRouter.use("/testimonials", testimonialsRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/giving", givingRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/submissions", submissionsRouter);
apiRouter.use("/uploads", uploadsRouter);

apiRouter.use("/public/track", trackRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/analytics", analyticsRouter);
