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
    setMounted(true);
  }, []);

  const pathname = usePathname();

  if (!mounted) return null;

  // Pages that should show NO layout at all
  const noLayoutPages = ["/metrics"];

  // Pages that should show ONLY navbar + footer
  const navbarFooterPages = ["/"];

  // CASE 1 → Only children (metrics page)
  if (noLayoutPages.includes(pathname)) {
    return <>{children}</>;
  }

  // CASE 2 → Show navbar + footer (homepage)
  if (navbarFooterPages.includes(pathname)) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  // CASE 3 → All other pages → Sidebar layout
  return (
    <SidebarProvider className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </SidebarProvider>
  );
}
