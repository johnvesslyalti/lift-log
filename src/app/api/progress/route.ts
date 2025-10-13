import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const today = startOfDay(new Date());
    const weekStart = subDays(today, 6); // last 7 days (today + past 6 days)

    const progressData = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: weekStart,
          lte: today,
        },
      },
      orderBy: { date: "asc" },
    });

    // Group data by day (aggregate calories and avg weight)
    const dailySummary = Array.from({ length: 7 }).map((_, i) => {
      const currentDate = subDays(today, 6 - i);
      const formattedDate = currentDate.toISOString().split("T")[0];

      const dayEntries = progressData.filter(
        (p) => p.date.toISOString().split("T")[0] === formattedDate
      );

      const totalCalories = dayEntries.reduce(
        (sum, d) => sum + (d.caloriesBurned || 0),
        0
      );
      const avgWeight =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, d) => sum + (d.weight || 0), 0) /
            dayEntries.length
          : null;

      return {
        date: formattedDate,
        calories: totalCalories,
        weight: avgWeight,
      };
    });

    return NextResponse.json(dailySummary);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const body = await req.json();
    const { workoutId, weight, caloriesBurned } = body;

    if (!workoutId) {
      return NextResponse.json(
        { message: "Workout ID is required" },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        workoutId,
        weight: weight ?? null,
        caloriesBurned: caloriesBurned ?? null,
      },
      include: {
        workout: {
          include: {
            workoutExercises: {
              include: { Exercise: true },
            },
          },
        },
      },
    });

    // derive stats same as GET
    const exercises = progress.workout?.workoutExercises ?? [];
    const totalSets = exercises.reduce((acc, e) => acc + (e.Exercise.sets ?? 0), 0);
    const totalReps = exercises.reduce((acc, e) => acc + (e.Exercise.reps ?? 0), 0);

    const formatted = {
      id: String(progress.id),
      workout: progress.workout?.name ?? "Unknown Workout",
      sets: totalSets,
      reps: totalReps,
      createdAt: progress.createdAt.toISOString(),
    };

    return NextResponse.json(formatted);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
