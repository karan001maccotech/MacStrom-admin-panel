"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, Edit, Trash, Loader2, RefreshCw, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AllGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/games");


      // First check if response exists and is OK
      if (!response) {
        throw new Error("No response received from server");
      }

      // Check for HTTP errors
      if (!response.ok) {
        // Try to get error message from response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response");
      }

      // Check for empty response
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return setGames([]); // Return empty array if no content
      }

      const data = await response.json();

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      setGames(data);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError(err.message || "Failed to load games. Please try again.");

      // Set empty array if error occurs but we want to continue
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames()
  }, [])

  const handleUpdateGame = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/games/${editingGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGame),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      await fetchGames() // Refresh list
      setIsEditModalOpen(false)
      setEditingGame(null)
    } catch (err) {
      console.error("Failed to update game:", err)
      setError("Failed to update game: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game? This action cannot be undone.")) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      await fetchGames() // Refresh list
    } catch (err) {
      console.error("Failed to delete game:", err)
      setError("Failed to delete game: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Games</h2>
          <p className="text-gray-600">Manage all game titles available on the platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/games/add-game">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search games by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
        <Button variant="outline" onClick={fetchGames} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""} mr-2`} />
          Refresh
        </Button>
      </div>

      {/* Games List */}
      <Card>
        <CardHeader>
          <CardTitle>Game Catalog</CardTitle>
          <CardDescription>A list of all games configured on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No games found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sr. No.</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Game Name</TableHead>
                    <TableHead>Game Type</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game, index) => (
                    <TableRow key={game.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Image
                          src={game.image_url || "/placeholder.svg?height=64&width=64&query=game_icon"}
                          alt={game.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>{game.type}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingGame(game)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteGame(game.id)}>
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

      {/* Edit Game Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription>Make changes to the game details here.</DialogDescription>
          </DialogHeader>
          {editingGame && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_name">Game Name</Label>
                <Input
                  id="edit_name"
                  value={editingGame.name}
                  onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_type">Game Type</Label>
                <Input
                  id="edit_type"
                  value={editingGame.type}
                  onChange={(e) => setEditingGame({ ...editingGame, type: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_image_url">Image URL (Optional)</Label>
                <Input
                  id="edit_image_url"
                  value={editingGame.image_url || ""}
                  onChange={(e) => setEditingGame({ ...editingGame, image_url: e.target.value })}
                  placeholder="/placeholder.svg?height=64&width=64"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGame} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
