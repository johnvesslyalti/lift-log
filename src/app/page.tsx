'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectUser = async () => {
      if (!session?.user) {
        // No user logged in
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const user = await res.json();

        // Redirect based on profile completeness
        if (!user.height || !user.weight) {
          router.replace("/details");
        } else {
          router.replace("/dashboard");
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) redirectUser();
  }, [session, isPending, router]);

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <HandleLogin />
      </div>
    );
  }

  // If no session, show landing page
  return (
    <div className="flex flex-col justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="text-xl mb-4">Landing page coming soon...</div>
        <HandleLogin />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
