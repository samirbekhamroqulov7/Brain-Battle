// ELO rating system for competitive games

export class ELOSystem {
  private readonly K_FACTOR = 32 // Standard K-factor for rating calculation
  private readonly BASE_RATING = 1200

  /**
   * Calculate new ELO ratings after a game
   */
  calculateNewRatings(
    player1Rating: number,
    player2Rating: number,
    result: "win" | "loss" | "draw",
  ): { player1NewRating: number; player2NewRating: number } {
    const expectedScore1 = this.getExpectedScore(player1Rating, player2Rating)
    const expectedScore2 = 1 - expectedScore1

    let actualScore1: number
    if (result === "win") {
      actualScore1 = 1
    } else if (result === "loss") {
      actualScore1 = 0
    } else {
      actualScore1 = 0.5
    }

    const actualScore2 = 1 - actualScore1

    const player1NewRating = Math.round(player1Rating + this.K_FACTOR * (actualScore1 - expectedScore1))
    const player2NewRating = Math.round(player2Rating + this.K_FACTOR * (actualScore2 - expectedScore2))

    return {
      player1NewRating: Math.max(0, player1NewRating),
      player2NewRating: Math.max(0, player2NewRating),
    }
  }

  /**
   * Calculate expected score based on rating difference
   */
  private getExpectedScore(player1Rating: number, player2Rating: number): number {
    const ratingDiff = player2Rating - player1Rating
    return 1 / (1 + Math.pow(10, ratingDiff / 400))
  }
}
