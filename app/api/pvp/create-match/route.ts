import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { gameType } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: match, error } = await supabase
      .from("matches")
      .insert([
        {
          game_id: gameType,
          mode: "pvp",
          status: "waiting",
          game_state: {},
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Add user as first participant
    await supabase.from("match_participants").insert([
      {
        match_id: match.id,
        user_id: user.id,
        is_ready: false,
      },
    ])

    return NextResponse.json({ match })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
  }
}
