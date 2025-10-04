"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { Menu, Home, Activity } from "lucide-react"; // Lucide icons
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const user = useUserStore((state) => state.user);

  // Menu items
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Progress", href: "/progress", icon: <Activity size={20} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`p-4 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col border-r-white/50 border-[1px]`}
      >
        <div className="flex items-center gap-5">
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 p-2 rounded hover:bg-white/5 hover:border-rounded"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          {!collapsed && <h1 className="text-xl font-bold mb-6">LiftLog</h1>}
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded hover:bg-white/5 hover:border-rounded transition-colors`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <Link
          href={"/profile"}
          className="mt-auto flex items-center gap-3 p-2 rounded hover:bg-white/5 hover:border-rounded transition-colors"
        >
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name[1]}</AvatarFallback>
          </Avatar>
          {!collapsed && <div>{user?.name}</div>}
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
