import { ZodError } from "zod";

export function handleError(error: unknown) {
    if(error instanceof ZodError) {
        return { type: "validation", issues: error.issues}
    } else if (error instanceof Error){
        console.error(error.message)
        return { type: "error", message: error.message}
    } else {
        console.error("unExpected error", error);
        return { type: "unknown", message: "unexpected error occured"}
    }
}