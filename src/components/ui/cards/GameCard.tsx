import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameConfig } from '@/types';

interface GameCardProps {
  game: GameConfig;
  onClick: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  isSelected = false,
  disabled = false,
  showDetails = false,
  compact = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-lime-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-orange-500';
      case 5: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getPlayersText = (players: number) => {
    return players === 1 ? '1 игрок' : `${players} игрока`;
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      puzzle: '🧩',
      strategy: '♟️',
      math: '🧮',
      words: '📝',
      logic: '🔍'
    };
    return icons[category] || '🎮';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!disabled ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative"
    >
      {/* Выделение при выборе */}
      {isSelected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-40"></div>
      )}
      
      {/* Карточка */}
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative
          w-full
          ${compact ? 'p-4' : 'p-5 md:p-6'}
          rounded-2xl
          text-left
          transition-all duration-300
          overflow-hidden
          group
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${isSelected 
            ? 'border-2 border-white/50 shadow-2xl shadow-purple-500/30' 
            : 'border border-white/10 shadow-lg'
          }
          ${game.colorScheme || 'bg-gradient-to-br from-gray-800 to-gray-900'}
          hover:shadow-2xl hover:shadow-purple-500/20
        `}
      >
        {/* Фоновый узор */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-purple-500/20 blur-2xl"></div>
        </div>
        
        {/* Верхняя часть: иконка и название */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              ${compact ? 'w-12 h-12 text-2xl' : 'w-16 h-16 text-3xl'}
              rounded-xl
              flex items-center justify-center
              bg-gradient-to-br from-white/10 to-white/5
              backdrop-blur-sm
              border border-white/10
              group-hover:border-white/20
              transition-all duration-300
              ${isHovered && !disabled ? 'scale-110' : ''}
            `}>
              {getCategoryIcon(game.category)}
            </div>
            
            <div>
              <h3 className={`
                ${compact ? 'text-lg' : 'text-xl md:text-2xl'}
                font-bold text-white
                transition-all duration-300
                ${isHovered && !disabled ? 'tracking-wide' : ''}
              `}>
                {game.name}
              </h3>
              
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/70 text-sm">
                  {getPlayersText(game.players)}
                </span>
                
                {/* Сложность */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i < game.difficulty ? getDifficultyColor(game.difficulty) : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Время */}
          {!compact && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">
                {Math.floor(game.timeLimit / 60)}:{(game.timeLimit % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
        
        {/* Описание (только в расширенном режиме) */}
        {!compact && (
          <p className="relative z-10 text-white/80 text-sm md:text-base mb-6 leading-relaxed">
            {game.description}
          </p>
        )}
        
        {/* Нижняя часть: метки и кнопка */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Категория */}
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${getCategoryColor(game.category)}
              backdrop-blur-sm
            `}>
              {getCategoryName(game.category)}
            </span>
            
            {/* Компактное время */}
            {compact && (
              <span className="px-2 py-1 rounded text-xs bg-black/30 text-white/70">
                {Math.floor(game.timeLimit / 60)}мин
              </span>
            )}
          </div>
          
          {/* Индикатор выбора/играть */}
          <div className={`
            ${compact ? 'w-8 h-8' : 'w-10 h-10'}
            rounded-full
            flex items-center justify-center
            text-white
            transition-all duration-300
            ${isSelected 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110' 
              : 'bg-gradient-to-r from-white/10 to-white/5 group-hover:from-white/20'
            }
            border border-white/10
            group-hover:border-white/20
          `}>
            {isSelected ? (
              <span className="text-lg">✓</span>
            ) : (
              <motion.span
                animate={isHovered && !disabled ? { x: 3 } : { x: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                →
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Анимированная граница при наведении */}
        {isHovered && !disabled && (
          <div className="absolute inset-0 rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(168,85,247,0.3)]"></div>
        )}
      </button>
    </motion.div>
  );
};

// Вспомогательные функции
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    puzzle: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    strategy: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    math: 'bg-green-500/20 text-green-300 border border-green-500/30',
    words: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    logic: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
  };
  return colors[category] || 'bg-gray-500/20 text-gray-300';
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    puzzle: 'Головоломка',
    strategy: 'Стратегия',
    math: 'Математика',
    words: 'Слова',
    logic: 'Логика'
  };
  return names[category] || 'Игра';
}

export default GameCard;