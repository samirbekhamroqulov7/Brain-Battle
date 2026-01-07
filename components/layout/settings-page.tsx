"use client"

import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Volume2, Music, Trash2 } from "lucide-react"
import { useState } from "react"

export function SettingsPage() {
  const router = useRouter()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearData = () => {
    localStorage.removeItem("brain_battle_guest_stats")
    localStorage.removeItem("brain_battle_guest_profile")
    localStorage.removeItem("brain_battle_guest_mode")
    setShowClearConfirm(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <GameButton variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </GameButton>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-4 pb-8">
          {/* Audio Settings */}
          <GameCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Audio</h2>

            <div className="space-y-4">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Sound Effects</p>
                    <p className="text-sm text-gray-400">Game and UI sounds</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${soundEnabled ? "bg-purple-600" : "bg-gray-600"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              {/* Music Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Background Music</p>
                    <p className="text-sm text-gray-400">Game music</p>
                  </div>
                </div>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${musicEnabled ? "bg-purple-600" : "bg-gray-600"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${musicEnabled ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </GameCard>

          {/* Game Settings */}
          <GameCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Game Settings</h2>

            <div className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-white font-semibold mb-2">Game Mode</p>
                <p className="text-gray-300 text-sm">PvP Games (Player vs Player)</p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-white font-semibold mb-2">Available Games</p>
                <p className="text-gray-300 text-sm">11 unique PvP games</p>
              </div>
            </div>
          </GameCard>

          {/* Data Management */}
          <GameCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">Data Management</h2>

            <div className="space-y-3">
              <GameButton
                variant="secondary"
                className="w-full h-12 justify-start gap-3"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </GameButton>

              <p className="text-xs text-gray-400 text-center">This will reset your profile and statistics</p>
            </div>
          </GameCard>

          {/* About */}
          <GameCard className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">About</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-400">App Version</p>
                <p className="text-white font-semibold">1.0.0</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">Games Available</p>
                <p className="text-white font-semibold">11</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">Mode</p>
                <p className="text-white font-semibold">PvP Only</p>
              </div>
            </div>
          </GameCard>

          {/* Action Buttons */}
          <GameButton onClick={() => router.back()} className="w-full h-14">
            Back to Home
          </GameButton>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <GameCard className="p-6 max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Clear All Data?</h3>
            <p className="text-gray-300 mb-6">
              This will permanently delete your profile, statistics, and all game data. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <GameButton variant="secondary" onClick={() => setShowClearConfirm(false)} className="flex-1 h-12">
                Cancel
              </GameButton>
              <GameButton onClick={handleClearData} className="flex-1 h-12 bg-red-600 hover:bg-red-700">
                Clear
              </GameButton>
            </div>
          </GameCard>
        </div>
      )}
    </div>
  )
}
