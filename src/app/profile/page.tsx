"use client";

import HandleLogout from "@/components/handle-logout";
import { useUserStore } from "@/store/userStore";
import EditProfileDialog from "@/components/edit-profile-dialog";
import Image from "next/image";
import MissingProfileDataPrompt from "@/components/missing-profile-data-prompt";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Weight, Flame, Mail } from "lucide-react";

interface StreakData {
  streak: number;
}

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Fetch streak once
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/streak", { credentials: "include" });
        if (!res.ok) return;
        const data: StreakData = await res.json();
        setStreak(data.streak ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStreak();
  }, []);

  // Fetch profile only once, or when we haven't loaded it yet.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setProfileLoaded(true);
        setLoading(false);
      }
    };

    if (!profileLoaded) {
      fetchProfile();
    }
  }, [profileLoaded, setUser]);

  // Loading UI
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500"
        >
          Loading...
        </motion.div>
      </div>
    );
  }



  return (
    <motion.div
      className="min-h-screen p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <MissingProfileDataPrompt />

        {/* Header Section */}
        <div className="rounded-2xl shadow-lift-gradient p-6 md:p-8 mb-8 border border-neutral-800 flex flex-col md:flex-row items-center gap-8 bg-black/20 backdrop-blur-sm">
          <div className="relative group">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-br from-emerald-400 to-teal-600">
              <div className="w-full h-full rounded-full border-4 border-black overflow-hidden relative">
                {user.image ? (
                  <Image
                    src={user.image}
                    fill
                    alt="User Image"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-4xl font-bold text-emerald-500">
                    {user.name?.[0] ?? "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {user.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 font-medium">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="pt-2">
              <EditProfileDialog />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Height Card */}
          <motion.div
            className="rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lift-gradient p-6 flex flex-col items-center justify-center gap-4 bg-black/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Ruler className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Height</p>
              <p className="text-3xl font-bold text-white">
                {user.height ? <span className="text-blue-100">{user.height}</span> : <span className="text-gray-600 text-xl">--</span>}
                <span className="text-sm text-gray-500 ml-1 font-normal">cm</span>
              </p>
            </div>
          </motion.div>

          {/* Weight Card */}
          <motion.div
            className="rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lift-gradient p-6 flex flex-col items-center justify-center gap-4 bg-black/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Weight className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Weight</p>
              <p className="text-3xl font-bold text-white">
                {user.weight ? <span className="text-emerald-100">{user.weight}</span> : <span className="text-gray-600 text-xl">--</span>}
                <span className="text-sm text-gray-500 ml-1 font-normal">kg</span>
              </p>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            className="rounded-2xl backdrop-blur-xl border border-neutral-800/70 shadow-lift-gradient p-6 flex flex-col items-center justify-center gap-4 bg-black/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-white">
                <span className="text-orange-100">{streak}</span>
                <span className="text-sm text-gray-500 ml-1 font-normal">days</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center">
          <HandleLogout />
        </div>
      </div>
    </motion.div>
  );
}

