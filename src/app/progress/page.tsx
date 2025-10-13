"use client";

import { useState, useEffect } from "react";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter } from "react-icons/md";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";
import ProgressDialog from "./progress-dialog";

interface DailySummary {
  date: string; // 'YYYY-MM-DD'
  calories: number;
  weight: number | null;
}

export default function Progress() {
  const [progress, setProgress] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error(`Failed to fetch progress (${res.status})`);

      const data: DailySummary[] = await res.json();
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

  // Helper: format a date as YYYY-MM-DD in local time
  const formatLocalDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const today = new Date();

  // Generate last 7 days summary
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i)); // from oldest to today
    const dayStr = formatLocalDate(day);

    // Find progress entry for this date
    const dayProgress = progress.find((p) => p.date === dayStr);

    return {
      date: dayStr,
      calories: dayProgress?.calories || 0,
      weight: dayProgress?.weight ?? null,
    };
  });

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
                {weeklyData.filter((d) => d.calories > 0).length}{" "}
                {weeklyData.filter((d) => d.calories > 0).length === 1
                  ? "day"
                  : "days"}{" "}
                tracked
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

        {/* Weekly Progress */}
        {weeklyData.map((day) => (
          <div
            key={day.date}
            className="dark:bg-neutral-950 rounded-2xl border border-neutral-800 shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {new Date(day.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <ul>
              <li className="p-4 rounded-xl border border-neutral-800 hover:border-white transition-all flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-400">
                    Calories: {day.calories}
                  </p>
                  {day.weight !== null && (
                    <p className="text-sm text-neutral-400">Weight: {day.weight} kg</p>
                  )}
                </div>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
