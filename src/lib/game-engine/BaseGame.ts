import { GameState, Player, GameResult, GameMove } from '@/types';

/**
 * Базовый абстрактный класс для всех игр
 * Определяет общий интерфейс и базовую логику
 */
export abstract class BaseGame {
  protected gameId: string;
  protected players: Player[];
  protected state: GameState;
  protected timer: NodeJS.Timeout | null = null;
  
  constructor(gameId: string, players: Player[]) {
    this.gameId = gameId;
    this.players = players;
    this.state = this.initializeState();
  }
  
  // Абстрактные методы, которые должны быть реализованы в дочерних классах
  
  /**
   * Инициализация состояния игры
   */
  protected abstract initializeState(): GameState;
  
  /**
   * Обработка хода игрока
   * @param playerId ID игрока
   * @param move Данные хода
   * @returns Успешность хода и новое состояние
   */
  public abstract makeMove(playerId: string, move: any): {
    success: boolean;
    newState: GameState;
    message?: string;
  };
  
  /**
   * Проверка завершения игры
   * @returns Результат игры или null если игра продолжается
   */
  public abstract checkGameOver(): GameResult | null;
  
  /**
   * Валидация хода
   * @param playerId ID игрока
   * @param move Данные хода
   */
  protected abstract validateMove(playerId: string, move: any): boolean;
  
  /**
   * Получение визуального представления состояния игры
   */
  public abstract getVisualState(): any;
  
  /**
   * Получение подсказок для игрока
   */
  public abstract getHints(playerId: string): string[];
  
  // Общие методы, общие для всех игр
  
  /**
   * Получение текущего состояния игры
   */
  public getState(): GameState {
    return { ...this.state };
  }
  
  /**
   * Получение текущего игрока
   */
  public getCurrentPlayer(): Player | null {
    return this.players.find(p => p.id === this.state.currentPlayer) || null;
  }
  
  /**
   * Получение списка игроков
   */
  public getPlayers(): Player[] {
    return [...this.players];
  }
  
  /**
   * Получение истории ходов
   */
  public getMoveHistory(): GameMove[] {
    return [...this.state.moves];
  }
  
  /**
   * Получение времени с начала игры
   */
  public getElapsedTime(): number {
    return Math.floor((Date.now() - this.state.createdAt) / 1000);
  }
  
  /**
   * Запуск таймера игры
   */
  public startTimer(): void {
    if (this.timer) return;
    
    this.timer = setInterval(() => {
      this.state.timer += 1;
      this.state.updatedAt = Date.now();
      
      // Проверка тайм-аута
      this.checkTimeout();
    }, 1000);
  }
  
  /**
   * Остановка таймера
   */
  public stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  /**
   * Проверка тайм-аута
   */
  protected checkTimeout(): void {
    // Базовая реализация проверки тайм-аута
    // Дочерние классы могут переопределить эту логику
    const timePerPlayer = 180; // 3 минуты по умолчанию
    const currentPlayer = this.getCurrentPlayer();
    
    if (currentPlayer) {
      // Здесь должна быть логика проверки времени для текущего игрока
      // В базовой реализации просто обновляем состояние
    }
  }
  
  /**
   * Смена текущего игрока
   */
  protected switchPlayer(): void {
    const currentIndex = this.players.findIndex(p => p.id === this.state.currentPlayer);
    const nextIndex = (currentIndex + 1) % this.players.length;
    this.state.currentPlayer = this.players[nextIndex].id;
  }
  
  /**
   * Добавление хода в историю
   */
  protected addMoveToHistory(move: any): void {
    const gameMove: GameMove = {
      playerId: this.state.currentPlayer,
      move,
      timestamp: Date.now(),
      moveNumber: this.state.moves.length + 1
    };
    
    this.state.moves.push(gameMove);
  }
  
  /**
   * Завершение игры
   */
  public endGame(result: GameResult): void {
    this.state.status = 'finished';
    this.state.result = result;
    this.state.updatedAt = Date.now();
    
    this.stopTimer();
    
    // Обновление статистики игроков
    this.updatePlayerStats(result);
  }
  
  /**
   * Обновление статистики игроков
   */
  protected updatePlayerStats(result: GameResult): void {
    // Базовая реализация обновления статистики
    // В реальном приложении здесь будет API вызов
    console.log('Updating player stats:', result);
  }
  
  /**
   * Пауза игры
   */
  public pauseGame(): void {
    if (this.state.status === 'playing') {
      this.state.status = 'paused';
      this.stopTimer();
    }
  }
  
  /**
   * Возобновление игры
   */
  public resumeGame(): void {
    if (this.state.status === 'paused') {
      this.state.status = 'playing';
      this.startTimer();
    }
  }
  
  /**
   * Сброс игры
   */
  public resetGame(): void {
    this.stopTimer();
    this.state = this.initializeState();
  }
  
  /**
   * Отмена последнего хода (только для одиночной игры)
   */
  public undoLastMove(): boolean {
    if (this.players.length > 1) {
      return false; // Нельзя отменять ходы в многопользовательской игре
    }
    
    if (this.state.moves.length === 0) {
      return false;
    }
    
    this.state.moves.pop();
    // Здесь должна быть логика восстановления предыдущего состояния
    // В базовом классе просто возвращаем true
    
    return true;
  }
  
  /**
   * Получение оценки состояния для AI
   */
  public evaluateState(playerId: string): number {
    // Базовая реализация оценки
    // Дочерние классы должны переопределить для конкретных игр
    return 0;
  }
  
  /**
   * Генерация возможных ходов для игрока
   */
  public abstract generatePossibleMoves(playerId: string): any[];
  
  /**
   * Получение правил игры
   */
  public abstract getRules(): string[];
  
  /**
   * Получение сложности игры
   */
  public abstract getDifficulty(): number;
  
  /**
   * Валидация состояния игры
   */
  protected validateState(): boolean {
    // Базовая валидация состояния
    return (
      this.state !== null &&
      this.players.length > 0 &&
      this.players.some(p => p.id === this.state.currentPlayer)
    );
  }
  
  /**
   * Сериализация состояния игры для сохранения
   */
  public serialize(): string {
    return JSON.stringify({
      gameId: this.gameId,
      players: this.players,
      state: this.state
    });
  }
  
  /**
   * Десериализация состояния игры
   */
  public static deserialize<T extends BaseGame>(
    this: new (gameId: string, players: Player[]) => T,
    data: string
  ): T {
    const parsed = JSON.parse(data);
    const game = new this(parsed.gameId, parsed.players);
    game.state = parsed.state;
    return game;
  }
  
  /**
   * Уничтожение игры (очистка ресурсов)
   */
  public destroy(): void {
    this.stopTimer();
    // Дополнительная очистка ресурсов
  }
}

/**
 * Фабрика для создания игр
 */
export class GameFactory {
  /**
   * Создание игры по ID
   */
  public static createGame(gameId: string, players: Player[]): BaseGame {
    switch (gameId) {
      case 'pentago':
        return new PentagoGame(gameId, players);
      case 'dots-and-boxes':
        return new DotsAndBoxesGame(gameId, players);
      case 'chess-blitz':
        return new ChessBlitzGame(gameId, players);
      case 'math-sprint':
        return new MathSprintGame(gameId, players);
      // Добавьте другие игры здесь
      default:
        throw new Error(`Unknown game ID: ${gameId}`);
    }
  }
  
  /**
   * Создание игры с AI соперником
   */
  public static createGameWithAI(gameId: string, humanPlayer: Player, aiDifficulty: number): BaseGame {
    const aiPlayer: Player = {
      id: 'ai_opponent',
      name: `AI (${['Легкий', 'Средний', 'Сложный', 'Эксперт', 'Мастер'][aiDifficulty - 1]})`,
      avatar: {
        type: 'emoji',
        value: '🤖'
      },
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDrawn: 0,
        totalTimePlayed: 0,
        averageScore: 0,
        winRate: 0,
        currentStreak: 0,
        maxStreak: 0
      },
      rank: 1000 + aiDifficulty * 200,
      level: aiDifficulty + 1,
      status: 'online',
      achievements: [],
      friends: []
    };
    
    return this.createGame(gameId, [humanPlayer, aiPlayer]);
  }
}

// Пример реализации для Пентаго (упрощенная)
class PentagoGame extends BaseGame {
  private pentagoState: any;
  
  protected initializeState(): GameState {
    this.pentagoState = {
      board: Array(6).fill(null).map(() => Array(6).fill(null)),
      currentPlayer: 'X',
      quadrantToRotate: null,
      winner: null
    };
    
    return {
      id: this.gameId,
      gameId: 'pentago',
      status: 'waiting',
      players: this.players,
      currentPlayer: this.players[0].id,
      timer: 0,
      moves: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  
  public makeMove(playerId: string, move: any): {
    success: boolean;
    newState: GameState;
    message?: string;
  } {
    // Реализация для Пентаго
    return {
      success: false,
      newState: this.state,
      message: 'Not implemented'
    };
  }
  
  public checkGameOver(): GameResult | null {
    return null;
  }
  
  protected validateMove(playerId: string, move: any): boolean {
    return false;
  }
  
  public getVisualState(): any {
    return this.pentagoState;
  }
  
  public getHints(playerId: string): string[] {
    return ['Сначала ставьте фишки по центру', 'Контролируйте центр поля', 'Блокируйте линии соперника'];
  }
  
  public generatePossibleMoves(playerId: string): any[] {
    return [];
  }
  
  public getRules(): string[] {
    return [
      'По очереди ставьте фишки на поле 6x6',
      'После хода поверните один из 4 секторов на 90°',
      'Побеждает тот, кто соберет 5 своих фишек в ряд'
    ];
  }
  
  public getDifficulty(): number {
    return 3;
  }
}

// Заглушки для других игр
class DotsAndBoxesGame extends BaseGame {
  protected initializeState(): GameState { return {} as GameState; }
  public makeMove(): any { return {}; }
  public checkGameOver(): GameResult | null { return null; }
  protected validateMove(): boolean { return false; }
  public getVisualState(): any { return {}; }
  public getHints(): string[] { return []; }
  public generatePossibleMoves(): any[] { return []; }
  public getRules(): string[] { return []; }
  public getDifficulty(): number { return 2; }
}

class ChessBlitzGame extends BaseGame {
  protected initializeState(): GameState { return {} as GameState; }
  public makeMove(): any { return {}; }
  public checkGameOver(): GameResult | null { return null; }
  protected validateMove(): boolean { return false; }
  public getVisualState(): any { return {}; }
  public getHints(): string[] { return []; }
  public generatePossibleMoves(): any[] { return []; }
  public getRules(): string[] { return []; }
  public getDifficulty(): number { return 4; }
}

class MathSprintGame extends BaseGame {
  protected initializeState(): GameState { return {} as GameState; }
  public makeMove(): any { return {}; }
  public checkGameOver(): GameResult | null { return null; }
  protected validateMove(): boolean { return false; }
  public getVisualState(): any { return {}; }
  public getHints(): string[] { return []; }
  public generatePossibleMoves(): any[] { return []; }
  public getRules(): string[] { return []; }
  public getDifficulty(): number { return 2; }
}