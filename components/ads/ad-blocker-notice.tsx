"use client"

import { useEffect, useState } from "react"
import { adManager } from "@/lib/ads/ad-manager"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdBlockerNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const detected = adManager.isAdBlockerDetected()
    if (detected) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-amber-600 text-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Ad Blocker Detected</h3>
          <p className="text-sm mb-3">
            Please disable your ad blocker to support us. Free ads help keep Brain Battle running!
          </p>
          <Button size="sm" variant="secondary" onClick={() => setShow(false)}>
            Got it
          </Button>
        </div>
        <button onClick={() => setShow(false)} className="flex-shrink-0 text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
