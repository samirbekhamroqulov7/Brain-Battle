import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // Error setting cookies
        }
      },
    },
  })
}

export async function updatePurchaseStatus(purchaseId: string, status: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_purchases")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", purchaseId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPvPMatches(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("match_participants")
    .select(`
      match_id,
      matches (
        id,
        game_id,
        status,
        winner_id,
        created_at,
        finished_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

export async function getUserGameStats(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("user_game_stats").select("*").eq("user_id", userId)

  if (error) throw error
  return data
}

export async function recordPvPResult(matchId: string, userId: string, result: "win" | "loss" | "draw") {
  const supabase = await createClient()

  const { data: match, error: matchError } = await supabase.from("matches").select("game_id").eq("id", matchId).single()

  if (matchError) throw matchError

  const ratingChange = result === "win" ? 16 : result === "loss" ? -16 : 0

  const { data: existing } = await supabase
    .from("user_game_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", match.game_id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("user_game_stats")
      .update({
        wins: existing.wins + (result === "win" ? 1 : 0),
        losses: existing.losses + (result === "loss" ? 1 : 0),
        draws: existing.draws + (result === "draw" ? 1 : 0),
        rating: Math.max(800, existing.rating + ratingChange),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase.from("user_game_stats").insert([
      {
        user_id: userId,
        game_id: match.game_id,
        wins: result === "win" ? 1 : 0,
        losses: result === "loss" ? 1 : 0,
        draws: result === "draw" ? 1 : 0,
        rating: 1000 + ratingChange,
      },
    ])

    if (error) throw error
  }
}
