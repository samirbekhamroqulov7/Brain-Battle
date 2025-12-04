export default function MobileLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 safe-padding">
      <div className="relative">
        {/* Основной спиннер */}
        <div className="w-16 h-16 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin" />
        
        {/* Второй слой для красоты */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary-500 rounded-full animate-spin animation-delay-500" />
      </div>
      
      <p className="mt-6 text-gray-300 text-center animate-pulse">
        Загрузка...
      </p>
      
      {/* Индикатор для мобильных */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
            style={{ animation: 'shimmer 2s infinite linear' }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Оптимизация для мобильных устройств
        </p>
      </div>
    </div>
  )
}