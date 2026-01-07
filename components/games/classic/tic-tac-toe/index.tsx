"use client"

import { useState, useEffect } from "react"
import { Screen, GameMode, OpponentType } from "./types"
import { OpponentSelect } from "./screens/opponent-select"
import { ModeSelect } from "./screens/mode-select"
import { SymbolSelect } from "./screens/symbol-select"
import { GameScreen } from "./screens/game-screen"
import { ResultScreen } from "./screens/result-screen"

export function TicTacToeGame() {
  const [screen, setScreen] = useState<Screen>("opponent")
  const [gameMode, setGameMode] = useState<GameMode>("3x3")
  const [opponent, setOpponent] = useState<OpponentType>("ai")
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X")
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(null)
  const [matchStats, setMatchStats] = useState({
    matches: 0,
    wins: 0,
    gamesInMatch: 0,
    currentMatchWins: 0,
    currentMatchLosses: 0,
    draws: 0,
  })

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("tic_tac_toe_stats")
    if (savedStats) {
      try {
        setMatchStats(JSON.parse(savedStats))
      } catch (e) {
        console.error("Failed to load stats:", e)
      }
    }
  }, [])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem("tic_tac_toe_stats", JSON.stringify(matchStats))
  }, [matchStats])

  // Handle opponent selection
  const handleOpponentSelect = (selectedOpponent: OpponentType) => {
    setOpponent(selectedOpponent)
    setScreen("mode")
  }

  // Handle mode selection
  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode)
    setScreen("symbol")
  }

  // Handle symbol selection
  const handleSymbolSelect = (symbol: "X" | "O") => {
    setPlayerSymbol(symbol)
    setScreen("game")
    setMatchStats(prev => ({
      ...prev,
      gamesInMatch: 0,
      currentMatchWins: 0,
      currentMatchLosses: 0,
      draws: 0
    }))
  }

  // Handle game end
  const handleGameEnd = (result: "win" | "lose" | "draw") => {
    setGameResult(result)
    setMatchStats(prev => {
      const newStats = { ...prev }
      newStats.gamesInMatch += 1
      
      if (result === "win") {
        newStats.currentMatchWins += 1
      } else if (result === "lose") {
        newStats.currentMatchLosses += 1
      } else {
        newStats.draws += 1
      }
      
      return newStats
    })
  }

  // Handle match end
  const handleMatchEnd = (winner: "player1" | "player2" | "draw") => {
    setMatchStats(prev => {
      const newStats = { ...prev }
      
      if (winner === "player1") {
        newStats.wins += 1
      }
      newStats.matches += 1
      
      // Reset current match
      newStats.gamesInMatch = 0
      newStats.currentMatchWins = 0
      newStats.currentMatchLosses = 0
      newStats.draws = 0
      
      return newStats
    })
    
    if (winner === "player1") {
      setGameResult("win")
    } else if (winner === "player2") {
      setGameResult("lose")
    } else {
      setGameResult("draw")
    }
    
    setScreen("result")
  }

  // Handle restart
  const handleRestart = () => {
    setScreen("game")
    setGameResult(null)
  }

  // Handle back navigation
  const handleBack = () => {
    switch (screen) {
      case "mode":
        setScreen("opponent")
        break
      case "symbol":
        setScreen("mode")
        break
      case "game":
        setScreen("symbol")
        break
      case "result":
        setScreen("opponent")
        break
      default:
        setScreen("opponent")
    }
  }

  return (
    <div className="tic-tac-toe-container">
      {/* Render Current Screen */}
      {screen === "opponent" && (
        <OpponentSelect
          onSelect={handleOpponentSelect}
          onBack={() => window.history.back()}
        />
      )}

      {screen === "mode" && (
        <ModeSelect
          onSelect={handleModeSelect}
          onBack={handleBack}
          opponent={opponent}
        />
      )}

      {screen === "symbol" && (
        <SymbolSelect
          onSelect={handleSymbolSelect}
          onBack={handleBack}
          opponent={opponent}
          mode={gameMode}
        />
      )}

      {screen === "game" && (
        <GameScreen
          mode={gameMode}
          opponent={opponent}
          playerSymbol={playerSymbol}
          onScreenChange={setScreen}
          onGameEnd={handleGameEnd}
          onMatchEnd={handleMatchEnd}
          matchStats={matchStats}
        />
      )}

      {screen === "result" && gameResult && (
        <ResultScreen
          result={gameResult}
          opponent={opponent}
          matchStats={matchStats}
          onRestart={handleRestart}
          onMenu={() => setScreen("opponent")}
        />
      )}

      <style jsx global>{`
        .tic-tac-toe-container {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        @media (max-height: 700px) {
          .tic-tac-toe-container {
            min-height: 100svh;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  )
}
