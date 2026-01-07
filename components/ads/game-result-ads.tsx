"use client"

import type { ReactNode } from "react"
import { AdSenseBanner } from "./ad-sense-banner"
import { RewardedAd } from "./rewarded-ad"
import { adManager } from "@/lib/ads/ad-manager"

interface GameResultAdsProps {
  isWin: boolean
  onCoinReward: (amount: number) => void
  children: ReactNode
}

export function GameResultAds({ isWin, onCoinReward, children }: GameResultAdsProps) {
  if (!adManager.shouldShowAds()) {
    return <>{children}</>
  }

  return (
    <div className="space-y-6">
      {/* Top banner ad */}
      <AdSenseBanner slot="results_banner_top" format="horizontal" />

      {/* Main content */}
      {children}

      {/* Reward for watching video ad */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-500/20">
        <h3 className="font-semibold text-amber-300 mb-3">Earn Extra Coins</h3>
        <RewardedAd onReward={(amount) => onCoinReward(amount)} rewardAmount={50} adType="video" className="w-full" />
      </div>

      {/* Bottom banner ad */}
      <AdSenseBanner slot="results_banner_bottom" format="horizontal" />
    </div>
  )
}
