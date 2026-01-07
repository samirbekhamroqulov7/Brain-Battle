// PvP Lobby component for matchmaking

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PvPLobbyProps {
  gameType: string
  userId: string
  onMatchFound: (roomId: string, opponentId: string) => void
}

export function PvPLobby({ gameType, userId, onMatchFound }: PvPLobbyProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [waitTime, setWaitTime] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!isSearching) return

    const searchInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/pvp/matchmake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, gameType }),
        })

        const data = await response.json()

        if (data.matched) {
          setIsSearching(false)
          onMatchFound(data.roomId, data.opponent.userId)
        } else {
          setQueuePosition(data.queuePosition)
          setWaitTime((prev) => prev + 1)
        }
      } catch (error) {
        console.error("[Matchmaking Error]", error)
      }
    }, 2000)

    return () => clearInterval(searchInterval)
  }, [isSearching, gameType, userId, onMatchFound])

  const handleStartSearch = () => {
    setIsSearching(true)
    setQueuePosition(null)
    setWaitTime(0)
  }

  const handleCancel = () => {
    setIsSearching(false)
    router.back()
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8 text-center">
      {!isSearching ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Find Opponent</h2>
          <p className="text-gray-400">Ready to challenge someone?</p>
          <Button onClick={handleStartSearch} className="w-full" size="lg">
            Find Match
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Searching...</h2>
            <p className="text-gray-400 mb-4">Finding the best opponent for you</p>
            {queuePosition !== null && <p className="text-sm text-gray-500">Queue: {queuePosition} players ahead</p>}
            <p className="text-sm text-gray-500">Wait time: {waitTime}s</p>
          </div>
          <Button onClick={handleCancel} variant="outline" className="w-full bg-transparent">
            Cancel
          </Button>
        </div>
      )}
    </Card>
  )
}
