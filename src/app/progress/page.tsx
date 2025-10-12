"use client";

import { useState, useEffect } from "react";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";
import ProgressDialog from "./progress-dialog";

interface Workout {
  id: number;
  name: string;
  sets: number;
  reps: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgressEntry {
  id: number;
  workoutId: number;
  startTime: string;
  endTime?: string;
  weight?: number;
  caloriesBurned?: number;
  streak: number;
  workout: Workout;
}

export default function Progress() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error(`Failed to fetch progress (${res.status})`);

      const data: ProgressEntry[] = await res.json();
      setProgress(data || []);
    } catch (err: unknown) {
      const e = handleError(err);
      setError(typeof e === "string" ? e : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) return <Loading text="progress entries" />;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="dark:bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="dark:bg-neutral-950 p-4 rounded-2xl shadow-lg">
                <MdFitnessCenter className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Progress</h1>
                <p className="text-neutral-400 mt-1">
                  {progress.length} {progress.length === 1 ? "entry" : "entries"} tracked
                </p>
              </div>
            </div>
            <ProgressDialog />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="dark:bg-neutral-950 border-2 border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <MdFitnessCenter className="text-red-500 text-xl" />
            </div>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {progress.length === 0 && !loading && !error && (
          <div className="rounded-2xl shadow-xl p-12 text-center border border-neutral-800">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiDumbbell className="text-5xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Progress Yet</h3>
            <p className="mb-6 max-w-md mx-auto">
              Track your fitness journey by adding your first progress entry!
            </p>
            <div className="flex items-center justify-center gap-2">
              <AiOutlineCheckCircle className="text-xl" />
              <span className="font-medium">Click &quot;Add Workout Session&quot; to begin</span>
            </div>
          </div>
        )}

        {/* Progress Grid */}
        {progress.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((p, index) => (
              <div
                key={p.id}
                className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-800 hover:border-white hover:-translate-y-1"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="p-3 rounded-xl backdrop-blur-sm">
                      <BiDumbbell className="text-2xl" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {p.workout?.name
                      ? p.workout.name.charAt(0).toUpperCase() + p.workout.name.slice(1)
                      : "Unknown"}
                  </h3>

                  {p.workout?.category && (
                    <div className="inline-block px-3 py-1 rounded-full mb-4">
                      <span className="text-neutral-300 text-sm font-semibold">
                        {p.workout.category}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">Sets</span>
                      </div>
                      <p className="text-2xl font-bold">{p.workout?.sets ?? 0}</p>
                    </div>
                    <div className="rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">Reps</span>
                      </div>
                      <p className="text-2xl font-bold">{p.workout?.reps ?? 0}</p>
                    </div>
                  </div>

                  {p.weight && (
                    <p className="mt-4 text-sm">
                      <strong>Weight:</strong> {p.weight} kg
                    </p>
                  )}
                  {p.caloriesBurned && (
                    <p className="text-sm">
                      <strong>Calories:</strong> {p.caloriesBurned} kcal
                    </p>
                  )}
                  <p className="text-sm mt-2 text-neutral-400">
                    Streak: {p.streak} {p.streak === 1 ? "day" : "days"}
                  </p>

                  <p className="text-xs text-neutral-500 mt-2">
                    {new Date(p.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
