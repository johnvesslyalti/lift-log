"use client";

import Image from "next/image";
import { motion } from "motion/react";

const IMAGES = [
  { src: "/dashboard.png", alt: "Dashboard Preview" },
  { src: "/exercise.png", alt: "Exercise Selection" },
  { src: "/lift-log.png", alt: "Lift Logging UI" },
  { src: "/progress.png", alt: "Progress Tracking" },
  { src: "/workout.png", alt: "Workout Session Screen" },
];

export default function CTASection() {
  return (
    <section className="relative py-28">
      {/* subtle bg glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(94,234,212,0.18),transparent_70%)]" />

      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Your progress deserves to be{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 bg-clip-text text-transparent">
            seen.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-white/70 max-w-xl mx-auto"
        >
          LiftLog turns your training into measurable progress — so you can see
          exactly how far you&apos;ve come.
        </motion.p>
      </div>

      {/* Images Grid */}
      <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 px-6 place-items-center">
        {IMAGES.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.35)]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={300}
              height={200}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 flex justify-center"
      >
        <a
          href="/app"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 text-black hover:opacity-90 transition"
        >
          Start Your Journey
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="transition"
          >
            <path
              d="M5 12h14m0 0-6-6m6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
