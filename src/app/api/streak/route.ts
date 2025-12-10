import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Invalid User");
  return session;
}

export async function GET() {
  try {
    const session = await getSession();

    const streak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      streak: streak?.count ?? 0,
      lastUpdated: streak?.lastDate ?? null,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
