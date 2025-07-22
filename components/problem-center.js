"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, User, ArrowUp, Download, Eye, UserCheck, Filter } from "lucide-react"

export default function ProblemCenter() {
  const [problems, setProblems] = useState([])
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [filters, setFilters] = useState({
    severity: "all",
    status: "all",
    assigned: "all",
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockProblems = [
      {
        id: "P001",
        title: "Unable to withdraw winnings",
        description: "User reports withdrawal request stuck for 3 days",
        severity: "High",
        status: "Open",
        category: "Payment",
        userId: "U12345",
        userName: "john_doe",
        assignedTo: null,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        slaTimer: 4.5, // hours remaining
        attachments: [{ id: "A001", name: "screenshot.png", url: "/api/attachments/A001" }],
        comments: [
          {
            id: "C001",
            author: "System",
            content: "Ticket created automatically from user report",
            timestamp: "2024-01-15T10:30:00Z",
          },
        ],
      },
      {
        id: "P002",
        title: "Match result dispute",
        description: "Team claims incorrect kill count recorded",
        severity: "Medium",
        status: "In Progress",
        category: "Gameplay",
        userId: "U67890",
        userName: "team_alpha",
        assignedTo: "admin_sarah",
        createdAt: "2024-01-15T09:15:00Z",
        updatedAt: "2024-01-15T11:45:00Z",
        slaTimer: 18.2,
        attachments: [
          { id: "A002", name: "match_recording.mp4", url: "/api/attachments/A002" },
          { id: "A003", name: "scoreboard.jpg", url: "/api/attachments/A003" },
        ],
        comments: [
          {
            id: "C002",
            author: "admin_sarah",
            content: "Reviewing match footage and server logs",
            timestamp: "2024-01-15T11:45:00Z",
          },
        ],
      },
      {
        id: "P003",
        title: "Account verification failed",
        description: "KYC documents rejected without clear reason",
        severity: "Low",
        status: "Open",
        category: "Account",
        userId: "U11111",
        userName: "new_player",
        assignedTo: null,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z",
        slaTimer: 22.0,
        attachments: [],
        comments: [],
      },
    ]
    setProblems(mockProblems)
  }, [])

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/problems-feed")

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)

      if (update.type === "new_problem") {
        setProblems((prev) => [update.problem, ...prev])
      } else if (update.type === "problem_updated") {
        setProblems((prev) =>
          prev.map((p) =>
            p.id === update.problemId ? { ...p, ...update.changes, updatedAt: new Date().toISOString() } : p,
          ),
        )
      }
    }

    return () => ws.close()
  }, [])

  // SLA Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setProblems((prev) =>
        prev.map((problem) => ({
          ...problem,
          slaTimer: Math.max(0, problem.slaTimer - 1 / 60), // Decrease by 1 minute
        })),
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleAssignToMe = (problemId) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, assignedTo: "current_admin", status: "In Progress" } : p)),
    )
  }

  const handleEscalate = (problemId) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problemId ? { ...p, severity: p.severity === "Low" ? "Medium" : "High", assignedTo: "supervisor" } : p,
      ),
    )
  }

  const handleStatusChange = (problemId, newStatus) => {
    setProblems((prev) => prev.map((p) => (p.id === problemId ? { ...p, status: newStatus } : p)))
  }

  const getSeverityBadge = (severity) => {
    const variants = {
      High: "destructive",
      Medium: "warning",
      Low: "secondary",
    }
    return <Badge variant={variants[severity]}>{severity}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      Open: "secondary",
      "In Progress": "warning",
      Resolved: "success",
      Closed: "outline",
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getSLABadge = (hours) => {
    if (hours <= 2) return <Badge variant="destructive">Critical</Badge>
    if (hours <= 8) return <Badge variant="warning">Urgent</Badge>
    return <Badge variant="success">On Time</Badge>
  }

  const filteredProblems = problems.filter((problem) => {
    if (filters.severity !== "all" && problem.severity !== filters.severity) return false
    if (filters.status !== "all" && problem.status !== filters.status) return false
    if (filters.assigned === "unassigned" && problem.assignedTo) return false
    if (filters.assigned === "assigned" && !problem.assignedTo) return false
    return true
  })

  const ProblemDrawer = ({ problem }) => {
    const [newComment, setNewComment] = useState("")

    const handleAddComment = () => {
      if (!newComment.trim()) return

      const comment = {
        id: `C${Date.now()}`,
        author: "current_admin",
        content: newComment,
        timestamp: new Date().toISOString(),
      }

      setProblems((prev) => prev.map((p) => (p.id === problem.id ? { ...p, comments: [...p.comments, comment] } : p)))

      setNewComment("")
    }

    return (
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[600px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {problem.title}
              {getSeverityBadge(problem.severity)}
            </SheetTitle>
            <SheetDescription>
              Problem #{problem.id} • Created {new Date(problem.createdAt).toLocaleString()}
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={problem.status} onValueChange={(value) => handleStatusChange(problem.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Severity</Label>
                  <Select value={problem.severity} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={problem.description} disabled rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User</Label>
                  <Input value={`${problem.userName} (${problem.userId})`} disabled />
                </div>

                <div>
                  <Label>Category</Label>
                  <Input value={problem.category} disabled />
                </div>
              </div>

              <div>
                <Label>Assigned To</Label>
                <Input value={problem.assignedTo || "Unassigned"} disabled />
              </div>

              <div className="flex gap-2">
                {!problem.assignedTo && (
                  <Button onClick={() => handleAssignToMe(problem.id)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign to Me
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleEscalate(problem.id)}>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Escalate
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              {problem.attachments.length > 0 ? (
                <div className="space-y-2">
                  {problem.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{attachment.name}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No attachments</p>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                {problem.comments.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Add Comment</Label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Problem Center</h1>
          <p className="text-muted-foreground">Monitor and resolve user-reported issues</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Problems</p>
                <p className="text-2xl font-bold">{problems.filter((p) => p.status === "Open").length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{problems.filter((p) => p.status === "In Progress").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold">{problems.filter((p) => !p.assignedTo).length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Breaches</p>
                <p className="text-2xl font-bold">{problems.filter((p) => p.slaTimer <= 2).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Severity</Label>
              <Select
                value={filters.severity}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Assignment</Label>
              <Select
                value={filters.assigned}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, assigned: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Problems</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Problems Feed</CardTitle>
          <CardDescription>Real-time problem tracking with SLA monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Timer</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{problem.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{problem.title}</TableCell>
                  <TableCell>{problem.userName}</TableCell>
                  <TableCell>{problem.category}</TableCell>
                  <TableCell>{getSeverityBadge(problem.severity)}</TableCell>
                  <TableCell>{getStatusBadge(problem.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSLABadge(problem.slaTimer)}
                      <span className="text-sm">{problem.slaTimer.toFixed(1)}h</span>
                    </div>
                  </TableCell>
                  <TableCell>{problem.assignedTo || "Unassigned"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProblem(problem)
                        setIsDrawerOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProblems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No problems match the current filters.</div>
          )}
        </CardContent>
      </Card>

      {selectedProblem && <ProblemDrawer problem={selectedProblem} />}
    </div>
  )
}
