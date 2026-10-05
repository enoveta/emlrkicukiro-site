-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleRw" TEXT,
    "category" TEXT NOT NULL DEFAULT 'service',
    "dayOfWeek" INTEGER NOT NULL,
    "recurrence" TEXT NOT NULL DEFAULT 'every',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "location" TEXT,
    "locationRw" TEXT,
    "leader" TEXT,
    "notes" TEXT,
    "notesRw" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleItem_status_dayOfWeek_idx" ON "ScheduleItem"("status", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

