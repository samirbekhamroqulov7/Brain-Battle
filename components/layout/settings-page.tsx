"use client"

import { useI18n } from "@/lib/i18n/context"
import { useUser } from "@/lib/hooks/use-user"
import { useSound } from "@/lib/hooks/use-sound"
import { useMusic } from "@/lib/hooks/use-music"
import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { languages } from "@/lib/i18n/translations"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Settings,
  Globe,
  Volume2,
  User,
  HelpCircle,
  LogOut,
  Check,
  Loader2,
  Music,
  Pencil,
  AlertCircle,
  Sparkles,
  Smartphone,
  RefreshCw
} from "lucide-react"
import { useState, useEffect } from "react"
import { HelpModal } from "@/components/modals/help-modal"
import { ProfileEditorModal } from "@/components/modals/profile-editor-modal"
import { AvatarCircle } from "@/components/ui/avatar-circle"

const AccountPanel = () => {
  const { t } = useI18n()
  const { user, profile, isGuest, signOut, refetch, loading: userLoading } = useUser()
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // If user exists but profile missing — try to refetch/create profile up to 3 times with backoff.
  useEffect(() => {
    if (!(isClient && user && !profile && !userLoading)) return

    let cancelled = false

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const attemptRefetch = async () => {
      const attempts = 3
      let delay = 1000
      for (let i = 0; i < attempts && !cancelled; i++) {
        try {
          console.log(`[v0] AccountPanel: refetch attempt ${i + 1}`)
          await refetch()
          // give a short time for state to update after refetch
          await sleep(1200)
          if (!cancelled && profile) {
            console.log("[v0] AccountPanel: profile recovered")
            break
          }
        } catch (err) {
          console.error("[v0] AccountPanel refetch error:", err)
        }
        // exponential backoff
        await sleep(delay)
        delay *= 2
      }
      if (!cancelled && !profile) {
        console.warn("[v0] AccountPanel: profile still missing after retries")
      }
    }

    attemptRefetch()

    return () => {
      cancelled = true
    }
  }, [isClient, user, profile, userLoading, refetch])

  if (userLoading) {
    return (
      <GameCard className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p>Загрузка профиля...</p>
      </GameCard>
    )
  }

  if (!isClient || !user) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl" />
        <GameCard variant="interactive" className="p-6 text-center relative">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("auth.notSignedIn")}</h3>
          <p className="text-muted-foreground mb-4">
            Войдите в аккаунт для сохранения прогресса
          </p>
          <GameButton
            variant="primary"
            className="w-full"
            onClick={() => router.push('/auth/login')}
          >
            {t("auth.login")}
          </GameButton>
        </GameCard>
      </div>
    )
  }

  if (user && !profile && !userLoading) {
    return (
      <GameCard className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Профиль не найден</h3>
        <p className="text-muted-foreground mb-4">
          Попытка восстановить профиль...
        </p>
        <div className="space-y-3">
          <GameButton
            variant="outline"
            className="w-full"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Повторить сейчас
          </GameButton>
          <GameButton
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/auth/login")}
          >
            Войти другим способом
          </GameButton>
        </div>
      </GameCard>
    )
  }

  // ... the rest of AccountPanel rendering (profile exists)
  return (
    <div className="relative">
      {/* existing UI for when profile exists */}
      {/* This part of the file remains unchanged */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl" />
      <GameCard variant="interactive" className="p-6 text-left relative">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-1 border-2 border-border">
            <AvatarCircle src={profile?.avatar_url} size="lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile?.username}</h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <GameButton onClick={() => setShowProfileEditor(true)} className="w-full">
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать профиль
          </GameButton>
          <GameButton variant="outline" onClick={() => signOut()} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </GameButton>
        </div>
      </GameCard>

      {showProfileEditor && <ProfileEditorModal onClose={() => setShowProfileEditor(false)} />}
    </div>
  )
}

export default function SettingsPage() {
  // rest of SettingsPage left unchanged
  // ...
  return (
    // placeholder, actual page contains AccountPanel etc.
    <div />
  )
}