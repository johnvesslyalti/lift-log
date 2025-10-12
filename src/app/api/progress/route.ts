import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Type for request body
interface ProgressRequestBody {
  workoutId: number;
  startTime: string;
  endTime?: string;
  weight?: number;
  caloriesBurned?: number;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
      include: { workout: true }, // Include workout details for frontend
    });

    return NextResponse.json(progress);
  } catch (error: unknown) {
    console.error("Unexpected error", error);
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
    const body: ProgressRequestBody = await req.json();

    const { workoutId, startTime, endTime, weight, caloriesBurned } = body;

    if (!workoutId || !startTime) {
      return NextResponse.json(
        { message: "Workout ID and start time are required" },
        { status: 400 }
      );
    }

    // Fetch last progress entry for streak calculation
    const lastProgress = await prisma.progress.findFirst({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
    });

    const lastDate = lastProgress?.startTime ? new Date(lastProgress.startTime) : null;
    const newStartDate = new Date(startTime);

    let newStreak = 1;
    if (lastDate) {
      const diffDays = (newStartDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 2) {
        newStreak = (lastProgress?.streak ?? 0) + 1;
      }
    }

    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        workoutId,
        startTime: newStartDate,
        endTime: endTime ? new Date(endTime) : null,
        weight: weight ?? null,
        caloriesBurned: caloriesBurned ?? null,
        streak: newStreak,
      },
      include: { workout: true }, // Include workout for frontend display
    });

    return NextResponse.json(progress);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
