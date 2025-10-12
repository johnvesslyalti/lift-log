/*
  Warnings:

  - You are about to drop the column `endTime` on the `workout_progress` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `workout_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_progress" DROP COLUMN "endTime",
DROP COLUMN "startTime";
