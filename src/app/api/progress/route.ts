import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });

  try {
    await prisma.findMany({
        where: {userId: session.user.id }
    })

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

export async function POST() {
    const session = await auth.api.getSession({ headers: await headers()})
    if (!session)
        return NextResponse.json({ message: 'Invalid user'}, { status: 401 })

    const progress = await prisma.progress.upsert({
        where: { userId: session.user.id },
        update: {
            streak: { increament: 1}
        },
        create: {
            userId: session.user.id,
            streak: 1
        }
    });

    return NextResponse.json(progress);
}