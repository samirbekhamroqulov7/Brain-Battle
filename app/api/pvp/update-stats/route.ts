import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { gameType, result } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ratingChange = result === "win" ? 16 : result === "loss" ? -16 : 0

    // Get existing stats
    const { data: existing } = await supabase
      .from("user_game_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("game_id", gameType)
      .single()

    if (existing) {
      await supabase
        .from("user_game_stats")
        .update({
          wins: existing.wins + (result === "win" ? 1 : 0),
          losses: existing.losses + (result === "loss" ? 1 : 0),
          draws: existing.draws + (result === "draw" ? 1 : 0),
          rating: Math.max(800, existing.rating + ratingChange),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("user_game_stats").insert([
        {
          user_id: user.id,
          game_id: gameType,
          wins: result === "win" ? 1 : 0,
          losses: result === "loss" ? 1 : 0,
          draws: result === "draw" ? 1 : 0,
          rating: 1000 + ratingChange,
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
