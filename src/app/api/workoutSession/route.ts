import { handleError } from "@/components/error-handle";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const workoutSessions = await prisma.workoutSession.findMany({
        where: {
            userId: session.user.id
        }
    })

    return NextResponse.json(workoutSessions, { status: 200 })
  } catch (error: unknown) {
    const err = handleError(error)
    return NextResponse.json(err, { status: 401 })
  }
}
