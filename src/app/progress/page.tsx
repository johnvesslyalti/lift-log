"use client";

import { useState, useEffect } from "react";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter } from "react-icons/md";
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
}

interface ProgressEntry {
  id: number;
  workoutId: number;
  weight?: number;
  caloriesBurned?: number;
  streak: number;
  workout: Workout;
  createdAt: string;
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

  const today = new Date();
  const getDayProgress = (daysAgo: number) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysAgo);

    const targetDateString = targetDate.toDateString();

    return progress.filter(
      (p) => new Date(p.createdAt).toDateString() === targetDateString
    );
  };

  const todayProgress = getDayProgress(0);
  const yesterdayProgress = getDayProgress(1);
  const dayBeforeYesterdayProgress = getDayProgress(2);

  const sections = [
    { title: "Today", data: todayProgress },
    { title: "Yesterday", data: yesterdayProgress },
    { title: "Day Before Yesterday", data: dayBeforeYesterdayProgress },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="dark:bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl shadow-lg dark:bg-neutral-950">
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

        {/* Error */}
        {error && (
          <div className="dark:bg-neutral-950 border-2 border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <BiDumbbell className="text-red-500 text-xl" />
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {progress.length === 0 && !error && (
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

        {/* Daily Progress Sections */}
        {sections.map(({ title, data }) => (
          <div key={title} className="dark:bg-neutral-950 rounded-2xl border border-neutral-800 shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            {data.length === 0 ? (
              <p className="text-neutral-500">No workouts recorded.</p>
            ) : (
              <ul className="space-y-4">
                {data.map((p) => (
                  <li
                    key={p.id}
                    className="p-4 rounded-xl border border-neutral-800 hover:border-white transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">
                          {p.workout.name.charAt(0).toUpperCase() + p.workout.name.slice(1)}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {p.workout.sets} sets × {p.workout.reps} reps
                        </p>
                        {p.weight && (
                          <p className="text-sm mt-1">
                            <strong>Weight:</strong> {p.weight} kg
                          </p>
                        )}
                        {p.caloriesBurned && (
                          <p className="text-sm">
                            <strong>Calories:</strong> {p.caloriesBurned} kcal
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-neutral-500">
                        🏆 Streak: {p.streak} {p.streak === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
