"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Clock, Download, TrendingUp, Loader2 } from "lucide-react"

/**
 * MatchResults
 * TODO: replace mocked data & handlers with real API / WebSocket sources.
 */
export default function MatchResults() {
  /* ------------------------------------------------------------------ */
  /* Local state (simple client filters)                                */
  /* ------------------------------------------------------------------ */
  const [statusFilter, setStatusFilter] = useState("all")
  const [gameFilter, setGameFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("7d")
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /* ------------------------------------------------------------------ */
  /* Data fetching                                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchMatchResults = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/match-results")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error("Failed to fetch match results:", error)
        setError("Failed to fetch match results")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchResults()
  }, [])

  /* ------------------------------------------------------------------ */
  /* Derived data + small helpers                                       */
  /* ------------------------------------------------------------------ */
  const filtered = matches.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false
    if (gameFilter !== "all" && m.game !== gameFilter) return false
    return true
  })

  const kpis = {
    total: matches.length,
    completed: matches.filter((m) => m.status === "completed").length,
    disputed: matches.filter((m) => m.status === "disputed").length,
    pending: matches.filter((m) => m.status === "pending").length,
    spectators: matches.reduce((sum, m) => sum + m.spectators, 0),
  }

  const statusBadge = (status) => {
    const map = {
      completed: {
        label: "Completed",
        color: "bg-green-100 text-green-800",
        Icon: CheckCircle,
      },
      disputed: {
        label: "Disputed",
        color: "bg-red-100 text-red-800",
        Icon: AlertTriangle,
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        Icon: Clock,
      },
    }
    const cfg = map[status] || map.completed
    const Icon = cfg.Icon
    return (
      <Badge className={`${cfg.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" /> {cfg.label}
      </Badge>
    )
  }

  const stageBadge = (stage) => (
    <Badge className={stage === "National" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
      {stage}
    </Badge>
  )

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <section className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Match Results</h1>
          <p className="text-muted-foreground">Review completed, pending, or disputed matches.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-1 h-4 w-4" /> Analytics
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="disputed">Disputed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Games</option>
          <option value="Mobile Legends">Mobile Legends</option>
          <option value="PUBG Mobile">PUBG Mobile</option>
          <option value="Free Fire">Free Fire</option>
        </select>

        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="24h">Last 24 h</option>
          <option value="7d">Last 7 d</option>
          <option value="30d">Last 30 d</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KpiCard label="Total" value={kpis.total} />
        <KpiCard label="Completed" value={kpis.completed} />
        <KpiCard label="Disputed" value={kpis.disputed} />
        <KpiCard label="Pending" value={kpis.pending} />
        <KpiCard label="Spectators" value={kpis.spectators.toLocaleString()} />
      </div>

      {/* Results table */}
      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left font-medium">
              <tr>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Spectators</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No matches found for current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{m.title}</td>
                    <td className="px-4 py-3">{m.game}</td>
                    <td className="px-4 py-3">{stageBadge(m.stage)}</td>
                    <td className="px-4 py-3">{m.date}</td>
                    <td className="px-4 py-3">{m.spectators}</td>
                    <td className="px-4 py-3">{statusBadge(m.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------- */
/* Small KPI card helper                                                */
/* -------------------------------------------------------------------- */
function KpiCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
