// PvP service for game operations

import { createBrowserClient } from "@supabase/ssr"

export class PvPService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  /**
   * Get player's rating for a game
   */
  async getPlayerRating(userId: string, gameType: string): Promise<number> {
    const { data, error } = await this.supabase
      .from("game_ratings")
      .select("rating")
      .eq("user_id", userId)
      .eq("game_type", gameType)
      .single()

    if (error) {
      // Create new rating entry
      await this.supabase.from("game_ratings").insert({
        user_id: userId,
        game_type: gameType,
        rating: 1200,
      })
      return 1200
    }

    return data?.rating || 1200
  }

  /**
   * Get player's game statistics
   */
  async getGameStats(userId: string, gameType: string) {
    const { data } = await this.supabase
      .from("game_ratings")
      .select("*")
      .eq("user_id", userId)
      .eq("game_type", gameType)
      .single()

    return data || { rating: 1200, wins: 0, losses: 0, draws: 0 }
  }

  /**
   * Get leaderboard for a game
   */
  async getLeaderboard(gameType: string, limit = 100) {
    const { data } = await this.supabase
      .from("game_ratings")
      .select("*, users(id, username, avatar_url)")
      .eq("game_type", gameType)
      .order("rating", { ascending: false })
      .limit(limit)

    return data || []
  }

  /**
   * Get player's recent matches
   */
  async getRecentMatches(userId: string, limit = 10) {
    const { data } = await this.supabase
      .from("game_sessions")
      .select("*, room_players(player_id)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    return data || []
  }

  /**
   * Watch a live game room
   */
  subscribeToRoom(roomId: string, callback: (data: any) => void) {
    return this.supabase
      .from(`rooms:id=eq.${roomId}`)
      .on("*", (payload) => {
        callback(payload)
      })
      .subscribe()
  }

  /**
   * Subscribe to game moves in real-time
   */
  subscribeToMoves(roomId: string, callback: (move: any) => void) {
    return this.supabase
      .from(`game_moves:room_id=eq.${roomId}`)
      .on("INSERT", (payload) => {
        callback(payload.new)
      })
      .subscribe()
  }
}
