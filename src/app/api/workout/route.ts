import { auth } from "@/lib/auth";
import { workoutSchema } from "@/lib/validation";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workouts = await prisma.workout.findMany({
        where: { userId: session.user.id },
    });

    return NextResponse.json(workouts, { status: 200 })

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 401 });
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("unexpected error", error);
    }
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const validateData = workoutSchema.parse(body);

    await prisma.workout.create({
      data: {
        userId: validateData.userId,
        name: validateData.name,
      },
    });

    return NextResponse.json(
      { message: "Workout created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("unexpected error", error);
    }
  }
}
