import { handleError } from "@/components/error-handle";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper to get session
async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Invalid User");
  return session;
}

// GET all progress for the current user
export async function GET() {
  try {
    const session = await getSession();

    const progressData = await prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
      include: { workout: true },
    });

    const result = progressData.map((p) => ({
      id: p.id,
      date: p.date.toISOString(),
      workout: p.workout?.name ?? "Unknown Workout",
      weight: p.weight ?? null,
      caloriesBurned: p.caloriesBurned ?? null,
    }));

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}

// POST new progress entry + update streak
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { workoutId, weight, caloriesBurned } = await req.json();

    if (!workoutId) {
      return NextResponse.json(
        { message: "Workout ID is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Create progress entry
    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        workoutId,
        weight: weight ?? null,
        caloriesBurned: caloriesBurned ?? null,
      },
      include: { workout: true },
    });

    // 2️⃣ Calculate streak
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));

    const existingStreak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    let streakCount = 1;

    if (!existingStreak) {
      // First-time streak
      await prisma.streak.create({
        data: { userId: session.user.id, count: 1, lastDate: new Date() },
      });
    } else {
      const lastWorkoutDate = existingStreak.lastDate
        ? new Date(existingStreak.lastDate)
        : null;

      const diffDays = lastWorkoutDate
        ? Math.floor(
            (startOfToday.getTime() -
              new Date(lastWorkoutDate.setHours(0, 0, 0, 0)).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : Infinity;

      if (diffDays === 1) {
        streakCount = existingStreak.count + 1;
      } else if (diffDays > 1) {
        streakCount = 1; // reset streak
      } else {
        streakCount = existingStreak.count; // already today
      }

      await prisma.streak.upsert({
        where: { userId: session.user.id },
        update: { count: streakCount, lastDate: new Date() },
        create: { userId: session.user.id, count: streakCount, lastDate: new Date() },
      });
    }

    return NextResponse.json({
      id: progress.id,
      workout: progress.workout?.name ?? "Unknown Workout",
      weight: progress.weight ?? null,
      caloriesBurned: progress.caloriesBurned ?? null,
      createdAt: progress.createdAt.toISOString(),
      streak: streakCount,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}

// DELETE progress entry
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Progress ID is required" },
        { status: 400 }
      );
    }

    await prisma.progress.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: "Progress entry deleted" });
  } catch (error: unknown) {
    handleError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
