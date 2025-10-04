import { ModeToggle } from "./mode-toggle";

// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4">
        {/* Branding */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">🏋️ Lift Log</span>
          <span className="text-sm text-muted-foreground">
            Track • Train • Transform
          </span>
        </div>

        {/* Links */}
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
          <a href="/about" className="hover:text-primary transition">About</a>
          <a href="/privacy" className="hover:text-primary transition">Privacy</a>
          <a href="/terms" className="hover:text-primary transition">Terms</a>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lift Log. All rights reserved.
        </div>

        <div>
            <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
