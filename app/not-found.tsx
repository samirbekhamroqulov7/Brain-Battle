"use client"

import Link from "next/link"
import { GameButton } from "@/components/ui/game-button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
          <span className="text-5xl font-bold text-purple-400">404</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
        </p>

        <Link href="/">
          <GameButton className="w-full h-14 flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </GameButton>
        </Link>
      </div>
    </div>
  )
}
