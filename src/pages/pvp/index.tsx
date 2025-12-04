import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';
import RankBadge from '@/components/ui/indicators/RankBadge';
import { motion, AnimatePresence } from 'framer-motion';

// Типы для игроков и матчей
interface Player {
  id: string;
  name: string;
  rank: number;
  avatarColor: string;
  status: 'online' | 'in_game' | 'away';
  game?: string;
}

interface GameMatch {
  id: string;
  gameId: string;
  gameName: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  timeLimit: number;
  eloRange: [number, number];
}

export default function PVPLobbyPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [playerRank, setPlayerRank] = useState(1250);
  const [selectedGame, setSelectedGame] = useState<string>('any');
  const [rankRange, setRankRange] = useState<[number, number]>([1100, 1400]);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([
    { id: '1', name: 'BrainMaster', rank: 1250, avatarColor: 'from-cyan-400 to-blue-500', status: 'online' },
    { id: '2', name: 'LogicKing', rank: 1420, avatarColor: 'from-purple-400 to-pink-500', status: 'in_game', game: 'Пентаго' },
    { id: '3', name: 'MathPro', rank: 1180, avatarColor: 'from-green-400 to-teal-500', status: 'online' },
    { id: '4', name: 'StrategyGod', rank: 1560, avatarColor: 'from-yellow-400 to-orange-500', status: 'away' },
    { id: '5', name: 'PuzzleSolver', rank: 1320, avatarColor: 'from-red-400 to-pink-500', status: 'online' },
    { id: '6', name: 'QuickMind', rank: 1270, avatarColor: 'from-blue-400 to-cyan-500', status: 'in_game', game: 'Шахматы блиц' },
  ]);
  const [availableMatches, setAvailableMatches] = useState<GameMatch[]>([
    { id: 'm1', gameId: 'pentago', gameName: 'Пентаго', players: [{ id: '7', name: 'WaitingPlayer', rank: 1200, avatarColor: 'from-gray-400 to-gray-600', status: 'online' }], status: 'waiting', timeLimit: 180, eloRange: [1100, 1300] },
    { id: 'm2', gameId: 'dots-and-boxes', gameName: 'Точки и квадраты', players: [{ id: '8', name: 'BoxMaster', rank: 1350, avatarColor: 'from-green-400 to-emerald-500', status: 'online' }], status: 'waiting', timeLimit: 120, eloRange: [1300, 1500] },
  ]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Список игр для ПВП
  const pvpGames = [
    { id: 'any', name: 'Любая игра', icon: '🎲' },
    { id: 'pentago', name: 'Пентаго', icon: '🎯' },
    { id: 'chess-blitz', name: 'Шахматы блиц', icon: '♟️' },
    { id: 'dots-and-boxes', name: 'Точки и квадраты', icon: '🔲' },
    { id: 'math-sprint', name: 'Математический спринт', icon: '⚡' },
  ];

  // Функция поиска противника
  const handleFindMatch = () => {
    if (isSearching) {
      // Отмена поиска
      setIsSearching(false);
      setSearchTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Начало поиска
      setIsSearching(true);
      setSearchTime(0);
      
      // Имитация поиска
      timerRef.current = setInterval(() => {
        setSearchTime(prev => {
          const newTime = prev + 1;
          
          // Автоматический подбор через 10 секунд
          if (newTime >= 10) {
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Случайный выбор матча или создание нового
            setTimeout(() => {
              const matchToJoin = availableMatches[Math.floor(Math.random() * availableMatches.length)];
              if (matchToJoin) {
                router.push(`/pvp/match/${matchToJoin.id}`);
              } else {
                // Создаем новый матч
                const newMatchId = `match_${Date.now()}`;
                router.push(`/pvp/match/${newMatchId}`);
              }
            }, 1000);
            
            return newTime;
          }
          
          // Обновляем список игроков каждые 3 секунды
          if (newTime % 3 === 0) {
            simulatePlayerActivity();
          }
          
          return newTime;
        });
      }, 1000);
    }
  };

  // Присоединение к существующему матчу
  const handleJoinMatch = (matchId: string) => {
    setIsSearching(false);
    if (timerRef.current) clearInterval(timerRef.current);
    router.push(`/pvp/match/${matchId}`);
  };

  // Симуляция активности игроков
  const simulatePlayerActivity = () => {
    setOnlinePlayers(prev => 
      prev.map(player => ({
        ...player,
        status: Math.random() > 0.7 ? (player.status === 'online' ? 'in_game' : 'online') : player.status
      }))
    );
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getRankTitle = (rank: number) => {
    if (rank < 1000) return "Новичок";
    if (rank < 1200) return "Ученик";
    if (rank < 1400) return "Знаток";
    if (rank < 1600) return "Эксперт";
    if (rank < 1800) return "Мастер";
    return "Гроссмейстер";
  };

  return (
    <>
      <Head>
        <title>Brain Battle | ПВП Арена</title>
        <meta name="description" content="Соревнуйтесь с игроками в реальном времени" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        
        {/* Анимированный фон для ПВП */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Header 
            showBack={true} 
            onBack={() => router.back()}
            title="ПВП Арена"
          />

          <main className="container mx-auto px-4 py-6 md:py-8">
            
            {/* Основная панель */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Левая колонка: Статистика игрока */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 mb-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">👤</span> Ваш профиль
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        BM
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold border-2 border-gray-900">
                        12
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white text-xl font-bold">BrainMaster</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RankBadge rank={playerRank} showLabel={true} size="lg" />
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {getRankTitle(playerRank)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Рейтинг ELO</span>
                      <span className="text-white font-bold">{playerRank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Победы</span>
                      <span className="text-green-400 font-bold">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Поражения</span>
                      <span className="text-red-400 font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-yellow-400 font-bold">74%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-2">Следующий ранг</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full" 
                          style={{ width: `${((playerRank - 1200) / 200) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {1400 - playerRank} ELO до <span className="text-cyan-300">«Знатока»</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Настройки поиска */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚙️</span> Настройки поиска
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Игра</label>
                      <div className="flex flex-wrap gap-2">
                        {pvpGames.map(game => (
                          <button
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-full transition-all
                              ${selectedGame === game.id 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                              }
                            `}
                          >
                            <span>{game.icon}</span>
                            <span className="text-sm">{game.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Диапазон рангов</label>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold">{rankRange[0]}</span>
                        <span className="text-gray-400">—</span>
                        <span className="text-white font-bold">{rankRange[1]}</span>
                      </div>
                      <div className="relative h-2">
                        <input
                          type="range"
                          min="800"
                          max="2000"
                          step="50"
                          value={rankRange[0]}
                          onChange={(e) => setRankRange([parseInt(e.target.value), rankRange[1]])}
                          className="absolute w-full h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <input
                          type="range"
                          min="800"
                          max="2000"
                          step="50"
                          value={rankRange[1]}
                          onChange={(e) => setRankRange([rankRange[0], parseInt(e.target.value)])}
                          className="absolute w-full h-2 bg-transparent rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                      </div>
                      <div className="text-gray-400 text-xs mt-2">
                        Соперники от {getRankTitle(rankRange[0])} до {getRankTitle(rankRange[1])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Центральная колонка: Поиск матча */}
              <div className="lg:col-span-2">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 mb-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚔️</span> Быстрый матч
                  </h2>
                  
                  <div className="text-center py-8">
                    <AnimatePresence>
                      {isSearching ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-8"
                        >
                          <div className="relative">
                            <div className="w-48 h-48 mx-auto relative">
                              {/* Анимированные круги */}
                              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                              <div className="absolute inset-8 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin animation-delay-500"></div>
                              <div className="absolute inset-16 rounded-full border-4 border-transparent border-t-pink-500 animate-spin animation-delay-1000"></div>
                              
                              {/* Центральный текст */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl mb-4">🔍</div>
                                <div className="text-white text-2xl font-bold mb-2">
                                  {searchTime} сек
                                </div>
                                <div className="text-gray-400">
                                  Поиск противника...
                                </div>
                              </div>
                            </div>
                            
                            {/* Анимированные точки поиска */}
                            <div className="flex justify-center gap-2 mt-8">
                              {[0, 1, 2].map(i => (
                                <motion.div
                                  key={i}
                                  className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                  animate={{
                                    y: [0, -10, 0]
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-gray-400 max-w-md mx-auto">
                            Ищем соперника с похожим рейтингом ({rankRange[0]}-{rankRange[1]} ELO)
                            {selectedGame !== 'any' && ` в игре "${pvpGames.find(g => g.id === selectedGame)?.name}"`}
                          </div>
                          
                          <button
                            onClick={handleFindMatch}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transition-all"
                          >
                            ОТМЕНИТЬ ПОИСК
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-8"
                        >
                          <div className="text-8xl mb-4">⚔️</div>
                          <h3 className="text-2xl font-bold text-white">
                            Готовы к битве умов?
                          </h3>
                          <p className="text-gray-400 max-w-md mx-auto">
                            Найдите достойного соперника и сразьтесь в логической дуэли. 
                            Победы повышают ваш рейтинг, поражения — дают опыт.
                          </p>
                          
                          <button
                            onClick={handleFindMatch}
                            className="px-12 py-6 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-xl hover:shadow-2xl hover:shadow-green-500/40 transition-all transform hover:scale-105"
                          >
                            НАЙТИ ПРОТИВНИКА
                          </button>
                          
                          <div className="text-gray-500 text-sm">
                            Среднее время ожидания: 5-15 секунд
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Доступные матчи */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">👥</span> Открытые матчи
                  </h2>
                  
                  {availableMatches.length > 0 ? (
                    <div className="space-y-4">
                      {availableMatches.map((match) => (
                        <div
                          key={match.id}
                          className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/2 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
                          onClick={() => handleJoinMatch(match.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xl">
                                {pvpGames.find(g => g.id === match.gameId)?.icon || '🎮'}
                              </div>
                              <div>
                                <h4 className="text-white font-bold">{match.gameName}</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>{match.players.length}/2 игроков</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span>Лимит: {Math.floor(match.timeLimit / 60)}:{(match.timeLimit % 60).toString().padStart(2, '0')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-white font-bold">{match.eloRange[0]}-{match.eloRange[1]}</div>
                                <div className="text-gray-400 text-sm">ELO</div>
                              </div>
                              
                              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm opacity-0 group-hover:opacity-100 transition-all">
                                Присоединиться →
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-4">
                            {match.players.map(player => (
                              <div key={player.id} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                                  {player.name.charAt(0)}
                                </div>
                                <div className="text-sm">
                                  <div className="text-white">{player.name}</div>
                                  <div className="text-gray-400 text-xs">{player.rank} ELO</div>
                                </div>
                              </div>
                            ))}
                            
                            {match.players.length < 2 && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                                  ?
                                </div>
                                <div className="text-sm">Ожидает соперника...</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-20">⚔️</div>
                      <h3 className="text-xl text-white mb-2">Нет открытых матчей</h3>
                      <p className="text-gray-400 mb-6">Создайте свой матч или начните поиск противника</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Онлайн игроки */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🌐</span> Игроки онлайн ({onlinePlayers.length})
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {onlinePlayers.map(player => (
                  <div key={player.id} className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-cyan-500/30 transition-all">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                          {player.name.charAt(0)}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 ${
                          player.status === 'online' ? 'bg-green-500' :
                          player.status === 'in_game' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      
                      <div className="text-white font-medium truncate w-full">{player.name}</div>
                      <div className="text-gray-400 text-sm">{player.rank} ELO</div>
                      
                      {player.status === 'in_game' && player.game && (
                        <div className="mt-2 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                          В игре: {player.game}
                        </div>
                      )}
                      
                      {player.status === 'away' && (
                        <div className="mt-2 px-2 py-1 rounded-full bg-gray-500/20 text-gray-300 text-xs">
                          Отошел
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>В сети</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>В игре</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Отошел</span>
                </div>
              </div>
            </div>
            
          </main>
        </div>
      </div>
    </>
  );
}