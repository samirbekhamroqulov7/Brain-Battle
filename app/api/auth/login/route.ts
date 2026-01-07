import { NextResponse } from "next/server"
import { createGuestSession } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    // Временная заглушка - всегда создаем гостевую сессию
    const sessionToken = await createGuestSession()
    
    localStorage.setItem("brain_battle_guest_mode", "true")
    localStorage.setItem("brain_battle_guest_name", "Гость")

    return NextResponse.json({
      success: true,
      message: "Logged in as guest (auth disabled)",
      user: {
        id: "guest_" + Date.now(),
        username: "Гость",
        isGuest: true,
      },
    })
  } catch (error: unknown) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
