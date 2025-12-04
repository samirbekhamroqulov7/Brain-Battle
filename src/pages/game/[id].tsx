import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GAMES_CONFIG, getGameById } from '@/lib/games/config';
import { useStore } from '@/lib/state/store';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

// Динамический импорт игр (ленивая загрузка)
const gameComponents: Record<string, any> = {
  'pentago': dynamic(() => import('@/components/games/specific/Pentago'), {
    loading: () => <GameLoading gameName="Пентаго" />
  }),
  'dots-and-boxes': dynamic(() => import('@/components/games/specific/DotsAndBoxes'), {
    loading: () => <GameLoading gameName="Точки и квадраты" />
  }),
  'chess-blitz': dynamic(() => import('@/components/games/specific/ChessBlitz'), {
    loading: () => <GameLoading gameName="Шахматы блиц" />
  }),
  'math-sprint': dynamic(() => import('@/components/games/specific/MathSprint'), {
    loading: () => <GameLoading gameName="Математический спринт" />
  }),
  // Добавьте другие игры по аналогии
};

interface GamePageProps {
  gameId: string;
  gameConfig: any;
}

// Компонент загрузки игры
const GameLoading: React.FC<{ gameName: string }> = ({ gameName }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Загружаем {gameName}</h1>
          <p className="text-gray-400">Подготавливаем игровое поле...</p>
          
          <div className="mt-6 space-y-2">
            <div className="h-2 w-64 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
            </div>
            <div className="text-xs text-gray-500">
              Оптимизация графики и загрузка логики игры
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Страница игры
const GamePage: React.FC<GamePageProps> = ({ gameId, gameConfig }) => {
  const router = useRouter();
  const player = useStore(state => state.player);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [showGameRules, setShowGameRules] = useState(false);
  const [gameMode, setGameMode] = useState<'classic' | 'pvp' | 'ai'>('classic');
  const [difficulty, setDifficulty] = useState<number>(3);
  
  const GameComponent = gameComponents[gameId] || null;
  
  // Параметры из URL
  const { mode, opponent: opponentParam, difficulty: difficultyParam } = router.query;
  
  // Инициализация игры
  useEffect(() => {
    if (!gameConfig) {
      router.push('/classic');
      return;
    }
    
    // Определяем режим игры
    if (mode === 'pvp') {
      setGameMode('pvp');
      setIsMultiplayer(true);
      
      // Симуляция получения данных соперника
      setOpponent({
        id: 'opponent_1',
        name: opponentParam || 'Соперник',
        rank: 1300,
        avatar: {
          type: 'gradient',
          value: 'from-purple-400 to-pink-500'
        }
      });
      
      // Здесь будет WebSocket соединение для ПВП
      console.log('Initializing PvP connection...');
      
    } else if (mode === 'ai') {
      setGameMode('ai');
      setIsMultiplayer(false);
      setDifficulty(parseInt(difficultyParam as string) || 3);
      
      // Создание AI противника
      const aiNames = ['AI Новичок', 'AI Ученик', 'AI Знаток', 'AI Эксперт', 'AI Мастер'];
      setOpponent({
        id: 'ai_opponent',
        name: aiNames[difficulty - 1] || 'AI',
        rank: 1000 + difficulty * 200,
        avatar: {
          type: 'emoji',
          value: '🤖'
        }
      });
      
    } else {
      setGameMode('classic');
      setIsMultiplayer(false);
    }
    
    // Таймер авто-выхода если игра не началась
    const timeout = setTimeout(() => {
      // Логика авто-выхода
    }, 30000);
    
    return () => clearTimeout(timeout);
  }, [gameId, mode, opponentParam, difficultyParam, gameConfig, router]);
  
  // Обработка завершения игры
  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);
    
    // Показ результата
    setTimeout(() => {
      if (gameMode === 'classic' || gameMode === 'ai') {
        // Для одиночной игры показываем статистику
        setShowGameRules(true);
      }
      // Для ПВП будет редирект в лобби
    }, 2000);
  };
  
  // Выход из игры
  const handleExit = () => {
    if (gameMode === 'pvp' && !confirm('Вы уверены, что хотите выйти? Это засчитается как поражение.')) {
      return;
    }
    router.back();
  };
  
  // Повтор игры
  const handleReplay = () => {
    router.reload();
  };
  
  // Назад к выбору игр
  const handleBackToGames = () => {
    router.push('/classic');
  };
  
  if (!gameConfig || !GameComponent) {
    return <GameLoading gameName="Игра" />;
  }
  
  return (
    <>
      <Head>
        <title>Brain Battle | {gameConfig.name}</title>
        <meta name="description" content={gameConfig.description} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        
        {/* Фоновые эффекты для игры */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        {/* Основной контент */}
        <div className="relative z-10">
          
          {/* Информационная панель */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                
                {/* Левая часть: Информация об игре */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExit}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                  >
                    ←
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-12 h-12 rounded-xl
                      flex items-center justify-center
                      text-2xl
                      ${gameConfig.colorScheme}
                      bg-gradient-to-br ${gameConfig.colorScheme}
                    `}>
                      {gameConfig.icon}
                    </div>
                    
                    <div>
                      <h1 className="text-white font-bold text-lg">{gameConfig.name}</h1>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400">
                          {gameMode === 'pvp' ? 'ПВП' : gameMode === 'ai' ? 'Против ИИ' : 'Классика'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">Сложность: {'★'.repeat(gameConfig.difficulty)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Правая часть: Игроки */}
                <div className="flex items-center gap-6">
                  
                  {/* Игрок 1 (текущий) */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-white font-medium">{player?.name || 'Игрок'}</div>
                      <div className="text-gray-400 text-sm">{player?.rank || 1000} ELO</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {player?.name?.charAt(0) || 'П'}
                    </div>
                  </div>
                  
                  {/* VS */}
                  <div className="text-gray-500">VS</div>
                  
                  {/* Игрок 2/AI */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${
                      gameMode === 'ai' 
                        ? 'bg-gradient-to-br from-gray-400 to-gray-600' 
                        : 'bg-gradient-to-br from-purple-400 to-pink-500'
                    } flex items-center justify-center text-white font-bold`}>
                      {opponent?.name?.charAt(0) || 'С'}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{opponent?.name || 'Соперник'}</div>
                      <div className="text-gray-400 text-sm">{opponent?.rank || 1200} ELO</div>
                    </div>
                  </div>
                  
                  {/* Кнопка правил */}
                  <button
                    onClick={() => setShowGameRules(!showGameRules)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                    title="Правила игры"
                  >
                    ?
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Модалка с правилами */}
          <AnimatePresence>
            {showGameRules && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                onClick={() => setShowGameRules(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">📚 Правила игры: {gameConfig.name}</h2>
                    <button
                      onClick={() => setShowGameRules(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-all text-white"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-300">{gameConfig.description}</p>
                    
                    <div>
                      <h3 className="text-white font-bold mb-2">Основные правила:</h3>
                      <ul className="space-y-2 text-gray-300">
                        {gameConfig.rules?.map((rule: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{rule}</span>
                          </li>
                        )) || (
                          <li className="text-gray-500">Правила не указаны</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-bold mb-2">Особенности:</h3>
                      <div className="flex flex-wrap gap-2">
                        {gameConfig.features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <div className="text-gray-400 text-sm">Категория</div>
                        <div className="text-white font-medium">
                          {gameConfig.category === 'puzzle' ? 'Головоломка' :
                           gameConfig.category === 'strategy' ? 'Стратегия' :
                           gameConfig.category === 'math' ? 'Математика' :
                           gameConfig.category === 'words' ? 'Слова' : 'Логика'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Время на партию</div>
                        <div className="text-white font-medium">
                          {Math.floor(gameConfig.timeLimit / 60)}:
                          {(gameConfig.timeLimit % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Количество игроков</div>
                        <div className="text-white font-medium">{gameConfig.players}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Сложность</div>
                        <div className="text-white font-medium">{'★'.repeat(gameConfig.difficulty)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowGameRules(false)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      Начать игру
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Игровой компонент */}
          <div className="container mx-auto px-4 py-6">
            <Suspense fallback={<GameLoading gameName={gameConfig.name} />}>
              <GameComponent
                isMultiplayer={isMultiplayer}
                opponentName={opponent?.name}
                onGameEnd={handleGameEnd}
              />
            </Suspense>
          </div>
          
          {/* Нижняя панель управления */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-gray-900/80 border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                
                {/* Левая часть: Быстрые действия */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleReplay}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-blue-300 hover:from-blue-600/30 hover:to-cyan-500/30 transition-all"
                  >
                    <span>🔄</span>
                    <span className="hidden md:inline">Заново</span>
                  </button>
                  
                  <button
                    onClick={() => setShowGameRules(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-500/30 transition-all"
                  >
                    <span>📖</span>
                    <span className="hidden md:inline">Правила</span>
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-500/20 text-green-300 hover:from-green-600/30 hover:to-emerald-500/30 transition-all"
                  >
                    <span>💾</span>
                    <span className="hidden md:inline">Сохранить</span>
                  </button>
                </div>
                
                {/* Центральная часть: Статус */}
                <div className="text-center">
                  <div className="text-sm text-gray-400">Режим игры</div>
                  <div className="text-white font-bold">
                    {gameMode === 'pvp' ? 'ПВП Битва' : 
                     gameMode === 'ai' ? 'Против ИИ' : 'Тренировка'}
                  </div>
                </div>
                
                {/* Правая часть: Основные кнопки */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToGames}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:shadow-lg transition-all"
                  >
                    К играм
                  </button>
                  
                  <button
                    onClick={handleExit}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Получение данных на сервере
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const gameConfig = getGameById(id);
  
  if (!gameConfig) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      gameId: id,
      gameConfig
    }
  };
};

export default GamePage;