"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, XCircle } from "lucide-react"

export default function AddGamePage() {
  const router = useRouter()
  const [newGame, setNewGame] = useState({ name: "", type: "", image_url: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleCreateGame = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSuccess(`Game "${data.name}" added successfully!`)
      setNewGame({ name: "", type: "", image_url: "" }) // Clear form
      // Optionally redirect after a short delay
      setTimeout(() => {
        router.push("/admin/games/all") // Redirect to all games list
      }, 1500)
    } catch (err) {
      console.error("Failed to create game:", err)
      setError("Failed to add game: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Game</h2>
          <p className="text-gray-600">Enter details for a new game to be added to the platform.</p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
          <CardDescription>Fill in the information for the new game.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGame} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Game Name</Label>
              <Input
                id="name"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Game Type</Label>
              <Input
                id="type"
                value={newGame.type}
                onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                value={newGame.image_url}
                onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })}
                placeholder="/placeholder.svg?height=64&width=64"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/games/all")}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Add Game
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
