"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/store/userStore";

export default function Dashboard() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: session, error } = await authClient.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? undefined,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>This is the dashboard</div>
    </div>
  );
}
