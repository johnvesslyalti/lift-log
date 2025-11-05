"use client";

import { motion } from "motion/react";
import HandleLogin from "../handle-login";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center py-24 px-6 md:py-28"
      aria-labelledby="hero-heading"
    >
      <motion.h1
        id="hero-heading"
        initial="hidden"
        animate="show"
        className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 bg-clip-text text-transparent tracking-tight"
      >
        Track. Improve. Dominate.
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="show"
        className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
      >
        LiftLog helps you stay consistent, visualize progress, and achieve your
        dream physique.
      </motion.p>

      <div className="flex gap-5">
        {/* Track */}
        <HandleLogin />

        {/* Dominate */}
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
          Learn More
        </Button>
      </div>
    </div>
  );
}
