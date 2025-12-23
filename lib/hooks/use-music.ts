"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export function useMusic() {
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const saved = localStorage.getItem("musicEnabled")
    if (saved !== null) {
      setMusicEnabled(saved === "true")
    }

    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isClient])

  const playMusic = useCallback(
    (track: string) => {
      if (!isClient || !audioRef.current || !musicEnabled) return

      if (currentTrack !== track) {
        audioRef.current.src = track
        setCurrentTrack(track)
      }

      audioRef.current.play().catch((error) => {
        // Silently handle autoplay restrictions
        console.log("[v0] Music autoplay prevented:", error.message)
      })
    },
    [musicEnabled, currentTrack, isClient],
  )

  const stopMusic = useCallback(() => {
    if (!isClient || !audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }, [isClient])

  const toggleMusic = useCallback(() => {
    if (!isClient) return

    const newState = !musicEnabled
    setMusicEnabled(newState)

    if (typeof window !== "undefined") {
      localStorage.setItem("musicEnabled", String(newState))
    }

    if (!newState && audioRef.current) {
      audioRef.current.pause()
    } else if (newState && currentTrack && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("[v0] Music play prevented:", error.message)
      })
    }
  }, [musicEnabled, currentTrack, isClient])

  useEffect(() => {
    if (!isClient || !audioRef.current) return

    if (musicEnabled && currentTrack) {
      audioRef.current.play().catch((error) => {
        console.log("[v0] Music play prevented:", error.message)
      })
    } else {
      audioRef.current.pause()
    }
  }, [musicEnabled, currentTrack, isClient])

  return {
    musicEnabled,
    toggleMusic,
    playMusic,
    stopMusic,
    currentTrack,
  }
}
