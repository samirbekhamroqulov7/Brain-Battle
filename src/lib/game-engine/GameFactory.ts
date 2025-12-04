export class GameFactory {
  static createGame(type: string) {
    // Базовая реализация
    return {
      type,
      start: () => console.log(`Game ${type} started`),
      pause: () => console.log(`Game ${type} paused`),
      reset: () => console.log(`Game ${type} reset`),
    };
  }

  static getAvailableGames() {
    return ['dots-and-boxes', 'pentago', 'chess', 'checkers'];
  }
}

export default GameFactory;