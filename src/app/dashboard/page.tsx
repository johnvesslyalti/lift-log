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
import Loading from "@/components/loading";

interface ProgressEntry {
  id: string;
  workout: string;
  sets: number;
  reps: number;
  createdAt: string;
}

interface ProgressStats {
  entries: ProgressEntry[];
  totalLifts: number;
  totalWeekLifts: number;
  averageReps: number;
}

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Failed to fetch progress");

      const data: ProgressEntry[] = await res.json();
      console.log("📊 /api/progress returned:", data);

      if (!Array.isArray(data)) {
        console.error("❌ API didn't return an array:", data);
        setStats({
          entries: [],
          totalLifts: 0,
          totalWeekLifts: 0,
          averageReps: 0,
        });
        return;
      }

      // ✅ Safe numeric calculations
      const totalLifts = data.reduce((acc, e) => {
        const sets = Number(e.sets);
        const reps = Number(e.reps);
        if (isNaN(sets) || isNaN(reps)) return acc;
        return acc + sets * reps;
      }, 0);

      const totalWeekLifts = data
        .filter((e) => {
          const diff =
            (Date.now() - new Date(e.createdAt).getTime()) /
            (1000 * 60 * 60 * 24);
          return diff <= 7;
        })
        .reduce((acc, e) => {
          const sets = Number(e.sets);
          const reps = Number(e.reps);
          if (isNaN(sets) || isNaN(reps)) return acc;
          return acc + sets * reps;
        }, 0);

      const averageReps =
        data.length > 0
          ? data.reduce((acc, e) => {
              const reps = Number(e.reps);
              return acc + (isNaN(reps) ? 0 : reps);
            }, 0) / data.length
          : 0;

      setStats({
        entries: data,
        totalLifts: isNaN(totalLifts) ? 0 : totalLifts,
        totalWeekLifts: isNaN(totalWeekLifts) ? 0 : totalWeekLifts,
        averageReps: isNaN(averageReps) ? 0 : averageReps,
      });
    } catch (err) {
      console.error("🔥 fetchStats error:", err);
      setStats({
        entries: [],
        totalLifts: 0,
        totalWeekLifts: 0,
        averageReps: 0,
      });
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

  if (loading) return <Loading text="dashboard" />;

  const entries = stats?.entries ?? [];

  // ✅ Ensure chartData is safe and numeric
  const chartData = entries.map((p) => {
    const lifts = Number(p.sets) * Number(p.reps);
    return {
      day: new Date(p.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      lifts: isNaN(lifts) ? 0 : lifts,
    };
  });

  const getEntriesForDay = (daysAgo: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    const targetStr = targetDate.toDateString();

    return entries.filter(
      (e) => new Date(e.createdAt).toDateString() === targetStr
    );
  };

  const todayEntries = getEntriesForDay(0);
  const yesterdayEntries = getEntriesForDay(1);
  const beforeYesterdayEntries = getEntriesForDay(2);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userName ? `Welcome, ${userName}` : "Dashboard"}
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl shadow p-4 bg-card">
          <h2 className="text-lg font-semibold mb-2">Total Lifts</h2>
          <p className="text-3xl font-bold">
            {stats?.totalLifts ?? 0}
          </p>
          <p className="text-gray-500 text-sm">Keep it up! 🏋️‍♂️</p>
        </div>

        <div className="rounded-xl shadow p-4 bg-card">
          <h2 className="text-lg font-semibold mb-2">Lifts This Week</h2>
          <p className="text-3xl font-bold">
            {stats?.totalWeekLifts ?? 0}
          </p>
          <p className="text-gray-500 text-sm">Stay consistent 💪</p>
        </div>

        <div className="rounded-xl shadow p-4 bg-card">
          <h2 className="text-lg font-semibold mb-2">Average Reps</h2>
          <p className="text-3xl font-bold">
            {stats ? (isNaN(stats.averageReps) ? 0 : stats.averageReps.toFixed(1)) : 0}
          </p>
          <p className="text-gray-500 text-sm">Steady gains 🏋️‍♀️</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="rounded-xl shadow p-4 mt-6 h-64 bg-card">
        <h2 className="text-lg font-semibold mb-2">Weekly Lifts</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lifts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent 3 Days Workouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <WorkoutDay title="Day Before Yesterday" entries={beforeYesterdayEntries} />
        <WorkoutDay title="Yesterday" entries={yesterdayEntries} />
        <WorkoutDay title="Today" entries={todayEntries} />
      </div>
    </div>
  );
}

function WorkoutDay({
  title,
  entries,
}: {
  title: string;
  entries: ProgressEntry[];
}) {
  return (
    <div className="rounded-xl shadow p-4 bg-card">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {entries.length ? (
        <ul className="space-y-1">
          {entries.map((e, i) => {
            const sets = Number(e.sets);
            const reps = Number(e.reps);
            return (
              <li key={i}>
                🏋️‍♂️ {e.workout} — {isNaN(sets) ? 0 : sets} sets ×{" "}
                {isNaN(reps) ? 0 : reps} reps
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No workout logged</p>
      )}
    </div>
  );
}
