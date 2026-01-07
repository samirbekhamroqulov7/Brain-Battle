// Track ad revenue and performance metrics
export interface AdRevenueMetric {
  placement: string
  impressions: number
  clicks: number
  ctr: number // Click-through rate
  estimatedRevenue: number
  timestamp: Date
}

export class AdRevenueTracker {
  private static instance: AdRevenueTracker
  private metrics: Map<string, AdRevenueMetric> = new Map()

  private constructor() {}

  static getInstance(): AdRevenueTracker {
    if (!AdRevenueTracker.instance) {
      AdRevenueTracker.instance = new AdRevenueTracker()
    }
    return AdRevenueTracker.instance
  }

  recordImpression(placement: string): void {
    const metric = this.metrics.get(placement) || {
      placement,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      estimatedRevenue: 0,
      timestamp: new Date(),
    }
    metric.impressions++
    this.metrics.set(placement, metric)
  }

  recordClick(placement: string): void {
    const metric = this.metrics.get(placement)
    if (metric) {
      metric.clicks++
      metric.ctr = (metric.clicks / metric.impressions) * 100
    }
  }

  getMetrics(placement: string): AdRevenueMetric | undefined {
    return this.metrics.get(placement)
  }

  getAllMetrics(): AdRevenueMetric[] {
    return Array.from(this.metrics.values())
  }

  estimateDailyRevenue(): number {
    // Rough estimate: average $0.50 per 1000 impressions
    const totalImpressions = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.impressions, 0)
    return (totalImpressions / 1000) * 0.5
  }
}

export const revenueTracker = AdRevenueTracker.getInstance()
