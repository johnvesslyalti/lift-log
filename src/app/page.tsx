import { redirect } from "next/navigation";
import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";

export default async function Page() {
  const { data: session } = await authClient.getSession();

  // ✅ If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

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
