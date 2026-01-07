// Game Statistics Manager - Track player performance

export interface GameStat {
  gameType: string
  wins: number
  losses: number
  draws: number
  rating: number
  matchesPlayed: number
}

export const initializeGameStats = (gameType: string): GameStat => {
  return {
    gameType,
    wins: 0,
    losses: 0,
    draws: 0,
    rating: 1000,
    matchesPlayed: 0,
  }
}

export const updateGameStat = (stat: GameStat, result: "win" | "loss" | "draw"): GameStat => {
  const ratingChange = result === "win" ? 16 : result === "loss" ? -16 : 0

  return {
    ...stat,
    wins: stat.wins + (result === "win" ? 1 : 0),
    losses: stat.losses + (result === "loss" ? 1 : 0),
    draws: stat.draws + (result === "draw" ? 1 : 0),
    rating: Math.max(800, stat.rating + ratingChange),
    matchesPlayed: stat.matchesPlayed + 1,
  }
}

export const saveGameStats = (userId: string, gameType: string, stats: GameStat) => {
  if (userId.startsWith("guest_")) {
    const allStats = JSON.parse(localStorage.getItem("brain_battle_guest_stats") || "[]") as GameStat[]
    const existingIndex = allStats.findIndex((s) => s.gameType === gameType)

    if (existingIndex >= 0) {
      allStats[existingIndex] = stats
    } else {
      allStats.push(stats)
    }

    localStorage.setItem("brain_battle_guest_stats", JSON.stringify(allStats))
  }
}

export const loadGameStats = (userId: string, gameType: string): GameStat => {
  if (userId.startsWith("guest_")) {
    const allStats = JSON.parse(localStorage.getItem("brain_battle_guest_stats") || "[]") as GameStat[]
    return allStats.find((s) => s.gameType === gameType) || initializeGameStats(gameType)
  }

  return initializeGameStats(gameType)
}

export const loadAllGameStats = (userId: string): GameStat[] => {
  if (userId.startsWith("guest_")) {
    return JSON.parse(localStorage.getItem("brain_battle_guest_stats") || "[]")
  }

  return []
}
