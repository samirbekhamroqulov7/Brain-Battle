import { NextResponse } from "next/server"
import { createGuestSession } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    // Временная заглушка - всегда создаем гостевую сессию
    const sessionToken = await createGuestSession()
    
    return NextResponse.json({
      success: true,
      message: "Email verification skipped (guest mode)",
      user: {
        id: "guest_" + Date.now(),
        username: "Гость",
        isGuest: true,
      },
    })
  } catch (error: unknown) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
