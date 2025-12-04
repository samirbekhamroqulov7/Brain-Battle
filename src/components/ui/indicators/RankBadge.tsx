import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RANKS } from '@/types';

interface RankBadgeProps {
  rank: number;
  showLabel?: boolean;
  showElo?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  showLabel = true,
  showElo = false,
  size = 'md',
  animated = false,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Определяем ранг по ELO
  const getRankInfo = (elo: number) => {
    const rankInfo = RANKS.find(r => elo >= r.minElo && elo <= r.maxElo) || RANKS[0];
    const progress = Math.min(100, ((elo - rankInfo.minElo) / (rankInfo.maxElo - rankInfo.minElo)) * 100);
    
    return {
      ...rankInfo,
      progress: isNaN(progress) ? 100 : progress,
      nextRank: RANKS[RANKS.indexOf(rankInfo) + 1],
      eloToNext: rankInfo.maxElo - elo + 1
    };
  };
  
  const rankInfo = getRankInfo(rank);
  
  // Размеры
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };
  
  // Цвета для градиентов
  const rankGradients = {
    novice: 'from-gray-400 to-gray-600',
    apprentice: 'from-green-400 to-emerald-600',
    specialist: 'from-blue-400 to-cyan-600',
    expert: 'from-purple-400 to-violet-600',
    master: 'from-yellow-400 to-orange-600',
    grandmaster: 'from-red-400 to-pink-600'
  };
  
  const rankGlowColors = {
    novice: 'shadow-gray-500/30',
    apprentice: 'shadow-green-500/40',
    specialist: 'shadow-blue-500/40',
    expert: 'shadow-purple-500/40',
    master: 'shadow-yellow-500/40',
    grandmaster: 'shadow-red-500/40'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Анимированное свечение */}
      {animated && (
        <motion.div
          className={`absolute -inset-1 rounded-full ${rankGlowColors[rankInfo.id as keyof typeof rankGlowColors]} blur-lg`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Бейдж */}
      <div className={`
        relative
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        bg-gradient-to-br ${rankGradients[rankInfo.id as keyof typeof rankGradients]}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
        ${isHovered && onClick ? 'scale-110 shadow-xl' : 'shadow-lg'}
        border-2 border-white/20
        z-10
      `}>
        {/* Внутренний круг для премиум-вида */}
        <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm"></div>
        
        {/* Иконка */}
        <span className="relative z-10 text-white font-bold">
          {rankInfo.icon}
        </span>
        
        {/* Анимация частиц при наведении */}
        {isHovered && animated && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 120 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 120 * Math.PI) / 180) * 20,
                  opacity: [1, 0.5, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Текстовая информация */}
      {(showLabel || showElo) && (
        <div className={`text-center mt-2 ${textSizeClasses[size]}`}>
          {showLabel && (
            <div className="font-bold text-white truncate">
              {rankInfo.name}
            </div>
          )}
          
          {showElo && (
            <div className="text-gray-300 mt-1">
              {rank} ELO
            </div>
          )}
        </div>
      )}
      
      {/* Тулкит при наведении */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-white/10 shadow-2xl z-50"
        >
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">{rankInfo.name}</div>
            <div className="text-gray-300 text-sm mb-3">{rankInfo.description}</div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Ваш ELO:</span>
              <span className="text-white font-bold">{rank}</span>
            </div>
            
            {/* Прогресс до следующего ранга */}
            {rankInfo.nextRank && (
              <>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-500"
                    style={{ width: `${rankInfo.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">До {rankInfo.nextRank.name}:</span>
                  <span className="text-yellow-400 font-bold">
                    +{rankInfo.eloToNext} ELO
                  </span>
                </div>
              </>
            )}
            
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">Уровень:</div>
                <div className="text-white text-right">
                  {Math.floor(rank / 100) + 1}
                </div>
                
                <div className="text-gray-400">Процент игроков:</div>
                <div className="text-white text-right">
                  {Math.min(100, Math.floor((rank - 800) / 12))}%
                </div>
                
                <div className="text-gray-400">Позиция в рейтинге:</div>
                <div className="text-white text-right">
                  #{Math.floor(100000 / (rank / 10))}
                </div>
              </div>
            </div>
            
            {/* Кнопка деталей */}
            {onClick && (
              <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 text-xs hover:from-purple-600/30 hover:to-pink-600/30 transition-all">
                Подробнее о рангах →
              </button>
            )}
          </div>
          
          {/* Стрелка тулкита */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-white/10"></div>
          </div>
        </motion.div>
      )}
      
      {/* Индикатор анимации (для анимированных рангов) */}
      {animated && (
        <div className="absolute -inset-2">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/30 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-white/30 animate-spin animation-delay-1000"></div>
        </div>
      )}
    </div>
  );
};

export default RankBadge;