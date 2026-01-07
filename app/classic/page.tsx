"use client"

import { useEffect } from "react"
import { ClassicGames } from "@/components/layout/classic-games"

export default function ClassicPage() {
  useEffect(() => {
    // Гарантируем гостевой режим
    const guestMode = localStorage.getItem("brain_battle_guest_mode")
    if (!guestMode) {
      localStorage.setItem("brain_battle_guest_mode", "true")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <ClassicGames />
    </div>
  )
}
