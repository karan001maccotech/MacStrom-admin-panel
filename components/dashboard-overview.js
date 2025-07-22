"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Trophy,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Plus,
  Play,
  Bell,
  Wallet,
  AlertTriangle,
  Vote,
  Crown,
  ExternalLink,
  Maximize2,
  Loader2,
} from "lucide-react"

export default function DashboardOverview({ stats, userRole = "admin" }) {
  const [kpiData, setKpiData] = useState(null)
  const [plData, setPlData] = useState(null)
  const [liveMatch, setLiveMatch] = useState(null)
  const [adBanner, setAdBanner] = useState(null)
  const [wsConnection, setWsConnection] = useState(null)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch KPI data from /api/stats/kpis REST endpoint
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/stats/kpis")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setKpiData(data)
      } catch (error) {
        console.error("Failed to fetch KPI data:", error)
        setError("Failed to fetch KPI data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchKPIs()
    // Refresh KPIs every 30 seconds
    const interval = setInterval(fetchKPIs, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch P&L data from /api/stats/pl_today REST endpoint (super admin only)
  useEffect(() => {
    const fetchPLData = async () => {
      if (userRole !== "super_admin") return

      try {
        setIsLoading(true)
        const response = await fetch("/api/stats/pl_today")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPlData(data)
      } catch (error) {
        console.error("Failed to fetch P&L data:", error)
        setError("Failed to fetch P&L data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPLData()
    // Refresh P&L every 5 minutes
    const interval = setInterval(fetchPLData, 300000)
    return () => clearInterval(interval)
  }, [userRole])

  // WebSocket connection for live match status
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Replace with actual WebSocket endpoint
        const ws = new WebSocket("wss://api.battlenation.com/ws/livematchstatus")

        ws.onopen = () => {
          console.log("Connected to live match WebSocket")
          setWsConnection(ws)
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          setLiveMatch(data)
        }

        ws.onclose = () => {
          console.log("WebSocket connection closed, attempting to reconnect...")
          setTimeout(connectWebSocket, 5000) // Reconnect after 5 seconds
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
        }

        return ws
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error)
        // Fallback to simulated data
        setLiveMatch({
          matchId: "MATCH-789",
          title: "Phoenix Warriors vs Thunder Bolts",
          game: "Mobile Legends",
          status: "live",
          timer: "23:45",
          spectators: 1250,
          teams: [
            { name: "Phoenix Warriors", tag: "PHX", score: 1 },
            { name: "Thunder Bolts", tag: "TBT", score: 2 },
          ],
        })
      }
    }

    const ws = connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  // Fetch ad banner from ads?placement=banner endpoint
  useEffect(() => {
    const fetchAdBanner = async () => {
      try {
        // Simulated API call - replace with actual endpoint
        const response = await fetch("/api/ads?placement=banner")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAdBanner(data)

        // Rotate ad banner every 30 seconds
        const interval = setInterval(async () => {
          const newResponse = await fetch("/api/ads?placement=banner")
          const newData = await newResponse.json()
          setAdBanner(newData)
        }, data.duration)

        return () => clearInterval(interval)
      } catch (error) {
        console.error("Failed to fetch ad banner:", error)
      }
    }

    fetchAdBanner()
  }, [])

  useEffect(() => {
    if (kpiData && (userRole !== "super_admin" || plData)) {
      setIsLoading(false)
    }
  }, [kpiData, plData, userRole])

  const handleQuickAction = (action) => {
    setShowQuickActions(false)
    switch (action) {
      case "match":
        // Navigate to create match
        console.log("Creating new match...")
        break
      case "notification":
        // Navigate to send notification
        console.log("Sending notification...")
        break
      case "payout":
        // Navigate to process payout
        console.log("Processing payout...")
        break
    }
  }

  const openSuperAdminPL = () => {
    // Navigate to Super Admin P&L tab
    console.log("Opening Super Admin P&L tab...")
  }

  const openMatchRoom = () => {
    if (liveMatch) {
      // Navigate to match room
      console.log(`Opening match room for ${liveMatch.matchId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Live KPIs and shortcuts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 24 hours
          </Button>
        </div>
      </div>

      {/* Live Match Banner */}
      {liveMatch && (
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge className="bg-red-100 text-red-800">
                    <Play className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{liveMatch.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{liveMatch.game}</span>
                    <span>Match ID: {liveMatch.matchId}</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {liveMatch.timer}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {liveMatch.spectators} watching
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {liveMatch.teams.map((team, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold">{team.score}</div>
                      <div className="text-xs text-gray-600">{team.tag}</div>
                    </div>
                  ))}
                </div>
                <Button onClick={openMatchRoom} size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Match Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards from /api/stats/kpis REST endpoint */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Users KPI */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.users.active.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">of {kpiData.users.total.toLocaleString()} total</p>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    kpiData.users.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpiData.users.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">+{kpiData.users.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue KPI */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue Today</CardTitle>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">${kpiData.revenue.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Gross revenue</p>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    kpiData.revenue.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpiData.revenue.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">+{kpiData.revenue.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Teams KPI */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Teams</CardTitle>
                <Trophy className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.activeTeams.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Competing teams</p>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    kpiData.activeTeams.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpiData.activeTeams.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">+{kpiData.activeTeams.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Votes KPI */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Votes (State/Nat)</CardTitle>
                <Vote className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpiData.votes.state.toLocaleString()}/{kpiData.votes.national.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">State/National</p>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    kpiData.votes.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpiData.votes.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">+{kpiData.votes.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Problems KPI */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Open Problems</CardTitle>
                <AlertTriangle className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.openProblems.total}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpiData.openProblems.critical}C, {kpiData.openProblems.high}H, {kpiData.openProblems.medium}M
                  </p>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    kpiData.openProblems.changeType === "positive" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {kpiData.openProblems.changeType === "positive" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">{kpiData.openProblems.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profit & Loss Card - Super Admin Only */}
      {userRole === "super_admin" && plData && (
        <Card
          className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={openSuperAdminPL}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">Today's Profit & Loss</CardTitle>
                <Badge className="bg-purple-100 text-purple-800">Super Admin Only</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-purple-700">Click to open detailed P&L</span>
                <Maximize2 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <CardDescription className="text-purple-700">Data source: /stats/pl_today REST</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">Gross Revenue</p>
                <p className="text-2xl font-bold text-purple-900">${plData.grossRevenue.toLocaleString()}</p>
                <div className="flex items-center justify-center mt-1 text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+{plData.comparison.revenue}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">Total Costs</p>
                <p className="text-2xl font-bold text-purple-900">${plData.totalCosts.toLocaleString()}</p>
                <div className="flex items-center justify-center mt-1 text-red-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+{plData.comparison.costs}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">Net P/L</p>
                <p className="text-2xl font-bold text-purple-900">${plData.netProfitLoss.toLocaleString()}</p>
                <div className="flex items-center justify-center mt-1 text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+{plData.comparison.profit}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-900">{plData.profitMargin}%</p>
                <Progress value={plData.profitMargin} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ad Banner Slot */}
      {adBanner && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={adBanner.imageUrl || "/placeholder.svg"}
                alt={adBanner.title}
                className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(adBanner.clickUrl, "_blank")}
              />
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-black/70 text-white">Sponsored by {adBanner.sponsor}</Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-white/90">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {adBanner.title}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {showQuickActions && (
            <div className="absolute bottom-16 right-0 space-y-2">
              <Button
                onClick={() => handleQuickAction("payout")}
                className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
                size="sm"
              >
                <Wallet className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleQuickAction("notification")}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                size="sm"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleQuickAction("match")}
                className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                size="sm"
              >
                <Calendar className="h-5 w-5" />
              </Button>
            </div>
          )}
          <Button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={`w-14 h-14 rounded-full shadow-lg transition-transform ${
              showQuickActions ? "rotate-45 bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
            }`}
            size="sm"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Labels (when expanded) */}
      {showQuickActions && (
        <div className="fixed bottom-6 right-20 z-40 space-y-2">
          <div className="text-right space-y-2">
            <div className="bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">Process Payout</div>
            <div className="bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">Send Notification</div>
            <div className="bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">Schedule Match</div>
          </div>
        </div>
      )}
    </div>
  )
}
