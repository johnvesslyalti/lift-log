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

const dummyStats = [
  { day: "Mon", lifts: 5 },
  { day: "Tue", lifts: 3 },
  { day: "Wed", lifts: 4 },
  { day: "Thu", lifts: 6 },
  { day: "Fri", lifts: 2 },
  { day: "Sat", lifts: 4 },
  { day: "Sun", lifts: 1 },
];

const recentWorkouts = [
  "Monday - Chest & Triceps",
  "Tuesday - Back & Biceps",
  "Wednesday - Legs",
  "Thursday - Shoulders",
  "Friday - Full Body",
];

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const [userName, setUserName] = useState<string | null>(null);

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
  }, [setUser]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userName ? `Welcome, ${userName}` : "Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Lifts */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Lifts This Week</h2>
          <p className="text-3xl font-bold">25</p>
          <p className="text-gray-500 text-sm">Keep it up!</p>
        </div>

        {/* Max Weight */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Max Weight Lifted</h2>
          <p className="text-3xl font-bold">120kg</p>
          <p className="text-gray-500 text-sm">New PR 🔥</p>
        </div>

        {/* Average Reps */}
        <div className="rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Average Reps</h2>
          <p className="text-3xl font-bold">8</p>
          <p className="text-gray-500 text-sm">Steady gains 💪</p>
        </div>
      </div>

      {/* Weekly Lifts Chart */}
      <div className="rounded-xl shadow p-4 mt-6 h-64">
        <h2 className="text-lg font-semibold mb-2">Weekly Lifts</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dummyStats}>
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
          {recentWorkouts.map((w, i) => (
            <li key={i}>🏋️‍♂️ {w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
