"use client"

import * as React from "react"
import { LaptopMinimal, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-5">
        <Button onClick={() => setTheme("system")}>
            <LaptopMinimal />
        </Button>
        <Button onClick={() => setTheme("light")}>
            <Sun />
        </Button>
        <Button onClick={() => setTheme("dark")}>
            <Moon />
        </Button>
    </div>
  )
}
