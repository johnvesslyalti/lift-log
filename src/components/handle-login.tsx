"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function HandleLogin() {
  const handlelogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };
  return <Button onClick={handlelogin}>Google</Button>
}
