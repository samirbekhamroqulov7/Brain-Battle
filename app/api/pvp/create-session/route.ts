// Create a new game session

import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { roomId, gameType } = await request.json()

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

    // Update room status
    const { data: updatedRoom } = await supabase
      .from("rooms")
      .update({
        status: "playing",
        started_at: new Date().toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single()

    // Create game session
    const { data: session } = await supabase
      .from("game_sessions")
      .insert({
        room_id: roomId,
        game_type: gameType,
        result: "ongoing",
        session_data: {
          startTime: Date.now(),
          moves: [],
        },
      })
      .select()
      .single()

    return NextResponse.json({
      sessionId: session.id,
      roomId: updatedRoom.id,
      startTime: updatedRoom.started_at,
    })
  } catch (error) {
    console.error("[Session Creation Error]", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
