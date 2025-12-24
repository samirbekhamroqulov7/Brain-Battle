"use client"

import { useState, useEffect } from "react"
import { Screen, GameMode, AILevel, GameStats } from "./types"
import { MenuScreen } from "./menu-screen"
import { GameScreen } from "./game-screen"
import { useI18n } from "@/lib/i18n/context"
import { GameLayout } from "@/components/games/game-layout"

export function TicTacToeGame() {
  const { t } = useI18n()
  const [screen, setScreen] = useState<Screen>("menu")
  const [mode, setMode] = useState<GameMode>("3x3")
  const [aiLevel, setAiLevel] = useState<AILevel>("novice")
  const [stats, setStats] = useState<GameStats>({
    playerWins: 0,
    aiWins: 0,
    draws: 0,
  })

  // Загрузка статистики из localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStats = localStorage.getItem("tic_tac_toe_stats")
      if (savedStats) {
        try {
          setStats(JSON.parse(savedStats))
        } catch (error) {
          console.error("Ошибка загрузки статистики:", error)
        }
      }
    }
  }, [])

  const handleStartGame = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setScreen("game")
  }

  const handleBackToMenu = () => {
    setScreen("menu")
  }

  const handleUpdateStats = (newStats: GameStats) => {
    setStats(newStats)
  }

  return (
    <GameLayout gameName={t("games.ticTacToe")}>
      <div className="min-h-[calc(100vh-120px)] w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-gradient-to-br from-sky-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-xl p-6 shadow-2xl">
            {screen === "menu" && (
              <MenuScreen
                onStartGame={handleStartGame}
                stats={stats}
              />
            )}

            {screen === "game" && (
              <GameScreen
                mode={mode}
                aiLevel={aiLevel}
                stats={stats}
                onUpdateStats={handleUpdateStats}
                onBackToMenu={handleBackToMenu}
              />
            )}
          </div>

          {/* Game info footer */}
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>Режим: {mode} | Уровень ИИ: {
              aiLevel === "novice" ? "Новичок" :
              aiLevel === "pro" ? "Профи" : "Гроссмейстер"
            }</p>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}

export { TicTacToeGame }
