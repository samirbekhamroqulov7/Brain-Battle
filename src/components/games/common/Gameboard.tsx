import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameBoardProps {
  children: ReactNode;
  size?: number; // Размер сетки (например: 3 для 3x3, 8 для 8x8)
  cellSize?: 'sm' | 'md' | 'lg' | 'xl'; // Размер ячейки
  boardType?: 'grid' | 'hex' | 'dots' | 'custom'; // Тип доски
  interactive?: boolean; // Интерактивная ли доска
  showGrid?: boolean; // Показывать сетку
  showCoordinates?: boolean; // Показывать координаты
  animateCells?: boolean; // Анимировать появление ячеек
  onCellClick?: (row: number, col: number) => void; // Клик по ячейке
  onCellHover?: (row: number, col: number) => void; // Наведение на ячейку
  selectedCell?: [number, number] | null; // Выбранная ячейка
  highlightedCells?: Array<[number, number]>; // Подсвеченные ячейки
  disabledCells?: Array<[number, number]>; // Заблокированные ячейки
  className?: string;
  style?: React.CSSProperties;
}

const GameBoard: React.FC<GameBoardProps> = ({
  children,
  size = 3,
  cellSize = 'md',
  boardType = 'grid',
  interactive = true,
  showGrid = true,
  showCoordinates = false,
  animateCells = true,
  onCellClick,
  onCellHover,
  selectedCell,
  highlightedCells = [],
  disabledCells = [],
  className = '',
  style = {}
}) => {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  
  // Размеры ячеек
  const cellSizeClasses = {
    sm: 'w-8 h-8 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-12 h-12 md:w-16 md:h-16',
    xl: 'w-16 h-16 md:w-20 md:h-20'
  };
  
  // Цвета сетки
  const gridColor = boardType === 'dots' ? 'border-gray-700' : 'border-white/10';
  
  // Обработка клика по ячейке
  const handleCellClick = (row: number, col: number) => {
    if (!interactive) return;
    
    // Проверяем, не заблокирована ли ячейка
    const isDisabled = disabledCells.some(([r, c]) => r === row && c === col);
    if (isDisabled) return;
    
    if (onCellClick) {
      onCellClick(row, col);
    }
  };
  
  // Обработка наведения на ячейку
  const handleCellHover = (row: number, col: number) => {
    if (!interactive) return;
    
    setHoveredCell([row, col]);
    
    if (onCellHover) {
      onCellHover(row, col);
    }
  };
  
  // Проверка состояния ячейки
  const isSelected = (row: number, col: number) => {
    return selectedCell && selectedCell[0] === row && selectedCell[1] === col;
  };
  
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(([r, c]) => r === row && c === col);
  };
  
  const isDisabled = (row: number, col: number) => {
    return disabledCells.some(([r, c]) => r === row && c === col);
  };
  
  const isHovered = (row: number, col: number) => {
    return hoveredCell && hoveredCell[0] === row && hoveredCell[1] === col;
  };
  
  // Получение классов для ячейки
  const getCellClasses = (row: number, col: number) => {
    const baseClasses = `
      ${cellSizeClasses[cellSize]}
      flex items-center justify-center
      transition-all duration-200
      relative
      ${interactive && !isDisabled(row, col) ? 'cursor-pointer' : 'cursor-default'}
    `;
    
    // Классы для сетки
    if (boardType === 'grid') {
      return `
        ${baseClasses}
        border ${gridColor}
        ${showGrid ? '' : 'border-0'}
        ${isSelected(row, col) ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-2 ring-cyan-500' : ''}
        ${isHighlighted(row, col) ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : ''}
        ${isDisabled(row, col) ? 'bg-gray-900/50 opacity-50' : 'hover:bg-white/5'}
        ${isHovered(row, col) ? 'bg-white/10 scale-105' : ''}
      `;
    }
    
    // Классы для шестиугольников (Гекс)
    if (boardType === 'hex') {
      const isEvenRow = row % 2 === 0;
      const hexOffset = isEvenRow ? 'ml-8' : '';
      
      return `
        ${baseClasses}
        ${hexOffset}
        clip-hexagon
        bg-gradient-to-br from-gray-800 to-gray-900
        border border-white/10
        ${isSelected(row, col) ? '!from-cyan-500 !to-blue-500' : ''}
        ${isHighlighted(row, col) ? '!from-yellow-500 !to-orange-500' : ''}
        ${isDisabled(row, col) ? 'opacity-50' : 'hover:from-gray-700 hover:to-gray-800'}
      `;
    }
    
    // Классы для точек (Точки и квадраты)
    if (boardType === 'dots') {
      return `
        ${baseClasses}
        ${cellSize === 'sm' ? 'w-3 h-3' : cellSize === 'md' ? 'w-4 h-4' : 'w-6 h-6'}
        rounded-full
        bg-white
        ${isSelected(row, col) ? 'ring-2 ring-cyan-500 scale-125' : ''}
        ${isHighlighted(row, col) ? 'ring-2 ring-yellow-500' : ''}
      `;
    }
    
    return baseClasses;
  };
  
  // Рендер координат
  const renderCoordinates = () => {
    if (!showCoordinates) return null;
    
    return (
      <>
        {/* Буквы сверху */}
        <div className="absolute -top-8 left-0 right-0 flex justify-between px-2">
          {Array.from({ length: size }).map((_, col) => (
            <div key={`col-${col}`} className="text-gray-400 text-xs font-mono">
              {String.fromCharCode(65 + col)} {/* A, B, C... */}
            </div>
          ))}
        </div>
        
        {/* Цифры слева */}
        <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between py-2">
          {Array.from({ length: size }).map((_, row) => (
            <div key={`row-${row}`} className="text-gray-400 text-xs font-mono">
              {row + 1}
            </div>
          ))}
        </div>
      </>
    );
  };
  
  // Рендер сетки
  const renderGrid = () => {
    if (boardType === 'hex') return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Вертикальные линии */}
        {Array.from({ length: size + 1 }).map((_, col) => (
          <div
            key={`v-line-${col}`}
            className="absolute top-0 bottom-0 border-r border-white/5"
            style={{
              left: `${(col / size) * 100}%`,
              width: '1px'
            }}
          />
        ))}
        
        {/* Горизонтальные линии */}
        {Array.from({ length: size + 1 }).map((_, row) => (
          <div
            key={`h-line-${row}`}
            className="absolute left-0 right-0 border-b border-white/5"
            style={{
              top: `${(row / size) * 100}%`,
              height: '1px'
            }}
          />
        ))}
      </div>
    );
  };
  
  // Анимация появления ячеек
  const getCellAnimation = (row: number, col: number) => {
    if (!animateCells) return {};
    
    const index = row * size + col;
    const delay = index * 0.05;
    
    return {
      initial: { opacity: 0, scale: 0.8, rotate: -5 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: { 
          delay,
          type: "spring",
          stiffness: 200,
          damping: 15
        }
      },
      exit: { opacity: 0, scale: 0.8 }
    };
  };
  
  return (
    <div className={`relative ${className}`} style={style}>
      
      {/* Контейнер доски */}
      <div 
        className={`
          relative
          ${boardType === 'hex' ? 'grid grid-cols-6 gap-2' : 'grid'}
          ${boardType === 'dots' ? 'gap-4' : 'gap-0'}
          ${boardType === 'grid' ? `grid-cols-${size}` : ''}
          bg-gradient-to-br from-gray-900/50 to-gray-800/50
          rounded-xl
          p-4
          border border-white/10
          shadow-2xl
        `}
        style={{
          gridTemplateColumns: boardType === 'grid' ? `repeat(${size}, minmax(0, 1fr))` : undefined
        }}
      >
        
        {/* Фоновый узор */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-3xl"></div>
        </div>
        
        {/* Сетка */}
        {showGrid && renderGrid()}
        
        {/* Координаты */}
        {renderCoordinates()}
        
        {/* Ячейки */}
        <AnimatePresence>
          {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => (
              <motion.div
                key={`cell-${row}-${col}`}
                {...getCellAnimation(row, col)}
                className={getCellClasses(row, col)}
                onClick={() => handleCellClick(row, col)}
                onMouseEnter={() => handleCellHover(row, col)}
                onMouseLeave={() => setHoveredCell(null)}
                whileHover={interactive && !isDisabled(row, col) ? { scale: 1.05 } : {}}
                whileTap={interactive && !isDisabled(row, col) ? { scale: 0.95 } : {}}
              >
                {/* Контент ячейки */}
                {children}
                
                {/* Индикатор выбора */}
                {isSelected(row, col) && (
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-500 rounded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
                
                {/* Индикатор подсветки */}
                {isHighlighted(row, col) && !isSelected(row, col) && (
                  <div className="absolute inset-0 border border-yellow-500/50 rounded animate-pulse"></div>
                )}
                
                {/* Индикатор наведения */}
                {isHovered(row, col) && interactive && !isDisabled(row, col) && (
                  <div className="absolute inset-0 border border-white/30 rounded transition-all"></div>
                )}
                
                {/* Индикатор блокировки */}
                {isDisabled(row, col) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded flex items-center justify-center">
                    <div className="w-4 h-4 text-gray-600">✕</div>
                  </div>
                )}
                
                {/* Номер ячейки (для отладки) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute bottom-0 right-0 text-[6px] text-gray-600">
                    {row},{col}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {/* Легенда (для некоторых типов досок) */}
        {boardType === 'hex' && (
          <div className="absolute -bottom-10 left-0 right-0 text-center text-gray-500 text-xs">
            Шестиугольная доска • Используется в игре Гекс
          </div>
        )}
        
        {boardType === 'dots' && (
          <div className="absolute -bottom-10 left-0 right-0 text-center text-gray-500 text-xs">
            Сетка точек • Соединяйте точки, чтобы захватывать квадраты
          </div>
        )}
      </div>
      
      {/* Информационная панель */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div>
          Размер: {size}×{size}
        </div>
        
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span>Выбрано: </span>
            <span className="text-white font-mono">
              ({hoveredCell[0] + 1}, {hoveredCell[1] + 1})
            </span>
            <span className="text-xs">
              {String.fromCharCode(65 + hoveredCell[1])}{hoveredCell[0] + 1}
            </span>
          </motion.div>
        )}
        
        <div className="flex items-center gap-2">
          {selectedCell && (
            <span className="text-cyan-400">
              Выбрана ячейка
            </span>
          )}
          {highlightedCells.length > 0 && (
            <span className="text-yellow-400">
              {highlightedCells.length} подсвечено
            </span>
          )}
        </div>
      </div>
      
      {/* Инструкция по взаимодействию */}
      {interactive && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {boardType === 'grid' && 'Кликните по ячейке, чтобы выбрать'}
          {boardType === 'hex' && 'Кликните по шестиугольнику, чтобы поставить фишку'}
          {boardType === 'dots' && 'Соединяйте точки, кликая между ними'}
        </div>
      )}
    </div>
  );
};

export default GameBoard;