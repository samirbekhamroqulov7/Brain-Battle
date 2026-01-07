"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { Gamepad2, Settings, User, Brain } from "lucide-react"
import { AdSenseBanner } from "@/components/ads/ad-sense-banner"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const guestMode = localStorage.getItem("brain_battle_guest_mode")
    if (!guestMode) {
      const guestProfile = {
        id: "guest_" + Date.now(),
        username: "Гость",
        avatar_url: null,
        isGuest: true,
        created_at: new Date().toISOString(),
      }
      localStorage.setItem("brain_battle_guest_profile", JSON.stringify(guestProfile))
      localStorage.setItem("brain_battle_guest_mode", "true")
      localStorage.setItem("brain_battle_guest_name", "Гость")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      {/* Logo */}
      <div className="pt-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Brain Battle
            </h1>
            <p className="text-sm text-gray-400">Multiplayer Brain Games</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 mb-6">
          <div className="flex items-center gap-2 text-sm text-green-300">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Ready to Battle</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <AdSenseBanner slot="home_banner_top" format="horizontal" />
      </div>

      {/* Main Buttons */}
      <div className="max-w-md mx-auto space-y-4 mb-8">
        <GameButton variant="primary" size="lg" className="w-full h-16 text-lg" onClick={() => router.push("/pvp")}>
          <Gamepad2 className="w-6 h-6 mr-3" />
          Play PvP Games
        </GameButton>
      </div>

      {/* Info Cards */}
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        <GameCard
          className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={() => router.push("/profile")}
        >
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-sm text-center text-white mb-1">Profile</h3>
          <p className="text-xs text-gray-400 text-center">Your stats</p>
        </GameCard>

        <GameCard
          className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={() => router.push("/settings")}
        >
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-sm text-center text-white mb-1">Settings</h3>
          <p className="text-xs text-gray-400 text-center">Preferences</p>
        </GameCard>
      </div>

      {/* Info Section */}
      <div className="max-w-md mx-auto mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
        <p className="text-sm text-gray-300 text-center">
          Challenge players worldwide in 11 unique PvP games. Compete, climb the ranks, and become a Brain Battle
          champion!
        </p>
      </div>

      <div className="max-w-md mx-auto mt-8">
        <AdSenseBanner slot="home_banner_bottom" format="horizontal" />
      </div>
    </div>
  )
}
