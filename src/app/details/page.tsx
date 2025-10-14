'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MdFitnessCenter } from "react-icons/md";
import { FiActivity } from "react-icons/fi";

export default function CompleteProfileForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const [height, setHeight] = useState<number | null>(user?.height ?? null);
  const [weight, setWeight] = useState<number | null>(user?.weight ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!height || height <= 0 || !weight || weight <= 0) {
      setError("Please enter valid height and weight.");
      return;
    }

    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      // Call backend API
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Update Zustand store safely
      setUser({ ...user, height, weight });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl shadow-xl backdrop-blur-xl border border-neutral-800/70 p-6 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Complete Your Profile</h1>
        <p className="text-center text-gray-400">
          Please provide your height and weight to start tracking your fitness journey.
        </p>

        {/* Height */}
        <Card className="bg-neutral-800 backdrop-blur-xl rounded-2xl p-4">
          <CardHeader className="flex items-center gap-2">
            <MdFitnessCenter /> Height (cm)
          </CardHeader>
          <CardContent>
            <input
              type="number"
              className="w-full rounded-xl p-2 mt-2 text-black"
              placeholder="Enter your height in cm"
              value={height ?? ""}
              onChange={(e) =>
                setHeight(e.target.value ? Number(e.target.value) : null)
              }
            />
          </CardContent>
        </Card>

        {/* Weight */}
        <Card className="bg-neutral-800 backdrop-blur-xl rounded-2xl p-4">
          <CardHeader className="flex items-center gap-2">
            <FiActivity /> Weight (kg)
          </CardHeader>
          <CardContent>
            <input
              type="number"
              className="w-full rounded-xl p-2 mt-2 text-black"
              placeholder="Enter your weight in kg"
              value={weight ?? ""}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : null)
              }
            />
          </CardContent>
        </Card>

        {/* Error */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-2xl transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
