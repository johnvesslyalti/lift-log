import z from "zod";

export const workoutSchema = z.object({
  name: z.string(),
  exercises: z.array(z.number()).nonempty("selected at least one exercise")
});

export const profileSchema = z.object({
    height: z.float32().optional(),
    weight: z.float32().optional()
});

export const exerciseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sets: z.int(),
    reps: z.int()
})

export const progressSchema = z.object({
    streak:z.number().min(0),
    weight: z.float32().optional()
})