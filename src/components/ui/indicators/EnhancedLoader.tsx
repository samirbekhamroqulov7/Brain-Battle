import { motion } from 'framer-motion'

interface EnhancedLoaderProps {
  message?: string
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
  type?: 'spinner' | 'dots' | 'pulse' | 'brain'
}

export default function EnhancedLoader({ 
  message = 'Загрузка...', 
  fullScreen = true,
  size = 'md',
  type = 'brain'
}: EnhancedLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const LoaderSpinner = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin`} />
      <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-secondary-500 rounded-full animate-spin animation-delay-500`} />
    </div>
  )

  const LoaderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </div>
  )

  const LoaderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  )

  const LoaderBrain = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Внешний круг */}
        <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full animate-ping" />
        
        {/* Средний круг */}
        <div className="absolute inset-2 border-4 border-secondary-500/40 rounded-full animate-ping animation-delay-200" />
        
        {/* Внутренний круг */}
        <div className="absolute inset-4 border-4 border-accent-500/50 rounded-full animate-ping animation-delay-400" />
        
        {/* Иконка мозга */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4C8 4 4 7 4 11C4 14 6 16 8 17C8 18 7 20 5 21C7 22 9 23 12 23C15 23 17 22 19 21C17 20 16 18 16 17C18 16 20 14 20 11C20 7 16 4 12 4Z"
              fill="url(#brain-gradient)"
            />
            <path
              d="M9 10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10Z"
              fill="white"
            />
            <path
              d="M17 10C17 10.5523 16.5523 11 16 11C15.4477 11 15 10.5523 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10Z"
              fill="white"
            />
            <defs>
              <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Партиклы */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-500 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
          animate={{
            rotate: i * 45,
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )

  const LoaderComponent = {
    spinner: LoaderSpinner,
    dots: LoaderDots,
    pulse: LoaderPulse,
    brain: LoaderBrain,
  }[type]

  const Component = LoaderComponent as () => JSX.Element

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Component />
      {message && (
        <motion.p
          className="text-gray-300 text-center text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
      
      {/* Прогресс бар для долгих загрузок */}
      <div className="w-48 md:w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm safe-padding">
        {content}
        
        {/* Индикатор для мобильных */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-gray-500">
            {navigator.userAgent.includes('Mobile') ? 'Коснитесь для продолжения' : 'Загрузка...'}
          </p>
        </div>
      </div>
    )
  }

  return content
}