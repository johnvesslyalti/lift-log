import { handleError } from "@/components/error-handle";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(res: NextResponse, req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const body = await req.json();

    const validateData = profileSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validateData,
      },
    });
  } catch (error: unknown) {
    const err = handleError(error);
    return NextResponse.json(err, { status: 400 });
  }
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const userId = session.user.id;

    // 1. Delete all WorkoutExercise records of this user's exercises or workouts
    await prisma.workoutExercise.deleteMany({
      where: {
        OR: [{ Exercise: { userId } }, { Workout: { userId } }],
      },
    });

    // 2. Delete all Exercises of this user
    await prisma.exercise.deleteMany({ where: { userId } });

    // 3. Delete all Workouts of this user
    await prisma.workout.deleteMany({ where: { userId } });

    // 4. Finally, delete the User
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: unknown) {
    const err = handleError(error);
    return NextResponse.json(err, { status: 400 });
  }
}
