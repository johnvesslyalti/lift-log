import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function Page() {
    const { data: session } = await authClient.getSession()

    if(session) {
        redirect("/dashboard")
    }
  return (
    <div className="flex flex-col justify-center">
      <main className="min-h-screen">
        <div className="text-xl">Landing page coming soon...</div>
        <HandleLogin />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
