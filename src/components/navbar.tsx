"use client";

import { motion } from "motion/react";

const navbar_content = [
    {name: "Overview", refr: "#overview"},
    {name: "Features", refr: "#features"},
    {name: "Pricing", refr: "#pricing"},
    {name: "CTA", refr: "#cta"},
];

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] z-50 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0, 0, 0, 0.3)] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <svg
            width="50"
            height="50"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="liftlogGradient"
                x1="0"
                y1="0"
                x2="64"
                y2="64"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#5eead4" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>

            <path
              d="M10 26H6V38H10V26ZM18 22H14V42H18V22ZM26 30V26H22V38H26V34H36L30 40L34 44L48 30L34 16L30 20L36 26H26ZM50 22H46V42H50V22ZM58 26H54V38H58V26Z"
              fill="url(#liftlogGradient)"
            />
          </svg>

          <span className="tracking-tight text-white">
            Lift<span className="text-[10px]">Log</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-xs text-gray-300">
          {navbar_content.map((navbar_con, index) => (
            <motion.a
              key={index}
              href={navbar_con.refr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1, color: "#fff" }}
              transition={{
                delay: 0.1 * index,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="hover:text-white transition-colors"
            >
              {navbar_con.name}
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  );
}
