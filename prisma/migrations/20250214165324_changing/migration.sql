/*
  Warnings:

  - The primary key for the `EventAttendee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attendeeId` on the `EventAttendee` table. All the data in the column will be lost.
  - Added the required column `userId` to the `EventAttendee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_attendeeId_fkey";

-- AlterTable
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_pkey",
DROP COLUMN "attendeeId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("eventId", "userId");

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
