import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?message=No authorization code received", requestUrl.origin)
    )
  }
  
  try {
    const supabase = await createClient()
    
    await supabase.auth.exchangeCodeForSession(code)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(
        new URL(`/auth/error?message=${encodeURIComponent("User session initialization failed")}`, requestUrl.origin)
      )
    }
    
    const username = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     `User_${Math.random().toString(36).substr(2, 8)}`
    
    const avatarUrl = user.user_metadata?.avatar_url || 
                     user.user_metadata?.picture || 
                     `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    
    await supabase
      .from("users")
      .upsert({
        auth_id: user.id,
        email: user.email,
        username: username.substring(0, 20),
        avatar_url: avatarUrl,
        avatar_frame: 'none',
        nickname_style: 'normal',
        language: "ru",
        sound_enabled: true,
        music_enabled: true,
        isGuest: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'auth_id'
      })
    
    try {
      await supabase.from("mastery").upsert({
        user_id: user.id,
        level: 1,
        mini_level: 0,
        fragments: 0,
        total_wins: 0,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      
      await supabase.from("glory").upsert({
        user_id: user.id,
        level: 1,
        wins: 0,
        total_glory_wins: 0,
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } catch (error) {
      console.error("Error creating mastery/glory:", error)
    }
    
    const response = NextResponse.redirect(new URL('/', requestUrl.origin))
    
    response.cookies.set({
      name: 'auth_refresh',
      value: '1',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5,
      path: '/'
    })
    
    return response
    
  } catch (error: any) {
    console.error("Unexpected error in callback:", error)
    
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent("Unexpected authentication error")}`, requestUrl.origin)
    )
  }
}
