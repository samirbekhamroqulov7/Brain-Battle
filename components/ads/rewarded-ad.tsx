"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { adManager } from "@/lib/ads/ad-manager"
import { Gift, Loader2 } from "lucide-react"

interface RewardedAdProps {
  onReward: (amount: number) => void
  rewardAmount?: number
  adType?: string
  className?: string
}

export function RewardedAd({ onReward, rewardAmount = 100, adType = "video", className = "" }: RewardedAdProps) {
  const [loading, setLoading] = useState(false)
  const [adReady, setAdReady] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    // Simulate ad readiness
    if (adManager.shouldShowAds()) {
      const timer = setTimeout(() => setAdReady(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((c) => c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleWatchAd = async () => {
    if (!adManager.shouldShowAds() || loading || cooldown > 0) return

    setLoading(true)
    // Simulate ad watch
    setTimeout(() => {
      adManager.trackAdReward(adType, rewardAmount)
      onReward(rewardAmount)
      setLoading(false)
      setCooldown(60) // 1 minute cooldown
    }, 3000)
  }

  if (!adManager.shouldShowAds() || !adReady) {
    return null
  }

  return (
    <Button
      onClick={handleWatchAd}
      disabled={loading || cooldown > 0}
      className={`gap-2 ${className}`}
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Watching ad...
        </>
      ) : cooldown > 0 ? (
        <>
          <Gift className="w-4 h-4" />
          Available in {cooldown}s
        </>
      ) : (
        <>
          <Gift className="w-4 h-4" />
          Watch Ad (+{rewardAmount} coins)
        </>
      )}
    </Button>
  )
}
