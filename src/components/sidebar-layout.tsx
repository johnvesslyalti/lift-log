"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  Menu,
  Home,
  Dumbbell,
  List,
  BarChart,
  Settings,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useUserStore((state) => state.user);

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Workouts", href: "/workouts", icon: <Dumbbell size={20} /> },
    { name: "Exercises", href: "/exercises", icon: <List size={20} /> },
    { name: "Progress", href: "/progress", icon: <BarChart size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`p-4 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col border-r dark:border-white/10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-white/5"
          >
            <Menu size={20} />
          </button>

          {!collapsed && <h1 className="text-xl font-bold">LiftLog</h1>}
          {!collapsed && <ModeToggle />}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User profile (bottom) */}
        <Link
          href="/profile"
          className="mt-auto flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors"
        >
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && <span>{user?.name ?? "User"}</span>}
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
