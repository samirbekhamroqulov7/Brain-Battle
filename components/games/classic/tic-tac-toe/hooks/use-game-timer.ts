"use client"

import { useState, useEffect, useRef } from 'react'

export function useGameTimer(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    
    return () => clearTimeout(timerRef.current)
  }, [isRunning, timeLeft])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setTimeLeft(seconds)
  }

  return { timeLeft, isRunning, start, pause, reset }
}
