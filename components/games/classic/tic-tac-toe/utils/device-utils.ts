export function getCellSize(device: 'mobile' | 'tablet' | 'desktop', boardSize: number): string {
  if (boardSize === 3) {
    return device === 'mobile' ? 'w-20 h-20' : device === 'tablet' ? 'w-24 h-24' : 'w-32 h-32'
  }
  if (boardSize === 5) {
    return device === 'mobile' ? 'w-12 h-12' : device === 'tablet' ? 'w-16 h-16' : 'w-20 h-20'
  }
  return device === 'mobile' ? 'w-8 h-8' : device === 'tablet' ? 'w-12 h-12' : 'w-16 h-16'
}

export function getFontSize(device: 'mobile' | 'tablet' | 'desktop', boardSize: number): string {
  if (boardSize === 3) {
    return device === 'mobile' ? 'text-4xl' : device === 'tablet' ? 'text-5xl' : 'text-6xl'
  }
  if (boardSize === 5) {
    return device === 'mobile' ? 'text-2xl' : device === 'tablet' ? 'text-3xl' : 'text-4xl'
  }
  return device === 'mobile' ? 'text-xl' : device === 'tablet' ? 'text-2xl' : 'text-3xl'
}

export function shouldReduceAnimations(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
