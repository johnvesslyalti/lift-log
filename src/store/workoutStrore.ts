import { create } from "zustand";

interface WorkoutState {
    workoutId: number | null;
    setWorkoutId: (id: number) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
    workoutId: null,
    setWorkoutId: (id) => set({ workoutId: id}),
}))