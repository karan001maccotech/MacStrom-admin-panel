"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash, Loader2, RefreshCw, Search } from "lucide-react"

export default function TournamentMatches() {
  const [tournaments, setTournaments] = useState([])
  const [games, setGames] = useState([]) // To fetch game names for dropdown
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
  const [searchTerm, setSearchTerm] = useState("")

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

  const fetchGamesForDropdown = async () => {
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

  useEffect(() => {
    fetchTournaments()
    fetchGamesForDropdown()
  }, [])

  const handleCreateTournament = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTournament,
          game_id: Number.parseInt(newTournament.game_id), // Ensure game_id is integer
          entry_fee: Number.parseFloat(newTournament.entry_fee),
          prize_pool: Number.parseFloat(newTournament.prize_pool),
          current_participants: Number.parseInt(newTournament.current_participants),
          max_participants: Number.parseInt(newTournament.max_participants),
          progress: Number.parseInt(newTournament.progress),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
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
      setError("Failed to create tournament: " + err.message)
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
          game_id: Number.parseInt(editingTournament.game_id), // Ensure game_id is integer
          entry_fee: Number.parseFloat(editingTournament.entry_fee),
          prize_pool: Number.parseFloat(editingTournament.prize_pool),
          current_participants: Number.parseInt(editingTournament.current_participants),
          max_participants: Number.parseInt(editingTournament.max_participants),
          progress: Number.parseInt(editingTournament.progress),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
      setIsEditModalOpen(false)
      setEditingTournament(null)
    } catch (err) {
      console.error("Failed to update tournament:", err)
      setError("Failed to update tournament: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTournament = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      await fetchTournaments() // Refresh list
    } catch (err) {
      console.error("Failed to delete tournament:", err)
      setError("Failed to delete tournament: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { label: "Live", className: "bg-red-100 text-red-800" },
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      delayed: { label: "Delayed", className: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
    }
    const config = statusConfig[status] || statusConfig.scheduled
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tournament Matches</h2>
          <p className="text-gray-600">Create and manage all tournaments on the platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Match
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tournaments by title, game, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
        <Button variant="outline" onClick={fetchTournaments} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""} mr-2`} />
          Refresh
        </Button>
      </div>

      {/* Tournaments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tournaments</CardTitle>
          <CardDescription>Overview of all scheduled, live, and completed tournaments.</CardDescription>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sr. No.</TableHead>
                    <TableHead>Match ID</TableHead>
                    <TableHead>Game Name</TableHead>
                    <TableHead>Match/Event Name</TableHead>
                    <TableHead>Match Schedule</TableHead>
                    <TableHead>Total Players</TableHead>
                    <TableHead>Joined Players</TableHead>
                    <TableHead>Win Prize ($)</TableHead>
                    <TableHead>Entry Fee ($)</TableHead>
                    <TableHead>Match Type</TableHead>
                    <TableHead>Match Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.map((tournament, index) => (
                    <TableRow key={tournament.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{tournament.id}</TableCell>
                      <TableCell className="font-medium">{tournament.game_name}</TableCell>
                      <TableCell>{tournament.title}</TableCell>
                      <TableCell>
                        {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                        {new Date(tournament.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{tournament.max_participants}</TableCell>
                      <TableCell>{tournament.current_participants}</TableCell>
                      <TableCell>{tournament.prize_pool.toFixed(2)}</TableCell>
                      <TableCell>{tournament.entry_fee.toFixed(2)}</TableCell>
                      <TableCell>{tournament.type}</TableCell>
                      <TableCell>{getStatusBadge(tournament.status)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTournament({
                                ...tournament,
                                start_date: new Date(tournament.start_date).toISOString().split("T")[0], // Format for date input
                                end_date: new Date(tournament.end_date).toISOString().split("T")[0], // Format for date input
                                game_id: tournament.game_id.toString(), // Ensure string for select
                              })
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Tournament Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Match (Tournament)</DialogTitle>
            <DialogDescription>Enter details for the new tournament match.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="game_id">Game</Label>
              <Select
                value={newTournament.game_id}
                onValueChange={(value) => setNewTournament({ ...newTournament, game_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id.toString()}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Match/Event Name</Label>
              <Input
                id="title"
                value={newTournament.title}
                onChange={(e) => setNewTournament({ ...newTournament, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Match Type</Label>
              <Input
                id="type"
                value={newTournament.type}
                onChange={(e) => setNewTournament({ ...newTournament, type: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={newTournament.start_date}
                onChange={(e) => setNewTournament({ ...newTournament, start_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={newTournament.end_date}
                onChange={(e) => setNewTournament({ ...newTournament, end_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTournament.status}
                onValueChange={(value) => setNewTournament({ ...newTournament, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="entry_fee">Entry Fee ($)</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.01"
                value={newTournament.entry_fee}
                onChange={(e) => setNewTournament({ ...newTournament, entry_fee: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prize_pool">Win Prize ($)</Label>
              <Input
                id="prize_pool"
                type="number"
                step="0.01"
                value={newTournament.prize_pool}
                onChange={(e) => setNewTournament({ ...newTournament, prize_pool: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_participants">Max Players</Label>
              <Input
                id="max_participants"
                type="number"
                value={newTournament.max_participants}
                onChange={(e) => setNewTournament({ ...newTournament, max_participants: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current_participants">Joined Players</Label>
              <Input
                id="current_participants"
                type="number"
                value={newTournament.current_participants}
                onChange={(e) => setNewTournament({ ...newTournament, current_participants: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current_round">Current Round</Label>
              <Input
                id="current_round"
                value={newTournament.current_round}
                onChange={(e) => setNewTournament({ ...newTournament, current_round: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                value={newTournament.organizer}
                onChange={(e) => setNewTournament({ ...newTournament, organizer: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTournament} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tournament Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Match (Tournament)</DialogTitle>
            <DialogDescription>Update details for the tournament match.</DialogDescription>
          </DialogHeader>
          {editingTournament && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_game_id">Game</Label>
                <Select
                  value={editingTournament.game_id}
                  onValueChange={(value) => setEditingTournament({ ...editingTournament, game_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_title">Match/Event Name</Label>
                <Input
                  id="edit_title"
                  value={editingTournament.title}
                  onChange={(e) => setEditingTournament({ ...editingTournament, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_type">Match Type</Label>
                <Input
                  id="edit_type"
                  value={editingTournament.type}
                  onChange={(e) => setEditingTournament({ ...editingTournament, type: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_start_date">Start Date</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={editingTournament.start_date}
                  onChange={(e) => setEditingTournament({ ...editingTournament, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_date">End Date</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={editingTournament.end_date}
                  onChange={(e) => setEditingTournament({ ...editingTournament, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={editingTournament.status}
                  onValueChange={(value) => setEditingTournament({ ...editingTournament, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_entry_fee">Entry Fee ($)</Label>
                <Input
                  id="edit_entry_fee"
                  type="number"
                  step="0.01"
                  value={editingTournament.entry_fee}
                  onChange={(e) => setEditingTournament({ ...editingTournament, entry_fee: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_prize_pool">Win Prize ($)</Label>
                <Input
                  id="edit_prize_pool"
                  type="number"
                  step="0.01"
                  value={editingTournament.prize_pool}
                  onChange={(e) => setEditingTournament({ ...editingTournament, prize_pool: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_max_participants">Max Players</Label>
                <Input
                  id="edit_max_participants"
                  type="number"
                  value={editingTournament.max_participants}
                  onChange={(e) => setEditingTournament({ ...editingTournament, max_participants: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_current_participants">Joined Players</Label>
                <Input
                  id="edit_current_participants"
                  type="number"
                  value={editingTournament.current_participants}
                  onChange={(e) => setEditingTournament({ ...editingTournament, current_participants: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_current_round">Current Round</Label>
                <Input
                  id="edit_current_round"
                  value={editingTournament.current_round}
                  onChange={(e) => setEditingTournament({ ...editingTournament, current_round: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_organizer">Organizer</Label>
                <Input
                  id="edit_organizer"
                  value={editingTournament.organizer}
                  onChange={(e) => setEditingTournament({ ...editingTournament, organizer: e.target.value })}
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
