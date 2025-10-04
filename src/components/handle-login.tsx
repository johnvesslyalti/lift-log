"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userStore";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface SignInResult {
  user?: User;
}

export default function HandleLogin() {
  const setUser = useUserStore((state) => state.setUser);

  const handlelogin = async () => {
    try {
      const result = (await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })) as SignInResult;

      if (result.user) {
        setUser({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          image: result.user.image ?? undefined,
        });
      } else {
        console.log("Redirecting or user not immediately available");
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return <Button onClick={handlelogin}>Google</Button>;
}
