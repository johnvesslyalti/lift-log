/*
  Warnings:

  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutSession" DROP CONSTRAINT "WorkoutSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkoutSession" DROP CONSTRAINT "WorkoutSession_workoutId_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Progress";

-- DropTable
DROP TABLE "public"."WorkoutSession";

-- CreateTable
CREATE TABLE "workout_progress" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "weight" DOUBLE PRECISION,
    "caloriesBurned" DOUBLE PRECISION,
    "streak" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_progress" ADD CONSTRAINT "workout_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_progress" ADD CONSTRAINT "workout_progress_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
