"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { authClient } from "@/lib/auth-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import LogoLoading from "../logo-loading/page";

interface ProgressEntry {
  id: number;
  date: string; // ISO date string
  caloriesBurned: number | null;
  weight: number | null;
  workout: string;
}

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const [userName, setUserName] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch user session
        const { data: session, error } = await authClient.getSession();
        if (session?.user) {
          const user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          };
          setUser(user);
          setUserName(user.name ?? "User");
          localStorage.setItem("user", JSON.stringify(user));
        } else if (error) {
          console.error("Error fetching session:", error);
        }

        // Fetch progress
        const progressRes = await fetch("/api/progress");
        if (!progressRes.ok) throw new Error("Failed to fetch progress");
        const progressData: ProgressEntry[] = await progressRes.json();
        setProgress(progressData);

        // Fetch streak
        const streakRes = await fetch("/api/streak");
        if (!streakRes.ok) throw new Error("Failed to fetch streak");
        const streakData: { streak: number } = await streakRes.json();
        setStreak(streakData.streak ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [setUser]);

  if (loading) return <LogoLoading />;

  // Stats
  const totalCalories = progress.reduce((sum, p) => sum + (p.caloriesBurned ?? 0), 0);
  const averageWeight =
    progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.weight ?? 0), 0) / progress.length
      : 0;
  const activeDays = progress.filter((p) => p.caloriesBurned && p.caloriesBurned > 0).length;

  // Chart
  const chartData = progress.slice(-7).map((p) => ({
    day: new Date(p.date).toLocaleDateString("en-US", { weekday: "short" }),
    calories: p.caloriesBurned ?? 0,
    weight: p.weight ?? 0,
  }));

  // Recent
  const recentEntries = [...progress].reverse().slice(0, 3);

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{userName ? `Welcome, ${userName}` : "Dashboard"}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Calories Burned" value={totalCalories} color="red" />
        <DashboardCard title="Average Weight (kg)" value={averageWeight.toFixed(1)} color="blue" />
        <DashboardCard title="Active Days" value={activeDays} color="green" />
        <DashboardCard title="🔥 Current Streak" value={streak} color="yellow" />
      </div>

      {/* Chart */}
      <div className="relative rounded-2xl shadow-xl backdrop-blur-xl border border-neutral-800/70 p-6 overflow-hidden mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="#f87171" strokeWidth={2} />
              <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center">No progress data yet</p>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        {recentEntries.length > 0 ? (
          recentEntries.map((entry, index) => (
            <div
              key={entry.id}
              className="relative group rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lg p-6 overflow-hidden"
              style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
            >
              <h3 className="text-lg font-bold mb-2">{entry.workout}</h3>
              <p className="text-sm text-neutral-400 mb-2">{new Date(entry.date).toLocaleDateString()}</p>
              <div className="flex gap-4 text-sm text-neutral-400">
                <span>🔥 Calories: {entry.caloriesBurned ?? 0}</span>
                <span>⚖️ Weight: {entry.weight ?? "N/A"} kg</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl shadow-xl p-12 text-center border border-neutral-800/70">
            <p className="text-neutral-400">No workouts logged yet</p>
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// --- Dashboard Card Component ---
function DashboardCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number | string;
  color?: "red" | "blue" | "green" | "yellow";
}) {
  const colorClasses: Record<"red" | "blue" | "green" | "yellow", string> = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-400",
  };

  return (
    <div className="relative group rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lg p-6 overflow-hidden">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${color ? colorClasses[color] : ""}`}>{value}</p>
    </div>
  );
}
