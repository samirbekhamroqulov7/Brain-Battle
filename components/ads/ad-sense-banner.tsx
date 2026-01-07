"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { adManager } from "@/lib/ads/ad-manager"

interface AdSenseBannerProps {
  slot: string
  format?: "auto" | "horizontal" | "vertical"
  className?: string
  style?: React.CSSProperties
}

export function AdSenseBanner({ slot, format = "auto", className = "", style = {} }: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adManager.shouldShowAds()) return

    // Initialize Google AdSense if not already done
    if (typeof window !== "undefined" && !(window as any).adsbygoogle) {
      const script = document.createElement("script")
      script.async = true
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }

    // Push ad when component mounts
    if ((window as any).adsbygoogle) {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        adManager.trackAdImpression(`adsense_${slot}`)
      } catch (e) {
        console.error("AdSense error:", e)
      }
    }
  }, [slot])

  if (!adManager.shouldShowAds()) {
    return null
  }

  return (
    <div
      ref={adRef}
      className={`ad-banner ${className}`}
      style={style}
      onClick={() => adManager.trackAdClick(`adsense_${slot}`)}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
