"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"
import { ClassicGames } from "@/components/layout/classic-games"
import { Loader2, AlertCircle, User, LogIn, Gamepad2 } from "lucide-react"

export default function ClassicPage() {
  const router = useRouter()
  const { user, profile, loading, isGuest, quickGuestPlay } = useUser()
  const [initializing, setInitializing] = useState(true)
  const [showGuestPrompt, setShowGuestPrompt] = useState(false)

  useEffect(() => {
    const initGuestMode = async () => {
      // Проверяем, есть ли сохраненный гостевой профиль
      const savedGuestProfile = localStorage.getItem('brain_battle_guest_profile')
      const guestMode = localStorage.getItem('brain_battle_guest_mode')
      const hasGameProgress = localStorage.getItem('brain_battle_guest_progress')

      if (!user && (savedGuestProfile || guestMode === 'true' || hasGameProgress)) {
        // Автоматически создаем гостевую сессию
        console.log("Восстановление гостевой сессии...")
        
        if (savedGuestProfile) {
          try {
            const guestProfile = JSON.parse(savedGuestProfile)
            // Просто продолжаем как гость без создания нового профиля
            console.log("Гостевая сессия восстановлена из localStorage")
          } catch (e) {
            console.error("Ошибка восстановления гостевой сессии:", e)
          }
        }
      }
      
      setInitializing(false)
    }

    initGuestMode()
  }, [user])

  const handleStartAsGuest = () => {
    try {
      // Создаем быстрый гостевой аккаунт
      const guestProfile = quickGuestPlay()
      console.log("Быстрый гостевой аккаунт создан:", guestProfile)
      
      // Прямо переходим к играм
      setShowGuestPrompt(false)
    } catch (error) {
      console.error("Ошибка создания гостевого аккаунта:", error)
      
      // Альтернативный метод для гостей
      const fallbackGuestProfile = {
        id: 'guest_' + Date.now(),
        auth_id: 'guest_' + Date.now(),
        username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
        email: `guest_${Date.now()}@brainbattle.com`,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
        isGuest: true,
        sound_enabled: true,
        music_enabled: true,
        language: "ru",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      localStorage.setItem('brain_battle_guest_profile', JSON.stringify(fallbackGuestProfile))
      localStorage.setItem('brain_battle_guest_mode', 'true')
      
      setShowGuestPrompt(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push("/auth/login")
  }

  // Если еще загружаем данные
  if (loading && initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если нет пользователя и не гость, показываем промпт
  if (!user && !localStorage.getItem('brain_battle_guest_mode')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <GameCard className="max-w-md w-full p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-4">Добро пожаловать в Brain Battle!</h1>
          
          <p className="text-muted-foreground mb-6">
            Выберите способ начала игры. Вы можете играть как гость без регистрации.
          </p>
          
          <div className="space-y-3">
            <GameButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleStartAsGuest}
            >
              <User className="w-5 h-5 mr-2" />
              Играть как гость
            </GameButton>
            
            <GameButton
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleLoginRedirect}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Войти в аккаунт
            </GameButton>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded border border-border">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground text-left">
                <p className="font-medium mb-1">Гостевой режим:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Можно играть во все классические игры</li>
                  <li>Прогресс сохраняется в этом браузере</li>
                  <li>Можно настроить профиль</li>
                  <li>PvP игры недоступны</li>
                </ul>
              </div>
            </div>
          </div>
        </GameCard>
      </div>
    )
  }

  // Если есть пользователь или гость, показываем игры
  return (
    <div className="min-h-screen bg-background">
      <ClassicGames />
    </div>
  )
}
