// Простая заглушка для гостевого режима
export interface Session {
  userId: string
  username: string
  isGuest: boolean
}

export async function createSession(userId: string, email: string, username: string, isGuest = false): Promise<string> {
  const session: Session = {
    userId,
    username,
    isGuest
  }

  const sessionToken = Buffer.from(JSON.stringify(session)).toString("base64")
  localStorage.setItem("brain_battle_session", sessionToken)
  
  return sessionToken
}

export async function createGuestSession(): Promise<string> {
  return createSession(
    "guest_" + Date.now(),
    "guest@brainbattle.com",
    "Гость",
    true
  )
}

export async function getSession(): Promise<Session | null> {
  try {
    const sessionToken = localStorage.getItem("brain_battle_session")
    if (!sessionToken) {
      return null
    }

    const session: Session = JSON.parse(Buffer.from(sessionToken, "base64").toString())
    return session
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  localStorage.removeItem("brain_battle_session")
}

export async function refreshSession(session: Session): Promise<void> {
  await createSession(session.userId, "", session.username, session.isGuest)
}
