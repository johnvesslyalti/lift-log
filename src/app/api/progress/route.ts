import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Type for request body (startTime & endTime removed)
interface ProgressRequestBody {
  workoutId: number;
  weight?: number;
  caloriesBurned?: number;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" }, // ordering by id since startTime is removed
      include: { workout: true },
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
    const { workoutId, weight, caloriesBurned } = body;

    if (!workoutId) {
      return NextResponse.json(
        { message: "Workout ID is required" },
        { status: 400 }
      );
    }

    // Create a new progress entry without time fields
    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        workoutId,
        weight: weight ?? null,
        caloriesBurned: caloriesBurned ?? null,
      },
      include: { workout: true },
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
