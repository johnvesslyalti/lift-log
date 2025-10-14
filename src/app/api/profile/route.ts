import { handleError } from "@/components/error-handle";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        height: true,
        weight: true,
      }
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error: unknown) {
    const err = handleError(error);
    return NextResponse.json(err, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const body = await req.json();
    const validateData = profileSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { ...validateData },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error: unknown) {
    const err = handleError(error);
    return NextResponse.json(err, { status: 400 });
  }
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  const userId = session.user.id;

  try {
    // Get all exercises and workouts IDs
    const exercises = await prisma.exercise.findMany({ where: { userId }, select: { id: true } });
    const workouts = await prisma.workout.findMany({ where: { userId }, select: { id: true } });

    const exerciseIds = exercises.map(e => e.id);
    const workoutIds = workouts.map(w => w.id);

    // Delete all workoutExercises related to these
    await prisma.workoutExercise.deleteMany({
      where: {
        OR: [
          { exerciseId: { in: exerciseIds } },
          { workoutId: { in: workoutIds } },
        ],
      },
    });

    await prisma.streak.deleteMany({ where: { userId } });
    await prisma.exercise.deleteMany({ where: { userId } });
    await prisma.workout.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: unknown) {
    const err = handleError(error);
    return NextResponse.json(err, { status: 400 });
  }
}
