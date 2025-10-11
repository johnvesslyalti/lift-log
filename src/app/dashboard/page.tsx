"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/store/userStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Exercise } from "../exercises/page";
import Loading from "@/components/loading";

interface ExerciseStats {
  exercises: Exercise[];
  totalLifts: number;
  totalWeekLifts: number;
  averageReps: number;
}

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState<ExerciseStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/exercise"); // Adjust if your API route is different
      if (!res.ok) throw new Error("Failed to fetch exercises");
      const data: ExerciseStats = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: session, error } = await authClient.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          });
          setUserName(session.user.name ?? null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
    fetchStats();
  }, [setUser]);

  if (loading) return <Loading text="dashboard"/>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userName ? `Welcome, ${userName}` : "Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Lifts */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Lifts</h2>
          <p className="text-3xl font-bold">{stats?.totalLifts ?? 0}</p>
          <p className="text-gray-500 text-sm">Keep it up! 🏋️‍♂️</p>
        </div>

        {/* Total Week Lifts */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Lifts This Week</h2>
          <p className="text-3xl font-bold">{stats?.totalWeekLifts ?? 0}</p>
          <p className="text-gray-500 text-sm">Stay consistent 🏋️‍♂️</p>
        </div>

        {/* Average Reps */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Average Reps</h2>
          <p className="text-3xl font-bold">
            {stats?.averageReps.toFixed(1) ?? 0}
          </p>
          <p className="text-gray-500 text-sm">Steady gains 🏋️‍♂️</p>
        </div>
      </div>

      {/* Weekly Lifts Chart */}
      <div className="rounded-xl shadow p-4 mt-6 h-64">
        <h2 className="text-lg font-semibold mb-2">Weekly Lifts</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={
              stats?.exercises.map((ex) => ({
                day: new Date(ex.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                }),
                lifts: ex.sets * ex.reps,
              })) ?? []
            }
          >
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lifts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Workouts */}
      <div className="rounded-xl shadow p-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Recent Workouts</h2>
        <ul className="space-y-1">
          {stats?.exercises.slice(0, 5).map((ex, i) => (
            <li key={i}>
              🏋️‍♂️ {ex.name} — {ex.sets} sets × {ex.reps} reps
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
