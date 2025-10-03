import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
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
    const exercises = prisma.exercises.findMany({
        where: { userId: session.user.id }
    })

    return NextResponse.json(exercises, { status: 200 })

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

export async function POST() {
    
}