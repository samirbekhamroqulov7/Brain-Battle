import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { matchId, winnerId, result } = await request.json()

    const supabase = await createClient()

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error finishing match:", error)
    return NextResponse.json({ error: "Failed to finish match" }, { status: 500 })
  }
}
