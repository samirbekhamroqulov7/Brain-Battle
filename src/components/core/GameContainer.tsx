import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/state/store';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';

interface GameContainerProps {
  children: ReactNode;
  gameId: string;
  gameName: string;
  onExit?: () => void;
  onReset?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  error?: string | null;
  showHeader?: boolean;
  showControls?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const GameContainer: React.FC<GameContainerProps> = ({
  children,
  gameId,
  gameName,
  onExit,
  onReset,
  onSettings,
  onHelp,
  isLoading = false,
  loadingText = 'Загрузка игры...',
  error = null,
  showHeader = true,
  showControls = true,
  maxWidth = 'lg',
  className = ''
}) => {
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const soundEnabled = useStore(state => state.soundEnabled);
  const settings = useStore(state => state.settings);
  
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  // Эффект для обработки ошибок
  useEffect(() => {
    if (error) {
      console.error(`Game ${gameId} error:`, error);
      // Здесь можно добавить отправку ошибки в аналитику
    }
  }, [error, gameId]);

  // Воспроизведение звука
  const playSound = (soundType: 'click' | 'hover' | 'success' | 'error') => {
    if (!soundEnabled || !settings.sound.enabled) return;
    
    // Здесь будет логика воспроизведения звуков
    console.log(`Playing sound: ${soundType}`);
  };

  const handleExit = () => {
    playSound('click');
    if (onExit) onExit();
  };

  const handleReset = () => {
    playSound('click');
    if (onReset) onReset();
  };

  const handleHelp = () => {
    playSound('click');
    setShowRules(true);
    if (onHelp) onHelp();
  };

  const handleSettings = () => {
    playSound('click');
    if (onSettings) onSettings();
  };

  // Получение градиента для игры
  const getGameGradient = () => {
    switch (gameId) {
      case 'pentago':
        return 'from-purple-900/20 via-purple-800/10 to-pink-900/20';
      case 'dots-and-boxes':
        return 'from-green-900/20 via-emerald-800/10 to-teal-900/20';
      case 'chess-blitz':
        return 'from-gray-900/20 via-gray-800/10 to-blue-900/20';
      case 'math-sprint':
        return 'from-orange-900/20 via-yellow-800/10 to-red-900/20';
      default:
        return 'from-gray-900/20 via-gray-800/10 to-purple-900/20';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGameGradient()} ${className}`}>
      
      {/* Анимированный фон */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      {/* Загрузка */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <LoadingSpinner size="xl" />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-white text-lg font-medium"
            >
              {loadingText}
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ошибка */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="mx-4 p-4 rounded-xl bg-gradient-to-r from-red-900/80 to-pink-900/80 border border-red-500/30 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Ошибка загрузки</h3>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-all"
                >
                  Перезагрузить
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Заголовок игры */}
      {showHeader && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/80 border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* Левая часть: Навигация */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExit}
                  onMouseEnter={() => playSound('hover')}
                  className="group p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  title="Выйти из игры"
                >
                  <div className="flex items-center gap-1 text-white">
                    <span className="text-lg">←</span>
                    <span className="text-sm hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity">
                      Назад
                    </span>
                  </div>
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg">
                    🎮
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg md:text-xl">{gameName}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Игра идет</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Центральная часть: Информация */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Время</div>
                  <div className="text-white font-mono font-bold">05:43</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Ход</div>
                  <div className="text-white font-bold">12</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Сложность</div>
                  <div className="text-white font-bold">★★★☆☆</div>
                </div>
              </div>
              
              {/* Правая часть: Управление */}
              <div className="flex items-center gap-2">
                {showControls && (
                  <>
                    <button
                      onClick={handleHelp}
                      onMouseEnter={() => playSound('hover')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                      title="Помощь"
                    >
                      <span className="text-lg">?</span>
                    </button>
                    
                    <button
                      onClick={() => setShowStats(!showStats)}
                      onMouseEnter={() => playSound('hover')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                      title="Статистика"
                    >
                      <span className="text-lg">📊</span>
                    </button>
                    
                    <button
                      onClick={handleSettings}
                      onMouseEnter={() => playSound('hover')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                      title="Настройки"
                    >
                      <span className="text-lg">⚙️</span>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      onMouseEnter={() => playSound('hover')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                      title="Начать заново"
                    >
                      <span className="text-lg">🔄</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Основной контент */}
      <main className="relative z-10">
        <div className={`container mx-auto px-4 py-6 ${maxWidthClasses[maxWidth]}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Панель управления (нижняя) */}
      {showControls && (
        <motion.footer
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-lg bg-gray-900/80 border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              
              {/* Левая часть: Быстрые действия */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playSound('click')}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white text-sm flex items-center gap-2"
                >
                  <span>🔇</span>
                  <span className="hidden md:inline">Звук</span>
                </button>
                
                <button
                  onClick={() => playSound('click')}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white text-sm flex items-center gap-2"
                >
                  <span>💾</span>
                  <span className="hidden md:inline">Сохранить</span>
                </button>
                
                <button
                  onClick={() => playSound('click')}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white text-sm flex items-center gap-2"
                >
                  <span>📋</span>
                  <span className="hidden md:inline">История</span>
                </button>
              </div>
              
              {/* Центральная часть: Статус */}
              <div className="text-center">
                <div className="text-gray-400 text-xs">Режим игры</div>
                <div className="text-white font-bold text-sm">Классический</div>
              </div>
              
              {/* Правая часть: Основные кнопки */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExit}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:shadow-lg transition-all text-sm"
                >
                  Выйти
                </button>
                
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm"
                >
                  Заново
                </button>
              </div>
            </div>
          </div>
        </motion.footer>
      )}

      {/* Модалка правил */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">📚 Правила игры: {gameName}</h2>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-300">
                  Здесь будут правила игры. Правила загружаются динамически для каждой игры.
                </p>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                  <h3 className="text-white font-bold mb-2">Кратко:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Играйте по очереди</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Соблюдайте правила конкретной игры</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Побеждает самый умный!</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowRules(false)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  Понятно!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модалка статистики */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">📊 Статистика</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-gray-400 text-sm">Время игры</div>
                    <div className="text-white font-bold">05:43</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-gray-400 text-sm">Ходов</div>
                    <div className="text-white font-bold">12</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-gray-400 text-sm">Ошибки</div>
                    <div className="text-white font-bold">2</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-gray-400 text-sm">Точность</div>
                    <div className="text-white font-bold">83%</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30">
                  <h3 className="text-white font-bold mb-2">Рекорды</h3>
                  <div className="text-gray-300 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Лучшее время:</span>
                      <span className="text-cyan-300">03:21</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Лучший счет:</span>
                      <span className="text-cyan-300">2450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Серия побед:</span>
                      <span className="text-cyan-300">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameContainer;