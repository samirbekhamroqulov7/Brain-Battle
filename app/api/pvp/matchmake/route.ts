// Matchmaking API endpoint

import { type NextRequest, NextResponse } from "next/server"
import { Matchmaker } from "@/lib/matchmaking/matchmaker"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const matchmaker = new Matchmaker()

export async function POST(request: NextRequest) {
  try {
    const { userId, gameType } = await request.json()

    if (!userId || !gameType) {
      return NextResponse.json({ error: "Missing userId or gameType" }, { status: 400 })
    }

    // Get player rating from database
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

    const { data: rating } = await supabase
      .from("game_ratings")
      .select("rating")
      .eq("user_id", userId)
      .eq("game_type", gameType)
      .single()

    const playerRating = rating?.rating || 1200

    // Add to queue
    matchmaker.addToQueue(userId, gameType, playerRating)

    // Try to find a match
    const opponent = matchmaker.findMatch(userId, gameType, playerRating)

    if (opponent) {
      // Match found
      matchmaker.removeFromQueue(userId, gameType)
      matchmaker.removeFromQueue(opponent.userId, gameType)

      // Create room in database
      const { data: room } = await supabase
        .from("rooms")
        .insert({
          game_type: gameType,
          status: "waiting",
          max_players: 2,
        })
        .select()
        .single()

      // Add players to room
      await supabase.from("room_players").insert([
        { room_id: room.id, player_id: userId },
        { room_id: room.id, player_id: opponent.userId },
      ])

      return NextResponse.json({
        matched: true,
        roomId: room.id,
        opponent: {
          userId: opponent.userId,
          rating: opponent.rating,
        },
      })
    } else {
      // No match yet, return queue position
      const queue = matchmaker.getQueueStatus(gameType)
      return NextResponse.json({
        matched: false,
        queuePosition: queue.players,
        avgWaitTime: queue.avgWaitTime,
      })
    }
  } catch (error) {
    console.error("[Matchmaking Error]", error)
    return NextResponse.json({ error: "Matchmaking failed" }, { status: 500 })
  }
}
