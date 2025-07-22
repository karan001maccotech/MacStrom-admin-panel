"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Settings, TrendingUp, AlertTriangle, DollarSign, Activity, StopCircle } from "lucide-react"

export default function DailyBets() {
  const [matches, setMatches] = useState([])
  const [markets, setMarkets] = useState([])
  const [liabilityData, setLiabilityData] = useState([])
  const [settlements, setSettlements] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("markets")

  // Mock data for demonstration
  useEffect(() => {
    const mockMatches = [
      {
        id: "M001",
        title: "Team Alpha vs Team Beta",
        startTime: "2024-01-15T18:00:00Z",
        status: "Live",
        totalStake: 15000,
        totalExposure: 12000,
        markets: [
          { id: "WIN", name: "Match Winner", odds: { teamA: 1.85, teamB: 1.95 }, status: "Active" },
          { id: "KILLS", name: "Total Kills Over/Under", odds: { over: 2.1, under: 1.7 }, line: 25, status: "Active" },
        ],
      },
      {
        id: "M002",
        title: "Team Gamma vs Team Delta",
        startTime: "2024-01-15T20:00:00Z",
        status: "Upcoming",
        totalStake: 8500,
        totalExposure: 7200,
        markets: [{ id: "WIN", name: "Match Winner", odds: { teamA: 2.2, teamB: 1.65 }, status: "Active" }],
      },
    ]
    setMatches(mockMatches)

    // Mock liability data for charts
    const mockLiabilityData = [
      { time: "18:00", totalStake: 5000, exposure: 4200 },
      { time: "18:15", totalStake: 8500, exposure: 7100 },
      { time: "18:30", totalStake: 12000, exposure: 9800 },
      { time: "18:45", totalStake: 15000, exposure: 12000 },
      { time: "19:00", totalStake: 18500, exposure: 14500 },
    ]
    setLiabilityData(mockLiabilityData)

    // Mock settlements
    const mockSettlements = [
      {
        id: "S001",
        matchId: "M001",
        matchTitle: "Team Alpha vs Team Beta",
        totalBets: 156,
        totalStake: 15000,
        totalPayout: 13500,
        platformProfit: 1500,
        settledAt: "2024-01-14T19:30:00Z",
        anomalies: [],
      },
      {
        id: "S002",
        matchId: "M002",
        matchTitle: "Team Gamma vs Team Delta",
        totalBets: 89,
        totalStake: 8500,
        totalPayout: 9200,
        platformProfit: -700,
        settledAt: "2024-01-14T21:15:00Z",
        anomalies: [{ type: "Large Payout", description: "Single bet won ₹3,500", userId: "U12345" }],
      },
    ]
    setSettlements(mockSettlements)
  }, [])

  // Real-time liability updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/betting-liability")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setLiabilityData((prev) => [...prev.slice(-9), data])

      // Update match stakes
      setMatches((prev) =>
        prev.map((match) =>
          match.id === data.matchId ? { ...match, totalStake: data.totalStake, totalExposure: data.exposure } : match,
        ),
      )
    }

    return () => ws.close()
  }, [])

  const handleConfigureMarket = (matchId, marketConfig) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              markets: match.markets.map((market) =>
                market.id === marketConfig.id ? { ...market, ...marketConfig } : market,
              ),
            }
          : match,
      ),
    )
    setIsConfigModalOpen(false)
  }

  const handleHaltBetting = (matchId, marketId) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              markets: match.markets.map((market) =>
                market.id === marketId ? { ...market, status: "Halted" } : market,
              ),
            }
          : match,
      ),
    )
  }

  const getStatusBadge = (status) => {
    const variants = {
      Active: "success",
      Halted: "destructive",
      Suspended: "warning",
      Settled: "secondary",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const ConfigureMarketModal = () => {
    const [marketConfig, setMarketConfig] = useState({
      id: "WIN",
      name: "Match Winner",
      odds: { teamA: 1.85, teamB: 1.95 },
      status: "Active",
    })

    return (
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Market</DialogTitle>
            <DialogDescription>Set odds and market parameters</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Market Type</Label>
              <Select
                value={marketConfig.id}
                onValueChange={(value) => setMarketConfig((prev) => ({ ...prev, id: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WIN">Match Winner</SelectItem>
                  <SelectItem value="KILLS">Total Kills Over/Under</SelectItem>
                  <SelectItem value="FIRST_BLOOD">First Blood</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Team A Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketConfig.odds.teamA}
                  onChange={(e) =>
                    setMarketConfig((prev) => ({
                      ...prev,
                      odds: { ...prev.odds, teamA: Number.parseFloat(e.target.value) },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Team B Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={marketConfig.odds.teamB}
                  onChange={(e) =>
                    setMarketConfig((prev) => ({
                      ...prev,
                      odds: { ...prev.odds, teamB: Number.parseFloat(e.target.value) },
                    }))
                  }
                />
              </div>
            </div>

            {marketConfig.id === "KILLS" && (
              <div>
                <Label>Over/Under Line</Label>
                <Input
                  type="number"
                  value={marketConfig.line || 25}
                  onChange={(e) => setMarketConfig((prev) => ({ ...prev, line: Number.parseInt(e.target.value) }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleConfigureMarket(selectedMatch, marketConfig)}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const LiabilityChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Live Liability
        </CardTitle>
        <CardDescription>Real-time stake vs exposure tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liabilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
            <Line type="monotone" dataKey="totalStake" stroke="#3b82f6" name="Total Stake" strokeWidth={2} />
            <Line type="monotone" dataKey="exposure" stroke="#ef4444" name="Exposure" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Bets</h1>
          <p className="text-muted-foreground">Manage betting markets and monitor liability</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Markets</p>
                <p className="text-2xl font-bold">
                  {matches.reduce((sum, m) => sum + m.markets.filter((mk) => mk.status === "Active").length, 0)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stake</p>
                <p className="text-2xl font-bold">
                  ₹{matches.reduce((sum, m) => sum + m.totalStake, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exposure</p>
                <p className="text-2xl font-bold">
                  ₹{matches.reduce((sum, m) => sum + m.totalExposure, 0).toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">
                  {(
                    ((matches.reduce((sum, m) => sum + m.totalStake, 0) -
                      matches.reduce((sum, m) => sum + m.totalExposure, 0)) /
                      matches.reduce((sum, m) => sum + m.totalStake, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="liability">Live Liability</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="space-y-4">
          <div className="grid gap-4">
            {matches.map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{match.title}</CardTitle>
                      <CardDescription>
                        {new Date(match.startTime).toLocaleString()} • Stake: ₹{match.totalStake.toLocaleString()} •
                        Exposure: ₹{match.totalExposure.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant={match.status === "Live" ? "destructive" : "secondary"}>{match.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {match.markets.map((market) => (
                      <div key={market.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{market.name}</span>
                            {getStatusBadge(market.status)}
                          </div>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>Team A: {market.odds.teamA}</span>
                            <span>Team B: {market.odds.teamB}</span>
                            {market.line && <span>Line: {market.line}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMatch(match.id)
                              setIsConfigModalOpen(true)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                          {market.status === "Active" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleHaltBetting(match.id, market.id)}
                            >
                              <StopCircle className="h-4 w-4 mr-1" />
                              Halt
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liability" className="space-y-4">
          <LiabilityChart />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{match.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Stake:</span>
                      <span className="font-medium">₹{match.totalStake.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exposure:</span>
                      <span className="font-medium text-red-600">₹{match.totalExposure.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potential Profit:</span>
                      <span className="font-medium text-green-600">
                        ₹{(match.totalStake - match.totalExposure).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(match.totalExposure / match.totalStake) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {((match.totalExposure / match.totalStake) * 100).toFixed(1)}% exposure
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Summary</CardTitle>
              <CardDescription>Completed match settlements and anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Match</TableHead>
                    <TableHead>Total Bets</TableHead>
                    <TableHead>Stake</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>Platform P&L</TableHead>
                    <TableHead>Settled At</TableHead>
                    <TableHead>Anomalies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell className="font-medium">{settlement.matchTitle}</TableCell>
                      <TableCell>{settlement.totalBets}</TableCell>
                      <TableCell>₹{settlement.totalStake.toLocaleString()}</TableCell>
                      <TableCell>₹{settlement.totalPayout.toLocaleString()}</TableCell>
                      <TableCell className={settlement.platformProfit >= 0 ? "text-green-600" : "text-red-600"}>
                        ₹{settlement.platformProfit.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(settlement.settledAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {settlement.anomalies.length > 0 ? (
                          <Badge variant="warning">{settlement.anomalies.length} anomalies</Badge>
                        ) : (
                          <Badge variant="success">Clean</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Anomalies Detail */}
          {settlements.some((s) => s.anomalies.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Settlement Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settlements
                    .filter((s) => s.anomalies.length > 0)
                    .map((settlement) => (
                      <div key={settlement.id} className="border rounded-lg p-3">
                        <h4 className="font-medium">{settlement.matchTitle}</h4>
                        {settlement.anomalies.map((anomaly, index) => (
                          <div key={index} className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                            <span className="font-medium text-yellow-800">{anomaly.type}:</span>
                            <span className="ml-2">{anomaly.description}</span>
                            {anomaly.userId && <span className="ml-2 text-blue-600">User: {anomaly.userId}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ConfigureMarketModal />
    </div>
  )
}
