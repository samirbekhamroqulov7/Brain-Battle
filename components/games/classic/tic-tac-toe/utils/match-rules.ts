import { GameMode } from "../types"

export function getMatchConfig(mode: GameMode) {
  switch (mode) {
    case "3x3": return { totalRounds: 5, winsNeeded: 3 }
    case "5x5": return { totalRounds: 3, winsNeeded: 2 }
    case "7x7": return { totalRounds: 1, winsNeeded: 1 }
  }
}

export function isMatchComplete(wins: number, losses: number, mode: GameMode): boolean {
  const { totalRounds, winsNeeded } = getMatchConfig(mode)
  const gamesPlayed = wins + losses
  
  if (wins >= winsNeeded || losses >= winsNeeded) return true
  if (gamesPlayed >= totalRounds) return true
  
  return false
}

export function getMatchWinner(wins: number, losses: number, mode: GameMode): 'player1' | 'player2' | 'draw' | null {
  if (!isMatchComplete(wins, losses, mode)) return null
  
  const { winsNeeded } = getMatchConfig(mode)
  
  if (wins >= winsNeeded) return 'player1'
  if (losses >= winsNeeded) return 'player2'
  
  return wins > losses ? 'player1' : losses > wins ? 'player2' : 'draw'
}
