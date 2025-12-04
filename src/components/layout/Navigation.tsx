import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useStore, useIsFavorite } from '@/lib/state/store';
import { GAMES_CONFIG } from '@/lib/games/config';
import RankBadge from '@/components/ui/indicators/RankBadge';

interface NavigationProps {
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onClose }) => {
  const router = useRouter();
  const player = useStore(state => state.player);
  const settings = useStore(state => state.settings);
  const favoriteGames = useStore(state => state.favoriteGames);
  const [activeSection, setActiveSection] = useState<'games' | 'stats' | 'friends' | 'settings'>('games');
  
  // Получение статистики игрока
  const playerStats = player?.stats || {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    totalTimePlayed: 0,
    averageScore: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0
  };
  
  // Навигация
  const navigateTo = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };
  
  // Получение избранных игр
  const favoriteGamesList = GAMES_CONFIG.filter(game => 
    favoriteGames.includes(game.id)
  ).slice(0, 5); // Показываем только 5 избранных
  
  // Категории игр
  const gameCategories = [
    { id: 'all', name: 'Все игры', icon: '🎮', count: GAMES_CONFIG.length },
    { id: 'puzzle', name: 'Головоломки', icon: '🧩', count: GAMES_CONFIG.filter(g => g.category === 'puzzle').length },
    { id: 'strategy', name: 'Стратегии', icon: '♟️', count: GAMES_CONFIG.filter(g => g.category === 'strategy').length },
    { id: 'math', name: 'Математика', icon: '🧮', count: GAMES_CONFIG.filter(g => g.category === 'math').length },
    { id: 'words', name: 'Слова', icon: '📝', count: GAMES_CONFIG.filter(g => g.category === 'words').length },
    { id: 'logic', name: 'Логика', icon: '🔍', count: GAMES_CONFIG.filter(g => g.category === 'logic').length },
  ];
  
  // Форматирование времени
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes} минут`;
  };

  return (
    <div className="h-full flex flex-col">
      
      {/* Заголовок */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {player?.name?.charAt(0) || 'П'}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{player?.name || 'Игрок'}</h2>
              <div className="flex items-center gap-2">
                <RankBadge rank={player?.rank || 1000} size="sm" />
                <span className="text-gray-400 text-xs">Уровень {player?.level || 1}</span>
              </div>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-all text-white"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Прогресс уровня */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>До следующего уровня</span>
            <span>{Math.floor(((player?.rank || 1000) % 100) / 10)}/10</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${((player?.rank || 1000) % 100) / 10 * 10}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Навигационные вкладки */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveSection('games')}
          className={`
            flex-1 py-3 text-center text-sm font-medium transition-all
            ${activeSection === 'games' 
              ? 'text-white border-b-2 border-cyan-500' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span>🎮</span>
            <span className="hidden md:inline">Игры</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection('stats')}
          className={`
            flex-1 py-3 text-center text-sm font-medium transition-all
            ${activeSection === 'stats' 
              ? 'text-white border-b-2 border-purple-500' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span>📊</span>
            <span className="hidden md:inline">Статистика</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveSection('settings')}
          className={`
            flex-1 py-3 text-center text-sm font-medium transition-all
            ${activeSection === 'settings' 
              ? 'text-white border-b-2 border-green-500' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span>⚙️</span>
            <span className="hidden md:inline">Настройки</span>
          </div>
        </button>
      </div>
      
      {/* Контент вкладок */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Вкладка Игры */}
        {activeSection === 'games' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4"
          >
            {/* Быстрый доступ */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Быстрый доступ</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigateTo('/classic')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      🎮
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">Все игры</div>
                      <div className="text-gray-400 text-xs">{GAMES_CONFIG.length} игр доступно</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                </button>
                
                <button
                  onClick={() => navigateTo('/pvp')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      ⚔️
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">ПВП Арена</div>
                      <div className="text-gray-400 text-xs">Соревнуйтесь с игроками</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                </button>
              </div>
            </div>
            
            {/* Категории */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Категории</h3>
              <div className="grid grid-cols-2 gap-2">
                {gameCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => navigateTo(`/classic?category=${category.id}`)}
                    className="p-3 rounded-lg bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-700/30 hover:to-gray-800/30 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-gray-500 text-xs">{category.count}</span>
                    </div>
                    <div className="text-white text-xs font-medium">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Избранное */}
            {favoriteGamesList.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-3 text-sm">Избранное</h3>
                <div className="space-y-2">
                  {favoriteGamesList.map(game => (
                    <button
                      key={game.id}
                      onClick={() => navigateTo(`/game/${game.id}`)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg ${game.colorScheme} flex items-center justify-center`}>
                        {game.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-white text-xs font-medium truncate">{game.name}</div>
                        <div className="text-gray-500 text-xs truncate">{game.category === 'puzzle' ? 'Головоломка' : 
                          game.category === 'strategy' ? 'Стратегия' : 
                          game.category === 'math' ? 'Математика' : 
                          game.category === 'words' ? 'Слова' : 'Логика'}
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-white transition-colors text-xs">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Вкладка Статистика */}
        {activeSection === 'stats' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4"
          >
            {/* Основная статистика */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Общая статистика</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20">
                  <div className="text-cyan-300 text-xl font-bold">{playerStats.gamesPlayed}</div>
                  <div className="text-gray-400 text-xs">Игр сыграно</div>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20">
                  <div className="text-green-300 text-xl font-bold">{playerStats.winRate}%</div>
                  <div className="text-gray-400 text-xs">Win Rate</div>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
                  <div className="text-purple-300 text-xl font-bold">{formatTime(playerStats.totalTimePlayed)}</div>
                  <div className="text-gray-400 text-xs">Время в игре</div>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20">
                  <div className="text-yellow-300 text-xl font-bold">{playerStats.currentStreak}</div>
                  <div className="text-gray-400 text-xs">Текущая серия</div>
                </div>
              </div>
            </div>
            
            {/* Детальная статистика */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Результаты игр</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-300 text-sm">Победы</span>
                  </div>
                  <span className="text-white font-bold">{playerStats.gamesWon}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-300 text-sm">Поражения</span>
                  </div>
                  <span className="text-white font-bold">{playerStats.gamesLost}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-gray-300 text-sm">Ничьи</span>
                  </div>
                  <span className="text-white font-bold">{playerStats.gamesDrawn}</span>
                </div>
              </div>
              
              {/* График Win Rate */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Win Rate</span>
                  <span>{playerStats.winRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                    style={{ width: `${playerStats.winRate}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Достижения */}
            <div>
              <h3 className="text-white font-bold mb-3 text-sm">Достижения</h3>
              <div className="flex items-center gap-2">
                {player?.achievements?.slice(0, 3).map((ach, index) => (
                  <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs">
                    🏆
                  </div>
                ))}
                {(!player?.achievements || player.achievements.length === 0) && (
                  <div className="text-gray-500 text-sm">Нет достижений</div>
                )}
                {player?.achievements && player.achievements.length > 3 && (
                  <div className="text-gray-400 text-xs">
                    +{player.achievements.length - 3} еще
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Вкладка Настройки */}
        {activeSection === 'settings' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4"
          >
            {/* Звук */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Звук</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Общий звук</span>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${settings.sound.enabled ? 'bg-green-500' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.sound.enabled ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-gray-300 text-sm mb-1">
                    <span>Громкость</span>
                    <span>{Math.round(settings.sound.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sound.volume * 100}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-gray-300 text-sm mb-1">
                    <span>Эффекты</span>
                    <span>{Math.round(settings.sound.effectsVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sound.effectsVolume * 100}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Внешний вид */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 text-sm">Внешний вид</h3>
              <div className="grid grid-cols-3 gap-2">
                {['dark', 'light', 'auto'].map(theme => (
                  <button
                    key={theme}
                    className={`p-3 rounded-lg border ${settings.theme === theme ? 'border-cyan-500' : 'border-white/10'} hover:border-cyan-500/50 transition-all`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">
                        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🔄'}
                      </div>
                      <div className="text-gray-300 text-xs">
                        {theme === 'dark' ? 'Темная' : theme === 'light' ? 'Светлая' : 'Авто'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Доступность */}
            <div>
              <h3 className="text-white font-bold mb-3 text-sm">Доступность</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Высокая контрастность</span>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${settings.accessibility.highContrast ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.accessibility.highContrast ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Уменьшить анимации</span>
                  <div className={`w-12 h-6 rounded-full p-1 cursor-pointer ${settings.accessibility.reducedMotion ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.accessibility.reducedMotion ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-300 text-sm mb-2">Размер шрифта</div>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map(size => (
                      <button
                        key={size}
                        className={`flex-1 py-2 rounded-lg border ${settings.accessibility.fontSize === size ? 'border-cyan-500 text-cyan-300' : 'border-white/10 text-gray-400'} hover:border-cyan-500/50 transition-all`}
                      >
                        {size === 'small' ? 'Аа' : size === 'medium' ? 'Аа' : 'Аа'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Нижняя часть */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => navigateTo('/')}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all group"
        >
          <span className="text-gray-400 group-hover:text-white">🏠</span>
          <span className="text-white font-medium">Главное меню</span>
        </button>
        
        <div className="mt-3 text-center text-gray-500 text-xs">
          Brain Battle v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Navigation;