// Ad management service for handling ad placements and tracking
export class AdManager {
  private static instance: AdManager
  private adBlockerDetected = false
  private adConsent = true
  private userAdsDisabled = false

  private constructor() {
    this.detectAdBlocker()
    this.loadUserPreferences()
  }

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager()
    }
    return AdManager.instance
  }

  private detectAdBlocker(): void {
    if (typeof window !== "undefined") {
      const testElement = document.createElement("div")
      testElement.className = "ad-banner"
      testElement.style.display = "none"
      document.body.appendChild(testElement)

      this.adBlockerDetected = window.getComputedStyle(testElement).display === "none" && !testElement.offsetHeight
      document.body.removeChild(testElement)
    }
  }

  private loadUserPreferences(): void {
    if (typeof localStorage !== "undefined") {
      const disableAds = localStorage.getItem("brain_battle_disable_ads")
      this.userAdsDisabled = disableAds === "true"

      const consent = localStorage.getItem("brain_battle_ad_consent")
      this.adConsent = consent !== "false"
    }
  }

  isAdBlockerDetected(): boolean {
    return this.adBlockerDetected
  }

  shouldShowAds(): boolean {
    return this.adConsent && !this.userAdsDisabled && !this.adBlockerDetected
  }

  setAdConsent(consent: boolean): void {
    this.adConsent = consent
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("brain_battle_ad_consent", String(consent))
    }
  }

  disableAdsForUser(disable: boolean): void {
    this.userAdsDisabled = disable
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("brain_battle_disable_ads", String(disable))
    }
  }

  // Track ad impressions
  trackAdImpression(placement: string): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "ad_impression", {
        placement,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Track ad clicks
  trackAdClick(placement: string): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "ad_click", {
        placement,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Reward for watching ad
  trackAdReward(adType: string, reward: number): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "ad_reward", {
        ad_type: adType,
        reward_amount: reward,
        timestamp: new Date().toISOString(),
      })
    }
  }
}

export const adManager = AdManager.getInstance()
