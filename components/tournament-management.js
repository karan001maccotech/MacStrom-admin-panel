"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Play,
  Pause,
  Square,
  Settings,
  Edit,
  Trash,
  Plus,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react"

// This file is no longer used and can be deleted or ignored.
// Its functionality has been moved to components/tournament-matches.js
// and the routing updated in app/admin/layout.js and app/admin/games/matches/page.js

export default function TournamentManagement() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [tournaments, setTournaments] = useState([])
  const [tournamentStats, setTournamentStats] = useState({})
  const [games, setGames] = useState([]) // State to hold games for dropdown
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTournament, setEditingTournament] = useState(null)
  const [newTournament, setNewTournament] = useState({
    game_id: "",
    title: "",
    type: "",
    start_date: "",
    end_date: "",
    status: "scheduled",
    entry_fee: 0,
    prize_pool: 0,
    current_participants: 0,
    max_participants: 0,
    current_round: "",
    organizer: "",
    featured: false,
    progress: 0,
  })

  // Fetch tournaments data
  const fetchTournaments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/tournaments")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTournaments(data)
    } catch (err) {
      console.error("Failed to fetch tournaments:", err)
      setError("Failed to load tournaments. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch tournament stats
  const fetchTournamentStats = async () => {
    try {
      const response = await fetch("/api/tournaments/stats")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTournamentStats(data)
    } catch (err) {
      console.error("Failed to fetch tournament stats:", err)
      setError("Failed to load tournament stats. Please try again.")
    }
  }

  // Fetch games for dropdown
  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setGames(data)
    } catch (err) {
      console.error("Failed to fetch games for dropdown:", err)
      // Don't set global error, just log for this specific fetch
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchTournaments()
    fetchTournamentStats()
    fetchGames()
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { label: "Live", className: "bg-red-100 text-red-800", icon: Play },
      registration: { label: "Registration", className: "bg-blue-100 text-blue-800", icon: Users },
      scheduled: { label: "Scheduled", className: "bg-yellow-100 text-yellow-800", icon: Calendar },
      completed: { label: "Completed", className: "bg-green-100 text-green-800", icon: Trophy },
      paused: { label: "Paused", className: "bg-gray-100 text-gray-800", icon: Pause },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800", icon: Square },
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

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.game_type.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "all") return matchesSearch
    return matchesSearch && tournament.status === selectedFilter
  })

  const handleCreateTournament = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTournament,
          entry_fee: Number.parseFloat(newTournament.entry_fee),
          prize_pool: Number.parseFloat(newTournament.prize_pool),
          current_participants: Number.parseInt(newTournament.current_participants),
          max_participants: Number.parseInt(newTournament.max_participants),
          progress: Number.parseInt(newTournament.progress),
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
      await fetchTournamentStats() // Refresh stats
      setIsCreateModalOpen(false)
      setNewTournament({
        game_id: "",
        title: "",
        type: "",
        start_date: "",
        end_date: "",
        status: "scheduled",
        entry_fee: 0,
        prize_pool: 0,
        current_participants: 0,
        max_participants: 0,
        current_round: "",
        organizer: "",
        featured: false,
        progress: 0,
      })
    } catch (err) {
      console.error("Failed to create tournament:", err)
      setError("Failed to create tournament. " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTournament = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tournaments/${editingTournament.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingTournament,
          entry_fee: Number.parseFloat(editingTournament.entry_fee),
          prize_pool: Number.parseFloat(editingTournament.prize_pool),
          current_participants: Number.parseInt(editingTournament.current_participants),
          max_participants: Number.parseInt(editingTournament.max_participants),
          progress: Number.parseInt(editingTournament.progress),
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
      await fetchTournamentStats() // Refresh stats
      setIsEditModalOpen(false)
      setEditingTournament(null)
    } catch (err) {
      console.error("Failed to update tournament:", err)
      setError("Failed to update tournament. " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTournament = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
      await fetchTournamentStats() // Refresh stats
    } catch (err) {
      console.error("Failed to delete tournament:", err)
      setError("Failed to delete tournament. " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              fetchTournaments()
              fetchTournamentStats()
              fetchGames()
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tournament Management</h2>
          <p className="text-gray-600">Create and manage gaming tournaments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Tournament Settings
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tournament
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : tournamentStats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Trophy className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold">{tournamentStats.total}</p>
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
            ) : tournamentStats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Play className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live</p>
                  <p className="text-xl font-bold">{tournamentStats.live}</p>
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
            ) : tournamentStats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-xl font-bold">{tournamentStats.scheduled}</p>
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
            ) : tournamentStats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold">{tournamentStats.completed}</p>
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
            ) : tournamentStats ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prize Pool</p>
                  <p className="text-xl font-bold">${tournamentStats.totalPrizePool.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tournament List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Tournaments</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No tournaments found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Sr. No.</TableHead>
                  <TableHead className="w-[80px]">Game Image</TableHead>
                  <TableHead>Tournament Title</TableHead>
                  <TableHead>Game Name</TableHead>
                  <TableHead>Game Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.map((tournament, index) => (
                  <TableRow key={tournament.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={tournament.game_image_url || "/placeholder.svg?height=64&width=64&query=game%20icon"}
                        alt={tournament.game_name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tournament.title}</TableCell>
                    <TableCell>{tournament.game_name}</TableCell>
                    <TableCell>{tournament.game_type}</TableCell>
                    <TableCell>{getStatusBadge(tournament.status)}</TableCell>
                    <TableCell>
                      {tournament.current_participants}/{tournament.max_participants}
                    </TableCell>
                    <TableCell>${tournament.prize_pool.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTournament(tournament)
                            setIsEditModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTournament(tournament.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Tournament Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
            <DialogDescription>Fill in the details for the new tournament.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="game-id">Game</Label>
              <Select
                value={newTournament.game_id}
                onValueChange={(value) => setNewTournament({ ...newTournament, game_id: Number.parseInt(value) })}
              >
                <SelectTrigger id="game-id">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id.toString()}>
                      {game.name} ({game.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTournament.title}
                onChange={(e) => setNewTournament({ ...newTournament, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={newTournament.type}
                onChange={(e) => setNewTournament({ ...newTournament, type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={newTournament.start_date}
                onChange={(e) => setNewTournament({ ...newTournament, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={newTournament.end_date}
                onChange={(e) => setNewTournament({ ...newTournament, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTournament.status}
                onValueChange={(value) => setNewTournament({ ...newTournament, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry_fee">Entry Fee</Label>
              <Input
                id="entry_fee"
                type="number"
                value={newTournament.entry_fee}
                onChange={(e) => setNewTournament({ ...newTournament, entry_fee: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prize_pool">Prize Pool</Label>
              <Input
                id="prize_pool"
                type="number"
                value={newTournament.prize_pool}
                onChange={(e) => setNewTournament({ ...newTournament, prize_pool: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_participants">Current Participants</Label>
              <Input
                id="current_participants"
                type="number"
                value={newTournament.current_participants}
                onChange={(e) => setNewTournament({ ...newTournament, current_participants: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={newTournament.max_participants}
                onChange={(e) => setNewTournament({ ...newTournament, max_participants: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_round">Current Round</Label>
              <Input
                id="current_round"
                value={newTournament.current_round}
                onChange={(e) => setNewTournament({ ...newTournament, current_round: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                value={newTournament.organizer}
                onChange={(e) => setNewTournament({ ...newTournament, organizer: e.target.value })}
              />
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <Label htmlFor="featured">Featured</Label>
              <input
                id="featured"
                type="checkbox"
                checked={newTournament.featured}
                onChange={(e) => setNewTournament({ ...newTournament, featured: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                value={newTournament.progress}
                onChange={(e) => setNewTournament({ ...newTournament, progress: e.target.value })}
                min="0"
                max="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTournament} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tournament Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tournament</DialogTitle>
            <DialogDescription>Update details for the tournament.</DialogDescription>
          </DialogHeader>
          {editingTournament && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-game-id">Game</Label>
                <Select
                  value={editingTournament.game_id?.toString()}
                  onValueChange={(value) =>
                    setEditingTournament({ ...editingTournament, game_id: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger id="edit-game-id">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.name} ({game.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTournament.title}
                  onChange={(e) => setEditingTournament({ ...editingTournament, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input
                  id="edit-type"
                  value={editingTournament.type}
                  onChange={(e) => setEditingTournament({ ...editingTournament, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Start Date</Label>
                <Input
                  id="edit-start_date"
                  type="date"
                  value={editingTournament.start_date}
                  onChange={(e) => setEditingTournament({ ...editingTournament, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">End Date</Label>
                <Input
                  id="edit-end_date"
                  type="date"
                  value={editingTournament.end_date}
                  onChange={(e) => setEditingTournament({ ...editingTournament, end_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingTournament.status}
                  onValueChange={(value) => setEditingTournament({ ...editingTournament, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-entry_fee">Entry Fee</Label>
                <Input
                  id="edit-entry_fee"
                  type="number"
                  value={editingTournament.entry_fee}
                  onChange={(e) => setEditingTournament({ ...editingTournament, entry_fee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-prize_pool">Prize Pool</Label>
                <Input
                  id="edit-prize_pool"
                  type="number"
                  value={editingTournament.prize_pool}
                  onChange={(e) => setEditingTournament({ ...editingTournament, prize_pool: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-current_participants">Current Participants</Label>
                <Input
                  id="edit-current_participants"
                  type="number"
                  value={editingTournament.current_participants}
                  onChange={(e) => setEditingTournament({ ...editingTournament, current_participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max_participants">Max Participants</Label>
                <Input
                  id="edit-max_participants"
                  type="number"
                  value={editingTournament.max_participants}
                  onChange={(e) => setEditingTournament({ ...editingTournament, max_participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-current_round">Current Round</Label>
                <Input
                  id="edit-current_round"
                  value={editingTournament.current_round}
                  onChange={(e) => setEditingTournament({ ...editingTournament, current_round: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-organizer">Organizer</Label>
                <Input
                  id="edit-organizer"
                  value={editingTournament.organizer}
                  onChange={(e) => setEditingTournament({ ...editingTournament, organizer: e.target.value })}
                />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Label htmlFor="edit-featured">Featured</Label>
                <input
                  id="edit-featured"
                  type="checkbox"
                  checked={editingTournament.featured}
                  onChange={(e) => setEditingTournament({ ...editingTournament, featured: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-progress">Progress (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  value={editingTournament.progress}
                  onChange={(e) => setEditingTournament({ ...editingTournament, progress: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTournament} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
