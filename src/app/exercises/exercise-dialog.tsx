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
import { MdFitnessCenter } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import { BiDumbbell } from "react-icons/bi";
import { FiRepeat } from "react-icons/fi";
import { Circle } from "lucide-react";

interface ExerciseModalProps {
  onsuccess?: () => void;
}

export default function ExerciseModal({ onsuccess }: ExerciseModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const { workoutId } = useWorkoutStore();

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      showMessage("Exercise name is required", "error");
      return false;
    }
    if (sets && Number(sets) <= 0) {
      showMessage("Sets must be greater than 0", "error");
      return false;
    }
    if (reps && Number(reps) <= 0) {
      showMessage("Reps must be greater than 0", "error");
      return false;
    }
    return true;
  };

  async function addExercise() {
    if (!validateInputs()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          sets: sets ? Number(sets) : 0,
          reps: reps ? Number(reps) : 0,
          workoutId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save exercise");
      }
      showMessage("Exercise added successfully!", "success");
      setName("");
      setSets("");
      setReps("");
      onsuccess?.();
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 1200);
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && e.target instanceof HTMLInputElement) {
      addExercise();
    }
  };

  const resetForm = () => {
    setName("");
    setSets("");
    setReps("");
    setMessage("");
  };

  const incrementValue = (
    setter: (value: string) => void,
    currentValue: string,
    step: number = 1
  ) => {
    const current = Number(currentValue) || 0;
    setter(String(current + step));
  };

  const decrementValue = (
    setter: (value: string) => void,
    currentValue: string,
    step: number = 1
  ) => {
    const current = Number(currentValue) || 0;
    if (current - step >= 0) {
      setter(String(current - step));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="relative flex items-center gap-2 bg-black text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold px-6 py-3 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <IoMdAdd className="text-xl relative z-10" />
          <span className="relative z-10">Add Exercise</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 rounded-3xl shadow-2xl bg-neutral-950 border-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-black p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neutral-900/40 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-neutral-800 p-4 rounded-2xl backdrop-blur-sm border border-neutral-900 shadow-lg">
                <MdFitnessCenter className="text-4xl text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold mb-1 text-white">
                  Add New Exercise
                </DialogTitle>
                <DialogDescription className="text-neutral-400 text-base">
                  Track your progress with detailed workout data
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-black">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-semibold text-white flex items-center gap-2 text-base"
            >
              <BiDumbbell className="text-neutral-200" />
              Exercise Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Bench Press, Squats, Deadlift"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-2 border-neutral-800 focus:border-neutral-200 focus:ring-4 focus:ring-neutral-900 rounded-xl shadow-sm text-white placeholder:text-neutral-500 bg-neutral-950 transition-all h-12 text-base px-4"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="sets"
                className="font-semibold text-white text-sm flex items-center gap-1"
              >
                <FiRepeat className="text-neutral-200" />
                Sets
              </Label>
              <div className="relative">
                <Input
                  id="sets"
                  type="number"
                  placeholder="3"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="0"
                  className="border-2 border-neutral-800 focus:border-neutral-200 focus:ring-4 focus:ring-neutral-900 rounded-xl shadow-sm bg-neutral-950 transition-all h-12 text-center text-lg font-semibold text-white"
                  disabled={loading}
                />
                <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                  <button
                    type="button"
                    onClick={() => incrementValue(setSets, sets)}
                    className="flex-1 px-2 hover:bg-neutral-900 rounded-t-lg transition-colors text-neutral-200"
                    disabled={loading}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => decrementValue(setSets, sets)}
                    className="flex-1 px-2 hover:bg-neutral-900 rounded-b-lg transition-colors text-neutral-200"
                    disabled={loading}
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reps"
                className="font-semibold text-white text-sm flex items-center gap-1"
              >
                <FiRepeat className="text-neutral-200" />
                Reps
              </Label>
              <div className="relative">
                <Input
                  id="reps"
                  type="number"
                  placeholder="10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="0"
                  className="border-2 border-neutral-800 focus:border-neutral-200 focus:ring-4 focus:ring-neutral-900 rounded-xl shadow-sm bg-neutral-950 transition-all h-12 text-center text-lg font-semibold text-white"
                  disabled={loading}
                />
                <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                  <button
                    type="button"
                    onClick={() => incrementValue(setReps, reps)}
                    className="flex-1 px-2 hover:bg-neutral-900 rounded-t-lg transition-colors text-neutral-200"
                    disabled={loading}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => decrementValue(setReps, reps)}
                    className="flex-1 px-2 hover:bg-neutral-900 rounded-b-lg transition-colors text-neutral-200"
                    disabled={loading}
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all duration-300 shadow-md ${
                messageType === "success"
                  ? "bg-neutral-900 text-green-400 border-2 border-green-900"
                  : "bg-neutral-900 text-red-400 border-2 border-red-900"
              }`}
            >
              {messageType === "success" ? (
                <AiOutlineCheckCircle className="text-xl flex-shrink-0" />
              ) : (
                <AiOutlineWarning className="text-xl flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 border-2 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 text-white font-semibold py-3 rounded-xl transition-all text-base h-12 bg-black"
            >
              Cancel
            </Button>
            <Button
              onClick={addExercise}
              disabled={loading || !name.trim()}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base h-12"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <Circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Exercise"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
