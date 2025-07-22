"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  Shield,
  Users,
  Vote,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Crown,
  UserPlus,
  GripVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"

export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [rosterModalOpen, setRosterModalOpen] = useState(false)
  const [wsConnection, setWsConnection] = useState(null)
  const [loading, setLoading] = useState(true)

  // WebSocket connection for vote updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Replace with actual WebSocket endpoint
        const ws = new WebSocket("wss://localhost:3000/ws/votesupdates")

        ws.onopen = () => {
          console.log("Connected to votes WebSocket")
          setWsConnection(ws)
        }

        ws.onmessage = (event) => {
          const voteUpdate = JSON.parse(event.data)
          // Merge vote updates into team state
          setTeams((prevTeams) =>
            prevTeams.map((team) =>
              team.team_id === voteUpdate.teamId
                ? {
                    ...team,
                    votesState: voteUpdate.stateVotes,
                    votesNational: voteUpdate.nationalVotes,
                  }
                : team,
            ),
          )
        }

        ws.onclose = () => {
          console.log("Vote WebSocket connection closed, attempting to reconnect...")
          setTimeout(connectWebSocket, 5000)
        }

        ws.onerror = (error) => {
          console.error("Vote WebSocket error:", error)
        }

        return ws
      } catch (error) {
        console.error("Failed to connect to vote WebSocket:", error)
      }
    }

    const ws = connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch("/api/teams")
        const data = [
          {
            team_id: 1,
            name: "Phoenix Warriors",
            state: "California",
            votesState: 1250,
            votesNational: 3420,
            regUsers: 5,
            members: [
              { id: 1, username: "ProGamer123", role: "captain", active: true, position: 0 },
              { id: 2, username: "EliteSniper", role: "player", active: true, position: 1 },
              { id: 3, username: "MobileKing", role: "player", active: true, position: 2 },
              { id: 4, username: "SkillShot", role: "player", active: true, position: 3 },
              { id: 5, username: "GameMaster", role: "substitute", active: false, position: 4 },
              { id: 6, username: "NewPlayer", role: "substitute", active: false, position: 5 },
              { id: 7, username: "BackupPro", role: "substitute", active: false, position: 6 },
              { id: 8, username: "ReservePro", role: "substitute", active: false, position: 7 },
              { id: 9, username: "ExtraPlayer", role: "substitute", active: false, position: 8 },
              { id: 10, username: "BenchWarmer", role: "substitute", active: false, position: 9 },
              { id: 11, username: "SubPlayer1", role: "substitute", active: false, position: 10 },
              { id: 12, username: "SubPlayer2", role: "substitute", active: false, position: 11 },
              { id: 13, username: "SubPlayer3", role: "substitute", active: false, position: 12 },
              { id: 14, username: "SubPlayer4", role: "substitute", active: false, position: 13 },
              { id: 15, username: "SubPlayer5", role: "substitute", active: false, position: 14 },
            ],
          },
          {
            team_id: 2,
            name: "Thunder Bolts",
            state: "Texas",
            votesState: 1580,
            votesNational: 4200,
            regUsers: 4,
            members: [
              { id: 16, username: "LightningFast", role: "captain", active: true, position: 0 },
              { id: 17, username: "StormBreaker", role: "player", active: true, position: 1 },
              { id: 18, username: "ThunderStrike", role: "player", active: true, position: 2 },
              { id: 19, username: "ElectricShock", role: "player", active: false, position: 3 },
            ],
          },
          {
            team_id: 3,
            name: "Shadow Hunters",
            state: "New York",
            votesState: 890,
            votesNational: 2100,
            regUsers: 5,
            members: [
              { id: 20, username: "DarkAssassin", role: "captain", active: true, position: 0 },
              { id: 21, username: "NightCrawler", role: "player", active: true, position: 1 },
              { id: 22, username: "ShadowBlade", role: "player", active: true, position: 2 },
              { id: 23, username: "StealthMode", role: "player", active: true, position: 3 },
              { id: 24, username: "InvisibleMan", role: "substitute", active: false, position: 4 },
            ],
          },
        ]

        setTeams(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.state.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const openRosterModal = (team) => {
    setSelectedTeam(team)
    setRosterModalOpen(true)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(selectedTeam.members)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }))

    setSelectedTeam({
      ...selectedTeam,
      members: updatedItems,
    })
  }

  const toggleMemberActive = (memberId) => {
    const updatedMembers = selectedTeam.members.map((member) => {
      if (member.id === memberId) {
        return { ...member, active: !member.active }
      }
      return member
    })

    // Ensure only 15 members can be active
    const activeCount = updatedMembers.filter((m) => m.active).length
    if (activeCount > 15) {
      alert("Maximum 15 active members allowed")
      return
    }

    setSelectedTeam({
      ...selectedTeam,
      members: updatedMembers,
    })
  }

  const saveRosterChanges = async () => {
    try {
      // Write to team_members table
      await fetch(`/api/teams/${selectedTeam.team_id}/members`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members: selectedTeam.members.map((member) => ({
            userId: member.id,
            position: member.position,
            active: member.active,
            role: member.role,
          })),
        }),
      })

      // Update local state
      setTeams((prevTeams) => prevTeams.map((team) => (team.team_id === selectedTeam.team_id ? selectedTeam : team)))

      setRosterModalOpen(false)
      alert("Roster updated successfully!")
    } catch (error) {
      console.error("Failed to update roster:", error)
      alert("Failed to update roster")
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      captain: { label: "Captain", className: "bg-purple-100 text-purple-800", icon: Crown },
      player: { label: "Player", className: "bg-blue-100 text-blue-800", icon: Users },
      substitute: { label: "Sub", className: "bg-gray-100 text-gray-800", icon: UserPlus },
    }
    const config = roleConfig[role] || roleConfig.player
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading teams...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage team rosters, votes, and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Teams</Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Directory</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Teams Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Team ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">State</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Votes (State)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Votes (National)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reg Users</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.team_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{team.team_id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>{team.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{team.state}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Vote className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{team.votesState.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Vote className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-purple-600">{team.votesNational.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{team.regUsers}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openRosterModal(team)}>
                          <Users className="h-4 w-4 mr-2" />
                          Roster
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Roster Modal */}
      <Dialog open={rosterModalOpen} onOpenChange={setRosterModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Roster Management - {selectedTeam?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Drag and drop to reorder members. Toggle active status (max 15 active members).
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Active Members: {selectedTeam.members.filter((m) => m.active).length}/15
                </div>
                <Button onClick={saveRosterChanges}>Save Changes</Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="roster">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {selectedTeam.members
                        .sort((a, b) => a.position - b.position)
                        .map((member, index) => (
                          <Draggable key={member.id} draggableId={member.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
                                  snapshot.isDragging ? "shadow-lg bg-white" : "bg-gray-50"
                                } ${member.active ? "border-green-300 bg-green-50" : ""}`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm font-mono text-gray-500">
                                    #{(index + 1).toString().padStart(2, "0")}
                                  </div>
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-900">{member.username}</p>
                                    <div className="flex items-center space-x-2">
                                      {getRoleBadge(member.role)}
                                      {member.active && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleMemberActive(member.id)}
                                    className={member.active ? "text-red-600" : "text-green-600"}
                                  >
                                    {member.active ? (
                                      <ToggleRight className="h-5 w-5" />
                                    ) : (
                                      <ToggleLeft className="h-5 w-5" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
