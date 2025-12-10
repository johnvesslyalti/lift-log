import { z } from "zod";

// --- Workout Schema ---
export const workoutSchema = z.object({
    name: z.string(),
    exercises: z.array(z.number()).nonempty("selected at least one exercise")
});

// --- Exercise Schema ---
export const exerciseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sets: z.int(),
    reps: z.int()
})

// --- Progress Schema ---
export const progressSchema = z.object({
    streak: z.number().min(0),
    weight: z.number().optional() // Changed float32 to number, as JS numbers are floats
})

export const profileSchema = z.object({
    // Input is string, Output is number | null | undefined
    height: z.string()
        .transform((val) => (val === "" ? null : Number(val)))
        .nullable()
        .refine((val) => val === null || (val >= 50 && val <= 300), {
            message: "Height must be between 50 and 300 cm.",
        })
        .optional(),
    // Weight... (similar logic)
    weight: z.string()
        .transform((val) => (val === "" ? null : Number(val)))
        .nullable()
        .refine((val) => val === null || (val >= 20 && val <= 500), {
            message: "Weight must be between 20 and 500 kg.",
        })
        .optional(),
});

// The final transformed output type (for API/Zustand update)
export type ProfileFormValues = z.infer<typeof profileSchema>;

// The raw input type (for useForm defaultValues)
export type ProfileFormInput = {
    height?: string | null | undefined;
    weight?: string | null | undefined;
};