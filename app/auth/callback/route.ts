import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  console.log("[v0] OAuth callback started")

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] OAuth callback error:", error)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
    }

    if (data.user) {
      console.log("[v0] User authenticated:", data.user.id)

      const username = data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || 
                      data.user.email?.split("@")[0] || 
                      `user_${Date.now()}`

      const { error: profileError } = await supabase.from("users").upsert({
        auth_id: data.user.id,
        email: data.user.email || "",
        username: username.substring(0, 20),
        avatar_url: data.user.user_metadata?.avatar_url || 
                   data.user.user_metadata?.picture ||
                   `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        avatar_frame: "none",
        nickname_style: "normal",
        language: "ru",
        sound_enabled: true,
        music_enabled: true,
        isGuest: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'auth_id',
        ignoreDuplicates: false
      })

      if (profileError) {
        console.error("[v0] Failed to create/update user profile:", profileError)
      } else {
        console.log("[v0] Profile created/updated successfully")

        try {
          await supabase.from("mastery").upsert({
            user_id: data.user.id,
            level: 1,
            mini_level: 0,
            fragments: 0,
            total_wins: 0,
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })

          await supabase.from("glory").upsert({
            user_id: data.user.id,
            level: 1,
            wins: 0,
            total_glory_wins: 0,
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })

          console.log("[v0] Stats initialized")
        } catch (statsError) {
          console.error("[v0] Stats init error:", statsError)
        }
      }

      // Double-check profile exists before redirect
      const { data: profileCheck } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", data.user.id)
        .maybeSingle()

      if (!profileCheck) {
        console.error("[v0] Profile still not found after creation attempt")
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent("Failed to create profile. Please contact support.")}`,
        )
      }

      // IMPORTANT: set small client-readable cookies so SessionRestorer can pick them up.
      // We set auth_refresh flag and non-httpOnly sb tokens so client JS can detect them and restore session.
      const redirectUrl = `${origin}/`

      const res = NextResponse.redirect(redirectUrl)

      // Set a short-lived flag to indicate client should restore session.
      res.cookies.set("auth_refresh", "1", { path: "/", maxAge: 60 })

      // If supabase returned a session, expose access/refresh tokens to client cookies (non-httpOnly)
      // so SessionRestorer (client) will be able to call supabase.auth.setSession(...)
      if (data.session) {
        // maxAge: ensure it's not negative; default to 60s if expires_at is missing
        const nowSec = Math.floor(Date.now() / 1000)
        const expiresAt = data.session.expires_at ? Math.max(60, data.session.expires_at - nowSec) : 60

        res.cookies.set("sb-access-token", data.session.access_token || "", {
          path: "/",
          maxAge: expiresAt,
          httpOnly: false,
          sameSite: "lax",
        })
        res.cookies.set("sb-refresh-token", data.session.refresh_token || "", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // keep refresh for longer; SessionRestorer will clear it
          httpOnly: false,
          sameSite: "lax",
        })
      }

      console.log("[v0] OAuth callback completed successfully (cookies set)")
      return res
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?message=No+code+provided`)
}