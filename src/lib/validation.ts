import z from "zod";

export const workoutSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user", version: "v4"}),
    name: z.string()
})