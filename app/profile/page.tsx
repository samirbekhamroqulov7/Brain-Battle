"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { ArrowLeft, LogOut, Edit2 } from "lucide-react"

interface UserProfile {
  id: string
  username: string
  avatar_url: string | null
  rating: number
  wins: number
  losses: number
  draws: number
  totalMatches: number
  joinedDate: string
}

interface GameStats {
  gameType: string
  wins: number
  losses: number
  draws: number
  rating: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [gameStats, setGameStats] = useState<GameStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const guestProfile = localStorage.getItem("brain_battle_guest_profile")
      if (guestProfile) {
        const parsed = JSON.parse(guestProfile)
        setProfile({
          id: parsed.id,
          username: parsed.username,
          avatar_url: parsed.avatar_url,
          rating: 1000,
          wins: 0,
          losses: 0,
          draws: 0,
          totalMatches: 0,
          joinedDate: parsed.created_at,
        })

        // Load guest stats from localStorage
        const guestStats = localStorage.getItem("brain_battle_guest_stats")
        if (guestStats) {
          setGameStats(JSON.parse(guestStats))
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("brain_battle_guest_profile")
    localStorage.removeItem("brain_battle_guest_mode")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <p className="text-white">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <p className="text-white">No profile found</p>
      </div>
    )
  }

  const totalMatches = profile.wins + profile.losses + profile.draws
  const winRate = totalMatches > 0 ? Math.round((profile.wins / totalMatches) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <GameButton variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </GameButton>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
          </div>
          <GameButton variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </GameButton>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6 pb-8">
          {/* User Info Card */}
          <GameCard className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{profile.username}</h2>
                  <GameButton variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </GameButton>
                </div>
                <p className="text-gray-400 text-sm mb-3">Joined {new Date(profile.joinedDate).toLocaleDateString()}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">Rating</p>
                    <p className="text-2xl font-bold text-yellow-400">{profile.rating}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Matches</p>
                    <p className="text-2xl font-bold text-white">{totalMatches}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">Wins</p>
                <p className="text-2xl font-bold text-green-400">{profile.wins}</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">Losses</p>
                <p className="text-2xl font-bold text-red-400">{profile.losses}</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">Draws</p>
                <p className="text-2xl font-bold text-yellow-400">{profile.draws}</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">Win Rate</p>
                <p className="text-2xl font-bold text-blue-400">{winRate}%</p>
              </div>
            </div>
          </GameCard>

          {/* Game Statistics */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
            <div className="space-y-3">
              {gameStats.length > 0 ? (
                gameStats.map((stat) => (
                  <GameCard key={stat.gameType} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold capitalize mb-2">{stat.gameType.replace("-", " ")}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-400">W: {stat.wins}</span>
                          <span className="text-red-400">L: {stat.losses}</span>
                          <span className="text-yellow-400">D: {stat.draws}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs mb-1">Rating</p>
                        <p className="text-2xl font-bold text-purple-400">{stat.rating}</p>
                      </div>
                    </div>
                  </GameCard>
                ))
              ) : (
                <GameCard className="p-6 text-center">
                  <p className="text-gray-400">No games played yet. Start playing to build your stats!</p>
                  <GameButton onClick={() => router.push("/pvp")} className="mt-4 w-full h-12">
                    Play Games
                  </GameButton>
                </GameCard>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <GameButton onClick={() => router.push("/pvp")} className="w-full h-14">
              Return to Games
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  )
}
