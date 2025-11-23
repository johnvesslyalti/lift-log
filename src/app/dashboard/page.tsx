"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import LogoLoading from "../logo-loading/page";

interface ProgressEntry {
  id: number;
  date: string;
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
        // Fetch session
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          const mappedUser = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          };

          setUser(mappedUser);
          setUserName(mappedUser.name ?? "User");
          localStorage.setItem("user", JSON.stringify(mappedUser));
        }

        // Progress
        const progressRes = await fetch("/api/progress");
        const { progress: progressList } = await progressRes.json();
        setProgress(progressList);

        // Streak
        const streakRes = await fetch("/api/streak");
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
  const totalCalories = progress.reduce(
    (sum, p) => sum + (p.caloriesBurned ?? 0),
    0
  );
  const averageWeight =
    progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.weight ?? 0), 0) / progress.length
      : 0;

  const activeDays = progress.filter((p) => p.caloriesBurned).length;

  // ---------------------------
  // ✔ FIXED: Calculate THIS WEEK ONLY (Sun → Today)
  // ---------------------------
  const now = new Date();

  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);

  const thisWeekProgress = progress.filter((p) => {
    const d = new Date(p.date);
    return d >= weekStart && d <= weekEnd;
  });

  // Build Sun → Sat graph with fresh data
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyDailyData = weekdays.map((day) => ({
    day,
    calories: 0,
    weight: 0,
  }));

  thisWeekProgress.forEach((p) => {
    const d = new Date(p.date);
    const idx = d.getDay();
    weeklyDailyData[idx].calories += p.caloriesBurned ?? 0;
    weeklyDailyData[idx].weight =
      p.weight ?? weeklyDailyData[idx].weight;
  });

  // ---------------------------
  // END FIX
  // ---------------------------

  return (
    <motion.div
      className="min-h-screen p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold mb-8">
        {userName ? `Welcome, ${userName}` : "Dashboard"}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Calories Burned" value={totalCalories} />
        <StatCard
          title="Average Weight (kg)"
          value={averageWeight.toFixed(1)}
        />
        <StatCard title="Active Days" value={activeDays} />
        <StatCard title="Current Streak" value={streak} />
      </div>

      {/* Bar Chart */}
      <motion.div
        className="rounded-2xl shadow-lift-gradient backdrop-blur-xl border border-neutral-800/70 p-6 my-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4">This Week</h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={weeklyDailyData}>
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                background: "rgba(17, 24, 39, 0.8)",
                border: "1px solid rgba(45, 212, 191, 0.3)",
                borderRadius: "10px",
                backdropFilter: "blur(6px)",
              }}
              labelStyle={{ color: "#fff" }}
            />

            <Bar
              dataKey="calories"
              name="Calories Burned"
              animationDuration={900}
              radius={[6, 6, 0, 0]}
              fill="url(#tealGradient)"
            />

            <Bar
              dataKey="weight"
              name="Weight (kg)"
              animationDuration={900}
              radius={[6, 6, 0, 0]}
              fill="url(#tealBlueGradient)"
            />

            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>

              <linearGradient id="tealBlueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <motion.div
      className="rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lift-gradient p-6"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-sm text-gray-300 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-lift-gradient">{value}</p>
    </motion.div>
  );
}
