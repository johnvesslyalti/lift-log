'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return; // Wait for session to load

    const redirectUser = async () => {
      if (!session?.user) return; // No user logged in, show landing page

      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch user data");

        const user = await res.json();

        // Redirect based on profile completeness
        router.replace(
          !user.height || !user.weight ? "/details" : "/dashboard"
        );
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      }
    };

    redirectUser();
  }, [session, isPending, router]);

  if (isPending) {
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

  // Show landing page if no session
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
