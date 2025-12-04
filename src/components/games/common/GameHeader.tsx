import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface GameHeaderProps {
  gameName: string;
  onExit: () => void;
  onReset?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  showReset?: boolean;
  showExit?: boolean;
  showSettings?: boolean;
  showHelp?: boolean;
  timer?: number;
  currentPlayer?: string;
  gameStatus?: 'playing' | 'paused' | 'finished';
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameName,
  onExit,
  onReset,
  onSettings,
  onHelp,
  showReset = true,
  showExit = true,
  showSettings = true,
  showHelp = true,
  timer,
  currentPlayer,
  gameStatus = 'playing'
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/90 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Левая часть: Навигация и название */}
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="group p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              title="Выйти из игры"
            >
              <motion.div
                whileHover={{ x: -2 }}
                className="flex items-center gap-1 text-white"
              >
                <span className="text-lg">←</span>
                <span className="text-sm hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity">
                  Назад
                </span>
              </motion.div>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg">
                🎮
              </div>
              
              <div>
                <h1 className="text-white font-bold text-lg md:text-xl">{gameName}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${
                    gameStatus === 'playing' ? 'bg-green-500 animate-pulse' :
                    gameStatus === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span>
                    {gameStatus === 'playing' ? 'Игра идет' :
                     gameStatus === 'paused' ? 'На паузе' : 'Завершена'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Центральная часть: Информация о игре */}
          <div className="hidden md:flex items-center gap-6">
            {timer !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="text-white font-mono text-lg font-bold">
                  {formatTime(timer)}
                </div>
              </div>
            )}
            
            {currentPlayer && (
              <div className="flex items-center gap-2">
                <div className="text-gray-400 text-sm">Текущий ход:</div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/30">
                  {currentPlayer}
                </div>
              </div>
            )}
          </div>
          
          {/* Правая часть: Управление */}
          <div className="flex items-center gap-2">
            
            {/* Кнопка помощи */}
            {showHelp && (
              <button
                onClick={onHelp}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                title="Помощь"
              >
                <span className="text-lg">?</span>
              </button>
            )}
            
            {/* Кнопка настроек */}
            {showSettings && (
              <button
                onClick={onSettings}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                title="Настройки"
              >
                <span className="text-lg">⚙️</span>
              </button>
            )}
            
            {/* Кнопка перезапуска */}
            {showReset && (
              <button
                onClick={onReset}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                title="Начать заново"
              >
                <span className="text-lg">🔄</span>
              </button>
            )}
            
            {/* Меню */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white"
                title="Меню"
              >
                <span className="text-lg">☰</span>
              </button>
              
              {/* Выпадающее меню */}
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-white/10 shadow-2xl z-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button
                    onClick={onExit}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Выйти в меню</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/classic')}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <span>🎮</span>
                    <span>Выбор игр</span>
                  </button>
                  
                  <div className="h-px bg-white/10 my-2"></div>
                  
                  <button
                    onClick={() => window.open('/rules', '_blank')}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <span>📖</span>
                    <span>Правила игр</span>
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>Статистика</span>
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <span>🎵</span>
                    <span>Звук: Вкл</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Мобильная информация */}
        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between">
            {timer !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="text-white font-mono text-base font-bold">
                  {formatTime(timer)}
                </div>
              </div>
            )}
            
            {currentPlayer && (
              <div className="text-sm text-gray-400">
                Ход: <span className="text-cyan-300">{currentPlayer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default GameHeader;