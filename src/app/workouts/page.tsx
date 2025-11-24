"use client";

import { useState, useEffect, useCallback } from "react";
import WorkoutDialog from "./workout-dialog";
import { handleError } from "@/components/error-handle";
import LogoLoading from "../logo-loading/page";

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
  const [open, setOpen] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout>();
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
      handleError(error);
    }
  }, []);

  const viewDetails = useCallback((workout: Workout) => {
    setWorkout(workout);
    setOpen(true)
  }, [])

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (status === "loading" || status === "idle") {
    return <LogoLoading />;
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {open && workout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

          {/* Modal container */}
          <div className="relative shadow-lift-gradient bg-neutral-900 p-6 rounded-xl w-[90%] max-w-lg">

            {/* Close button */}
            <button
              className="absolute right-4 top-4 px-3 py-1 rounded-md border text-lg"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{workout.name}</h2>

            <p className="mb-2 font-semibold">Exercises:</p>
            <ul className="list-disc pl-5 space-y-1">
              {workout.workoutExercises?.map((we) => (
                <li key={`${we.id}-${we.Exercise.id}`}>{we.Exercise?.name}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header
          className="rounded-2xl shadow-lift-gradient p-6 md:p-8 mb-8 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          aria-label="Workouts header"
        >
          <div className="flex items-center gap-4">
            <svg
              width="70"
              height="70"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="liftlogGradient"
                  x1="0"
                  y1="0"
                  x2="64"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>

              <path
                d="M10 26H6V38H10V26ZM18 22H14V42H18V22ZM26 30V26H22V38H26V34H36L30 40L34 44L48 30L34 16L30 20L36 26H26ZM50 22H46V42H50V22ZM58 26H54V38H58V26Z"
                fill="url(#liftlogGradient)"
              />
            </svg>
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
            <h3 className="text-2xl font-bold mb-3">No Workouts Yet</h3>
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
                className="relative group rounded-2xl backdrop-blur-xl border border-teal-950 shadow-lg hover:shadow-black/50 dark:hover:shadow-teal-500 transition-all duration-500 overflow-hidden p-[1px]"
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
                        .map((we) => we.Exercise?.name || "Unnamed Exercise")
                        .join(", ")
                      : "No exercises yet"}
                  </p>

                  {/* Hover actions */}
                  <div className="flex justify-end mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={() => viewDetails(w)}
                      className="px-4 py-2 text-sm rounded-xl font-medium border transition-colors duration-300">
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
