import { auth } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient()

export async function POST(res: NextResponse, req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers()})
    if (!session)
        return NextResponse.json({ message: "Invalid User"}, { status: 401 })

    try {
        const body = await req.json()

        const validateData = profileSchema.parse(body)

        await prisma.User.update({
            data: {
                userId: validateData.userId,
                validateData
            }
        })

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 401 })
        } else if(error instanceof Error) {
            console.error(error.message)
        } else {
            console.error("Unexpected errors", error)
        }
    }
}