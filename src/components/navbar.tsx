// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          🏋️ Lift Log
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/workouts" className="hover:text-primary transition">
            Workouts
          </Link>
          <Link href="/progress" className="hover:text-primary transition">
            Progress
          </Link>
          <Link href="/settings" className="hover:text-primary transition">
            Settings
          </Link>
        </div>

        {/* Call to Action */}
        <div className="hidden md:flex">
          <Button asChild>
            <Link href="/profile">My Profile</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-4 pb-4 border-t bg-background">
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
          <Link href="/workouts" onClick={() => setIsOpen(false)}>
            Workouts
          </Link>
          <Link href="/progress" onClick={() => setIsOpen(false)}>
            Progress
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)}>
            Settings
          </Link>
          <Button asChild className="w-full mt-2">
            <Link href="/profile">My Profile</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
