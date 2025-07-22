"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Play,
  Square,
  Settings,
  Plus,
  Users,
  Gamepad2,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Target,
  Download,
  Copy,
  RefreshCw,
} from "lucide-react"

export default function MatchManagement() {
  const [selectedView, setSelectedView] = useState("calendar")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [autoSchedulerOpen, setAutoSchedulerOpen] = useState(false)
  const [matchCodesOpen, setMatchCodesOpen] = useState(false)

  // Auto scheduler form state
  const [schedulerForm, setSchedulerForm] = useState({
    stage: "State",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    startTime: "14:00",
    gapMinutes: 90,
  })

  // Match codes state
  const [editingCodes, setEditingCodes] = useState({})

  const matches = [
    {
      id: 1,
      title: "Phoenix Warriors vs Thunder Bolts",
      game: "Mobile Legends",
      type: "Tournament Semi-Final",
      status: "live",
      scheduledTime: "2024-01-08 15:00",
      actualStartTime: "2024-01-08 15:02",
      estimatedDuration: 45,
      currentDuration: 23,
      teams: [
        { id: 1, name: "Phoenix Warriors", tag: "PHX", score: 1 },
        { id: 2, name: "Thunder Bolts", tag: "TBT", score: 2 },
      ],
      roomId: "ROOM-789",
      spectators: 1250,
      streamUrl: "https://stream.battlenation.com/match-789",
      referee: "RefMaster01",
      killFeed: [
        { time: "23:45", player: "PHX_Sniper", action: "eliminated", target: "TBT_Warrior" },
        { time: "23:12", player: "TBT_Assassin", action: "eliminated", target: "PHX_Mage" },
        { time: "22:58", player: "PHX_Tank", action: "eliminated", target: "TBT_Support" },
      ],
      chatMessages: [
        { time: "23:50", user: "Spectator123", message: "Great play by PHX!" },
        { time: "23:48", user: "GameFan", message: "TBT comeback incoming" },
        { time: "23:45", user: "ProGamer", message: "Nice shot!" },
      ],
      shareCode: "MATCH789",
      issues: [],
    },
    {
      id: 2,
      title: "Shadow Hunters vs Storm Riders",
      game: "PUBG Mobile",
      type: "Daily Duel",
      status: "scheduled",
      scheduledTime: "2024-01-08 16:30",
      actualStartTime: null,
      estimatedDuration: 30,
      currentDuration: 0,
      teams: [
        { id: 3, name: "Shadow Hunters", tag: "SHD", score: 0 },
        { id: 4, name: "Storm Riders", tag: "STR", score: 0 },
      ],
      roomId: "ROOM-790",
      spectators: 0,
      streamUrl: null,
      referee: "RefMaster02",
      killFeed: [],
      chatMessages: [],
      shareCode: "MATCH790",
      issues: [],
    },
    {
      id: 3,
      title: "Elite Squad vs Pro Gamers",
      game: "Free Fire",
      type: "League Match",
      status: "completed",
      scheduledTime: "2024-01-08 14:00",
      actualStartTime: "2024-01-08 14:05",
      estimatedDuration: 35,
      currentDuration: 42,
      teams: [
        { id: 5, name: "Elite Squad", tag: "ELT", score: 3 },
        { id: 6, name: "Pro Gamers", tag: "PRO", score: 1 },
      ],
      roomId: "ROOM-788",
      spectators: 890,
      streamUrl: "https://stream.battlenation.com/match-788",
      referee: "RefMaster03",
      issues: [],
    },
    {
      id: 4,
      title: "Cyber Warriors vs Digital Knights",
      game: "Call of Duty Mobile",
      type: "Tournament Quarter-Final",
      status: "delayed",
      scheduledTime: "2024-01-08 17:00",
      actualStartTime: null,
      estimatedDuration: 50,
      currentDuration: 0,
      teams: [
        { id: 7, name: "Cyber Warriors", tag: "CYB", score: 0 },
        { id: 8, name: "Digital Knights", tag: "DIG", score: 0 },
      ],
      roomId: "ROOM-791",
      spectators: 0,
      streamUrl: null,
      referee: "RefMaster01",
      issues: [{ type: "technical", message: "Server connectivity issues", severity: "high" }],
    },
  ]

  const matchRooms = [
    {
      id: "ROOM-789",
      name: "Tournament Arena 1",
      game: "Mobile Legends",
      status: "occupied",
      capacity: 10,
      currentPlayers: 10,
      serverRegion: "US-East",
      ping: 23,
      uptime: 99.8,
    },
    {
      id: "ROOM-790",
      name: "Duel Chamber 2",
      game: "PUBG Mobile",
      status: "reserved",
      capacity: 8,
      currentPlayers: 0,
      serverRegion: "US-West",
      ping: 18,
      uptime: 99.9,
    },
    {
      id: "ROOM-791",
      name: "Championship Hall",
      game: "Call of Duty Mobile",
      status: "maintenance",
      capacity: 12,
      currentPlayers: 0,
      serverRegion: "EU-Central",
      ping: 45,
      uptime: 98.5,
    },
    {
      id: "ROOM-792",
      name: "Practice Arena",
      game: "Free Fire",
      status: "available",
      capacity: 6,
      currentPlayers: 0,
      serverRegion: "Asia-Pacific",
      ping: 12,
      uptime: 99.7,
    },
  ]

  const matchCodes = [
    {
      matchId: 1,
      matchTitle: "Phoenix Warriors vs Thunder Bolts",
      teams: [
        { name: "Phoenix Warriors", code: "PHX123", expiry: "2024-01-08T16:00", status: "active" },
        { name: "Thunder Bolts", code: "TBT456", expiry: "2024-01-08T16:00", status: "active" },
      ],
    },
    {
      matchId: 2,
      matchTitle: "Shadow Hunters vs Storm Riders",
      teams: [
        { name: "Shadow Hunters", code: "SHD789", expiry: "2024-01-08T17:30", status: "pending" },
        { name: "Storm Riders", code: "STR012", expiry: "2024-01-08T17:30", status: "pending" },
      ],
    },
  ]

  // Calendar data with color coding by stage
  const calendarMatches = [
    {
      id: 1,
      title: "Phoenix Warriors vs Thunder Bolts",
      date: "2024-01-08",
      time: "15:00",
      stage: "State",
      status: "live",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Shadow Hunters vs Storm Riders",
      date: "2024-01-08",
      time: "16:30",
      stage: "State",
      status: "scheduled",
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Elite Squad vs Pro Gamers",
      date: "2024-01-10",
      time: "14:00",
      stage: "National",
      status: "scheduled",
      color: "bg-red-500",
    },
    {
      id: 4,
      title: "Cyber Warriors vs Digital Knights",
      date: "2024-01-12",
      time: "17:00",
      stage: "National",
      status: "scheduled",
      color: "bg-red-500",
    },
  ]

  const autoSchedulerData = {
    stage: "State",
    dateRange: { start: "2024-01-15", end: "2024-01-20" },
    startTime: "14:00",
    gapMinutes: 90,
    preview: [
      { date: "2024-01-15", time: "14:00", match: "Team A vs Team B" },
      { date: "2024-01-15", time: "15:30", match: "Team C vs Team D" },
      { date: "2024-01-16", time: "14:00", match: "Team E vs Team F" },
      { date: "2024-01-16", time: "15:30", match: "Team G vs Team H" },
    ],
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { label: "Live", className: "bg-red-100 text-red-800", icon: Play },
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800", icon: Clock },
      completed: { label: "Completed", className: "bg-green-100 text-green-800", icon: CheckCircle },
      delayed: { label: "Delayed", className: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800", icon: Square },
    }
    const config = statusConfig[status] || statusConfig.scheduled
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getRoomStatusBadge = (status) => {
    const statusConfig = {
      occupied: { label: "Occupied", className: "bg-red-100 text-red-800" },
      reserved: { label: "Reserved", className: "bg-yellow-100 text-yellow-800" },
      available: { label: "Available", className: "bg-green-100 text-green-800" },
      maintenance: { label: "Maintenance", className: "bg-gray-100 text-gray-800" },
    }
    const config = statusConfig[status] || statusConfig.available
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredMatches = matches.filter((match) => {
    if (selectedFilter === "all") return true
    return match.status === selectedFilter
  })

  const matchStats = {
    total: matches.length,
    live: matches.filter((m) => m.status === "live").length,
    scheduled: matches.filter((m) => m.status === "scheduled").length,
    completed: matches.filter((m) => m.status === "completed").length,
    totalSpectators: matches.reduce((sum, m) => sum + m.spectators, 0),
  }

  const handleSchedulerFormChange = (field, value) => {
    setSchedulerForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScoreUpdate = (matchId, teamId, newScore) => {
    // Handle score update logic here
    console.log(`Updating match ${matchId}, team ${teamId} to score ${newScore}`)
  }

  const handleCodeExpiryUpdate = (matchId, teamIndex, newExpiry) => {
    setEditingCodes((prev) => ({
      ...prev,
      [`${matchId}-${teamIndex}`]: newExpiry,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Match Management</h2>
          <p className="text-gray-600">Calendar, match rooms, and auto-scheduler</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setAutoSchedulerOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Auto-Scheduler
          </Button>
          <Button variant="outline" onClick={() => setMatchCodesOpen(true)}>
            <Target className="h-4 w-4 mr-2" />
            Match Codes
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Match
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedView === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button
            variant={selectedView === "rooms" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("rooms")}
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Match Rooms
          </Button>
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Matches</option>
          <option value="live">Live</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-xl font-bold">{matchStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Play className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Live Now</p>
                <p className="text-xl font-bold">{matchStats.live}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-xl font-bold">{matchStats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">{matchStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Spectators</p>
                <p className="text-xl font-bold">{matchStats.totalSpectators.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedView === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Match Schedule</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>State</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>National</span>
                  </div>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="2024-01">January 2024</option>
                  <option value="2024-02">February 2024</option>
                  <option value="2024-03">March 2024</option>
                </select>
              </div>
            </CardTitle>
            <CardDescription>Upcoming and ongoing matches</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Simplified Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const dayMatches = calendarMatches.filter((match) => new Date(match.date).getDate() === day)
                return (
                  <div key={day} className="min-h-[80px] p-1 border border-gray-200 rounded">
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    {dayMatches.map((match) => (
                      <div
                        key={match.id}
                        className={`text-xs p-1 rounded mb-1 text-white ${match.color}`}
                        title={`${match.title} - ${match.time}`}
                      >
                        {match.time}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === "rooms" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Match Room */}
          {matches
            .filter((m) => m.status === "live")
            .map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{match.title}</span>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(match.status)}
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        {match.shareCode}
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Live match room with kill feed and chat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kill Feed */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Live Kill Feed
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {match.killFeed.map((kill, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                            <span className="text-gray-500">{kill.time}</span>
                            <span className="mx-2 font-medium text-red-600">{kill.player}</span>
                            <span className="text-gray-600">{kill.action}</span>
                            <span className="mx-2 font-medium text-blue-600">{kill.target}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Moderator */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat Moderator
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {match.chatMessages.map((msg, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-blue-600">{msg.user}</span>
                              <span className="text-gray-500 text-xs">{msg.time}</span>
                            </div>
                            <p className="text-gray-700 mt-1">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Score Override */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Manual Score Override</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {match.teams.map((team, index) => (
                        <div key={team.id} className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{team.name}:</span>
                          <input
                            type="number"
                            defaultValue={team.score}
                            onChange={(e) => handleScoreUpdate(match.id, team.id, Number.parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            min="0"
                          />
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Auto Scheduler Modal */}
      {autoSchedulerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Auto Scheduler Wizard</CardTitle>
              <CardDescription>Automatically schedule matches with custom parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={schedulerForm.stage}
                      onChange={(e) => handleSchedulerFormChange("stage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="State">State</option>
                      <option value="National">National</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={schedulerForm.startDate}
                        onChange={(e) => handleSchedulerFormChange("startDate", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="date"
                        value={schedulerForm.endDate}
                        onChange={(e) => handleSchedulerFormChange("endDate", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={schedulerForm.startTime}
                      onChange={(e) => handleSchedulerFormChange("startTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gap (minutes)</label>
                    <input
                      type="number"
                      value={schedulerForm.gapMinutes}
                      onChange={(e) => handleSchedulerFormChange("gapMinutes", Number.parseInt(e.target.value))}
                      min="30"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Schedule Preview</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {autoSchedulerData.preview.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{item.match}</span>
                          <Badge variant="outline">{item.date}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setAutoSchedulerOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Preview
                </Button>
                <Button>Confirm & Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Match Codes Modal */}
      {matchCodesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Match Codes</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    CSV Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate All
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>6-character codes for team access to matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {matchCodes.map((match) => (
                  <div key={match.matchId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{match.matchTitle}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2">Team</th>
                            <th className="text-left py-2">Code</th>
                            <th className="text-left py-2">Expiry</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-center py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.teams.map((team, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-3 font-medium">{team.name}</td>
                              <td className="py-3">
                                <code className="px-2 py-1 bg-gray-100 rounded font-mono">{team.code}</code>
                              </td>
                              <td className="py-3">
                                <input
                                  type="datetime-local"
                                  value={editingCodes[`${match.matchId}-${index}`] || team.expiry}
                                  onChange={(e) => handleCodeExpiryUpdate(match.matchId, index, e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs"
                                />
                              </td>
                              <td className="py-3">
                                <Badge
                                  className={
                                    team.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {team.status}
                                </Badge>
                              </td>
                              <td className="text-center py-3">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setMatchCodesOpen(false)}>
                  Close
                </Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
