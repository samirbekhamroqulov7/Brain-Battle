"use client"

import { useState, useEffect, useCallback } from 'react'

interface SoundConfig {
  enabled: boolean
  volume: number
}

export function useGameSound() {
  const [config, setConfig] = useState<SoundConfig>(() => {
    const saved = localStorage.getItem('ttt_sound') || '{"enabled":true,"volume":0.7}'
    return JSON.parse(saved)
  })

  const play = useCallback((type: 'click' | 'win' | 'lose' | 'draw') => {
    if (!config.enabled) return
    
    const audio = new Audio()
    const frequencies = {
      click: 800, win: [1200, 1000, 1400], lose: 400, draw: 600
    }
    
    // В реальной игре тут был бы Web Audio API
    console.log(`Playing sound: ${type} at volume ${config.volume}`)
    
  }, [config])

  const toggle = () => setConfig(c => ({ ...c, enabled: !c.enabled }))
  const setVolume = (vol: number) => setConfig(c => ({ ...c, volume: vol }))

  useEffect(() => {
    localStorage.setItem('ttt_sound', JSON.stringify(config))
  }, [config])

  return { config, play, toggle, setVolume }
}
