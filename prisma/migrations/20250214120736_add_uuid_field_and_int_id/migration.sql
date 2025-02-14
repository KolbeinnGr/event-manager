/*
  Warnings:

  - The primary key for the `Attendee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Attendee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Change` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Change` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ChangeHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ChangeHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `recurringDetailsId` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `EventAttendee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RecurringDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RecurringDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_EventEditors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `changeHistoryId` on the `Change` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `changedById` on the `ChangeHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `attendeeId` on the `EventAttendee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_EventEditors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Change" DROP CONSTRAINT "Change_changeHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "ChangeHistory" DROP CONSTRAINT "ChangeHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_recurringDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "_EventEditors" DROP CONSTRAINT "_EventEditors_A_fkey";

-- AlterTable
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Change" DROP CONSTRAINT "Change_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "changeHistoryId",
ADD COLUMN     "changeHistoryId" INTEGER NOT NULL,
ADD CONSTRAINT "Change_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChangeHistory" DROP CONSTRAINT "ChangeHistory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "changedById",
ADD COLUMN     "changedById" INTEGER NOT NULL,
ADD CONSTRAINT "ChangeHistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "recurringDetailsId",
ADD COLUMN     "recurringDetailsId" INTEGER,
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_pkey",
DROP COLUMN "attendeeId",
ADD COLUMN     "attendeeId" INTEGER NOT NULL,
ADD CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("eventId", "attendeeId");

-- AlterTable
ALTER TABLE "RecurringDetails" DROP CONSTRAINT "RecurringDetails_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecurringDetails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_EventEditors" DROP CONSTRAINT "_EventEditors_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_EventEditors_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "Event_recurringDetailsId_key" ON "Event"("recurringDetailsId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_recurringDetailsId_fkey" FOREIGN KEY ("recurringDetailsId") REFERENCES "RecurringDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeHistory" ADD CONSTRAINT "ChangeHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Change" ADD CONSTRAINT "Change_changeHistoryId_fkey" FOREIGN KEY ("changeHistoryId") REFERENCES "ChangeHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventEditors" ADD CONSTRAINT "_EventEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
