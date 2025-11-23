"use client";

import { useState, useEffect } from "react";
import ProgressDialog from "./progress-dialog";
import { handleError } from "@/components/error-handle";
import { MdDelete } from "react-icons/md";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LogoLoading from "../logo-loading/page";

export interface DailySummary {
  id: string;
  date: string;
  caloriesBurned: number;
  weight: number | null;
}

export default function Progress() {
  const [progress, setProgress] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/progress");
      const data = await res.json();

      if (!data.success) throw new Error("Failed to fetch progress");

      setProgress(data.progress);
    } catch (err) {
      const errMsg = handleError(err);
      setError(typeof errMsg === "string" ? errMsg : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Delete item after confirmation
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteId(selectedId);

      const res = await fetch(`/api/progress`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId }),
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      await fetchProgress();
    } catch (err) {
      const errMsg = handleError(err);
      setError(typeof errMsg === "string" ? errMsg : "An error occurred.");
    } finally {
      setDeleteId(null);
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) return <LogoLoading />;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="dark:bg-neutral-950 rounded-2xl shadow-lift-gradient p-6 md:p-8 mb-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                <h1 className="text-3xl font-bold">My Progress</h1>
                <p className="text-neutral-400 mt-1">
                  {progress.length}{" "}
                  {progress.length === 1 ? "entry" : "entries"} tracked
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

        {/* Empty State */}
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
              <span className="font-medium">
                Click &quot;Add Workout Session&quot; to begin
              </span>
            </div>
          </div>
        )}

        {/* Progress Cards */}
        {progress.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((entry, index) => (
              <div
                key={entry.id}
                className="relative group rounded-2xl backdrop-blur-xl border border-teal-950 shadow-lg hover:shadow-black/50 dark:hover:shadow-teal-500 transition-all duration-500 overflow-hidden p-[1px]"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Card Header */}
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="p-3 rounded-xl backdrop-blur-sm">
                      <BiDumbbell className="text-2xl" />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedId(entry.id);
                        setShowDeleteModal(true);
                      }}
                      disabled={deleteId === entry.id}
                      className="hover:bg-red-600 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      <MdDelete className="text-lg" />
                    </button>
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

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-[90%] max-w-md shadow-xl animate-fadeInDown">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Delete This Entry?
            </h2>

            <p className="text-neutral-300 mb-6">
              This action cannot be undone. Are you sure you want to delete this progress entry?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedId(null);
                }}
                className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteId === selectedId}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
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
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
