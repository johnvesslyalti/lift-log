"use client";

import { useState, useEffect } from "react";
import ProgressDialog from "./progress-dialog";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter, MdDelete } from "react-icons/md";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";

export interface DailySummary {
  date: string; // ISO string
  caloriesBurned: number;
  weight: number | null;
}

export default function Progress() {
  const [progress, setProgress] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDate, setDeleteDate] = useState<string | null>(null);

  // Fetch progress
  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error(`Failed to fetch progress (${res.status})`);
      const data: DailySummary[] = await res.json();
      setProgress(data);
    } catch (err: unknown) {
      const errMsg = handleError(err);
      setError(typeof errMsg === "string" ? errMsg : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Delete progress entry
  const handleDelete = async (date: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      setDeleteDate(date);
      const res = await fetch(`/api/progress?date=${date}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");

      setProgress(progress.filter((p) => p.date !== date));
    } catch (err) {
      const errMsg = handleError(err);
      setError(typeof errMsg === "string" ? errMsg : "An error occurred.");
    } finally {
      setDeleteDate(null);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) return <Loading text="progress entries" />;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="dark:bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="dark:bg-neutral-950 p-4 rounded-2xl shadow-lg">
                <MdFitnessCenter className="text-3xl text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Progress</h1>
                <p className="text-neutral-400 mt-1">
                  {progress.length} {progress.length === 1 ? "entry" : "entries"} tracked
                </p>
              </div>
            </div>
            <ProgressDialog onsuccess={fetchProgress} />
          </div>
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
          <div className="rounded-2xl shadow-xl p-12 text-center border border-neutral-800 dark:bg-neutral-950">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiDumbbell className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Progress Yet</h3>
            <p className="mb-6 max-w-md mx-auto">
              Track your fitness journey by adding your first progress entry!
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <AiOutlineCheckCircle className="text-xl" />
              <span className="font-medium">Click &quot;Add Workout Session&quot; to begin</span>
            </div>
          </div>
        )}

        {/* Progress Grid */}
        {progress.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((entry, index) => (
              <div
                key={entry.date}
                className="relative group rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lg hover:shadow-black/50 dark:hover:shadow-white/50 transition-all duration-500 overflow-hidden p-[1px]"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                {/* Card Header */}
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="p-3 rounded-xl backdrop-blur-sm">
                      <BiDumbbell className="text-2xl" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(entry.date)}
                        disabled={deleteDate === entry.date}
                        className="hover:bg-red-600 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="rounded-xl p-4 border border-neutral-800">
                      <p className="text-sm text-neutral-400">Calories Burned</p>
                      <p className="text-2xl font-bold">{entry.caloriesBurned}</p>
                    </div>
                    {entry.weight !== null && (
                      <div className="rounded-xl p-4 border border-neutral-800">
                        <p className="text-sm text-neutral-400">Weight</p>
                        <p className="text-2xl font-bold">{entry.weight} kg</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
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
