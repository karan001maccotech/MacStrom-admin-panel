"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Target,
  Zap,
  Globe,
  Smartphone,
  Loader2,
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Mock data for charts and analytics
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [
      { date: "2024-01-01", users: 1200, newUsers: 45 },
      { date: "2024-01-02", users: 1245, newUsers: 67 },
      { date: "2024-01-03", users: 1312, newUsers: 89 },
      { date: "2024-01-04", users: 1401, newUsers: 123 },
      { date: "2024-01-05", users: 1524, newUsers: 156 },
      { date: "2024-01-06", users: 1680, newUsers: 178 },
      { date: "2024-01-07", users: 1858, newUsers: 201 },
    ],
    revenueData: [
      { date: "2024-01-01", revenue: 2400, tournaments: 12 },
      { date: "2024-01-02", revenue: 3200, tournaments: 15 },
      { date: "2024-01-03", revenue: 2800, tournaments: 11 },
      { date: "2024-01-04", revenue: 4100, tournaments: 18 },
      { date: "2024-01-05", revenue: 3600, tournaments: 16 },
      { date: "2024-01-06", revenue: 5200, tournaments: 22 },
      { date: "2024-01-07", revenue: 4800, tournaments: 20 },
    ],
    gamePopularity: [
      { game: "Mobile Legends", players: 3420, percentage: 34.2 },
      { game: "PUBG Mobile", players: 2890, percentage: 28.9 },
      { game: "Free Fire", players: 1560, percentage: 15.6 },
      { game: "Call of Duty Mobile", players: 1230, percentage: 12.3 },
      { game: "Clash Royale", players: 900, percentage: 9.0 },
    ],
  })

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        // Simulated API call - replace with actual endpoint
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
        setError("Failed to fetch analytics data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  const kpiMetrics = [
    {
      title: "Total Revenue",
      value: "$127,450",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "Last 30 days",
    },
    {
      title: "Active Players",
      value: "18,247",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      description: "Currently online",
    },
    {
      title: "Tournaments Completed",
      value: "156",
      change: "+15.3%",
      changeType: "positive",
      icon: Trophy,
      description: "This month",
    },
    {
      title: "Conversion Rate",
      value: "3.8%",
      change: "-0.5%",
      changeType: "negative",
      icon: Target,
      description: "Registration to payment",
    },
    {
      title: "Avg Session Duration",
      value: "24m 32s",
      change: "+2.1%",
      changeType: "positive",
      icon: Activity,
      description: "Per user session",
    },
    {
      title: "Retention Rate",
      value: "68.4%",
      change: "+4.2%",
      changeType: "positive",
      icon: RefreshCw,
      description: "7-day retention",
    },
  ]

  const topPerformers = [
    { rank: 1, username: "ProGamer123", earnings: 5420, tournaments: 23, winRate: 78.3 },
    { rank: 2, username: "EliteSniper", earnings: 4890, tournaments: 19, winRate: 84.2 },
    { rank: 3, username: "MobileKing", earnings: 4230, tournaments: 21, winRate: 71.4 },
    { rank: 4, username: "GameMaster", earnings: 3980, tournaments: 17, winRate: 76.5 },
    { rank: 5, username: "SkillShot", earnings: 3650, tournaments: 15, winRate: 80.0 },
  ]

  const geographicData = [
    { country: "United States", users: 4520, percentage: 28.5 },
    { country: "India", users: 3890, percentage: 24.5 },
    { country: "Brazil", users: 2340, percentage: 14.7 },
    { country: "Indonesia", users: 1890, percentage: 11.9 },
    { country: "Philippines", users: 1560, percentage: 9.8 },
    { country: "Others", users: 1700, percentage: 10.6 },
  ]

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive platform insights and metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Icon className="h-8 w-8 text-gray-400 mb-2" />
                    <div
                      className={`flex items-center space-x-1 ${
                        metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>User Growth Trend</span>
            </CardTitle>
            <CardDescription>Daily active users and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.date}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{data.users.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Total Users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{data.newUsers}</p>
                      <p className="text-xs text-gray-500">New Users</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Analytics</span>
            </CardTitle>
            <CardDescription>Daily revenue and tournament activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.date}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">${data.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{data.tournaments}</p>
                      <p className="text-xs text-gray-500">Tournaments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Game Popularity</span>
            </CardTitle>
            <CardDescription>Most played games by user count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.gamePopularity.map((game, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{game.game}</span>
                    <span className="text-sm text-gray-600">{game.percentage}%</span>
                  </div>
                  <Progress value={game.percentage} className="h-2" />
                  <p className="text-xs text-gray-500">{game.players.toLocaleString()} players</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>Highest earning players this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((player) => (
                <div key={player.rank} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge
                      variant={player.rank <= 3 ? "default" : "secondary"}
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                    >
                      {player.rank}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{player.username}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>${player.earnings}</span>
                      <span>•</span>
                      <span>{player.tournaments} tournaments</span>
                      <span>•</span>
                      <span>{player.winRate}% win rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Geographic Distribution</span>
            </CardTitle>
            <CardDescription>User distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((country, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{country.country}</span>
                    <span className="text-sm text-gray-600">{country.percentage}%</span>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                  <p className="text-xs text-gray-500">{country.users.toLocaleString()} users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Platform Health Metrics</span>
          </CardTitle>
          <CardDescription>Real-time system performance and user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">98.7%</p>
              <p className="text-sm text-gray-600">Uptime</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">245ms</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Good</Badge>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Smartphone className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">87.3%</p>
              <p className="text-sm text-gray-600">Mobile Users</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">High</Badge>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <RefreshCw className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">4.2/5</p>
              <p className="text-sm text-gray-600">User Satisfaction</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
