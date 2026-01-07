export function calculateScore(moves: number, time: number, difficulty: number): number {
  const baseScore = 1000
  const moveBonus = Math.max(0, 500 - moves * 10)
  const timeBonus = Math.max(0, 500 - Math.floor(time / 10))
  const difficultyMultiplier = difficulty === 3 ? 2 : difficulty === 2 ? 1.5 : 1
  
  return Math.floor((baseScore + moveBonus + timeBonus) * difficultyMultiplier)
}

export function calculateWinStreakBonus(streak: number): number {
  if (streak < 3) return 0
  return Math.floor(Math.pow(1.5, streak - 2) * 100)
}

export function getRank(score: number): string {
  if (score >= 5000) return "ГРАНДМАСТЕР"
  if (score >= 3000) return "МАСТЕР"
  if (score >= 2000) return "ЭКСПЕРТ"
  if (score >= 1000) return "ПРОФИ"
  if (score >= 500) return "НОВИЧОК"
  return "НАЧИНАЮЩИЙ"
}
