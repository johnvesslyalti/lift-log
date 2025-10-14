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
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState(userFromStore);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (userFromStore) setUser(userFromStore);

    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/streak");
        if (!res.ok) throw new Error("Failed to fetch streak");
        const data: StreakData = await res.json();
        setStreak(data.streak ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStreak();
  }, [userFromStore]);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-neutral-900 text-white">
      {/* Profile Image */}
      <div className="relative w-40 h-40 mb-4">
        {user.image ? (
          <Image
            src={user.image}
            fill
            alt="User Image"
            className="rounded-full object-cover border-4 border-yellow-400 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-600 rounded-full text-5xl font-bold text-white shadow-lg border-4 border-yellow-400">
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
        <Card className="bg-neutral-800 hover:bg-neutral-700 transition p-4 rounded-2xl shadow-lg">
          <CardHeader>📏 Height</CardHeader>
          <CardContent>{user.height ?? "N/A"} cm</CardContent>
        </Card>
        <Card className="bg-neutral-800 hover:bg-neutral-700 transition p-4 rounded-2xl shadow-lg">
          <CardHeader>⚖️ Weight</CardHeader>
          <CardContent>{user.weight ?? "N/A"} kg</CardContent>
        </Card>
        <Card className="bg-neutral-800 hover:bg-neutral-700 transition p-4 rounded-2xl shadow-lg">
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
