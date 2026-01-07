"use client"
import { useEffect, useState } from "react"
import { PvPGameWrapper } from "@/components/games/pvp-game-wrapper"
import { TicTacToePvP } from "@/components/games/pvp/tic-tac-toe/game"
import { loadGameStats, updateGameStat, saveGameStats } from "@/lib/pvp/game-stats-manager"

export default function TicTacToePvPPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const profile = localStorage.getItem("brain_battle_guest_profile")
    if (profile) {
      const { id } = JSON.parse(profile)
      setUserId(id)
    }
  }, [])

  const handleGameComplete = (result: "player1_win" | "player2_win" | "draw") => {
    if (!userId) return

    const stats = loadGameStats(userId, "tic-tac-toe")
    const resultType = result === "player1_win" ? "win" : result === "player2_win" ? "loss" : "draw"
    const updatedStats = updateGameStat(stats, resultType)
    saveGameStats(userId, "tic-tac-toe", updatedStats)
  }

  return (
    <PvPGameWrapper gameTitle="PvP Tic Tac Toe" gameType="tic-tac-toe" onGameComplete={handleGameComplete}>
      <TicTacToePvP />
    </PvPGameWrapper>
  )
}
