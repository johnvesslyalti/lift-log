"use client";

import { useEffect, useState } from "react";
import WorkoutDialog from "./workout-dialog";

type Workout = {
  id: string;
  title: string;
  exercise?: string[]; // ensure optional
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Example API fetch — replace with your actual route
        const res = await fetch("/api/workout");
        const data: Workout[] = await res.json();

        // Ensure every workout has an exercise array
        const safeData = data.map((w) => ({
          ...w,
          exercise: w.exercise || [],
        }));

        setWorkouts(safeData);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <p>Loading workouts...</p>;
  if (!workouts.length) return <p>No workouts found. Add some!</p>;

  return (
    <div className="p-4">
      <WorkoutDialog />
      <div className="mt-4 space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">{workout.title}</h3>
            <p className="text-gray-600">
              Exercises: {workout.exercise?.join(", ") || "No exercises yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
