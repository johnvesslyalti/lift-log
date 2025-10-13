'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard"); // Client-side redirect
    }
  }, [session, router]);

  return (
    <div className="flex flex-col justify-center">
      <main className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Landing page coming soon...</div>
        <HandleLogin />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
