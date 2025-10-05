import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";

export default function Page() {
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
