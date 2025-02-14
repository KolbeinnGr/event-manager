/*
  Warnings:

  - You are about to drop the `Attendee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChangeHistory" DROP CONSTRAINT "ChangeHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "_EventEditors" DROP CONSTRAINT "_EventEditors_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventEditors" DROP CONSTRAINT "_EventEditors_B_fkey";

-- DropTable
DROP TABLE "Attendee";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeHistory" ADD CONSTRAINT "ChangeHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventEditors" ADD CONSTRAINT "_EventEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventEditors" ADD CONSTRAINT "_EventEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
