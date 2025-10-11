"use client";

import { useState, useEffect } from "react";
import ExerciseModal from "./exercise-dialog";
import { handleError } from "@/components/error-handle";
import { MdFitnessCenter, MdDelete } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "@/components/loading";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  category: string;
}

export default function Exercise() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/exercise");

      if (!res.ok) throw new Error(`Failed to fetch exercises (${res.status})`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setExercises(data);
      } else if (Array.isArray(data.exercises)) {
        setExercises(data.exercises);
      } else {
        setExercises([]);
      }
    } catch (error: unknown) {
      const err = handleError(error);
      setError(typeof err === "string" ? err : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exercise?")) return;

    try {
      setDeleteId(id);
      const res = await fetch(`/api/exercise?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete exercise");

      setExercises(exercises.filter((ex) => ex.id !== id));
    } catch (error) {
      const err = handleError(error);
      setError(typeof err === "string" ? err : "An error occurred.");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  if (loading) {
    return <Loading text="exercises" />;
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-neutral-900 p-4 rounded-2xl shadow-lg">
                <MdFitnessCenter className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Exercises</h1>
                <p className="text-neutral-400 mt-1">
                  {exercises.length}{" "}
                  {exercises.length === 1 ? "exercise" : "exercises"} tracked
                </p>
              </div>
            </div>
            <ExerciseModal onsuccess={fetchExercises} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-neutral-900 border-2 border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <MdFitnessCenter className="text-red-500 text-xl" />
            </div>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {exercises.length === 0 && !loading && !error && (
          <div className="bg-neutral-950 rounded-2xl shadow-xl p-12 text-center border border-neutral-800">
            <div className="bg-neutral-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiDumbbell className="text-5xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Exercises Yet
            </h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Start tracking your fitness journey by adding your first exercise
              using the button above!
            </p>
            <div className="flex items-center justify-center gap-2 text-white">
              <AiOutlineCheckCircle className="text-xl" />
              <span className="font-medium">
                Click &quot;Add Exercise&quot; to begin
              </span>
            </div>
          </div>
        )}

        {/* Exercise Grid */}
        {exercises.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((ex, index) => (
              <div
                key={ex.id}
                className="group bg-neutral-950 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-800 hover:border-white hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Card Header */}
                <div className="bg-neutral-900 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="bg-neutral-950 p-3 rounded-xl backdrop-blur-sm">
                      <BiDumbbell className="text-2xl text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(ex.id)}
                        disabled={deleteId === ex.id}
                        className="bg-neutral-950 hover:bg-red-600 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
                        title="Delete exercise"
                        aria-label="Delete exercise"
                      >
                        <MdDelete className="text-white text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
                  </h3>

                  {ex.category && (
                    <div className="inline-block bg-neutral-900 px-3 py-1 rounded-full mb-4">
                      <span className="text-neutral-300 text-sm font-semibold">
                        {ex.category}
                      </span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">
                          Sets
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {ex.sets || 0}
                      </p>
                    </div>
                    <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-1">
                        <FiRepeat className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-400">
                          Reps
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {ex.reps || 0}
                      </p>
                    </div>
                  </div>
                  {/* Total Volume */}
                  {ex.sets > 0 && ex.reps > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-400">
                          Total Volume
                        </span>
                        <span className="text-lg font-bold text-white">
                          {ex.sets * ex.reps} Lifts
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
