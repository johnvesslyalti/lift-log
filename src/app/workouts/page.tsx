"use client";

import { useState, useEffect } from "react";
import WorkoutDialog from "./workout-dialog";
import { MdFitnessCenter } from "react-icons/md";
import Loading from "@/components/loading";

interface Workout {
  id: string;
  name: string;
  exercises: string[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workout");
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const data: Workout[] = await res.json();
      setWorkouts(data || []);
      setError("");
    } catch (err: unknown) {
      setError("Failed to load workouts. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if(loading) {
    return (
        <Loading text="workouts" />
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-neutral-950 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-900 p-4 rounded-2xl shadow-lg">
              <MdFitnessCenter className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Workouts</h1>
              <p className="text-neutral-400 mt-1">
                {workouts.length} {workouts.length === 1 ? "workout" : "workouts"} tracked
              </p>
            </div>
          </div>
          <WorkoutDialog onWorkoutCreated={fetchWorkouts} />
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Empty State */}
        {!loading && workouts.length === 0 && !error && (
          <div className="bg-neutral-950 rounded-2xl shadow-xl p-12 text-center border border-neutral-800">
            <h3 className="text-2xl font-bold text-white mb-3">No Workouts Yet</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Start tracking your fitness journey by adding your first workout using the button above!
            </p>
          </div>
        )}

        {/* Workout Grid */}
        {!loading && workouts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((w, index) => (
              <div
                key={w.id}
                className="group bg-neutral-950 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-800 hover:border-white hover:-translate-y-1"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="bg-neutral-900 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{w.name}</h3>
                  <p className="text-neutral-400">
                    Exercises: {(w.exercises || []).join(", ") || "No exercises yet"}
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
