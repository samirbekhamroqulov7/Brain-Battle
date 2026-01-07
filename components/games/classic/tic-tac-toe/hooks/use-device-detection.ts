"use client"

import { useState, useEffect } from 'react'

export function useDeviceDetection() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    const width = window.innerWidth
    const isTouch = 'ontouchstart' in window
    
    setTouch(isTouch)
    
    if (width < 768) setDevice('mobile')
    else if (width < 1024) setDevice('tablet')
    else setDevice('desktop')

    const handleResize = () => {
      const w = window.innerWidth
      if (w < 768) setDevice('mobile')
      else if (w < 1024) setDevice('tablet')
      else setDevice('desktop')
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { device, touch }
}
