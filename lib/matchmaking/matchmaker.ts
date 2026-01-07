// Matchmaking system for finding suitable opponents

export interface MatchmakingQueue {
  userId: string
  gameType: string
  rating: number
  timestamp: number
}

export class Matchmaker {
  private queues: Map<string, MatchmakingQueue[]> = new Map()
  private readonly MAX_WAIT_TIME = 30000 // 30 seconds
  private readonly RATING_RANGE_INCREMENT = 50

  /**
   * Add player to matchmaking queue
   */
  addToQueue(userId: string, gameType: string, rating: number): void {
    const queueKey = gameType
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, [])
    }

    const queue = this.queues.get(queueKey)!
    queue.push({
      userId,
      gameType,
      rating,
      timestamp: Date.now(),
    })
  }

  /**
   * Find match for a player
   */
  findMatch(userId: string, gameType: string, playerRating: number): MatchmakingQueue | null {
    const queue = this.queues.get(gameType) || []
    const otherPlayers = queue.filter((p) => p.userId !== userId)

    if (otherPlayers.length === 0) return null

    // Find closest rating match
    let bestMatch: MatchmakingQueue | null = null
    let minDifference = Number.POSITIVE_INFINITY

    for (const player of otherPlayers) {
      const waitTime = Date.now() - player.timestamp
      const ratingDifference = Math.abs(player.rating - playerRating)

      // If player has been waiting more than 15s, increase rating range tolerance
      const tolerance = waitTime > 15000 ? this.RATING_RANGE_INCREMENT * 2 : this.RATING_RANGE_INCREMENT

      if (ratingDifference <= tolerance && ratingDifference < minDifference) {
        minDifference = ratingDifference
        bestMatch = player
      }
    }

    return bestMatch
  }

  /**
   * Remove player from queue
   */
  removeFromQueue(userId: string, gameType: string): void {
    const queue = this.queues.get(gameType)
    if (!queue) return

    const index = queue.findIndex((p) => p.userId === userId)
    if (index !== -1) {
      queue.splice(index, 1)
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(gameType: string): { players: number; avgWaitTime: number } {
    const queue = this.queues.get(gameType) || []
    const now = Date.now()
    const waitTimes = queue.map((p) => now - p.timestamp)
    const avgWaitTime = waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b) / waitTimes.length : 0

    return {
      players: queue.length,
      avgWaitTime,
    }
  }
}
