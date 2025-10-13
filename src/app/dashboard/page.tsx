"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/store/userStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Loading from "@/components/loading";

interface ProgressEntry {
  date: string; // ISO date string
  calories: number | null;
  weight: number | null;
}

interface ProgressStats {
  entries: ProgressEntry[];
  totalCalories: number;
  averageWeight: number;
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

      if (!Array.isArray(data) || data.length === 0) {
        setStats({
          entries: [],
          totalCalories: 0,
          averageWeight: 0,
        });
        return;
      }

      const totalCalories = data.reduce(
        (sum, e) => sum + (e.calories ?? 0),
        0
      );
      const averageWeight =
        data.reduce((sum, e) => sum + (e.weight ?? 0), 0) / data.length;

      setStats({
        entries: data,
        totalCalories,
        averageWeight,
      });
    } catch (err) {
      console.error(err);
      setStats({
        entries: [],
        totalCalories: 0,
        averageWeight: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: session, error } = await authClient.getSession();
        if (error) return;
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          });
          setUserName(
            typeof session.user.name === "string" ? session.user.name : null
          );
        }
      } catch (err) {}
    };

    getUser();
    fetchStats();
  }, [setUser]);

  if (loading) return <Loading text="dashboard" />;

  const entries = stats?.entries ?? [];

  // Rechart-friendly data
  const chartData = entries.map((p) => ({
    day: new Date(p.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    calories: p.calories ?? 0,
    weight: p.weight ?? 0,
  }));

  // Calculate today/yesterday progress for summary
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const todayEntry = entries.find(
    (e) => new Date(e.date).toDateString() === today
  );
  const yesterdayEntry = entries.find(
    (e) => new Date(e.date).toDateString() === yesterday
  );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userName ? `Welcome, ${userName}` : "Dashboard"}
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Calories Burned"
          value={`${stats?.totalCalories ?? 0}`}
          subtitle="🔥 Keep pushing!"
        />
        <StatCard
          title="Average Weight (kg)"
          value={
            stats?.averageWeight
              ? stats.averageWeight.toFixed(1)
              : "0"
          }
          subtitle="⚖️ Staying consistent!"
        />
        <StatCard
          title="Active Days This Week"
          value={entries.filter((e) => e.calories && e.calories > 0).length}
          subtitle="💪 Great streak!"
        />
      </div>

      {/* Weekly Graph */}
      <div className="rounded-xl shadow p-4 mt-6 h-64 bg-card">
        <h2 className="text-lg font-semibold mb-2">Weekly Progress</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#f87171"
              strokeWidth={2}
              name="Calories Burned"
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#60a5fa"
              strokeWidth={2}
              name="Weight (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DaySummary title="Yesterday" entry={yesterdayEntry} />
        <DaySummary title="Today" entry={todayEntry} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl shadow p-4 bg-card">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function DaySummary({
  title,
  entry,
}: {
  title: string;
  entry?: ProgressEntry;
}) {
  return (
    <div className="rounded-xl shadow p-4 bg-card">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {entry ? (
        <ul className="space-y-1 text-sm">
          <li>🔥 Calories: {entry.calories ?? 0}</li>
          <li>⚖️ Weight: {entry.weight ?? "N/A"} kg</li>
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No data logged</p>
      )}
    </div>
  );
}
