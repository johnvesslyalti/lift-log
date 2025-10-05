"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function HandleLogin() {

  const handlelogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return <Button onClick={handlelogin}>Google</Button>;
}
