"use client";

import { useEffect, useState } from "react";
import WorkoutDialog from "./workout-dialog";

type Workout = {
  id: string;
  title: string;
  exercise: string[];
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workout");
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const data: Workout[] = await res.json();

      const safeData = data.map((w) => ({
        ...w,
        exercise: w.exercise || [],
      }));

      setWorkouts(safeData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load workouts. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!workouts.length) return <p className="text-center">No workouts found. Add some!</p>;

  return (
    <div className="p-4">
      {/* Pass a callback to update the list */}
      <WorkoutDialog onWorkoutCreated={fetchWorkouts} />

      <div className="mt-4 space-y-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold">{workout.title}</h3>
            <p className="text-gray-600">
              Exercises: {workout.exercise.join(", ") || "No exercises yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
