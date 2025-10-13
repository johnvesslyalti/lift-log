/*
  Warnings:

  - You are about to drop the column `duration` on the `workout_progress` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `workout_progress` table. All the data in the column will be lost.
  - You are about to drop the column `streak` on the `workout_progress` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `workout_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_progress" DROP COLUMN "duration",
DROP COLUMN "notes",
DROP COLUMN "streak",
DROP COLUMN "weight";
