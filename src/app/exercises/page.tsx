"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import HandleLogout from "@/components/handle-logout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FiActivity } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";
import { AiOutlineFire } from "react-icons/ai";

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
    <div className="min-h-screen p-6 md:p-8 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

        {/* Profile Header */}
        <div className="relative flex flex-col items-center rounded-2xl shadow-xl p-6 md:p-8 border border-neutral-800/70 backdrop-blur-xl w-full max-w-md">
          {user.image ? (
            <Image
              src={user.image}
              width={150}
              height={150}
              alt="User Image"
              className="rounded-full border-4 border-yellow-400 shadow-lg mb-4"
            />
          ) : (
            <div className="w-36 h-36 rounded-full flex items-center justify-center bg-gray-600 text-5xl font-bold mb-4 border-4 border-yellow-400 shadow-lg">
              {user.name?.[0] ?? "U"}
            </div>
          )}
          <h1 className="text-2xl font-bold mb-1">Hello, {user.name ?? "User"}!</h1>
          <p className="text-gray-400 mb-4">{user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="bg-neutral-800 backdrop-blur-xl rounded-2xl shadow-lg p-4 hover:shadow-white/30 transition">
            <CardHeader className="flex items-center gap-2">
              <MdFitnessCenter /> Height
            </CardHeader>
            <CardContent>{user.height ?? "N/A"} cm</CardContent>
          </Card>

          <Card className="bg-neutral-800 backdrop-blur-xl rounded-2xl shadow-lg p-4 hover:shadow-white/30 transition">
            <CardHeader className="flex items-center gap-2">
              <FiActivity /> Weight
            </CardHeader>
            <CardContent>{user.weight ?? "N/A"} kg</CardContent>
          </Card>

          <Card className="bg-neutral-800 backdrop-blur-xl rounded-2xl shadow-lg p-4 hover:shadow-white/30 transition">
            <CardHeader className="flex items-center gap-2">
              <AiOutlineFire /> Current Streak
            </CardHeader>
            <CardContent>{streak}</CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="w-full flex justify-center mt-6">
          <HandleLogout />
        </div>
      </div>
    </div>
  );
}
