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
      include: { workout: true }, // optional: get workout name
    });

    // Return only the fields we care about
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

// POST new progress entry
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { workoutId, weight, caloriesBurned } = await req.json();

    if (!workoutId) {
      return NextResponse.json({ message: "Workout ID is required" }, { status: 400 });
    }

    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        workoutId,
        weight: weight ?? null,
        caloriesBurned: caloriesBurned ?? null,
      },
      include: { workout: true },
    });

    return NextResponse.json({
      id: progress.id,
      workout: progress.workout?.name ?? "Unknown Workout",
      weight: progress.weight ?? null,
      caloriesBurned: progress.caloriesBurned ?? null,
      createdAt: progress.createdAt.toISOString(),
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
