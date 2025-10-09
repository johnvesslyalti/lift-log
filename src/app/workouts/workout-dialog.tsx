"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IoMdAdd } from "react-icons/io";

interface Exercise {
  id: number;
  name: string;
}

interface WorkoutDialogProps {
  onWorkoutCreated?: () => void; // callback to refresh workouts
}

export default function WorkoutDialog({
  onWorkoutCreated,
}: WorkoutDialogProps) {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("/api/exercise");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const toggleExercise = (id: number) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((ex) => ex !== id) : [...prev, id]
    );
  };

  const handleCreateWorkout = async () => {
    if (!name.trim()) {
      alert("Enter a workout name");
      return;
    }
    if (selectedExercises.length === 0) {
      alert("Select at least one exercise");
      return;
    }

    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, exercises: selectedExercises }),
      });

      if (!res.ok) throw new Error("Failed to create workout");

      setName("");
      setSelectedExercises([]);
      alert("Workout created successfully!");

      if (onWorkoutCreated) onWorkoutCreated(); // refresh workouts in parent
    } catch (error) {
      console.error(error);
      alert("Failed to create workout. Try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative flex items-center gap-2 bg-black text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold px-6 py-3 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <IoMdAdd className="text-xl relative z-10" />
          <span className="relative z-10">Add Exercise</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full p-6 rounded-xl shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            New Workout
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-5">
          <Input
            placeholder="Workout Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg shadow-sm"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto border p-2 rounded-lg">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">
                Loading exercises...
              </p>
            ) : exercises.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No exercises found
              </p>
            ) : (
              exercises.map((exercise) => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`flex flex-col justify-center items-center p-3 rounded-lg cursor-pointer border transition-all duration-200 shadow-sm hover:shadow-md text-center ${
                      isSelected
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <h3 className="font-semibold">{exercise.name}</h3>
                  </div>
                );
              })
            )}
          </div>

          <Button
            onClick={handleCreateWorkout}
            className="py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors"
          >
            Save Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
