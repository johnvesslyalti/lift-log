'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const redirectUser = async () => {
      if (session?.user) {
        // Fetch full user data from your backend to check height/weight
        try {
          const res = await fetch("/api/user/me"); // create this route to get user info
          if (!res.ok) throw new Error("Failed to fetch user data");
          const user = await res.json();

          if (!user.height || !user.weight) {
            router.push("/details"); // Redirect to details page
          } else {
            router.push("/dashboard"); // Redirect to dashboard
          }
        } catch (error) {
          console.error(error);
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    redirectUser();
  }, [session, router]);

  if (isPending || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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
