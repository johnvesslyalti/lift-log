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
import { useState, useEffect } from "react";
import { MdFitnessCenter } from "react-icons/md";
import { BiDumbbell } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";

interface ProgressDialogProps {
  onsuccess?: () => void;
}

interface WorkoutSession {
  id: number;
  workout: {
    name: string;
  };
  startTime: string;
  endTime?: string | null;
  caloriesBurned?: number | null;
}

export default function ProgressDialog({ onsuccess }: ProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  // Show temporary messages
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/workout"); // your API for sessions
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : "Error fetching sessions", "error");
    }
  };

  useEffect(() => {
    if (open) fetchSessions();
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save progress");
      }

      showMessage("Progress saved!", "success");
      setWeight("");
      onsuccess?.();
      setTimeout(() => setOpen(false), 1200);
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : "Error saving progress", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setWeight("");
      }}
    >
      <DialogTrigger asChild>
        <Button className="relative flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold px-6 py-3 rounded-xl overflow-hidden group">
          <MdFitnessCenter className="text-xl relative z-10" />
          <span className="relative z-10">Add Progress</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 rounded-3xl shadow-2xl bg-neutral-950 border-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-900">
                <BiDumbbell className="text-4xl text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold mb-1 text-white">
                  Log Progress
                </DialogTitle>
                <DialogDescription className="text-neutral-400 text-base">
                  Track your weight and workout sessions
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-black">
          {/* Weight Input */}
          <div className="space-y-2">
            <Label
              htmlFor="weight"
              className="font-semibold text-white flex items-center gap-2 text-base"
            >
              <BiDumbbell className="text-neutral-200" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              placeholder="e.g., 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
              step="0.1"
              className="border-2 border-neutral-800 focus:border-neutral-200 focus:ring-4 focus:ring-neutral-900 rounded-xl shadow-sm text-white placeholder:text-neutral-500 bg-neutral-950 transition-all h-12 text-base px-4"
              disabled={loading}
            />
          </div>

          {/* Workout Sessions List */}
          {sessions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-lg">
                Your Workout Sessions
              </h3>
              <ul className="max-h-40 overflow-y-auto space-y-2">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="bg-neutral-900 p-3 rounded-xl flex justify-between items-center text-white"
                  >
                    <span>{s.workout.name ?? "unnamed workout"}</span>
                    <span className="text-neutral-400 text-sm">
                      {new Date(s.startTime).toLocaleDateString()}{" "}
                      {s.caloriesBurned ? `- ${s.caloriesBurned} cal` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Message */}
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

          {/* Buttons */}
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
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base h-12"
            >
              {loading ? "Saving..." : "Save Progress"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
