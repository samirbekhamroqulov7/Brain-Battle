import { NextResponse } from "next/server"
import { createGuestSession } from "@/lib/auth/session"

export async function POST() {
  try {
    const sessionToken = await createGuestSession()
    
    // Возвращаем данные для клиента
    return NextResponse.json({
      success: true,
      sessionToken,
      user: {
        id: "guest_" + Date.now(),
        username: "Гость",
        isGuest: true,
      },
      instructions: {
        localStorage: {
          "brain_battle_guest_mode": "true",
          "brain_battle_guest_name": "Гость",
          "brain_battle_guest_profile": JSON.stringify({
            id: "guest_" + Date.now(),
            username: "Гость",
            avatar_url: null,
            isGuest: true
          })
        }
      }
    })
  } catch (error: unknown) {
    console.error("Guest auth error:", error)
    return NextResponse.json({ error: "Failed to create guest account" }, { status: 500 })
  }
}
