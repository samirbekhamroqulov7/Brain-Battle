// PvP Match Service - Handle match operations

import { createClient } from "@/lib/supabase/client"
import type { PvPMatch, PvPPlayer } from "@/lib/types/pvp-games"

export const createMatch = async (
  gameType: string,
  player1: PvPPlayer,
  gameState: Record<string, unknown> = {},
): Promise<PvPMatch> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("matches")
    .insert([
      {
        game_id: gameType,
        mode: "pvp",
        status: "waiting",
        game_state: gameState,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data as PvPMatch
}

export const updateMatchState = async (
  matchId: string,
  gameState: Record<string, unknown>,
  status?: string,
): Promise<void> => {
  const supabase = createClient()

  const updateData: Record<string, unknown> = { game_state: gameState }
  if (status) updateData.status = status

  const { error } = await supabase.from("matches").update(updateData).eq("id", matchId)

  if (error) throw error
}

export const finishMatch = async (
  matchId: string,
  winnerId: string | null,
  result: "player1_win" | "player2_win" | "draw",
): Promise<void> => {
  const supabase = createClient()

  const { error } = await supabase
    .from("matches")
    .update({
      status: "finished",
      winner_id: winnerId,
      result: result,
      finished_at: new Date().toISOString(),
    })
    .eq("id", matchId)

  if (error) throw error
}

export const recordGameStats = async (
  userId: string,
  gameType: string,
  win: boolean,
  rating: number,
): Promise<void> => {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from("user_game_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", gameType)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("user_game_stats")
      .update({
        wins: existing.wins + (win ? 1 : 0),
        losses: existing.losses + (win ? 0 : 1),
        rating: rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase.from("user_game_stats").insert([
      {
        user_id: userId,
        game_id: gameType,
        wins: win ? 1 : 0,
        losses: win ? 0 : 1,
        draws: 0,
        rating: rating,
      },
    ])

    if (error) throw error
  }
}
