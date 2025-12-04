import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useStore, gameActions } from '@/lib/state/store';
import GameHeader from '@/components/games/common/GameHeader';
import Timer from '@/components/games/common/Timer';
import { DotsAndBoxesState } from '@/types';

interface DotsAndBoxesGameProps {
  isMultiplayer?: boolean;
  opponentName?: string;
  onGameEnd?: (result: any) => void;
  gridSize?: number; // 3 = 3x3 квадрата (4x4 точки)
}

const DotsAndBoxesGame: React.FC<DotsAndBoxesGameProps> = ({
  isMultiplayer = false,
  opponentName = 'Соперник',
  onGameEnd,
  gridSize = 3
}) => {
  const router = useRouter();
  const player = useStore(state => state.player);
  const [gameState, setGameState] = useState<DotsAndBoxesState>(initializeGame());
  const [hoveredLine, setHoveredLine] = useState<{ type: 'h' | 'v'; row: number; col: number } | null>(null);
  const [playerTime, setPlayerTime] = useState(120);
  const [opponentTime, setOpponentTime] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [chainReaction, setChainReaction] = useState(false);
  const [lastCapturedBox, setLastCapturedBox] = useState<[number, number] | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  const points = gridSize + 1; // Количество точек по каждому измерению
  const boxes = gridSize; // Количество квадратов по каждому измерению

  // Инициализация игры
  function initializeGame(): DotsAndBoxesState {
    return {
      gridSize,
      horizontalLines: Array(points - 1).fill(null).map(() => Array(points).fill(false)),
      verticalLines: Array(points).fill(null).map(() => Array(points - 1).fill(false)),
      boxes: Array(boxes).fill(null).map(() => Array(boxes).fill(null)),
      currentPlayer: player?.id || 'player1',
      scores: {
        [player?.id || 'player1']: 0,
        [isMultiplayer ? 'opponent' : 'player2']: 0
      },
      lastBoxCaptured: false
    };
  }

  // Получение цвета игрока
  const getPlayerColor = (playerId: string) => {
    return playerId === (player?.id || 'player1')
      ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
      : 'bg-gradient-to-br from-purple-400 to-pink-500';
  };

  const getPlayerName = (playerId: string) => {
    return playerId === (player?.id || 'player1')
      ? (player?.name || 'Игрок 1')
      : opponentName;
  };

  // Проверка завершения игры
  const checkGameOver = useCallback(() => {
    const totalBoxes = boxes * boxes;
    const filledBoxes = gameState.boxes.flat().filter(box => box !== null).length;
    
    if (filledBoxes === totalBoxes) {
      const player1Score = gameState.scores[player?.id || 'player1'] || 0;
      const player2Score = gameState.scores[isMultiplayer ? 'opponent' : 'player2'] || 0;
      
      let newWinner: string | null = null;
      if (player1Score > player2Score) newWinner = player?.id || 'player1';
      else if (player2Score > player1Score) newWinner = isMultiplayer ? 'opponent' : 'player2';
      
      setGameOver(true);
      setWinner(newWinner);
      setPlayerScore(player1Score);
      setOpponentScore(player2Score);
      
      if (onGameEnd) {
        onGameEnd({
          winner: newWinner,
          reason: newWinner ? 'win' : 'draw',
          scores: gameState.scores
        });
      }
      
      // Сохраняем результат в сторе
      if (player && newWinner === player.id) {
        const result = {
          winner: player.id,
          reason: 'win' as const,
          scores: gameState.scores
        };
        gameActions.endGame(result);
      }
      
      return true;
    }
    return false;
  }, [gameState, player, isMultiplayer, onGameEnd, boxes]);

  // Проверка захвата квадрата
  const checkBoxCapture = useCallback((row: number, col: number, playerId: string) => {
    // Проверяем все 4 стороны квадрата
    const top = gameState.horizontalLines[row][col];
    const bottom = gameState.horizontalLines[row + 1][col];
    const left = gameState.verticalLines[row][col];
    const right = gameState.verticalLines[row][col + 1];
    
    if (top && bottom && left && right && gameState.boxes[row][col] === null) {
      // Квадрат захвачен!
      const newBoxes = [...gameState.boxes.map(r => [...r])];
      newBoxes[row][col] = playerId;
      
      const newScores = { ...gameState.scores };
      newScores[playerId] = (newScores[playerId] || 0) + 1;
      
      setLastCapturedBox([row, col]);
      
      setGameState(prev => ({
        ...prev,
        boxes: newBoxes,
        scores: newScores,
        lastBoxCaptured: true
      }));
      
      // Обновляем счет
      if (playerId === (player?.id || 'player1')) {
        setPlayerScore(newScores[playerId]);
      } else {
        setOpponentScore(newScores[playerId]);
      }
      
      return true;
    }
    return false;
  }, [gameState, player]);

  // Обработка хода
  const handleLineClick = (type: 'h' | 'v', row: number, col: number) => {
    if (gameOver || chainReaction) return;
    
    // Проверяем, что линия свободна
    if (
      (type === 'h' && gameState.horizontalLines[row][col]) ||
      (type === 'v' && gameState.verticalLines[row][col])
    ) {
      return;
    }
    
    // Обновляем линии
    const newHorizontalLines = [...gameState.horizontalLines.map(r => [...r])];
    const newVerticalLines = [...gameState.verticalLines.map(r => [...r])];
    
    if (type === 'h') {
      newHorizontalLines[row][col] = true;
    } else {
      newVerticalLines[row][col] = true;
    }
    
    const moveRecord = {
      type: 'line',
      player: gameState.currentPlayer,
      lineType: type,
      position: [row, col],
      timestamp: Date.now()
    };
    
    setMoveHistory(prev => [...prev, moveRecord]);
    
    // Проверяем захват квадратов
    let capturedBox = false;
    
    if (type === 'h') {
      // Проверяем квадрат выше и ниже горизонтальной линии
      if (row > 0) capturedBox = checkBoxCapture(row - 1, col, gameState.currentPlayer) || capturedBox;
      if (row < boxes) capturedBox = checkBoxCapture(row, col, gameState.currentPlayer) || capturedBox;
    } else {
      // Проверяем квадрат слева и справа от вертикальной линии
      if (col > 0) capturedBox = checkBoxCapture(row, col - 1, gameState.currentPlayer) || capturedBox;
      if (col < boxes) capturedBox = checkBoxCapture(row, col, gameState.currentPlayer) || capturedBox;
    }
    
    // Если квадрат захвачен, тот же игрок ходит снова
    if (!capturedBox) {
      // Меняем игрока
      const nextPlayer = gameState.currentPlayer === (player?.id || 'player1')
        ? (isMultiplayer ? 'opponent' : 'player2')
        : (player?.id || 'player1');
      
      setGameState(prev => ({
        ...prev,
        horizontalLines: newHorizontalLines,
        verticalLines: newVerticalLines,
        currentPlayer: nextPlayer,
        lastBoxCaptured: false
      }));
      
      // Обновляем таймер
      if (gameState.currentPlayer === (player?.id || 'player1')) {
        setPlayerTime(prev => Math.max(0, prev - 1));
      } else {
        setOpponentTime(prev => Math.max(0, prev - 1));
      }
    } else {
      // Оставляем того же игрока для следующего хода
      setGameState(prev => ({
        ...prev,
        horizontalLines: newHorizontalLines,
        verticalLines: newVerticalLines
      }));
      
      // Цепная реакция захвата
      setChainReaction(true);
      setTimeout(() => {
        setChainReaction(false);
        // Проверяем завершение игры
        checkGameOver();
      }, 500);
    }
  };

  // Рендер точки
  const renderDot = (row: number, col: number) => {
    return (
      <div
        key={`dot-${row}-${col}`}
        className="absolute w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: `${(col / boxes) * 100}%`,
          top: `${(row / boxes) * 100}%`
        }}
      />
    );
  };

  // Рендер горизонтальной линии
  const renderHorizontalLine = (row: number, col: number) => {
    const isDrawn = gameState.horizontalLines[row][col];
    const isHovered = hoveredLine?.type === 'h' && hoveredLine.row === row && hoveredLine.col === col;
    
    const lineClasses = `
      absolute h-1
      transform -translate-y-1/2
      transition-all duration-200
      ${isDrawn 
        ? getPlayerColor(gameState.currentPlayer) + ' cursor-default' 
        : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
      }
      ${isHovered && !isDrawn ? 'scale-110' : ''}
      ${chainReaction ? 'animate-pulse' : ''}
    `;
    
    return (
      <button
        key={`h-${row}-${col}`}
        className={lineClasses}
        style={{
          left: `${(col / boxes) * 100}%`,
          top: `${((row + 0.5) / boxes) * 100}%`,
          width: `${(1 / boxes) * 100}%`
        }}
        onClick={() => handleLineClick('h', row, col)}
        disabled={isDrawn || gameOver || chainReaction}
        onMouseEnter={() => setHoveredLine({ type: 'h', row, col })}
        onMouseLeave={() => setHoveredLine(null)}
      >
        {/* Эффект при наведении */}
        {!isDrawn && (
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        )}
        
        {/* Индикатор последнего хода */}
        {moveHistory.length > 0 && 
         moveHistory[moveHistory.length - 1].lineType === 'h' &&
         moveHistory[moveHistory.length - 1].position[0] === row &&
         moveHistory[moveHistory.length - 1].position[1] === col && (
          <div className="absolute inset-0 border-2 border-yellow-400 animate-ping"></div>
        )}
      </button>
    );
  };

  // Рендер вертикальной линии
  const renderVerticalLine = (row: number, col: number) => {
    const isDrawn = gameState.verticalLines[row][col];
    const isHovered = hoveredLine?.type === 'v' && hoveredLine.row === row && hoveredLine.col === col;
    
    const lineClasses = `
      absolute w-1
      transform -translate-x-1/2
      transition-all duration-200
      ${isDrawn 
        ? getPlayerColor(gameState.currentPlayer) + ' cursor-default' 
        : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
      }
      ${isHovered && !isDrawn ? 'scale-110' : ''}
      ${chainReaction ? 'animate-pulse' : ''}
    `;
    
    return (
      <button
        key={`v-${row}-${col}`}
        className={lineClasses}
        style={{
          left: `${((col + 0.5) / boxes) * 100}%`,
          top: `${(row / boxes) * 100}%`,
          height: `${(1 / boxes) * 100}%`
        }}
        onClick={() => handleLineClick('v', row, col)}
        disabled={isDrawn || gameOver || chainReaction}
        onMouseEnter={() => setHoveredLine({ type: 'v', row, col })}
        onMouseLeave={() => setHoveredLine(null)}
      >
        {/* Эффект при наведении */}
        {!isDrawn && (
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        )}
        
        {/* Индикатор последнего хода */}
        {moveHistory.length > 0 && 
         moveHistory[moveHistory.length - 1].lineType === 'v' &&
         moveHistory[moveHistory.length - 1].position[0] === row &&
         moveHistory[moveHistory.length - 1].position[1] === col && (
          <div className="absolute inset-0 border-2 border-yellow-400 animate-ping"></div>
        )}
      </button>
    );
  };

  // Рендер квадрата
  const renderBox = (row: number, col: number) => {
    const owner = gameState.boxes[row][col];
    const isLastCaptured = lastCapturedBox && lastCapturedBox[0] === row && lastCapturedBox[1] === col;
    
    return (
      <div
        key={`box-${row}-${col}`}
        className="absolute"
        style={{
          left: `${(col / boxes) * 100}%`,
          top: `${(row / boxes) * 100}%`,
          width: `${(1 / boxes) * 100}%`,
          height: `${(1 / boxes) * 100}%`
        }}
      >
        {/* Заполненный квадрат */}
        {owner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-full h-full ${getPlayerColor(owner)} rounded-lg flex items-center justify-center`}
          >
            <span className="text-white text-xl font-bold">
              {owner === (player?.id || 'player1') ? 'P1' : 'P2'}
            </span>
          </motion.div>
        )}
        
        {/* Анимация последнего захвата */}
        {isLastCaptured && (
          <motion.div
            className="absolute inset-0 border-4 border-yellow-400 rounded-lg"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setLastCapturedBox(null)}
          />
        )}
        
        {/* Номер квадрата (для отладки) */}
        {!owner && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-700 text-xs">
              {row * boxes + col + 1}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Сброс игры
  const resetGame = () => {
    setGameState(initializeGame());
    setGameOver(false);
    setWinner(null);
    setPlayerTime(120);
    setOpponentTime(120);
    setMoveHistory([]);
    setPlayerScore(0);
    setOpponentScore(0);
    setLastCapturedBox(null);
  };

  // Выход из игры
  const exitGame = () => {
    if (isMultiplayer && !gameOver) {
      if (window.confirm('Вы уверены, что хотите сдаться?')) {
        gameActions.surrender();
      }
    } else {
      router.back();
    }
  };

  // Таймер
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      if (gameState.currentPlayer === (player?.id || 'player1')) {
        setPlayerTime(prev => {
          if (prev <= 0) {
            setGameOver(true);
            setWinner(isMultiplayer ? 'opponent' : 'player2');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setOpponentTime(prev => {
          if (prev <= 0) {
            setGameOver(true);
            setWinner(player?.id || 'player1');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.currentPlayer, gameOver, player, isMultiplayer]);

  // Проверка завершения игры при изменении состояния
  useEffect(() => {
    if (!chainReaction) {
      checkGameOver();
    }
  }, [gameState.boxes, chainReaction, checkGameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900">
      
      {/* Заголовок игры */}
      <GameHeader
        gameName="Точки и квадраты"
        onExit={exitGame}
        onReset={resetGame}
        showReset={!isMultiplayer}
        showExit={true}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Левая панель: Игрок 1 */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-full
                    ${getPlayerColor(player?.id || 'player1')}
                    flex items-center justify-center
                    text-white text-2xl font-bold
                    shadow-xl
                    ${gameState.currentPlayer === (player?.id || 'player1') ? 'ring-4 ring-cyan-300 ring-offset-4 ring-offset-gray-900' : ''}
                  `}>
                    P1
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {getPlayerName(player?.id || 'player1')}
                    </h3>
                    <p className="text-cyan-300 text-sm">Счет: {playerScore}</p>
                  </div>
                </div>
                
                <Timer
                  time={playerTime}
                  isActive={gameState.currentPlayer === (player?.id || 'player1') && !gameOver}
                  color="cyan"
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-white/80">
                  <div className="text-sm text-gray-400 mb-1">Следующий ход:</div>
                  <div className="text-lg font-bold">
                    {gameState.lastBoxCaptured ? 'Дополнительный ход!' : 'Нарисуйте линию'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  {gameState.currentPlayer === (player?.id || 'player1') 
                    ? 'Ваш ход!' 
                    : 'Ждите хода соперника'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Центральная панель: Игровое поле */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
              
              {/* Статус игры */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 rounded-xl text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30"
                  >
                    <div className="text-4xl mb-4">
                      {winner ? (winner === (player?.id || 'player1') ? '🏆' : '🎉') : '🤝'}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {winner 
                        ? `Победил ${getPlayerName(winner)}!` 
                        : 'Ничья!'}
                    </h2>
                    <p className="text-gray-300">
                      Счет: {playerScore} - {opponentScore}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Игровое поле */}
              <div className="relative aspect-square max-w-2xl mx-auto">
                {/* Точки */}
                <div className="absolute inset-0">
                  {Array.from({ length: points }).map((_, row) =>
                    Array.from({ length: points }).map((_, col) =>
                      renderDot(row, col)
                    )
                  )}
                </div>
                
                {/* Горизонтальные линии */}
                <div className="absolute inset-0">
                  {Array.from({ length: boxes }).map((_, row) =>
                    Array.from({ length: points }).map((_, col) =>
                      renderHorizontalLine(row, col)
                    )
                  )}
                </div>
                
                {/* Вертикальные линии */}
                <div className="absolute inset-0">
                  {Array.from({ length: points }).map((_, row) =>
                    Array.from({ length: boxes }).map((_, col) =>
                      renderVerticalLine(row, col)
                    )
                  )}
                </div>
                
                {/* Квадраты */}
                <div className="absolute inset-0">
                  {Array.from({ length: boxes }).map((_, row) =>
                    Array.from({ length: boxes }).map((_, col) =>
                      renderBox(row, col)
                    )
                  )}
                </div>
                
                {/* Сетка (фон) */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-lg"></div>
              </div>
              
              {/* Инструкция */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-white/10">
                <h4 className="text-white font-bold mb-2">Как играть:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>1. По очереди соединяйте соседние точки линией</li>
                  <li>2. Если вы замыкаете квадрат, он становится вашим</li>
                  <li>3. Захваченный квадрат дает дополнительный ход</li>
                  <li>4. Побеждает игрок с наибольшим количеством квадратов</li>
                  <li>5. Избегайте давать сопернику возможность захвата нескольких квадратов за один ход</li>
                </ul>
              </div>
              
              {/* Статистика */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-gray-400 text-sm">Всего квадратов</div>
                  <div className="text-white text-2xl font-bold">{boxes * boxes}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-gray-400 text-sm">Захвачено</div>
                  <div className="text-white text-2xl font-bold">
                    {Object.values(gameState.scores).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-gray-400 text-sm">Осталось</div>
                  <div className="text-white text-2xl font-bold">
                    {boxes * boxes - Object.values(gameState.scores).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Правая панель: Игрок 2 */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-full
                    ${getPlayerColor(isMultiplayer ? 'opponent' : 'player2')}
                    flex items-center justify-center
                    text-white text-2xl font-bold
                    shadow-xl
                    ${gameState.currentPlayer === (isMultiplayer ? 'opponent' : 'player2') ? 'ring-4 ring-purple-300 ring-offset-4 ring-offset-gray-900' : ''}
                  `}>
                    P2
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {getPlayerName(isMultiplayer ? 'opponent' : 'player2')}
                    </h3>
                    <p className="text-purple-300 text-sm">Счет: {opponentScore}</p>
                  </div>
                </div>
                
                <Timer
                  time={opponentTime}
                  isActive={gameState.currentPlayer === (isMultiplayer ? 'opponent' : 'player2') && !gameOver}
                  color="purple"
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-white/80">
                  <div className="text-sm text-gray-400 mb-1">Последний ход:</div>
                  <div className="text-lg font-bold">
                    {moveHistory.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <span>Линия</span>
                        <span className="text-sm text-gray-400">
                          {new Date(moveHistory[moveHistory.length - 1].timestamp).toLocaleTimeString([], { 
                            minute: '2-digit', 
                            second: '2-digit' 
                          })}
                        </span>
                      </div>
                    ) : (
                      'Еще не было ходов'
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  {isMultiplayer 
                    ? (gameState.currentPlayer === (isMultiplayer ? 'opponent' : 'player2') 
                        ? 'Ход соперника' 
                        : 'Ваш ход скоро')
                    : 'Компьютерный соперник'}
                </div>
              </div>
              
              {/* История ходов */}
              {moveHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-bold mb-3">История ходов:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {moveHistory.slice().reverse().map((move, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between text-sm p-2 rounded bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPlayerColor(move.player)}`}></div>
                          <span className="text-white">
                            {move.lineType === 'h' ? 'Горизонтальная' : 'Вертикальная'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">
                            ({move.position[0]}, {move.position[1]})
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(move.timestamp).toLocaleTimeString([], { 
                              minute: '2-digit', 
                              second: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Нижняя панель: Управление */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-white">
              <div className="text-sm text-gray-400">Ход номер:</div>
              <div className="text-xl font-bold">{moveHistory.length}</div>
            </div>
            
            <div className="text-white">
              <div className="text-sm text-gray-400">Захвачено квадратов:</div>
              <div className="text-xl font-bold">
                {playerScore} - {opponentScore}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                Новая игра
              </button>
              
              {isMultiplayer && !gameOver && (
                <button
                  onClick={() => gameActions.surrender()}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Сдаться
                </button>
              )}
              
              <button
                onClick={exitGame}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold hover:shadow-lg transition-all"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotsAndBoxesGame;