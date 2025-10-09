import { handleError } from "@/components/error-handle";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { exerciseSchema } from "@/lib/validation";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json(
      { message: "Invalid user authentication" },
      { status: 401 }
    );

  try {
    const exercises = await prisma.exercise.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(exercises, { status: 200 });
  } catch (error: unknown) {
    const err = handleError(error)
    return NextResponse.json(err, { status: 500})
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });
  try {
    const body = await req.json();

    const validateData = await exerciseSchema.parse(body);

    const { name } = validateData;

    const existingExercise = await prisma.exercise.findFirst({
        where: {
            userId: session.user.id,
            name,
        },
    });

    if(existingExercise) {
        return new Response(
            JSON.stringify({ message: "Exercise with this name already exists."}), { status : 400}
        );
    }

    await prisma.exercise.create({
      data: {
        name: validateData.name,
        sets: validateData.sets,
        reps: validateData.reps,
        userId: session.user.id
      },
    });

    return NextResponse.json({ message: "Exercise create successfully"})
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
