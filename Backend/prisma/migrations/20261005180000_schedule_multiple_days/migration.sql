-- Activities can repeat on several days (e.g. morning prayer Monday to Saturday).
ALTER TABLE "ScheduleItem" ADD COLUMN "days" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
UPDATE "ScheduleItem" SET "days" = ARRAY["dayOfWeek"];
ALTER TABLE "ScheduleItem" ALTER COLUMN "days" DROP DEFAULT;
ALTER TABLE "ScheduleItem" ADD COLUMN "ministrySlug" TEXT;
DROP INDEX IF EXISTS "ScheduleItem_status_dayOfWeek_idx";
ALTER TABLE "ScheduleItem" DROP COLUMN "dayOfWeek";
CREATE INDEX "ScheduleItem_status_idx" ON "ScheduleItem"("status");
