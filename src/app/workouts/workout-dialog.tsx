"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface Exercise {
  id: number;
  name: string;
  description?: string;
}

export default function WorkoutDialog() {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("/api/exercise");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error(error);
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
      await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, exercises: selectedExercises }),
      });
      setName("");
      setSelectedExercises([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-500 hover:to-blue-500 transition-all shadow-md">
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-lg bg-white">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-full text-center">
                No exercises found
              </p>
            ) : (
              exercises.map((exercise) => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`flex flex-col justify-center items-center p-4 rounded-xl cursor-pointer border transition-all duration-200 shadow-sm hover:shadow-md ${
                      isSelected
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <h3 className="font-semibold text-center">{exercise.name}</h3>
                  </div>
                );
              })
            )}
          </div>

          <Button
            onClick={handleCreateWorkout}
            className="bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-md py-2"
          >
            Save Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
