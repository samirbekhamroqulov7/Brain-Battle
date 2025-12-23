"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n/context"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[v0] Starting registration for:", formData.email)

    try {
      const supabase = createClient()

      const { data: existingUser } = await supabase
        .from("users")
        .select("id, auth_id")
        .eq("email", formData.email)
        .maybeSingle()

      if (existingUser) {
        console.log("[v0] User already exists, attempting login")
        // Пользователь существует, пробуем войти
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          toast.error("Пользователь с таким email уже существует. Попробуйте войти.")
          setLoading(false)
          return
        }

        if (signInData.session) {
          console.log("[v0] Login successful, redirecting")
          toast.success("Вход успешен!")
          router.push("/")
          return
        }
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("[v0] Registration error:", authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error("Пользователь не создан")
      }

      console.log("[v0] User registered:", authData.user.id)

      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (sessionError) {
        console.log("[v0] Email confirmation required")
        // Email требует подтверждения
        setNeedsConfirmation(true)
        setSuccess(true)
        toast.success("Регистрация успешна! Проверьте email для подтверждения.")
        setLoading(false)
        return
      }

      if (!sessionData.session) {
        throw new Error("Сессия не создана")
      }

      console.log("[v0] Session created, creating profile")

      const { data: newProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          auth_id: authData.user.id,
          email: authData.user.email,
          username: formData.username.substring(0, 20),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
          avatar_frame: "none",
          nickname_style: "normal",
          language: "ru",
          sound_enabled: true,
          music_enabled: true,
          isGuest: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (profileError) {
        console.error("[v0] Profile creation error:", profileError)
        // Профиль не создан, но триггер создаст его автоматически
        console.log("[v0] Profile will be created by trigger")
      } else {
        console.log("[v0] Profile created:", newProfile.id)

        try {
          await supabase.from("mastery").insert({
            user_id: newProfile.id,
            level: 1,
            mini_level: 0,
            fragments: 0,
            total_wins: 0,
            created_at: new Date().toISOString(),
          })

          await supabase.from("glory").insert({
            user_id: newProfile.id,
            level: 1,
            wins: 0,
            total_glory_wins: 0,
            created_at: new Date().toISOString(),
          })

          console.log("[v0] Mastery and glory created")
        } catch (error) {
          console.error("[v0] Error creating mastery/glory:", error)
        }
      }

      localStorage.setItem(
        "brain_battle_session",
        JSON.stringify({
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_at: sessionData.session.expires_at,
        }),
      )

      console.log("[v0] Registration complete, redirecting")
      toast.success("Регистрация успешна! Добро пожаловать!")

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("[v0] Registration exception:", error)
      toast.error(error.message || "Ошибка регистрации")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <GameCard className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {needsConfirmation ? "Проверьте ваш email" : "Регистрация успешна!"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {needsConfirmation
              ? "Мы отправили вам ссылку для подтверждения email. После подтверждения вы сможете войти в систему."
              : "Перенаправляем на главную страницу..."}
          </p>
          {needsConfirmation ? (
            <div className="space-y-3">
              <GameButton onClick={() => router.push("/auth/login")} className="w-full">
                Перейти к входу
              </GameButton>
              <GameButton variant="outline" onClick={() => router.push("/")} className="w-full">
                На главную
              </GameButton>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </div>
          )}
        </GameCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-4">
          <GameButton variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-5 h-5" />
          </GameButton>
          <h1 className="text-2xl font-bold text-primary uppercase tracking-wider">{t("auth.create_account")}</h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <GameCard className="max-w-md w-full p-6">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">
                {needsConfirmation ? "Проверьте ваш email" : "Регистрация успешна!"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {needsConfirmation
                  ? "Мы отправили вам ссылку для подтверждения email. После подтверждения вы сможете войти в систему."
                  : "Перенаправляем на главную страницу..."}
              </p>
              {needsConfirmation ? (
                <div className="space-y-3">
                  <GameButton onClick={() => router.push("/auth/login")} className="w-full">
                    Перейти к входу
                  </GameButton>
                  <GameButton variant="outline" onClick={() => router.push("/")} className="w-full">
                    На главную
                  </GameButton>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Загрузка...</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t("auth.username")}
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder={t("auth.username_placeholder")}
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t("auth.email")}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t("auth.password")}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t("auth.password_placeholder")}
                  required
                  minLength={6}
                />
              </div>

              <GameButton type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("auth.creating_account")}
                  </>
                ) : (
                  t("auth.create_account")
                )}
              </GameButton>

              <div className="text-center text-sm text-muted-foreground">
                {t("auth.already_have_account")}{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  {t("auth.login_here")}
                </Link>
              </div>
            </form>
          )}
        </GameCard>
      </div>
    </div>
  )
}
