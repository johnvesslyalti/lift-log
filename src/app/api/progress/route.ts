import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(progress);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error", error);
      return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid user" }, { status: 401 });

  try {
    // Optional: parse body if you want to include weight
    const body = await req.json().catch(() => ({}));
    const { weight } = body;

    // Get the last progress entry to calculate streak
    const lastProgress = await prisma.progress.findFirst({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });

    const today = new Date();
    const lastDate = lastProgress ? new Date(lastProgress.date) : null;
    const diffDays =
      lastDate && (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

    let newStreak = 1;
    if (diffDays && diffDays < 2) {
      // continued streak
      newStreak = (lastProgress?.streak ?? 0) + 1;
    }

    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        weight: weight ? parseFloat(weight) : null,
        streak: newStreak,
      },
    });

    return NextResponse.json(progress);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
