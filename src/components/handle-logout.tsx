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
      const { error } = await authClient.signOut(); // or whatever your client returns
      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      // Clear user state
      clearUser();

      // Redirect after logout
      router.push("/");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
