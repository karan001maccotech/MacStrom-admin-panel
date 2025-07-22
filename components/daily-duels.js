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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Trophy,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react"

export default function DailyDuels() {
  const [duels, setDuels] = useState([])
  const [selectedDuel, setSelectedDuel] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [webhookEvents, setWebhookEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch duels data
  const fetchDuels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/daily-duels?page=1&limit=25");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // If API returns { duels: [...] }
      setDuels(Array.isArray(data) ? data : data.duels || [])
    } catch (error) {
      console.error("Failed to fetch duels:", error)
      setError("Failed to fetch duels")
    } finally {
      setLoading(false)
    }
  }

  // Fetch webhook events
  const fetchWebhookEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/webhooks")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // console.log("Webhook Events:", data)
      setWebhookEvents(Array.isArray(data) ? data : data.events || [])
    } catch (error) {
      console.error("Failed to fetch webhook events:", error)
      setError("Failed to fetch webhook events")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDuels()
    fetchWebhookEvents()
  }, [])

  // WebSocket listener for webhook events
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/duels-webhook")

    ws.onmessage = (event) => {
      const webhookData = JSON.parse(event.data)

      // Update duel with webhook result
      setDuels((prev) =>
        prev.map((duel) =>
          duel.id === webhookData.duelId
            ? { ...duel, webhookReceived: true, winner: webhookData.winner, status: "Awaiting Verification" }
            : duel,
        ),
      )

      // Add to webhook events
      setWebhookEvents((prev) => [webhookData, ...prev])
    }

    return () => ws.close()
  }, [])

  const handleCreateDuel = async (formData) => {
    try {
      setLoading(true)
      const response = await fetch("/api/daily-duels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newDuel = await response.json()
      setDuels((prev) => [newDuel, ...prev])
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create duel:", error)
      setError("Failed to create duel")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyResult = async (duelId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/daily-duels/${duelId}/verify`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedDuel = await response.json()
      setDuels((prev) => prev.map((duel) => (duel.id === duelId ? updatedDuel : duel)))

      // Auto-book commission to platform_earnings
      fetch("/api/platform-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "daily_duel",
          duel_id: duelId,
          amount: updatedDuel.platformEarnings,
          commission_rate: updatedDuel.commission,
        }),
      })
    } catch (error) {
      console.error("Failed to verify duel:", error)
      setError("Failed to verify duel")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "secondary",
      "Awaiting Verification": "warning",
      Completed: "success",
      Cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const CreateDuelDialog = () => {
    const [formData, setFormData] = useState({
      title: "",
      type: "Solo",
      entryFee: 0,
      maxParticipants: 10,
      commission: 20,
      startTime: "",
      description: "",
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      const prizePool = formData.entryFee * formData.maxParticipants * (1 - formData.commission / 100)
      await handleCreateDuel({ ...formData, prizePool })
    }

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Daily Duel</DialogTitle>
            <DialogDescription>Set up a new duel event for players to compete</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Duel Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter duel title"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Game Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                <Input
                  id="entryFee"
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => setFormData((prev) => ({ ...prev, entryFee: Number.parseInt(e.target.value) }))}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Players</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) }))
                  }
                  min="2"
                  max="100"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                value={formData.commission}
                onChange={(e) => setFormData((prev) => ({ ...prev, commission: Number.parseInt(e.target.value) }))}
                min="0"
                max="50"
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Duel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const DuelCard = ({ duel }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{duel.title}</CardTitle>
          {getStatusBadge(duel.status)}
        </div>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {duel.currentParticipants}/{duel.maxParticipants}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />₹{duel.entryFee}
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />₹{duel.prizePool}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Type:</span>
            <span className="font-medium">{duel.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform Earnings:</span>
            <span className="font-medium text-green-600">₹{duel.platformEarnings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Start Time:</span>
            <span className="font-medium">{new Date(duel.startTime).toLocaleString()}</span>
          </div>

          {duel.webhookReceived && !duel.verified && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Result received - needs verification</span>
            </div>
          )}

          {duel.winner && (
            <div className="flex justify-between text-sm">
              <span>Winner:</span>
              <span className="font-medium text-blue-600">{duel.winner}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            {duel.webhookReceived && !duel.verified && (
              <Button size="sm" className="flex-1" onClick={() => handleVerifyResult(duel.id)}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Verify & Payout
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const pendingDuels = duels.filter((d) => d.status === "Pending" || d.status === "Awaiting Verification")
  const completedDuels = duels.filter((d) => d.status === "Completed")

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              fetchDuels()
              fetchWebhookEvents()
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Duels</h1>
          <p className="text-muted-foreground">Manage daily duel events and monitor results</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Duel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Duels</p>
                  <p className="text-2xl font-bold">{pendingDuels.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{completedDuels.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    ₹{duels.reduce((sum, d) => sum + (d.verified ? d.platformEarnings : 0), 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                  <p className="text-2xl font-bold">{duels.filter((d) => d.webhookReceived && !d.verified).length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Duels Grid */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingDuels.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedDuels.length})</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Events</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDuels.map((duel) => (
                <DuelCard key={duel.id} duel={duel} />
              ))}
            </div>
          )}
          {pendingDuels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pending duels. Create a new duel to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedDuels.map((duel) => (
                <DuelCard key={duel.id} duel={duel} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>Real-time webhook events from game servers</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Duel ID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Winner</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.duelId}</TableCell>
                        <TableCell>{event.event}</TableCell>
                        <TableCell>{event.winner}</TableCell>
                        <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          {event.verified ? (
                            <Badge variant="success">Verified</Badge>
                          ) : (
                            <Badge variant="warning">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateDuelDialog />
    </div>
  )
}
