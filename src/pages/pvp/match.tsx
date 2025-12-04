import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useStore, gameActions } from '@/lib/state/store';
import { useProfileStore } from '@/lib/state/profile';
import { getGameById } from '@/lib/games/config';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';
import RankBadge from '@/components/ui/indicators/RankBadge';
import Timer from '@/components/games/common/Timer';

// Динамический импорт игр
const gameComponents: Record<string, any> = {
  'pentago': dynamic(() => import('@/components/games/specific/Pentago'), {
    loading: () => <MatchLoading />
  }),
  'dots-and-boxes': dynamic(() => import('@/components/games/specific/DotsAndBoxes'), {
    loading: () => <MatchLoading />
  }),
  // Добавьте другие игры по аналогии
};

// Загрузка матча
const MatchLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Подготовка ПВП матча</h1>
          <p className="text-gray-400">Соединение с противником...</p>
          
          <div className="mt-6 space-y-2">
            <div className="h-2 w-64 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
            </div>
            <div className="text-xs text-gray-500">
              Установка защищенного соединения
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Основная страница матча
const PVPMatchPage: React.FC = () => {
  const router = useRouter();
  const { matchId } = router.query;
  
  const player = useStore(state => state.player);
  const profile = useProfileStore(state => state.player);
  const [gameState, setGameState] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [matchResult, setMatchResult] = useState<any>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const matchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Инициализация матча
  useEffect(() => {
    if (!matchId) return;
    
    // Симуляция получения данных матча
    const fetchMatchData = async () => {
      setConnectionStatus('connecting');
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Тестовые данные матча
      const mockMatch = {
        id: matchId as string,
        gameId: 'pentago', // или другой gameId из параметров
        players: [
          {
            id: profile?.id || 'player1',
            name: profile?.name || 'Игрок 1',
            rank: profile?.rank || 1250,
            avatar: profile?.avatar || { type: 'gradient', value: 'from-cyan-400 to-blue-500' },
            isReady: true
          },
          {
            id: 'opponent_123',
            name: 'LogicMaster',
            rank: 1320,
            avatar: { type: 'gradient', value: 'from-purple-400 to-pink-500' },
            isReady: true
          }
        ],
        status: 'playing',
        timeLimit: 180,
        createdAt: Date.now(),
        eloStake: 20 // Количество ELO на кону
      };
      
      setMatchInfo(mockMatch);
      setOpponent(mockMatch.players[1]);
      setConnectionStatus('connected');
      
      // Начинаем таймер матча
      startMatchTimer();
      
      // Инициализация игры
      initializeGame(mockMatch.gameId);
    };
    
    fetchMatchData();
    
    // Симуляция WebSocket соединения
    const wsSimulation = setInterval(() => {
      // Симуляция получения ходов противника
      if (Math.random() > 0.8 && !isPlayerTurn && !gameOver) {
        simulateOpponentMove();
      }
      
      // Симуляция чата
      if (Math.random() > 0.9 && chatMessages.length < 10) {
        const messages = [
          'Удачи!',
          'Интересная партия',
          'Ты хорош!',
          'Думай быстрее!',
          '👋',
          '🎮',
          '⚡'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        setChatMessages(prev => [...prev, {
          id: `msg_${Date.now()}`,
          sender: opponent?.id || 'opponent',
          senderName: opponent?.name || 'Соперник',
          content: randomMessage,
          timestamp: Date.now(),
          type: 'text'
        }]);
      }
    }, 3000);
    
    return () => {
      clearInterval(wsSimulation);
      if (matchTimerRef.current) {
        clearInterval(matchTimerRef.current);
      }
    };
  }, [matchId, profile]);
  
  // Прокрутка чата вниз при новых сообщениях
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Инициализация игры
  const initializeGame = (gameId: string) => {
    const gameConfig = getGameById(gameId);
    if (!gameConfig) return;
    
    // Инициализация состояния игры
    setGameState({
      gameId,
      gameName: gameConfig.name,
      status: 'playing',
      currentPlayer: profile?.id || 'player1',
      players: [profile?.id || 'player1', 'opponent_123']
    });
    
    setIsPlayerTurn(true);
  };
  
  // Запуск таймера матча
  const startMatchTimer = () => {
    if (matchTimerRef.current) clearInterval(matchTimerRef.current);
    
    matchTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(matchTimerRef.current as NodeJS.Timeout);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Таймаут
  const handleTimeout = () => {
    if (!gameOver) {
      const timedOutPlayer = isPlayerTurn ? profile?.id : opponent?.id;
      const winner = isPlayerTurn ? opponent?.id : profile?.id;
      
      setGameOver(true);
      setWinner(winner);
      setMatchResult({
        winner,
        reason: 'timeout',
        details: `У ${timedOutPlayer === profile?.id ? 'вас' : 'соперника'} закончилось время`
      });
      
      // Обновление статистики
      if (winner === profile?.id) {
        useProfileStore.getState().addGameResult('win', 180);
      } else {
        useProfileStore.getState().addGameResult('loss', 180);
      }
    }
  };
  
  // Симуляция хода противника
  const simulateOpponentMove = () => {
    if (gameOver || isPlayerTurn) return;
    
    // Имитация задержки мышления
    setTimeout(() => {
      // Здесь будет реальная логика хода
      console.log('Противник сделал ход');
      
      // Передача хода игроку
      setIsPlayerTurn(true);
      
      // Обновление времени
      setTimeLeft(180);
    }, 1000 + Math.random() * 2000);
  };
  
  // Ход игрока
  const handlePlayerMove = (move: any) => {
    if (gameOver || !isPlayerTurn) return;
    
    console.log('Игрок сделал ход:', move);
    
    // Отправка хода на сервер (симуляция)
    setTimeout(() => {
      // Передача хода противнику
      setIsPlayerTurn(false);
      setTimeLeft(180);
      
      // Проверка завершения игры
      // Здесь будет реальная логика проверки победы
    }, 500);
  };
  
  // Завершение игры
  const handleGameEnd = (result: any) => {
    setGameOver(true);
    setWinner(result.winner);
    setMatchResult(result);
    
    // Остановка таймера
    if (matchTimerRef.current) {
      clearInterval(matchTimerRef.current);
    }
    
    // Обновление статистики
    if (result.winner === profile?.id) {
      useProfileStore.getState().addGameResult('win', 180 - timeLeft);
    } else if (result.winner === opponent?.id) {
      useProfileStore.getState().addGameResult('loss', 180 - timeLeft);
    } else {
      useProfileStore.getState().addGameResult('draw', 180 - timeLeft);
    }
  };
  
  // Отправка сообщения в чат
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: `msg_${Date.now()}`,
      sender: profile?.id || 'player',
      senderName: profile?.name || 'Вы',
      content: newMessage,
      timestamp: Date.now(),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Симуляция ответа противника
    setTimeout(() => {
      if (Math.random() > 0.5 && !gameOver) {
        setChatMessages(prev => [...prev, {
          id: `msg_${Date.now()}_resp`,
          sender: opponent?.id || 'opponent',
          senderName: opponent?.name || 'Соперник',
          content: 'Интересно...',
          timestamp: Date.now(),
          type: 'text'
        }]);
      }
    }, 1000 + Math.random() * 2000);
  };
  
  // Сдача
  const handleSurrender = () => {
    if (window.confirm('Вы уверены, что хотите сдаться? Это засчитается как поражение.')) {
      setGameOver(true);
      setWinner(opponent?.id);
      setMatchResult({
        winner: opponent?.id,
        reason: 'surrender',
        details: 'Вы сдались'
      });
      
      useProfileStore.getState().addGameResult('loss', 180 - timeLeft);
      gameActions.surrender();
    }
  };
  
  // Выход из матча
  const handleExit = () => {
    if (!gameOver) {
      if (window.confirm('Выйти из матча? Это засчитается как поражение.')) {
        router.push('/pvp');
      }
    } else {
      router.push('/pvp');
    }
  };
  
  // Рематч
  const handleRematch = () => {
    if (!opponent) return;
    
    // Запрос рематча
    // Здесь будет WebSocket запрос
    console.log('Запрос на рематч отправлен');
    
    // Пока уведомление
    setChatMessages(prev => [...prev, {
      id: `sys_${Date.now()}`,
      sender: 'system',
      senderName: 'Система',
      content: 'Вы предложили реванш',
      timestamp: Date.now(),
      type: 'system'
    }]);
  };
  
  // Получение компонента игры
  const GameComponent = gameState ? gameComponents[gameState.gameId] : null;
  
  if (!matchInfo || !gameState) {
    return <MatchLoading />;
  }
  
  return (
    <>
      <Head>
        <title>Brain Battle | ПВП Матч</title>
        <meta name="description" content="ПВП матч в реальном времени" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/10 to-gray-900">
        
        {/* Статус подключения */}
        <AnimatePresence>
          {connectionStatus !== 'connected' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
            >
              <div className={`
                mx-4 p-4 rounded-xl backdrop-blur-lg border
                ${connectionStatus === 'connecting' 
                  ? 'bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-yellow-500/30' 
                  : 'bg-gradient-to-r from-red-900/80 to-pink-900/80 border-red-500/30'
                }
              `}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}
                    `}>
                      {connectionStatus === 'connecting' ? '🔗' : '⚠️'}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
                        {connectionStatus === 'connecting' ? 'Подключение...' : 'Отключено'}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {connectionStatus === 'connecting' 
                          ? 'Устанавливаем соединение с противником' 
                          : 'Пытаемся переподключиться...'}
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Результат матча */}
        <AnimatePresence>
          {gameOver && matchResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl p-6"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {matchResult.winner === profile?.id ? '🏆' : 
                     matchResult.winner === opponent?.id ? '🎉' : '🤝'}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {matchResult.winner === profile?.id ? 'Победа!' : 
                     matchResult.winner === opponent?.id ? 'Поражение' : 'Ничья!'}
                  </h2>
                  <p className="text-gray-400">{matchResult.details}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-gray-400">Причина:</span>
                    <span className="text-white font-medium">
                      {matchResult.reason === 'win' ? 'Победа по правилам' :
                       matchResult.reason === 'timeout' ? 'Время вышло' :
                       matchResult.reason === 'surrender' ? 'Сдача' : 'Ничья'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-gray-400">Время игры:</span>
                    <span className="text-white font-medium">
                      {Math.floor((180 - timeLeft) / 60)}:
                      {((180 - timeLeft) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-gray-400">Изменение ELO:</span>
                    <span className={`font-bold ${
                      matchResult.winner === profile?.id ? 'text-green-400' : 
                      matchResult.winner === opponent?.id ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {matchResult.winner === profile?.id ? '+20' : 
                       matchResult.winner === opponent?.id ? '-15' : '±0'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleRematch}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    Реванш
                  </button>
                  
                  <button
                    onClick={() => router.push('/pvp')}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold hover:shadow-lg transition-all"
                  >
                    В лобби
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Основной контент */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Левая колонка: Игрок */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        {profile?.name?.charAt(0) || 'П'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 ${
                        isPlayerTurn && !gameOver ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h3 className="text-white text-xl font-bold">{profile?.name || 'Игрок'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RankBadge rank={profile?.rank || 1000} size="sm" />
                        <span className="text-gray-400 text-sm">Вы</span>
                      </div>
                    </div>
                  </div>
                  
                  <Timer
                    time={timeLeft}
                    isActive={isPlayerTurn && !gameOver}
                    color="cyan"
                    showWarning={timeLeft < 60}
                    warningThreshold={30}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-gray-400 text-sm mb-1">Статус</div>
                    <div className="text-white font-bold">
                      {isPlayerTurn ? 'Ваш ход' : 'Ход соперника'}
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-gray-400 text-sm mb-1">На кону</div>
                    <div className="text-white font-bold">20 ELO</div>
                  </div>
                  
                  {!gameOver && (
                    <button
                      onClick={handleSurrender}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 transition-all"
                    >
                      Сдаться
                    </button>
                  )}
                </div>
              </div>
              
              {/* Информация о матче */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10">
                <h3 className="text-white font-bold mb-4">Информация о матче</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">ID матча:</span>
                    <span className="text-white font-mono">{matchId}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Игра:</span>
                    <span className="text-white">{gameState?.gameName || 'Загрузка...'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Время на ход:</span>
                    <span className="text-white">3:00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Режим:</span>
                    <span className="text-white">Рейтинговый</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Создан:</span>
                    <span className="text-white">
                      {new Date(matchInfo?.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Центральная колонка: Игра */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
                
                {/* Заголовок игры */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl">
                      ⚔️
                    </div>
                    <div>
                      <h1 className="text-white text-2xl font-bold">ПВП Матч</h1>
                      <div className="text-gray-400 text-sm">
                        {gameState?.gameName || 'Загрузка...'} • Рейтинговый
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleExit}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:shadow-lg transition-all"
                  >
                    Выйти
                  </button>
                </div>
                
                {/* Игровое поле */}
                <div className="min-h-[400px] flex items-center justify-center">
                  {GameComponent ? (
                    <GameComponent
                      isMultiplayer={true}
                      opponentName={opponent?.name}
                      onGameEnd={handleGameEnd}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4 opacity-20">🎮</div>
                      <h3 className="text-xl text-white mb-2">Загрузка игры</h3>
                      <p className="text-gray-400">Подготовка игрового поля...</p>
                    </div>
                  )}
                </div>
                
                {/* Ход игры */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-white/10">
                  <h3 className="text-white font-bold mb-3">Ход игры</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${isPlayerTurn ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                      <span className="text-white">
                        {isPlayerTurn ? 'Ваш ход' : 'Ход соперника'}
                      </span>
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                      Время: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Правая колонка: Соперник и чат */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        {opponent?.name?.charAt(0) || 'С'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-900 ${
                        !isPlayerTurn && !gameOver ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h3 className="text-white text-xl font-bold">{opponent?.name || 'Соперник'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RankBadge rank={opponent?.rank || 1200} size="sm" />
                        <span className="text-gray-400 text-sm">Противник</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white text-2xl font-bold">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-400 text-xs">Время соперника</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-gray-400 text-sm mb-1">Статистика соперника</div>
                    <div className="text-white font-bold">
                      {opponent?.stats?.winRate || '50'}% побед
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-gray-400 text-sm mb-1">Разница в ELO</div>
                    <div className={`font-bold ${
                      (opponent?.rank || 1200) > (profile?.rank || 1000) 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {Math.abs((opponent?.rank || 1200) - (profile?.rank || 1000))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Чат */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Чат матча</h3>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-1 rounded hover:bg-white/10 transition-all"
                  >
                    {showChat ? '−' : '+'}
                  </button>
                </div>
                
                {showChat && (
                  <>
                    {/* Сообщения */}
                    <div 
                      ref={chatContainerRef}
                      className="h-64 overflow-y-auto mb-4 space-y-3 pr-2"
                    >
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Начните общение с соперником
                        </div>
                      ) : (
                        chatMessages.map(message => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.sender === profile?.id
                                ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20 ml-4'
                                : message.sender === 'system'
                                ? 'bg-gradient-to-r from-gray-800/30 to-gray-900/30'
                                : 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 mr-4'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-xs font-medium ${
                                message.sender === profile?.id ? 'text-cyan-300' :
                                message.sender === 'system' ? 'text-gray-400' :
                                'text-purple-300'
                              }`}>
                                {message.senderName}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="text-white text-sm">{message.content}</div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Поле ввода */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Введите сообщение..."
                        className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        disabled={gameOver}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={gameOver}
                        className="px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </div>
                    
                    {/* Быстрые сообщения */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Удачи!', 'Хорошая игра', '👋', '⚡'].map((msg, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setNewMessage(msg);
                            setTimeout(sendMessage, 100);
                          }}
                          disabled={gameOver}
                          className="px-3 py-1 rounded-full bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Быстрые действия */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10">
                <h3 className="text-white font-bold mb-4">Действия</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRematch}
                    disabled={!gameOver}
                    className="p-3 rounded-lg bg-gradient-to-r from-cyan-900/20 to-blue-900/20 text-cyan-300 hover:from-cyan-900/30 hover:to-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-2xl mb-1">🔄</div>
                    <div className="text-xs">Реванш</div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/pvp')}
                    className="p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/30 text-gray-300 hover:from-gray-700/30 hover:to-gray-800/30 transition-all"
                  >
                    <div className="text-2xl mb-1">🏠</div>
                    <div className="text-xs">В лобби</div>
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="p-3 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 text-purple-300 hover:from-purple-900/30 hover:to-pink-900/30 transition-all"
                  >
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-xs">Профиль</div>
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="p-3 rounded-lg bg-gradient-to-r from-green-900/20 to-emerald-900/20 text-green-300 hover:from-green-900/30 hover:to-emerald-900/30 transition-all"
                  >
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs">Статистика</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PVPMatchPage;