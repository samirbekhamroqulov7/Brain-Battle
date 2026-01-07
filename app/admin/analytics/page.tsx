"use client"

import { useState, useEffect } from "react"
import { revenueTracker } from "@/lib/ads/ad-revenue-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [estimatedRevenue, setEstimatedRevenue] = useState(0)

  useEffect(() => {
    const allMetrics = revenueTracker.getAllMetrics()
    setMetrics(allMetrics)
    setEstimatedRevenue(revenueTracker.estimateDailyRevenue())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Ad Analytics</h1>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Estimated Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${estimatedRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Based on current metrics</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {metrics.reduce((sum, m) => sum + m.impressions, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Ads shown</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{metrics.reduce((sum, m) => sum + m.clicks, 0)}</div>
              <p className="text-xs text-gray-500 mt-1">User interactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">
                {(metrics.reduce((sum, m) => sum + m.ctr, 0) / metrics.length).toFixed(2)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Click-through rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Ad Placement Performance</CardTitle>
            <CardDescription>Detailed metrics for each ad placement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-gray-400">Placement</th>
                    <th className="text-left py-2 px-4 text-gray-400">Impressions</th>
                    <th className="text-left py-2 px-4 text-gray-400">Clicks</th>
                    <th className="text-left py-2 px-4 text-gray-400">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.placement} className="border-b border-gray-700">
                      <td className="py-2 px-4 text-white">{metric.placement}</td>
                      <td className="py-2 px-4 text-gray-300">{metric.impressions}</td>
                      <td className="py-2 px-4 text-gray-300">{metric.clicks}</td>
                      <td className="py-2 px-4 text-gray-300">{metric.ctr.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
