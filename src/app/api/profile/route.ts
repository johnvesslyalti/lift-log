import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

async function getSession(req: NextRequest) {
  return await auth.api.getSession({ headers: req.headers });
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { height: true, weight: true },
  });

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = profileSchema.parse(await req.json());

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({ message: "Profile updated successfully" });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  await prisma.$transaction([
    prisma.streak.deleteMany({ where: { userId } }),
    prisma.workoutExercise.deleteMany({
      where: {
        OR: [
          { Workout: { userId } },
          { Exercise: { userId } },
        ],
      },
    }),
    prisma.exercise.deleteMany({ where: { userId } }),
    prisma.workout.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ message: "Account deleted successfully" });
}
