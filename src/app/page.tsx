"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
  type Transition,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import Hero from "@/components/landing-page/hero";

export default function LandingPage() {
  // Hooks must be unconditional and at the top
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;

    const redirectUser = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        router.replace("/dashboard");
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (session?.user) setError("Something went wrong. Please try again.");
      }
    };

    void redirectUser();
  }, [session, isPending, router]); // Hooks must be called in same order every render [web:21][web:72]

  // Prefer primitives as deps; compose objects inside useMemo to avoid exhaustive-deps churn
  const easeOut: Transition["ease"] = "easeOut";
  const baseDuration = 0.6;
  const fastDuration = 0.5;

  // Variants with stable deps
  const heroVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: baseDuration, ease: easeOut },
      },
    }),
    [baseDuration, easeOut]
  );

  const containerVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
      },
    }),
    []
  );

  const cardVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 24, scale: 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: fastDuration, ease: easeOut },
      },
    }),
    [fastDuration, easeOut]
  );

  // Motion values created unconditionally (don’t gate hooks)
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 400], [0, 40]);
  const blobRotate = useTransform(scrollY, [0, 400], [0, 8]); // Easing accepts named strings or cubic-bezier tuples in Motion [web:38][web:26]

  const showLoading = isPending;
  const showError = !isPending && error;

  const features = [
    {
      title: "Dashboard Overview",
      desc: "Visualize your entire fitness journey — streaks, time spent, and calories burned, all in one place.",
      image: "/dashboard.png",
    },
    {
      title: "Workout Tracking",
      desc: "Log workouts easily and stay consistent with detailed exercise breakdowns and time tracking.",
      image: "/workout.png",
    },
    {
      title: "Exercise Management",
      desc: "Create, edit, and customize exercises tailored to your goals — track sets, reps, and progress.",
      image: "/exercise.png",
    },
    {
      title: "Progress Insights",
      desc: "Track your weight, muscle growth, and progress with beautiful charts and analytics.",
      image: "/progress.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(1200px_800px_at_50%_-10%,#0f172a,transparent),linear-gradient(to_b,#0b1220,#030712_70%)] text-white">
      {/* Loading */}
      {showLoading && (
        <section className="min-h-screen flex items-center justify-center">
          Loading...
        </section>
      )}

      {/* Error */}
      {!showLoading && showError && (
        <section className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error}</p>
          <HandleLogin />
        </section>
      )}

      {/* Main content */}
      {!showLoading && !showError && (
        <>
          {/* Subtle parallax blobs */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed -z-10 inset-0"
            style={{ y: blobY, rotate: blobRotate }}
          >
            <div className="absolute left-1/2 top-24 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute right-20 top-64 h-56 w-56 rounded-full bg-teal-400/10 blur-2xl" />
          </motion.div>

          <Hero />

          {/* Features */}
          <section
            className="px-6 md:px-12 lg:px-20 py-20"
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="sr-only">
              Features
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14"
            >
              {features.map((feat, idx) => (
                <motion.article
                  key={feat.title}
                  variants={cardVariants}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors backdrop-blur-sm shadow-lg"
                >
                  <div className="p-4 md:p-5">
                    <div className="relative overflow-hidden rounded-2xl">
                      <Image
                        src={feat.image}
                        alt={feat.title}
                        width={1000}
                        height={800}
                        className="rounded-2xl object-cover"
                        loading={idx > 0 ? "lazy" : "eager"}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent"
                        aria-hidden
                      />
                    </div>

                    <div className="mt-5">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {feat.title}
                      </h3>
                      <p className="mt-2 text-gray-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </section>

          {/* CTA */}
          <section
            className="text-center py-20 px-6 relative overflow-hidden"
            aria-labelledby="cta-heading"
          >
            <div className="absolute" aria-hidden />
            <div className="relative">
              <h3
                id="cta-heading"
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to log your next lift?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Join LiftLog and make every rep count.
              </p>
              <div className="inline-flex">
                <HandleLogin />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full border-t border-white/10 bg-white/[0.02] mt-auto">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">🏋️ Lift Log</span>
                <span className="text-sm text-gray-400">
                  Track • Train • Transform
                </span>
              </div>

              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} Lift Log. All rights reserved.
              </div>

              <div>
                <ModeToggle />
              </div>
            </div>
          </footer>

          {/* Reduced motion preference */}
          <style jsx global>{`
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
                scroll-behavior: auto !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
