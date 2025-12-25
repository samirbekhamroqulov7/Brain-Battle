import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()
    
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      )
    }
    
    if (code.length !== 6) {
      return NextResponse.json(
        { error: "Code must be 6 digits" },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Проверяем код
    const { data: verification, error: verifyError } = await supabase
      .rpc('verify_auth_code', {
        p_email: email,
        p_code: code
      })
    
    if (verifyError) throw verifyError
    
    if (!verification || !verification[0]?.is_valid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      )
    }
    
    // Получаем или создаем пользователя
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()
    
    // Если пользователя нет, создаем
    if (!user) {
      const username = email.split('@')[0]
      
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email,
          username,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          avatar_frame: "none",
          nickname_style: "normal",
          language: "ru",
          sound_enabled: true,
          music_enabled: true,
          isGuest: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (createError) throw createError
      user = newUser
    }
    
    // Создаем сессию
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password: `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })
    
    if (sessionError) {
      // Если пароль неверный, создаем нового пользователя через magic link
      const { data: magicData, error: magicError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })
      
      if (magicError) throw magicError
    }
    
    // Помечаем код как использованный
    await supabase.rpc('use_auth_code', {
      p_code_id: verification[0].auth_code_id
    })
    
    return NextResponse.json({ 
      success: true,
      session: sessionData?.session
    })
    
  } catch (error: any) {
    console.error("Verify code error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify code" },
      { status: 500 }
    )
  }
}