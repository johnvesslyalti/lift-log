"use client"

import { usePathname } from "next/navigation"
import SidebarLayout from "./sidebar-layout"
import React from "react"
import Navbar from "./navbar"

export default function ConditionalSidebar({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true) // ensures this runs only on the client
  }, [])

  const pathname = usePathname()

  // Only render after mount
  if (!mounted) return null

  return pathname === "/" ? (
    <>
    <Navbar />
    {children}
    </> ) : (
  <SidebarLayout>{children}</SidebarLayout>)
}
