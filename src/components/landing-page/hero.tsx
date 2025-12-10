"use client";

import { motion } from "motion/react";
import HandleLogin from "../handle-login";
import { Button } from "../ui/button";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center py-24 px-6 md:py-28"
      aria-labelledby="hero-heading"
      id="overview"
    >
      <motion.h1
        id="hero-heading"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 bg-clip-text text-transparent tracking-tight"
      >
        Track. Improve. Dominate.
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
        className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
      >
        LiftLog helps you stay consistent, visualize progress, and achieve your
        dream physique.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
        className="flex gap-5"
      >
        <HandleLogin />

        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
          Learn More
        </Button>
      </motion.div>
    </div>
  );
}
