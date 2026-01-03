"use client";

import { motion } from "framer-motion";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function MetricsOnboardingPage() {
    return (
        <motion.div
            className="relative min-h-screen flex flex-col items-center justify-center text-center py-16 px-6 md:py-20 bg-gray-900"
            aria-labelledby="metrics-heading"
            id="metrics-page"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.header id="metrics-heading" className="mb-8" variants={containerVariants}>
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-extrabold mb-4 
                     bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 
                     bg-clip-text text-transparent tracking-tight"
                >
                    Let's Set Your Baseline
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
                >
                    To accurately track your progress and calculate metrics, we just need
                    your current height and weight.
                </motion.p>
            </motion.header>

            <motion.div variants={itemVariants} className="w-full max-w-sm">
                <ProfileForm />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
                <Link href="/dashboard" passHref>
                    <Button
                        variant="link"
                        className="text-gray-400 hover:text-gray-200"
                    >
                        Skip for now (I'll do it later)
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
