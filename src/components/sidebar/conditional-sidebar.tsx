"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./app-sidebar";

export default function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true); // ensures this runs only on the client
  }, []);

  const pathname = usePathname();

  // Only render after mount
  if (!mounted) return null;

  return pathname === "/" ? (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  ) : (
    <SidebarProvider className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </SidebarProvider>
  );
}
