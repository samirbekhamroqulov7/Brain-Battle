"use client"

import { useState, useEffect } from 'react'

export function useGameStorage() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ttt_stats') || '{"games":0,"wins":0,"losses":0,"draws":0}'
    return JSON.parse(saved)
  })

  const saveResult = (result: 'win' | 'lose' | 'draw') => {
    setStats(s => ({
      games: s.games + 1,
      wins: result === 'win' ? s.wins + 1 : s.wins,
      losses: result === 'lose' ? s.losses + 1 : s.losses,
      draws: result === 'draw' ? s.draws + 1 : s.draws
    }))
  }

  useEffect(() => {
    localStorage.setItem('ttt_stats', JSON.stringify(stats))
  }, [stats])

  return { stats, saveResult }
}
