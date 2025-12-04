import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuButtonProps {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  icon: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  gradient: string; // Tailwind градиент: from-color to-color
  hoverGradient?: string;
  iconColor?: string;
  pulse?: boolean;
  badge?: React.ReactNode;
  loading?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  id,
  title,
  subtitle,
  description,
  icon,
  onClick,
  isActive = false,
  disabled = false,
  gradient,
  hoverGradient,
  iconColor = 'text-white',
  pulse = false,
  badge,
  loading = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    // Создаем ripple эффект
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // Удаляем ripple через 600ms
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);
    
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Контур при активности */}
      {isActive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
      )}
      
      {/* Пульсация */}
      {pulse && !disabled && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}

      <button
        id={id}
        onClick={handleClick}
        disabled={disabled || loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className={`
          relative
          w-full
          p-5 md:p-6
          rounded-2xl
          flex items-center justify-between
          transition-all duration-300
          overflow-hidden
          ${disabled 
            ? 'cursor-not-allowed opacity-60' 
            : 'cursor-pointer transform active:scale-[0.98]'
          }
          ${isPressed ? 'scale-[0.98]' : ''}
          ${isHovered && !disabled ? `shadow-2xl shadow-purple-500/20` : 'shadow-lg'}
          bg-gradient-to-r ${gradient}
          ${hoverGradient && isHovered && !disabled ? `hover:bg-gradient-to-r ${hoverGradient}` : ''}
          border-2 ${isActive ? 'border-white/40' : 'border-white/10'}
          group
        `}
      >
        {/* Ripple эффекты */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute rounded-full bg-white"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Внутренний градиент при наведении */}
        {isHovered && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        )}

        {/* Левый блок: текст */}
        <div className="relative z-10 text-left flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`
              text-2xl md:text-3xl
              transition-transform duration-300
              ${isHovered && !disabled ? 'scale-110' : ''}
              ${iconColor}
            `}>
              {icon}
            </div>
            
            <div>
              <h2 className={`
                text-xl md:text-2xl font-bold
                text-white
                transition-all duration-300
                ${isHovered && !disabled ? 'tracking-wide' : ''}
              `}>
                {title}
              </h2>
              
              <p className="text-white/90 text-sm md:text-base mt-1">
                {subtitle}
              </p>
            </div>
          </div>
          
          {description && (
            <p className="text-white/70 text-xs md:text-sm mt-2 leading-relaxed max-w-md">
              {description}
            </p>
          )}
        </div>

        {/* Правый блок: иконка и бейдж */}
        <div className="relative z-10 flex flex-col items-end gap-3">
          {badge && (
            <div className="animate-bounce">
              {badge}
            </div>
          )}
          
          {/* Иконка стрелки */}
          <motion.div
            animate={{ 
              x: isHovered && !disabled ? 5 : 0 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`
              w-10 h-10 md:w-12 md:h-12
              rounded-full
              flex items-center justify-center
              text-lg md:text-xl
              bg-white/10
              backdrop-blur-sm
              border border-white/20
              ${disabled ? 'opacity-50' : ''}
            `}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="text-white">→</span>
            )}
          </motion.div>
          
          {/* Индикатор загрузки */}
          {loading && (
            <div className="text-xs text-white/70 animate-pulse">
              Загрузка...
            </div>
          )}
        </div>

        {/* Светящаяся обводка при наведении */}
        <div className={`
          absolute inset-0 rounded-2xl
          border-2 border-transparent
          transition-all duration-500
          ${isHovered && !disabled 
            ? 'border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
            : ''
          }
        `}></div>
      </button>

      {/* Анимация частиц при наведении */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: -10,
                opacity: 0
              }}
              animate={{
                y: ['0%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity
              }}
              style={{
                left: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MenuButton;