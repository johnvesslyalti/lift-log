"use client";

import { useState, useEffect } from "react";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter, MdDelete } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";
import ProgressDialog from "./progress-dialog";

export interface WorkoutSession {
  id: number;
  name: string;
  sets: number;
  reps: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function Progress() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/workoutSession");

      if (!res.ok) throw new Error(`Failed to fetch sessions (${res.status})`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else if (Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (error: unknown) {
      const err = handleError(error);
      setError(typeof err === "string" ? err : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this workout session?")) return;

    try {
      setDeleteId(id);
      const res = await fetch(`/api/workout?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete session");

      setSessions(sessions.filter((s) => s.id !== id));
    } catch (error) {
      const err = handleError(error);
      setError(typeof err === "string" ? err : "An error occurred.");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <Loading text="workout sessions" />;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="dark:bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="dark:bg-neutral-950 p-4 rounded-2xl shadow-lg">
                <MdFitnessCenter className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold ">My Progress</h1>
                <p className="text-neutral-400 mt-1">
                  {sessions.length}{" "}
                  {sessions.length === 1 ? "session" : "sessions"} tracked
                </p>
              </div>
            </div>
            <ProgressDialog />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="dark:bg-neutral-950 border-2 border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <MdFitnessCenter className="text-red-500 text-xl" />
            </div>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && !loading && !error && (
          <div className=" rounded-2xl shadow-xl p-12 text-center border border-neutral-800">
            <div className=" w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiDumbbell className="text-5xl " />
            </div>
            <h3 className="text-2xl font-bold  mb-3">
              No Workout Sessions Yet
            </h3>
            <p className="mb-6 max-w-md mx-auto">
              Start tracking your fitness journey by adding your first workout session
              using the button above!
            </p>
            <div className="flex items-center justify-center gap-2 ">
              <AiOutlineCheckCircle className="text-xl" />
              <span className="font-medium">
                Click &quot;Add Workout Session&quot; to begin
              </span>
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((s, index) => (
              <div
                key={s.id}
                className="group  rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-800 hover:border-white hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Card Header */}
                <div className=" p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className=" p-3 rounded-xl backdrop-blur-sm">
                      <BiDumbbell className="text-2xl " />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleteId === s.id}
                        className=" hover:bg-red-600 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                        title="Delete session"
                        aria-label="Delete session"
                      >
                        <MdDelete className=" text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold  mb-3 line-clamp-2">
                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                  </h3>

                  {s.category && (
                    <div className="inline-block  px-3 py-1 rounded-full mb-4">
                      <span className="text-neutral-300 text-sm font-semibold">
                        {s.category}
                      </span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className=" rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">
                          Sets
                        </span>
                      </div>
                      <p className="text-2xl font-bold ">
                        {s.sets || 0}
                      </p>
                    </div>
                    <div className=" rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">
                          Reps
                        </span>
                      </div>
                      <p className="text-2xl font-bold ">
                        {s.reps || 0}
                      </p>
                    </div>
                  </div>

                  {/* Total Volume */}
                  {s.sets > 0 && s.reps > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-400">
                          Total Volume
                        </span>
                        <span className="text-lg font-bold ">
                          {s.sets * s.reps} Lifts
                        </span>
                      </div>
                    </div>
                  )}
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
