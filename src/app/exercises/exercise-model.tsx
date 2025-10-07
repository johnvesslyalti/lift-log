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

export default function ExerciseModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { workoutId } = useWorkoutStore();

  async function handleLogin() {
    if (!name.trim()) return setMessage("Exercise name is required");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sets, reps, category, workoutId }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("exercise added");
      setName("");
      setSets(0);
      setReps(0);
      setCategory("");
      setTimeout(() => setOpen(false), 1000);
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center">
            <IoMdAdd />
            <span>Create</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Lift</DialogTitle>
            <DialogDescription>
              Record your exercise details here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                placeholder="Eg: Bench Press"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Sets</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Reps</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  type="text"
                  placeholder="Pull"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </div>

          {message && (
            <p className="text-sm text-center text-slate-600">{message}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-slate-800 text-white"
          >
            {loading ? "Saving" : "Save log"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
