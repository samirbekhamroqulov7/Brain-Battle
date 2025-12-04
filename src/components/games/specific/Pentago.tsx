import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { PentagoState } from '@/types';
import { useStore, gameActions } from '@/lib/state/store';
import GameHeader from '@/components/games/common/GameHeader';
import GameTimer from '@/components/games/common/Timer';
import GameBoard from '@/components/games/common/GameBoard';

interface PentagoGameProps {
  isMultiplayer?: boolean;
  opponentName?: string;
  onGameEnd?: (result: any) => void;
}

const PentagoGame: React.FC<PentagoGameProps> = ({
  isMultiplayer = false,
  opponentName = 'Соперник',
  onGameEnd
}) => {
  const router = useRouter();
  const player = useStore(state => state.player);
  const [gameState, setGameState] = useState<PentagoState>(initializeGame());
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const [rotationDirection, setRotationDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [isRotating, setIsRotating] = useState(false);
  const [playerTime, setPlayerTime] = useState(180);
  const [opponentTime, setOpponentTime] = useState(180);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);

  // Инициализация игры
  function initializeGame(): PentagoState {
    return {
      board: Array(6).fill(null).map(() => Array(6).fill(null)),
      currentPlayer: 'X',
      quadrantToRotate: null,
      winner: null
    };
  }

  // Проверка победы
  const checkWin = useCallback((board: ('X' | 'O' | null)[][], player: 'X' | 'O'): boolean => {
    // Проверка горизонталей
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col <= 1; col++) {
        if (
          board[row][col] === player &&
          board[row][col + 1] === player &&
          board[row][col + 2] === player &&
          board[row][col + 3] === player &&
          board[row][col + 4] === player
        ) {
          return true;
        }
      }
    }

    // Проверка вертикалей
    for (let col = 0; col < 6; col++) {
      for (let row = 0; row <= 1; row++) {
        if (
          board[row][col] === player &&
          board[row + 1][col] === player &&
          board[row + 2][col] === player &&
          board[row + 3][col] === player &&
          board[row + 4][col] === player
        ) {
          return true;
        }
      }
    }

    // Проверка диагоналей (слева направо)
    for (let row = 0; row <= 1; row++) {
      for (let col = 0; col <= 1; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col + 1] === player &&
          board[row + 2][col + 2] === player &&
          board[row + 3][col + 3] === player &&
          board[row + 4][col + 4] === player
        ) {
          return true;
        }
      }
    }

    // Проверка диагоналей (справа налево)
    for (let row = 0; row <= 1; row++) {
      for (let col = 4; col < 6; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col - 1] === player &&
          board[row + 2][col - 2] === player &&
          board[row + 3][col - 3] === player &&
          board[row + 4][col - 4] === player
        ) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Проверка ничьей
  const checkDraw = useCallback((board: ('X' | 'O' | null)[][]): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  }, []);

  // Ход: постановка фишки
  const handleCellClick = (row: number, col: number) => {
    if (
      gameOver ||
      isRotating ||
      gameState.winner ||
      selectedQuadrant !== null ||
      gameState.board[row][col] !== null
    ) {
      return;
    }

    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = gameState.currentPlayer;

    const moveRecord = {
      type: 'place',
      player: gameState.currentPlayer,
      position: [row, col] as [number, number],
      timestamp: Date.now()
    };

    setMoveHistory(prev => [...prev, moveRecord]);
    setSelectedCell([row, col]);

    // Определяем квадрант для вращения
    const quadrant = Math.floor(row / 3) * 2 + Math.floor(col / 3);
    setSelectedQuadrant(quadrant);

    // Обновляем состояние
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      quadrantToRotate: quadrant
    }));
  };

  // Вращение квадранта
  const rotateQuadrant = (quadrant: number, direction: 'clockwise' | 'counterclockwise') => {
    if (gameOver || isRotating || selectedQuadrant === null) return;

    setIsRotating(true);

    const newBoard = gameState.board.map(row => [...row]);
    const startRow = Math.floor(quadrant / 2) * 3;
    const startCol = (quadrant % 2) * 3;

    // Создаем временную матрицу для квадранта
    const quadrantMatrix = [];
    for (let i = 0; i < 3; i++) {
      quadrantMatrix[i] = [];
      for (let j = 0; j < 3; j++) {
        quadrantMatrix[i][j] = newBoard[startRow + i][startCol + j];
      }
    }

    // Поворачиваем матрицу
    const rotatedMatrix = direction === 'clockwise' 
      ? quadrantMatrix[0].map((_, index) => 
          quadrantMatrix.map(row => row[index]).reverse()
        )
      : quadrantMatrix[0].map((_, index) => 
          quadrantMatrix.map(row => row[row.length - 1 - index])
        );

    // Копируем обратно в основную доску
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newBoard[startRow + i][startCol + j] = rotatedMatrix[i][j];
      }
    }

    const moveRecord = {
      type: 'rotate',
      player: gameState.currentPlayer,
      quadrant,
      direction,
      timestamp: Date.now()
    };

    setMoveHistory(prev => [...prev, moveRecord]);

    // Задержка для анимации
    setTimeout(() => {
      const winX = checkWin(newBoard, 'X');
      const winO = checkWin(newBoard, 'O');
      const draw = checkDraw(newBoard);

      let newWinner: 'X' | 'O' | 'draw' | null = null;
      if (winX) newWinner = 'X';
      else if (winO) newWinner = 'O';
      else if (draw) newWinner = 'draw';

      const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';

      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        quadrantToRotate: null,
        winner: newWinner,
        lastMove: {
          player: gameState.currentPlayer,
          position: selectedCell || [0, 0],
          rotatedQuadrant: quadrant,
          direction
        }
      });

      setSelectedCell(null);
      setSelectedQuadrant(null);
      setIsRotating(false);

      if (newWinner) {
        setGameOver(true);
        setWinner(newWinner);
        
        if (onGameEnd) {
          onGameEnd({
            winner: newWinner === 'draw' ? null : newWinner,
            reason: newWinner === 'draw' ? 'draw' : 'win'
          });
        }

        // Сохраняем результат в сторе
        if (player) {
          const result = {
            winner: newWinner === 'draw' ? null : player.id,
            reason: newWinner === 'draw' ? 'draw' : 'win' as const,
            scores: {
              [player.id]: newWinner === 'X' ? 1 : 0
            }
          };
          
          gameActions.endGame(result);
        }
      }

      // Обновляем таймер
      if (gameState.currentPlayer === 'X') {
        setPlayerTime(prev => Math.max(0, prev - 1));
      } else {
        setOpponentTime(prev => Math.max(0, prev - 1));
      }
    }, 600); // Длительность анимации вращения
  };

  // Отмена выбора квадранта
  const cancelRotation = () => {
    setSelectedQuadrant(null);
    setSelectedCell(null);
    
    // Возвращаемся к предыдущему состоянию
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      if (lastMove.type === 'place') {
        const [row, col] = lastMove.position;
        const newBoard = gameState.board.map(r => [...r]);
        newBoard[row][col] = null;
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          quadrantToRotate: null
        }));
        
        setMoveHistory(prev => prev.slice(0, -1));
      }
    }
  };

  // Сброс игры
  const resetGame = () => {
    setGameState(initializeGame());
    setSelectedCell(null);
    setSelectedQuadrant(null);
    setGameOver(false);
    setWinner(null);
    setPlayerTime(180);
    setOpponentTime(180);
    setMoveHistory([]);
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
      if (gameState.currentPlayer === 'X') {
        setPlayerTime(prev => {
          if (prev <= 0) {
            setGameOver(true);
            setWinner('O');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setOpponentTime(prev => {
          if (prev <= 0) {
            setGameOver(true);
            setWinner('X');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.currentPlayer, gameOver]);

  // Получение цвета игрока
  const getPlayerColor = (player: 'X' | 'O') => {
    return player === 'X' 
      ? 'bg-gradient-to-br from-cyan-400 to-blue-500' 
      : 'bg-gradient-to-br from-purple-400 to-pink-500';
  };

  // Рендер ячейки
  const renderCell = (row: number, col: number) => {
    const value = gameState.board[row][col];
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;
    const quadrant = Math.floor(row / 3) * 2 + Math.floor(col / 3);
    const isInSelectedQuadrant = selectedQuadrant === quadrant;

    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        disabled={value !== null || gameOver || selectedQuadrant !== null}
        className={`
          w-12 h-12 md:w-16 md:h-16
          rounded-lg
          flex items-center justify-center
          transition-all duration-200
          ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-gray-900' : ''}
          ${isInSelectedQuadrant ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-white/5'}
          ${value === null ? 'hover:bg-white/10 active:scale-95' : ''}
          ${value !== null ? 'cursor-default' : 'cursor-pointer'}
          border border-white/10
          relative
          overflow-hidden
        `}
      >
        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              w-10 h-10 md:w-14 md:h-14
              rounded-full
              flex items-center justify-center
              ${getPlayerColor(value)}
              text-white font-bold text-xl md:text-2xl
              shadow-lg
            `}
          >
            {value}
          </motion.div>
        )}

        {/* Индикатор последнего хода */}
        {gameState.lastMove && 
         gameState.lastMove.position[0] === row && 
         gameState.lastMove.position[1] === col && (
          <motion.div
            className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Подсветка при наведении */}
        {value === null && !gameOver && selectedQuadrant === null && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
            <div className={`w-full h-full ${getPlayerColor(gameState.currentPlayer)} opacity-10`}></div>
          </div>
        )}
      </button>
    );
  };

  // Рендер квадранта
  const renderQuadrant = (quadrant: number) => {
    const isSelected = selectedQuadrant === quadrant;
    const startRow = Math.floor(quadrant / 2) * 3;
    const startCol = (quadrant % 2) * 3;

    return (
      <motion.div
        key={quadrant}
        className={`
          p-2 md:p-4
          rounded-xl
          transition-all duration-300
          ${isSelected ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30' : 'bg-white/5'}
          ${isSelected ? 'border-2 border-yellow-400' : 'border border-white/10'}
          ${isRotating && isSelected ? 'scale-105' : ''}
        `}
        animate={isRotating && isSelected ? {
          rotate: rotationDirection === 'clockwise' ? 90 : -90
        } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {Array.from({ length: 3 }).map((_, i) =>
            Array.from({ length: 3 }).map((_, j) =>
              renderCell(startRow + i, startCol + j)
            )
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      
      {/* Заголовок игры */}
      <GameHeader
        gameName="Пентаго"
        onExit={exitGame}
        onReset={resetGame}
        showReset={!isMultiplayer}
        showExit={true}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Левая панель: Игрок X */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-full
                    ${getPlayerColor('X')}
                    flex items-center justify-center
                    text-white text-2xl font-bold
                    shadow-xl
                    ${gameState.currentPlayer === 'X' ? 'ring-4 ring-cyan-300 ring-offset-4 ring-offset-gray-900' : ''}
                  `}>
                    X
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {isMultiplayer ? (player?.name || 'Вы') : 'Игрок X'}
                    </h3>
                    <p className="text-cyan-300 text-sm">Фишки синие</p>
                  </div>
                </div>
                
                <GameTimer
                  time={playerTime}
                  isActive={gameState.currentPlayer === 'X' && !gameOver}
                  color="cyan"
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-white/80">
                  <div className="text-sm text-gray-400 mb-1">Следующий ход:</div>
                  <div className="text-lg font-bold">
                    {selectedQuadrant === null ? 'Поставьте фишку' : 'Поверните квадрант'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  {gameState.currentPlayer === 'X' 
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
                {gameOver && winner && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 rounded-xl text-center"
                  >
                    <div className="text-4xl mb-4">
                      {winner === 'draw' ? '🤝' : winner === 'X' ? '🏆' : '🎉'}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {winner === 'draw' ? 'Ничья!' : `Победил ${winner === 'X' ? 'X' : 'O'}!`}
                    </h2>
                    <p className="text-gray-300">
                      {winner === 'draw' 
                        ? 'Все поля заполнены' 
                        : `5 фишек в ряд`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Игровое поле */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {[0, 1, 2, 3].map(renderQuadrant)}
                </div>
                
                {/* Центральные линии */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/20 -translate-x-1/2"></div>
                
                {/* Декоративные круги на пересечениях */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white/30"></div>
                <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              {/* Панель управления вращением */}
              {selectedQuadrant !== null && !gameOver && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-white text-lg font-bold mb-2">
                      Выберите направление вращения
                    </h3>
                    <p className="text-yellow-300 text-sm">
                      Квадрант {selectedQuadrant + 1} (сектор {['верхний левый', 'верхний правый', 'нижний левый', 'нижний правый'][selectedQuadrant]})
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => {
                        setRotationDirection('clockwise');
                        rotateQuadrant(selectedQuadrant, 'clockwise');
                      }}
                      className="p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">↻</span>
                        <span>По часовой</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={cancelRotation}
                      className="p-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold hover:shadow-lg transition-all"
                    >
                      Отмена
                    </button>
                    
                    <button
                      onClick={() => {
                        setRotationDirection('counterclockwise');
                        rotateQuadrant(selectedQuadrant, 'counterclockwise');
                      }}
                      className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">↺</span>
                        <span>Против часовой</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-300">
                    После вращения ход переходит к сопернику
                  </div>
                </motion.div>
              )}
              
              {/* Инструкция */}
              {!selectedQuadrant && !gameOver && (
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-white/10">
                  <h4 className="text-white font-bold mb-2">Как играть:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>1. Поставьте свою фишку в любую свободную клетку</li>
                    <li>2. Затем поверните один из 4 секторов на 90°</li>
                    <li>3. Соберите 5 своих фишек в ряд (по горизонтали, вертикали или диагонали)</li>
                    <li>4. Каждый ход состоит из двух действий: поставить фишку + повернуть сектор</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Правая панель: Игрок O */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-full
                    ${getPlayerColor('O')}
                    flex items-center justify-center
                    text-white text-2xl font-bold
                    shadow-xl
                    ${gameState.currentPlayer === 'O' ? 'ring-4 ring-purple-300 ring-offset-4 ring-offset-gray-900' : ''}
                  `}>
                    O
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {isMultiplayer ? opponentName : 'Игрок O'}
                    </h3>
                    <p className="text-purple-300 text-sm">Фишки фиолетовые</p>
                  </div>
                </div>
                
                <GameTimer
                  time={opponentTime}
                  isActive={gameState.currentPlayer === 'O' && !gameOver}
                  color="purple"
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-white/80">
                  <div className="text-sm text-gray-400 mb-1">Последний ход:</div>
                  <div className="text-lg font-bold">
                    {moveHistory.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <span>{moveHistory[moveHistory.length - 1].type === 'place' ? 'Фишка' : 'Вращение'}</span>
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
                    ? (gameState.currentPlayer === 'O' ? 'Ход соперника' : 'Ваш ход скоро')
                    : 'Компьютерный соперник'}
                </div>
              </div>
              
              {/* История ходов (только для многопользовательской игры) */}
              {isMultiplayer && moveHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-bold mb-3">История ходов:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {moveHistory.slice().reverse().map((move, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between text-sm p-2 rounded bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getPlayerColor(move.player)}`}></div>
                          <span className="text-white">
                            {move.type === 'place' 
                              ? `Поставил в (${move.position[0] + 1}, ${move.position[1] + 1})` 
                              : `Повернул сектор ${move.quadrant + 1}`}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {new Date(move.timestamp).toLocaleTimeString([], { 
                            minute: '2-digit', 
                            second: '2-digit' 
                          })}
                        </span>
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
              <div className="text-xl font-bold">{Math.ceil(moveHistory.length / 2)}</div>
            </div>
            
            <div className="text-white">
              <div className="text-sm text-gray-400">Время игры:</div>
              <div className="text-xl font-bold">
                {Math.floor((180 - Math.min(playerTime, opponentTime)) / 60)}:
                {((180 - Math.min(playerTime, opponentTime)) % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold hover:shadow-lg transition-all"
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
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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

export default PentagoGame;