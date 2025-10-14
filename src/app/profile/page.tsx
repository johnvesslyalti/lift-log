"use client";

import HandleLogout from "@/components/handle-logout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StreakData {
  streak: number;
}

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/streak", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch streak");
        const data: StreakData = await res.json();
        setStreak(data.streak ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStreak();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();
        if (user) setUser({ ...user, ...data });
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch height/weight if missing
    if (user && (user.height == null || user.weight == null)) {
      fetchProfile();
    }
  }, [user, setUser]);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative w-40 h-40 mb-4">
        {user.image ? (
          <Image
            src={user.image}
            fill
            alt="User Image"
            className="rounded-full object-cover border-4 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-600 rounded-full text-5xl font-bold shadow-lg border-4">
            {user.name?.[0] ?? "U"}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Hello, {user.name ?? "User"}!</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 w-full max-w-3xl">
        <Card className="transition p-4 rounded-2xl shadow-lg">
          <CardHeader>📏 Height</CardHeader>
          <CardContent>{user.height ?? "N/A"} cm</CardContent>
        </Card>
        <Card className="transition p-4 rounded-2xl shadow-lg">
          <CardHeader>⚖️ Weight</CardHeader>
          <CardContent>{user.weight ?? "N/A"} kg</CardContent>
        </Card>
        <Card className="transition p-4 rounded-2xl shadow-lg">
          <CardHeader>🔥 Current Streak</CardHeader>
          <CardContent>{streak}</CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <HandleLogout />
      </div>
    </div>
  );
}
