/*
  Warnings:

  - You are about to drop the column `role` on the `Attendee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "EventAttendee" ADD COLUMN     "role" "AttendeeRole" NOT NULL DEFAULT 'attendee';

-- AlterTable
ALTER TABLE "RecurringDetails" ALTER COLUMN "daysOfWeek" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "customDates" SET DEFAULT ARRAY[]::TEXT[];
