"use client"

import type { ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n/context"
import { useMusic } from "@/lib/hooks/use-music"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SessionRestorer } from "./session-restorer"

function MusicProvider({ children }: { children: ReactNode }) {
  const { playMusic, stopMusic } = useMusic()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const shouldPlayMusic = !pathname.includes("/auth/") && 
                           !pathname.includes("/api/")
    
    if (shouldPlayMusic) {
      const musicTheme = pathname.includes("/game/") || 
                        pathname.includes("/pvp/") || 
                        pathname.includes("/classic/") 
                        ? "/music/game-theme.mp3" 
                        : "/music/menu-theme.mp3"
      playMusic(musicTheme)
    } else {
      stopMusic()
    }
  }, [pathname, playMusic, stopMusic, mounted])

  return <>{children}</>
}

function ClientOnlyProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <SessionRestorer />
      <MusicProvider>{children}</MusicProvider>
    </>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ClientOnlyProviders>{children}</ClientOnlyProviders>
    </I18nProvider>
  )
}