import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, Settings, Bell, Trophy, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export default function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const menuItems = [
    { label: 'Все игры', href: '/', icon: '🎮' },
    { label: 'Соревнования', href: '/tournaments', icon: '🏆' },
    { label: 'Рейтинг', href: '/leaderboard', icon: '📊' },
    { label: 'Друзья', href: '/friends', icon: '👥' },
    { label: 'Обучение', href: '/tutorials', icon: '🎓' },
    { label: 'Новости', href: '/news', icon: '📰' },
  ]

  const userStats = {
    level: 15,
    points: 1250,
    rank: 'Мастер',
    gamesPlayed: 342,
    winRate: '68%'
  }

  return (
    <>
      {/* Главный хедер */}
      <header className="sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-lg border-b border-white/10 safe-padding">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Логотип и бренд */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 lg:hidden touch-target"
                aria-label="Меню"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-600/30 to-secondary-600/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    Brain Battle
                  </h1>
                  <p className="text-xs text-gray-400">38 логических игр</p>
                </div>
              </Link>
            </div>

            {/* Центральная навигация для десктопа */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-lg hover:bg-white/5 active:scale-95 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-gray-300 group-hover:text-white">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Правые элементы */}
            <div className="flex items-center space-x-2">
              
              {/* Уведомления */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 relative touch-target"
                  aria-label="Уведомления"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                    3
                  </span>
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg">Уведомления</h3>
                          <button className="text-sm text-primary-400 hover:text-primary-300">
                            Очистить все
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { text: 'Новый противник в шахматах', time: '2 мин назад', unread: true },
                            { text: 'Вы достигли 15 уровня!', time: '1 час назад', unread: true },
                            { text: 'Турнир начинается через 30 мин', time: '3 часа назад', unread: false },
                          ].map((notification, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${notification.unread ? 'bg-primary-500/10 border-l-4 border-primary-500' : 'bg-white/5'}`}
                            >
                              <p className="text-sm">{notification.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Статистика пользователя */}
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Уровень</div>
                  <div className="font-bold text-primary-400">{userStats.level}</div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">Очки</div>
                  <div className="font-bold text-secondary-400">{userStats.points}</div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">Ранг</div>
                  <div className="font-bold text-accent-400">{userStats.rank}</div>
                </div>
              </div>

              {/* Профиль */}
              <Link
                href="/profile"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 touch-target"
                aria-label="Профиль"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Настройки */}
              <Link
                href="/settings"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 touch-target"
                aria-label="Настройки"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            {/* Боковое меню */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-white/10 lg:hidden"
            >
              <div className="h-full flex flex-col p-4 safe-padding">
                
                {/* Заголовок меню */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Меню</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Навигация */}
                <nav className="flex-1 space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 active:scale-95 transition-all duration-200"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Статистика пользователя в меню */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold">Игрок</p>
                        <p className="text-xs text-gray-400">Уровень {userStats.level}</p>
                      </div>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Очки</p>
                      <p className="font-bold">{userStats.points}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <p className="text-xs text-gray-400">Побед</p>
                      <p className="font-bold">{userStats.winRate}</p>
                    </div>
                  </div>
                </div>

                {/* Кнопка быстрой игры */}
                <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 font-bold hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 transition-all duration-200">
                  Быстрая игра
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}