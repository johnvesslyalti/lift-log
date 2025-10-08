"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkoutStore } from "@/store/workoutStrore";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

interface ExerciseModalProps {
  onsuccess?: () => void;
}

export default function ExerciseModal({ onsuccess }: ExerciseModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { workoutId } = useWorkoutStore();

  async function addExercise() {
    if (!name.trim()) return setMessage("Exercise name is required");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sets, reps, category, workoutId }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Exercise added successfully!");
      setName("");
      setSets(0);
      setReps(0);
      setCategory("");

      onsuccess?.();

      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all">
          <IoMdAdd className="text-lg" />
          <span>Create</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add Lift
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            Record your exercise details here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="font-semibold text-gray-700">
              Exercise Name
            </Label>
            <Input
              id="name"
              placeholder="Eg: Bench Press"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg shadow-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="font-semibold text-gray-700">Sets</Label>
              <Input
                type="number"
                placeholder="3"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg shadow-sm"
              />
            </div>
            <div>
              <Label className="font-semibold text-gray-700">Reps</Label>
              <Input
                type="number"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg shadow-sm"
              />
            </div>
            <div>
              <Label className="font-semibold text-gray-700">Category</Label>
              <Input
                type="text"
                placeholder="Pull"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg shadow-sm"
              />
            </div>
          </div>

          {message && (
            <p className="text-sm text-center text-indigo-600 font-medium mt-1">
              {message}
            </p>
          )}

          <Button
            onClick={addExercise}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
          >
            {loading ? "Saving..." : "Save Exercise"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
