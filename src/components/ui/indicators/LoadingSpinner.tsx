import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray';
  text?: string;
  showText?: boolean;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text = 'Загрузка...',
  showText = false,
  fullScreen = false,
  className = ''
}) => {
  // Размеры спиннера
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  // Цвета спиннера
  const colorClasses = {
    primary: 'border-purple-500 border-t-transparent',
    secondary: 'border-pink-500 border-t-transparent',
    accent: 'border-cyan-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };

  // Цвета текста
  const textColorClasses = {
    primary: 'text-purple-300',
    secondary: 'text-pink-300',
    accent: 'text-cyan-300',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm z-50">
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}></div>
        {showText && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 ${textColorClasses[color]} text-sm font-medium`}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center justify-center">
      <div className="relative">
        {/* Основной спиннер */}
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}></div>
        
        {/* Дополнительные анимации */}
        {size === 'lg' || size === 'xl' ? (
          <>
            {/* Внутренний спиннер */}
            <div className={`absolute inset-2 border-2 ${colorClasses[color]} rounded-full animate-spin animation-delay-500`}></div>
            
            {/* Точки */}
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  color === 'primary' ? 'bg-purple-500' :
                  color === 'secondary' ? 'bg-pink-500' :
                  color === 'accent' ? 'bg-cyan-500' :
                  color === 'white' ? 'bg-white' : 'bg-gray-400'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos((i * 120 * Math.PI) / 180) * 12,
                  y: Math.sin((i * 120 * Math.PI) / 180) * 12
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </>
        ) : null}
      </div>
      
      {showText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`mt-2 ${textColorClasses[color]} text-xs font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;