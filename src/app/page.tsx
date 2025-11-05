"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";
import Hero from "@/components/landing-page/hero";
import LogoLoading from "./logo-loading/page";
import Features from "@/components/landing-page/features";
import Pricing from "@/components/landing-page/pricing";

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

  // Motion values created unconditionally (don’t gate hooks)
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 400], [0, 40]);
  const blobRotate = useTransform(scrollY, [0, 400], [0, 8]); // Easing accepts named strings or cubic-bezier tuples in Motion [web:38][web:26]

  const showLoading = isPending;
  const showError = !isPending && error;

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(1200px_800px_at_50%_-10%,#0f172a,transparent),linear-gradient(to_b,#0b1220,#030712_70%)] text-white">
      {/* Loading */}
      {showLoading && (
        <LogoLoading />
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
          <Features />
          <Pricing />

        </>
      )}
    </div>
  );
}
