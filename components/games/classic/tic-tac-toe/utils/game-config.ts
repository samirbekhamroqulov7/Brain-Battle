import { GameMode } from "../types"

export interface RoundConfig {
  totalRounds: number
  winsNeeded: number
  winLength: number
}

export function getRoundConfig(mode: GameMode): RoundConfig {
  switch (mode) {
    case "3x3":
      return {
        totalRounds: 5,
        winsNeeded: 3,
        winLength: 3
      }
    case "5x5":
      return {
        totalRounds: 3,
        winsNeeded: 2,
        winLength: 4
      }
    case "7x7":
      return {
        totalRounds: 1,
        winsNeeded: 1,
        winLength: 5
      }
    default:
      return {
        totalRounds: 5,
        winsNeeded: 3,
        winLength: 3
      }
  }
}

export function calculateMatchWinner(
  playerWins: number,
  opponentWins: number,
  draws: number,
  mode: GameMode
): "player1" | "player2" | "draw" | null {
  const config = getRoundConfig(mode)
  
  if (playerWins >= config.winsNeeded) {
    return "player1"
  }
  
  if (opponentWins >= config.winsNeeded) {
    return "player2"
  }
  
  // Check if all rounds played
  const totalGames = playerWins + opponentWins + draws
  if (totalGames >= config.totalRounds) {
    if (playerWins > opponentWins) return "player1"
    if (opponentWins > playerWins) return "player2"
    return "draw"
  }
  
  return null
}
