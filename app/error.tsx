"use client"

import { GameButton } from "@/components/ui/game-button"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-gray-300 mb-2">Something went wrong</p>
        <p className="text-gray-400 text-sm mb-8">{error?.message || "An unexpected error occurred"}</p>

        <div className="space-y-3">
          <GameButton onClick={() => reset()} className="w-full h-12">
            Try Again
          </GameButton>
          <GameButton variant="secondary" onClick={() => router.push("/")} className="w-full h-12">
            Go Home
          </GameButton>
        </div>
      </div>
    </div>
  )
}
