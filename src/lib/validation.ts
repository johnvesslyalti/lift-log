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

export const exerciseSchema = z.object({
    name: z.string(),
    sets: z.int(),
    reps: z.int(),
    weight: z.float32().optional()
})

export const progressSchema = z.object({
    streak:z.number().min(0),
    weight: z.float32().optional()
})