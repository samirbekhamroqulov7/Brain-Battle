"use client"

import { useEffect, useRef } from "react"
import { adManager } from "@/lib/ads/ad-manager"

interface AdMobBannerProps {
  unitId: string
  className?: string
  onAdLoaded?: () => void
  onAdError?: (error: any) => void
}

export function AdMobBanner({ unitId, className = "", onAdLoaded, onAdError }: AdMobBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adManager.shouldShowAds()) return

    // Initialize Google Mobile Ads SDK
    if (typeof window !== "undefined") {
      const script = document.createElement("script")
      script.async = true
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
      script.crossOrigin = "anonymous"
      script.onload = () => {
        if ((window as any).adsbygoogle) {
          try {
            ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
              params: {
                cork: Math.random() * 1000000,
              },
            })
            onAdLoaded?.()
            adManager.trackAdImpression(`admob_${unitId}`)
          } catch (e) {
            onAdError?.(e)
            console.error("AdMob error:", e)
          }
        }
      }
      if (!document.querySelector(`script[src*="adsbygoogle"]`)) {
        document.head.appendChild(script)
      }
    }
  }, [unitId, onAdLoaded, onAdError])

  if (!adManager.shouldShowAds()) {
    return null
  }

  return (
    <div ref={adRef} className={`ad-mob-banner ${className}`} onClick={() => adManager.trackAdClick(`admob_${unitId}`)}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "50px",
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={unitId}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}
