'use client'

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function HandleLogout() {
    const clearUser = useUserStore((state) => state.clearUser)
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/')
                }
            }
        });

        clearUser()
    }
    return <Button onClick={handleLogout}>Logout</Button>
}