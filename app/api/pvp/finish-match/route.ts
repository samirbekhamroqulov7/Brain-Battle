import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ELOSystem } from "@/lib/realtime/elo-system"

const eloSystem = new ELOSystem()

export async function POST(request: NextRequest) {
  try {
    const { roomId, sessionId, winnerId, player1Id, player2Id, result, duration } = await request.json()

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => cookies.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      },
    )

    // Get game type from room
    const { data: room } = await supabase.from("rooms").select("game_type").eq("id", roomId).single()

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const gameType = room.game_type

    // Get both players' current ratings
    const { data: ratings } = await supabase
      .from("game_ratings")
      .select("*")
      .in("user_id", [player1Id, player2Id])
      .eq("game_type", gameType)

    const player1Rating = ratings?.find((r) => r.user_id === player1Id)?.rating || 1200
    const player2Rating = ratings?.find((r) => r.user_id === player2Id)?.rating || 1200

    // Calculate new ELO ratings
    const eloResult = result === "draw" ? "draw" : winnerId === player1Id ? "win" : "loss"
    const { player1NewRating, player2NewRating } = eloSystem.calculateNewRatings(
      player1Rating,
      player2Rating,
      eloResult,
    )

    // Update ratings and stats for both players
    const updates = [
      winnerId === player1Id
        ? {
            user_id: player1Id,
            game_type: gameType,
            rating: player1NewRating,
            wins: (ratings?.find((r) => r.user_id === player1Id)?.wins || 0) + 1,
          }
        : winnerId === player2Id
          ? {
              user_id: player1Id,
              game_type: gameType,
              rating: player1NewRating,
              losses: (ratings?.find((r) => r.user_id === player1Id)?.losses || 0) + 1,
            }
          : {
              user_id: player1Id,
              game_type: gameType,
              rating: player1NewRating,
              draws: (ratings?.find((r) => r.user_id === player1Id)?.draws || 0) + 1,
            },
      winnerId === player2Id
        ? {
            user_id: player2Id,
            game_type: gameType,
            rating: player2NewRating,
            wins: (ratings?.find((r) => r.user_id === player2Id)?.wins || 0) + 1,
          }
        : winnerId === player1Id
          ? {
              user_id: player2Id,
              game_type: gameType,
              rating: player2NewRating,
              losses: (ratings?.find((r) => r.user_id === player2Id)?.losses || 0) + 1,
            }
          : {
              user_id: player2Id,
              game_type: gameType,
              rating: player2NewRating,
              draws: (ratings?.find((r) => r.user_id === player2Id)?.draws || 0) + 1,
            },
    ]

    // Upsert ratings
    for (const update of updates) {
      await supabase.from("game_ratings").upsert(update, { onConflict: "user_id,game_type" })
    }

    await supabase
      .from("rooms")
      .update({
        status: "finished",
        finished_at: new Date().toISOString(),
      })
      .eq("id", roomId)

    await supabase
      .from("game_sessions")
      .update({
        result: result,
        winner_id: winnerId || null,
        duration: duration,
      })
      .eq("id", sessionId)

    const sessionResults = [
      {
        session_id: sessionId,
        player_id: player1Id,
        score: winnerId === player1Id ? 1 : winnerId === player2Id ? 0 : 0.5,
        rank: winnerId === player1Id ? 1 : winnerId === player2Id ? 2 : 1,
      },
      {
        session_id: sessionId,
        player_id: player2Id,
        score: winnerId === player2Id ? 1 : winnerId === player1Id ? 0 : 0.5,
        rank: winnerId === player2Id ? 1 : winnerId === player1Id ? 2 : 1,
      },
    ]

    await supabase.from("session_results").insert(sessionResults)

    // Award coins based on result
    const coinsToAward = winnerId ? 50 : 25 // Winner gets 50, loser/draw gets 25

    for (const playerId of [player1Id, player2Id]) {
      await supabase.rpc("add_coins", {
        player_id: playerId,
        coins: winnerId === playerId ? coinsToAward : coinsToAward / 2,
      })
    }

    return NextResponse.json({
      success: true,
      ratings: {
        player1: { previous: player1Rating, new: player1NewRating },
        player2: { previous: player2Rating, new: player2NewRating },
      },
    })
  } catch (error) {
    console.error("[Match Finish Error]", error)
    return NextResponse.json({ error: "Failed to finish match" }, { status: 500 })
  }
}
