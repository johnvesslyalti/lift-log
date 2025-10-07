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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Workout</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="Workout Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-full">
                No exercises found
              </p>
            ) : (
              exercises.map((exercise) => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <h3 className="font semibold">{exercise.name}</h3>
                  </div>
                );
              })
            )}
          </div>
          <Button onClick={handleCreateWorkout}>save workout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
