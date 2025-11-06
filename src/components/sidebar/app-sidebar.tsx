"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Home, Dumbbell, List, BarChart, Settings } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function AppSidebar({ children }: SidebarLayoutProps) {
  const user = useUserStore((state) => state.user);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Workouts", href: "/workouts", icon: <Dumbbell size={20} /> },
    { name: "Exercises", href: "/exercises", icon: <List size={20} /> },
    { name: "Progress", href: "/progress", icon: <BarChart size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar className="bg-neutral-900 text-white border-r border-white/10">
        <SidebarHeader className="p-4">
          <h1 className="text-xl font-bold tracking-wide">LiftLog</h1>
        </SidebarHeader>

        <SidebarContent className="flex flex-col gap-1 px-2 mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors
              text-white hover:bg-emerald-500 hover:text-black font-semibold"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </SidebarContent>

        <SidebarFooter className="mt-auto p-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors
            hover:bg-emerald-500 hover:text-black font-semibold"
          >
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span>{user?.name ?? "User"}</span>
          </Link>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
