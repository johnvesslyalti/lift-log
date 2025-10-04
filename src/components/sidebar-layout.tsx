"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { Menu, Home, Activity, Settings } from "lucide-react"; // Lucide icons

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Menu items
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Progress", href: "/progress", icon: <Activity size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`p-4 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        <div className="flex items-center gap-5">
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 p-2 rounded hover:bg-gray-700 self-start"
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
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
