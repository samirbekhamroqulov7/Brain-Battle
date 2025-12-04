import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  time: number; // время в секундах
  isActive: boolean;
  onTimeUp?: () => void;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  showWarning?: boolean;
  warningThreshold?: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  time,
  isActive,
  onTimeUp,
  color = 'red',
  size = 'md',
  showWarning = true,
  warningThreshold = 30,
  className = ''
}) => {
  const [displayTime, setDisplayTime] = useState(time);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previousTimeRef = useRef(time);
  
  // Цвета для таймера
  const colorClasses = {
    red: 'bg-gradient-to-br from-red-500 to-pink-600',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600',
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    yellow: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-600',
    cyan: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  };
  
  const colorText = {
    red: 'text-red-300',
    green: 'text-green-300',
    blue: 'text-blue-300',
    yellow: 'text-yellow-300',
    purple: 'text-purple-300',
    cyan: 'text-cyan-300'
  };
  
  const colorGlow = {
    red: 'shadow-red-500/40',
    green: 'shadow-green-500/40',
    blue: 'shadow-blue-500/40',
    yellow: 'shadow-yellow-500/40',
    purple: 'shadow-purple-500/40',
    cyan: 'shadow-cyan-500/40'
  };
  
  // Размеры
  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-20 h-20 text-xl',
    lg: 'w-24 h-24 text-2xl'
  };
  
  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Процент оставшегося времени для прогресс-бара
  const getPercentage = () => {
    const maxTime = 180; // 3 минуты по умолчанию
    return (displayTime / maxTime) * 100;
  };
  
  // Запуск/остановка таймера
  useEffect(() => {
    if (isActive && displayTime > 0) {
      timerRef.current = setInterval(() => {
        setDisplayTime(prev => {
          const newTime = prev - 1;
          
          // Проверка на предупреждение
          if (showWarning) {
            setIsWarning(newTime <= warningThreshold);
            setIsCritical(newTime <= 10);
          }
          
          // Время вышло
          if (newTime <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, displayTime, onTimeUp, showWarning, warningThreshold]);
  
  // Сброс таймера при изменении начального времени
  useEffect(() => {
    if (time !== previousTimeRef.current) {
      setDisplayTime(time);
      previousTimeRef.current = time;
      
      // Сброс состояний предупреждения
      setIsWarning(false);
      setIsCritical(false);
    }
  }, [time]);
  
  // Анимация тиканья для критического времени
  const [tick, setTick] = useState(false);
  useEffect(() => {
    if (isCritical && isActive) {
      const interval = setInterval(() => {
        setTick(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCritical, isActive]);
  
  return (
    <div className={`relative inline-block ${className}`}>
      
      {/* Внешний круг с прогрессом */}
      <div className={`relative ${sizeClasses[size]} rounded-full ${colorClasses[color]} shadow-lg`}>
        
        {/* Внутренний круг */}
        <div className="absolute inset-2 rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          
          {/* Отображаемое время */}
          <motion.div
            key={displayTime}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
            className={`font-mono font-bold ${colorText[color]} ${
              isCritical && tick ? 'text-white' : ''
            }`}
          >
            {formatTime(displayTime)}
          </motion.div>
          
          {/* Анимация тиканья для критического времени */}
          {isCritical && isActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
              
              {/* Вспышки */}
              {tick && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </>
          )}
        </div>
        
        {/* Прогресс-бар */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={Math.PI * 90}
            strokeDashoffset={Math.PI * 90 * (1 - getPercentage() / 100)}
            className={`${
              isCritical ? 'text-red-500' :
              isWarning ? 'text-yellow-500' :
              color === 'red' ? 'text-red-400/30' :
              color === 'green' ? 'text-green-400/30' :
              color === 'blue' ? 'text-blue-400/30' :
              color === 'yellow' ? 'text-yellow-400/30' :
              color === 'purple' ? 'text-purple-400/30' :
              'text-cyan-400/30'
            }`}
          />
        </svg>
        
        {/* Свечение при активности */}
        {isActive && (
          <motion.div
            className={`absolute -inset-1 rounded-full ${colorGlow[color]} blur-sm`}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}
        
        {/* Индикатор активности */}
        {isActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900"
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
      </div>
      
      {/* Текстовая информация под таймером */}
      <div className="text-center mt-2">
        <div className={`text-xs ${colorText[color]}`}>
          {isCritical ? 'ВРЕМЯ НА ИСХОДЕ!' :
           isWarning ? 'Поторопитесь!' :
           isActive ? 'Ход активен' : 'Ожидание'}
        </div>
        
        {/* Прогресс-бар под таймером (для мобильных) */}
        <div className="w-full h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
          <motion.div
            className={`h-full ${
              isCritical ? 'bg-gradient-to-r from-red-500 to-pink-500' :
              isWarning ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              color === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
              color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${getPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Анимация времени (для плавного уменьшения) */}
      <motion.div
        key={`time-${displayTime}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400"
      >
        {displayTime < time ? `-${time - displayTime}s` : ''}
      </motion.div>
    </div>
  );
};

export default Timer;