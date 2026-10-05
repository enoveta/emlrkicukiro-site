import type { ContentStatus } from "@prisma/client";

import type { AuthUser } from "../middleware/auth";
import { HttpError } from "../utils/httpError";

export const assertNotPublished = (status: ContentStatus, user?: AuthUser) => {
  if (status === "PUBLISHED" && user?.role !== "ADMIN") {
    throw new HttpError(409, "Cannot modify published content");
  }
};

export const assertOwnerOrAdmin = (user: AuthUser, createdById: string) => {
  if (user.role === "ADMIN") return;
  if (user.id !== createdById) throw new HttpError(403, "You can only modify your own content");
};

export const assertCanPublish = (user: AuthUser) => {
  if (user.role !== "ADMIN") throw new HttpError(403, "Only admins can publish");
};

export const assertCanRequestReview = (status: ContentStatus) => {
  if (status !== "DRAFT") throw new HttpError(409, "Only drafts can be submitted for review");
};

export const assertCanReject = (status: ContentStatus) => {
  if (status !== "IN_REVIEW") throw new HttpError(409, "Only items in review can be rejected");
};
