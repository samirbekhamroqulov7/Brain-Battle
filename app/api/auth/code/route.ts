import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Сохраняем код в БД
    const { data, error } = await supabase.rpc('create_auth_code', {
      p_email: email,
      p_code: code
    })
    
    if (error) throw error
    
    // Отправляем email с кодом
    await resend.emails.send({
      from: 'Brain Battle <noreply@yourdomain.com>',
      to: email,
      subject: 'Your Login Code - Brain Battle',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Brain Battle</h1>
          <p>Your login code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 10px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    })
    
    return NextResponse.json({ 
      success: true,
      message: "Code sent successfully" 
    })
    
  } catch (error: any) {
    console.error("Send code error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send code" },
      { status: 500 }
    )
  }
}