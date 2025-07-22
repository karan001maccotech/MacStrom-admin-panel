"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  Lock,
  Flag,
  Loader2,
  RefreshCw,
  BarChart3,
  Vote,
  Target,
  Shield,
  Users,
  TrendingUp,
  Ban,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VotingCenter() {
  const [stats, setStats] = useState(null)
  const [stateData, setStateData] = useState([])
  const [nationalData, setNationalData] = useState(null)
  const [fraudHeuristics, setFraudHeuristics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for tab and period selection (retained from previous versions)
  const [selectedTab, setSelectedTab] = useState("state")
  const [selectedPeriod, setSelectedPeriod] = useState("24h")
  const [selectedState, setSelectedState] = useState("California") // Default to California

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, stateRes, nationalRes, fraudRes] = await Promise.all([
        fetch("/api/voting/stats"),
        fetch("/api/voting/state-data"),
        fetch("/api/voting/national-data"),
        fetch("/api/voting/fraud-heuristics"),
      ])

      // Check for HTTP errors first
      if (!statsRes.ok) throw new Error(`Failed to fetch voting stats: ${statsRes.statusText}`)
      if (!stateRes.ok) throw new Error(`Failed to fetch state data: ${stateRes.statusText}`)
      if (!nationalRes.ok) throw new Error(`Failed to fetch national data: ${nationalRes.statusText}`)
      if (!fraudRes.ok) throw new Error(`Failed to fetch fraud heuristics: ${fraudRes.statusText}`)

      const statsData = await statsRes.json()
      const stateVotingData = await stateRes.json()
      const nationalVotingData = await nationalRes.json()
      const fraudHeuristicsData = await fraudRes.json()

      // Check for API-specific errors (if the API returns { error: "..." })
      if (statsData.error) throw new Error(statsData.details || statsData.error)
      if (stateVotingData.error) throw new Error(stateVotingData.details || stateVotingData.error)
      if (nationalVotingData.error) throw new Error(nationalVotingData.details || nationalVotingData.error)
      if (fraudHeuristicsData.error) throw new Error(fraudHeuristicsData.details || fraudHeuristicsData.error)

      console.log("Fetched voting stats:", statsData)
      setStats(statsData)
      setStateData(stateVotingData)
      setNationalData(nationalVotingData)
      setFraudHeuristics(fraudHeuristicsData)

      // Adjust selectedState if the default 'California' is not available or if 'all' was previously selected
      if (stateVotingData.length > 0 && !stateVotingData.some((s) => s.state_name === selectedState)) {
        setSelectedState(stateVotingData[0].state_name)
      }
    } catch (err) {
      console.error("Error fetching voting data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Determine chartData based on selectedTab and selectedState
  const chartData =
    selectedTab === "state"
      ? stateData.find((s) => s.state_name === selectedState)?.teams || []
      : nationalData?.team_votes || []

  const getFraudTooltip = (team) => {
    const flags = fraudHeuristics.filter((f) => f.teams && f.teams.includes(team.team_name))
    if (flags.length === 0) return null

    return flags.map((flag) => `${flag.type}: ${flag.reason}`).join("\n")
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Voting Center</h2>
          <p className="text-gray-600">Monitor vote analytics and fraud control</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BarChart3 className="h-4 w-4 mr-2" />}
            Analytics Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Vote className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-xl font-bold">{stats.total_votes?.toLocaleString() || "0"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Polls</p>
                  <p className="text-xl font-bold">{stats.active_polls || "0"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Suspicious</p>
                  <p className="text-xl font-bold">{stats.suspicious_activity || "0"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fraud Detected</p>
                  <p className="text-xl font-bold">{stats.fraud_detected || "0"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Participation</p>
                  <p className="text-xl font-bold">{stats.participation_rate?.toFixed(2) || "0.00"}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Top Voted</p>
                  <p className="text-sm font-bold">{stats.top_voted_team || "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTab === "state" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("state")}
          >
            <Flag className="h-4 w-4 mr-2" />
            State Voting
          </Button>
          <Button
            variant={selectedTab === "national" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("national")}
          >
            <Target className="h-4 w-4 mr-2" />
            National Voting
          </Button>
        </div>
        {selectedTab === "state" && (
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {stateData.length > 0 ? (
              <>
                {/* <option value="all">All States</option> */} {/* Removed 'all' as it complicates chartData logic */}
                {stateData.map((state) => (
                  <option key={state.state_name} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No states available</option>
            )}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedTab === "state" ? "State" : "National"} Voting Results</span>
              <div className="flex items-center space-x-2">
                {selectedTab === "state" && selectedState && (
                  <Badge
                    className={
                      stateData.find((s) => s.state_name === selectedState)?.is_locked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {stateData.find((s) => s.state_name === selectedState)?.is_locked ? (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </>
                    ) : (
                      "Active"
                    )}
                  </Badge>
                )}
                {selectedTab === "national" && nationalData && (
                  <Badge className={nationalData.is_locked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {nationalData.is_locked ? (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </>
                    ) : (
                      "Active"
                    )}
                  </Badge>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              {selectedTab === "state" ? "State-level voting breakdown" : "National voting results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="space-y-4 mb-6">
                {chartData.map((team) => (
                  <div key={team.team_name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{team.team_name}</span>
                        {team.fraud_flags > 0 && (
                          <div className="relative group">
                            <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              {getFraudTooltip(team)}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{team.percentage?.toFixed(2)}%</span>
                    </div>
                    <Progress value={team.percentage} className={`h-3 ${team.fraud_flags > 0 ? "bg-red-100" : ""}`} />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{team.votes?.toLocaleString()} votes</span>
                      {team.fraud_flags > 0 && <span className="text-red-600">{team.fraud_flags} fraud flags</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Ban className="h-4 w-4 mr-2" />
                Invalidate Votes
              </Button>
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Lock Voting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voting Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>Vote breakdown with fraud detection</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Votes</TableHead>
                      <TableHead className="text-right">%</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chartData.map((team) => (
                      <TableRow key={team.team_name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span>{team.team_name}</span>
                            {team.fraud_flags > 0 && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {team.fraud_flags}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{team.votes?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{team.percentage?.toFixed(2)}%</TableCell>
                        <TableCell className="text-center">
                          {team.fraud_flags > 0 ? (
                            <Badge className="bg-red-100 text-red-800">Flagged</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Clean</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Ban className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fraud Heuristics */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Fraud Detection Heuristics</span>
          </CardTitle>
          <CardDescription>Automated fraud detection alerts and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : fraudHeuristics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Affected Votes</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fraudHeuristics.map((heuristic) => (
                  <TableRow key={heuristic.id}>
                    <TableCell className="font-medium">{heuristic.type}</TableCell>
                    <TableCell>{heuristic.description}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(heuristic.severity)}>{heuristic.severity}</Badge>
                    </TableCell>
                    <TableCell>{heuristic.affected_votes?.toLocaleString()}</TableCell>
                    <TableCell>{heuristic.teams?.join(", ") || "N/A"}</TableCell>
                    <TableCell>{heuristic.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No fraud heuristics data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
