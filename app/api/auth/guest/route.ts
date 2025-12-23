import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const guestName = `Guest_${guestId.slice(-4)}`
    
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          is_guest: true,
          guest_id: guestId,
          guest_name: guestName,
          created_at: new Date().toISOString(),
        },
      },
    })
    
    if (error) {
      throw error
    }
    
    const { error: profileError } = await supabase
      .from("users")
      .upsert({
        auth_id: data.user?.id,
        email: null,
        username: guestName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestName}`,
        avatar_frame: "none",
        nickname_style: "normal",
        language: "ru",
        sound_enabled: true,
        music_enabled: true,
        isGuest: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'auth_id'
      })
    
    if (profileError) {
      console.error("Guest profile error:", profileError)
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        username: guestName,
        isGuest: true,
      },
      session: data.session,
    })
    
  } catch (error: any) {
    console.error("Guest auth error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
