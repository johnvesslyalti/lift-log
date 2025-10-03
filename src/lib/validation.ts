import z from "zod";

export const workoutSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user", version: "v4" }),
  name: z.string(),
});

export const profileSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user", version: "v4"}),
    height: z.float32(),
    weight: z.float32()
});