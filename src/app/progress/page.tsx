"use client";

import { useState, useEffect } from "react";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter } from "react-icons/md";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";
import ProgressDialog from "./progress-dialog";

interface DailySummary {
  date: string; // ISO string
  caloriesBurned: number;
  weight: number | null;
}

export default function Progress() {
  const [progress, setProgress] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error(`Failed to fetch progress (${res.status})`);

        const data: DailySummary[] = await res.json();
        setProgress(data); // render exactly what backend returns
      } catch (err: unknown) {
        handleError(err)
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <Loading text="progress entries" />;

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 md:p-8 rounded-2xl shadow-xl border border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl shadow-lg dark:bg-neutral-950">
              <MdFitnessCenter className="text-3xl text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Progress</h1>
              <p className="text-neutral-400 mt-1">
                {progress.length} {progress.length === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>
          <ProgressDialog />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 border-2 border-red-800 rounded-xl dark:bg-neutral-950">
            <BiDumbbell className="text-red-500 text-xl" />
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {progress.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center p-12 mb-6 text-center border border-neutral-800 rounded-2xl shadow-xl dark:bg-neutral-950">
            <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full">
              <BiDumbbell className="text-5xl text-gray-400" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">No Progress Yet</h3>
            <p className="mb-6 max-w-md mx-auto">
              Track your fitness journey by adding your first progress entry!
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <AiOutlineCheckCircle className="text-xl" />
              <span className="font-medium">Click &quot;Add Workout Session&quot; to begin</span>
            </div>
          </div>
        )}

        {/* Render exactly what backend returns */}
        {progress.map((entry) => (
          <div
            key={entry.date}
            className="p-6 rounded-2xl shadow-lg border border-neutral-800 dark:bg-neutral-950 hover:border-blue-500 transition-all"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <ul>
              <li className="flex justify-between items-center p-4 mb-2 rounded-xl border border-neutral-800 hover:border-blue-400 transition-all">
                <div>
                  <p className="text-sm text-neutral-400">Calories: {entry.caloriesBurned}</p>
                  {entry.weight !== null && (
                    <p className="text-sm text-neutral-400">Weight: {entry.weight} kg</p>
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
