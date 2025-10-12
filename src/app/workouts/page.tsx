"use client";

import { useState, useEffect, useCallback } from "react";
import WorkoutDialog from "./workout-dialog";
import { MdFitnessCenter } from "react-icons/md";
import Loading from "@/components/loading";
import { handleError } from "@/components/error-handle";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutExercise {
  id: string;
  Exercise: Exercise;
}

interface Workout {
  id: string;
  name: string;
  workoutExercises: WorkoutExercise[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWorkouts = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/workout");
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const data: Workout[] = await res.json();
      setWorkouts(data || []);
      setStatus("success");
    } catch (error) {
      handleError(error)
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (status === "loading" || status === "idle") {
    return <Loading text="workouts" />;
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header
          className="rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          aria-label="Workouts header"
        >
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              aria-hidden="true"
            >
              <MdFitnessCenter className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Workouts</h1>
              <p
                className="text-neutral-400 mt-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {workouts.length}{" "}
                {workouts.length === 1 ? "workout" : "workouts"} tracked
              </p>
            </div>
          </div>
          <WorkoutDialog onWorkoutCreated={fetchWorkouts} />
        </header>

        {/* Error */}
        {status === "error" && (
          <section
            className="text-red-400 text-center mb-8"
            role="alert"
            aria-live="assertive"
          >
            <p>{errorMessage}</p>
            <button
              onClick={fetchWorkouts}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              aria-label="Retry loading workouts"
            >
              Retry
            </button>
          </section>
        )}

        {/* Empty State */}
        {!errorMessage && workouts.length === 0 && (
          <section
            className="bg-neutral-950 rounded-2xl shadow-xl p-12 text-center border border-neutral-800"
            aria-live="polite"
            aria-atomic="true"
          >
            <h3 className="text-2xl font-bold mb-3">
              No Workouts Yet
            </h3>
            <p className="mb-6 max-w-md mx-auto">
              Start tracking your fitness journey by adding your first workout
              using the button above!
            </p>
          </section>
        )}

        {/* Workout Grid */}
        {!errorMessage && workouts.length > 0 && (
          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="List of workouts"
          >
            {workouts.map((w, index) => (
              <article
                key={w.id}
                className="relative group rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lg hover:shadow-white/50 transition-all duration-500 overflow-hidden p-[1px]"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
                tabIndex={0}
                aria-labelledby={`workout-title-${w.id}`}
              >
                {/* Glow border effect */}
                <div className="absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                {/* Card content */}
                <div className="relative z-10 p-6 rounded-2xl backdrop-blur-md">
                  <div className="flex justify-between items-start">
                    <h3
                      id={`workout-title-${w.id}`}
                      className="text-2xl font-semibold tracking-tight"
                    >
                      {w.name}
                    </h3>

                    <span className="text-xs px-3 py-1 rounded-full border">
                      {w.workoutExercises?.length || 0}{" "}
                      {w.workoutExercises?.length === 1
                        ? "Exercise"
                        : "Exercises"}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    aria-label={`Exercises: ${w.workoutExercises?.length || 0}`}
                  >
                    {w.workoutExercises?.length
                      ? w.workoutExercises
                          .map((we) => we.Exercise?.name || "Unnamed Exercise").join(", ")
                      : "No exercises yet"}
                  </p>

                  {/* Hover actions */}
                  <div className="flex justify-end mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="px-4 py-2 text-sm rounded-xl font-medium border transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
