"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function HandleLogout() {
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ✅ Ensure cookie is included during logout
      const { error } = await authClient.signOut({
        fetchOptions: {
          credentials: "include",
        },
      });

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      // ✅ Clear persisted store AFTER logout finishes
      clearUser();

      // ✅ Replace so the user cannot go back to protected pages
      router.replace("/");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
