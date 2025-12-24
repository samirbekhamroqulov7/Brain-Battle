import { NextResponse } from "next/server"
import { validateEmail, validatePassword, validateUsername } from "@/lib/auth/validation"
import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { createUser, getUserByEmail } from "@/lib/database/users"
import { createMastery, createGlory } from "@/lib/database/mastery"

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    // Validate input
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 })
    }

    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      return NextResponse.json({ error: usernameValidation.error }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const authId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const newUser = await createUser({
      auth_id: authId,
      email,
      username,
      password_hash: passwordHash,
      isGuest: false,
    })

    // Create mastery and glory
    await Promise.all([createMastery(newUser.id), createGlory(newUser.id)])

    // Create session
    await createSession(newUser.id, newUser.email, newUser.username, false)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    })
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
