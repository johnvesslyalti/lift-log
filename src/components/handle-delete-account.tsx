'use client'

import { useState } from "react";
import { handleError } from "./error-handle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function HandleDeleteAccount() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/profile', {
                method: 'Delete',
            });

            if(!res.ok) {
                const errorData = await res.json()
                const handled = handleError(errorData)
                alert(handled.message || "something went wrong")
                return
            }

            alert("Account deleted successfully")
            router.push("/")
            setLoading(false)
        } catch (error: unknown) {
            return handleError(error)
        }
    }
    return (
        <Button 
      onClick={handleDelete} 
      disabled={loading}
      className={loading ? "opacity-50 cursor-not-allowed" : ""}
    >
      {loading ? "Deleting..." : "Delete Account"}
    </Button>
    )
}