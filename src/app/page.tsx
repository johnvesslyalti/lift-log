import Footer from "@/components/footer";
import HandleLogin from "@/components/handle-login";

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <main>
        <div className="text-xl">Landing page coming soon...</div>
        <HandleLogin />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
