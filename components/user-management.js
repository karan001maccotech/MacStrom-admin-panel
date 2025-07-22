"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  UserCheck,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Ban,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Wallet,
  Plus,
  Minus,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalUsers, setTotalUsers] = useState(0)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [editBankModalOpen, setEditBankModalOpen] = useState(false)
  const [walletAdjustModalOpen, setWalletAdjustModalOpen] = useState(false)
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false)
  const [bulkActionType, setBulkActionType] = useState("")

  // Bank details form state
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    bankName: "",
    accountHolderName: "",
  })

  // Wallet adjustment form state
  const [walletAdjustment, setWalletAdjustment] = useState({
    amount: "",
    type: "credit", // credit or debit
    reason: "",
    adminPin: "",
  })

  // Bulk action form state
  const [bulkAction, setBulkAction] = useState({
    message: "",
    subject: "",
    reason: "",
  })

  // Server-side pagination and filtering
  useEffect(() => {
    fetchUsers()
  }, [currentPage, pageSize, searchTerm, selectedFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Simulated API call with server-side pagination
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        filter: selectedFilter,
      })

      // Replace with actual API endpoint
      const response = await fetch(`/api/users?${params}`)
      const data = {
        users: [
          {
            id: 1,
            username: "ProGamer123",
            email: "progamer@email.com",
            fullName: "Alex Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "active",
            verified: true,
            joinDate: "2023-12-15",
            lastActive: "2 hours ago",
            depositsTotal: 2450.5,
            withdrawalsTotal: 1200.0,
            walletBalance: 1250.5,
            location: "New York, USA",
            phone: "+1 (555) 123-4567",
            riskLevel: "low",
            kycStatus: "verified",
            currentTeam: "Phoenix Warriors",
            totalMatches: 45,
            wins: 32,
            averageKills: 8.5,
          },
          {
            id: 2,
            username: "EliteSniper",
            email: "elite@email.com",
            fullName: "Sarah Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "active",
            verified: true,
            joinDate: "2023-11-20",
            lastActive: "1 day ago",
            depositsTotal: 5670.0,
            withdrawalsTotal: 3200.0,
            walletBalance: 2470.0,
            location: "Los Angeles, USA",
            phone: "+1 (555) 987-6543",
            riskLevel: "low",
            kycStatus: "verified",
            currentTeam: "Thunder Bolts",
            totalMatches: 67,
            wins: 48,
            averageKills: 12.3,
          },
          {
            id: 3,
            username: "SuspiciousPlayer",
            email: "suspicious@email.com",
            fullName: "Unknown User",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "suspended",
            verified: false,
            joinDate: "2024-01-05",
            lastActive: "3 days ago",
            depositsTotal: 0,
            withdrawalsTotal: 0,
            walletBalance: 0,
            location: "Unknown",
            phone: "Not provided",
            riskLevel: "high",
            kycStatus: "pending",
            currentTeam: null,
            totalMatches: 8,
            wins: 0,
            averageKills: 2.1,
          },
        ],
        total: 1247,
        page: currentPage,
        totalPages: Math.ceil(1247 / pageSize),
      }

      setUsers(data.users)
      setTotalUsers(data.total)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId) => {
    try {
      // Fetch detailed user information for profile drawer
      const response = await fetch(`/api/users/${userId}/details`)
      const userDetails = {
        ...users.find((u) => u.id === userId),
        bankDetails: {
          accountNumber: "****1234",
          ifscCode: "HDFC0001234",
          upiId: "progamer@paytm",
          bankName: "HDFC Bank",
          accountHolderName: "Alex Johnson",
        },
        kycDocuments: [
          {
            type: "government_id",
            status: "verified",
            url: "/placeholder.svg?height=400&width=600",
            uploadDate: "2023-12-16",
          },
          {
            type: "selfie",
            status: "verified",
            url: "/placeholder.svg?height=400&width=400",
            uploadDate: "2023-12-16",
          },
          {
            type: "address_proof",
            status: "verified",
            url: "/placeholder.svg?height=400&width=600",
            uploadDate: "2023-12-16",
          },
        ],
        payments: [
          {
            refId: "DEP-001",
            type: "deposit",
            amount: 500.0,
            method: "UPI",
            status: "completed",
            timestamp: "2024-01-08 14:32:15",
          },
          {
            refId: "WTH-001",
            type: "withdrawal",
            amount: 250.0,
            method: "Bank Transfer",
            status: "pending",
            timestamp: "2024-01-08 12:18:45",
          },
        ],
        gameplay: {
          totalMatches: 45,
          wins: 32,
          losses: 13,
          winRate: 71.1,
          averageKills: 8.5,
          currentTeams: ["Phoenix Warriors"],
          favoriteGame: "Mobile Legends",
          totalEarnings: 2450.5,
        },
        transactions: [
          {
            id: "TXN-001",
            type: "in_app_purchase",
            description: "Premium Battle Pass",
            amount: 9.99,
            timestamp: "2024-01-08 10:15:30",
          },
          {
            id: "BET-001",
            type: "bet_placed",
            description: "Match #789 - Phoenix Warriors",
            amount: 50.0,
            timestamp: "2024-01-07 19:45:22",
          },
        ],
        auditTrail: [
          {
            id: 1,
            action: "KYC_VERIFIED",
            admin: "John Smith",
            timestamp: "2023-12-16 15:30:00",
            details: "KYC documents verified and approved",
          },
          {
            id: 2,
            action: "WALLET_CREDIT",
            admin: "Sarah Johnson",
            timestamp: "2024-01-05 11:22:33",
            details: "Manual wallet credit: +$100 - Tournament prize correction",
          },
        ],
      }

      setSelectedUser(userDetails)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  const handleUserAction = async (action, userId, data = {}) => {
    try {
      switch (action) {
        case "ban":
          await fetch(`/api/users/${userId}/ban`, { method: "POST", body: JSON.stringify(data) })
          break
        case "unban":
          await fetch(`/api/users/${userId}/unban`, { method: "POST" })
          break
        case "reset_password":
          await fetch(`/api/users/${userId}/reset-password`, { method: "POST" })
          break
        case "wallet_adjust":
          await fetch(`/api/users/${userId}/wallet-adjust`, { method: "POST", body: JSON.stringify(data) })
          break
        case "delete":
          await fetch(`/api/users/${userId}`, { method: "DELETE" })
          break
      }

      // Refresh user list
      fetchUsers()

      // Close modals
      setWalletAdjustModalOpen(false)
      setProfileDrawerOpen(false)
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
    }
  }

  const handleBulkAction = async () => {
    try {
      const payload = {
        userIds: selectedUsers,
        action: bulkActionType,
        data: bulkAction,
      }

      await fetch("/api/users/bulk-action", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      // Refresh user list
      fetchUsers()
      setSelectedUsers([])
      setBulkActionModalOpen(false)
    } catch (error) {
      console.error("Failed to perform bulk action:", error)
    }
  }

  const handleBankDetailsUpdate = async () => {
    try {
      await fetch(`/api/users/${selectedUser.id}/bank-details`, {
        method: "PUT",
        body: JSON.stringify(bankDetails),
      })

      // Refresh user details
      fetchUserDetails(selectedUser.id)
      setEditBankModalOpen(false)
    } catch (error) {
      console.error("Failed to update bank details:", error)
    }
  }

  const exportUsers = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        filter: selectedFilter,
        includeBankFields: true,
      })

      const response = await fetch(`/api/users/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export users:", error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      banned: { label: "Banned", className: "bg-gray-100 text-gray-800" },
    }
    const config = statusConfig[status] || statusConfig.active
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getKYCStatusBadge = (status) => {
    const statusConfig = {
      verified: { label: "Verified", className: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800", icon: XCircle },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const openProfileDrawer = (user) => {
    fetchUserDetails(user.id)
    setProfileDrawerOpen(true)
    setActiveTab("overview")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Server-paginated list of all registered accounts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {selectedUsers.length > 0 && (
            <Dialog open={bulkActionModalOpen} onOpenChange={setBulkActionModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Actions ({selectedUsers.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Actions</DialogTitle>
                  <DialogDescription>Perform actions on {selectedUsers.length} selected users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Action Type</Label>
                    <select
                      value={bulkActionType}
                      onChange={(e) => setBulkActionType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Action</option>
                      <option value="ban">Mass Ban</option>
                      <option value="broadcast_push">Broadcast Push Notification</option>
                      <option value="broadcast_email">Broadcast Email</option>
                    </select>
                  </div>

                  {bulkActionType === "broadcast_push" && (
                    <div>
                      <Label htmlFor="message">Push Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter push notification message"
                        value={bulkAction.message}
                        onChange={(e) => setBulkAction({ ...bulkAction, message: e.target.value })}
                      />
                    </div>
                  )}

                  {bulkActionType === "broadcast_email" && (
                    <>
                      <div>
                        <Label htmlFor="subject">Email Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Enter email subject"
                          value={bulkAction.subject}
                          onChange={(e) => setBulkAction({ ...bulkAction, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Email Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Enter email message"
                          value={bulkAction.message}
                          onChange={(e) => setBulkAction({ ...bulkAction, message: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {bulkActionType === "ban" && (
                    <div>
                      <Label htmlFor="reason">Ban Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Enter reason for ban"
                        value={bulkAction.reason}
                        onChange={(e) => setBulkAction({ ...bulkAction, reason: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button onClick={handleBulkAction} className="flex-1">
                      Execute Action
                    </Button>
                    <Button variant="outline" onClick={() => setBulkActionModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button>Add New User</Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Directory</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
                <option value="verified">KYC Verified</option>
                <option value="high_risk">High Risk</option>
              </select>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Selection */}
          {users.length > 0 && (
            <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedUsers(users.map((u) => u.id))
                  } else {
                    setSelectedUsers([])
                  }
                }}
              />
              <span className="text-sm text-gray-600">
                {selectedUsers.length > 0 ? `${selectedUsers.length} users selected` : "Select all"}
              </span>
            </div>
          )}

          {/* User Table */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                        }
                      }}
                    />
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{user.username}</h4>
                        {user.verified && <UserCheck className="h-4 w-4 text-blue-500" />}
                        {getStatusBadge(user.status)}
                        {getKYCStatusBadge(user.kycStatus)}
                      </div>
                      <p className="text-sm text-gray-600">{user.fullName}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined {user.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* New Financial Columns */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-green-600">${user.depositsTotal.toFixed(2)}</p>
                      <p className="text-gray-500">Deposits</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-red-600">${user.withdrawalsTotal.toFixed(2)}</p>
                      <p className="text-gray-500">Withdrawals</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">${user.walletBalance.toFixed(2)}</p>
                      <p className="text-gray-500">Balance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Last active</p>
                      <p className="text-xs font-medium">{user.lastActive}</p>
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openProfileDrawer(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={user.status === "suspended" ? "text-green-600" : "text-red-600"}
                      onClick={() => handleUserAction(user.status === "suspended" ? "unban" : "ban", user.id)}
                    >
                      {user.status === "suspended" ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleUserAction("reset_password", user.id)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Dialog open={walletAdjustModalOpen} onOpenChange={setWalletAdjustModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Wallet className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Wallet Adjustment</DialogTitle>
                          <DialogDescription>Adjust wallet balance for {selectedUser?.username}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Current Balance: ${selectedUser?.walletBalance.toFixed(2)}</Label>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                value={walletAdjustment.amount}
                                onChange={(e) => setWalletAdjustment({ ...walletAdjustment, amount: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <select
                                value={walletAdjustment.type}
                                onChange={(e) => setWalletAdjustment({ ...walletAdjustment, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="credit">Credit (+)</option>
                                <option value="debit">Debit (-)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                              id="reason"
                              placeholder="Enter reason for adjustment"
                              value={walletAdjustment.reason}
                              onChange={(e) => setWalletAdjustment({ ...walletAdjustment, reason: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminPin">Admin PIN</Label>
                            <Input
                              id="adminPin"
                              type="password"
                              placeholder="Enter your admin PIN"
                              value={walletAdjustment.adminPin}
                              onChange={(e) => setWalletAdjustment({ ...walletAdjustment, adminPin: e.target.value })}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUserAction("wallet_adjust", selectedUser.id, walletAdjustment)}
                              className="flex-1"
                            >
                              {walletAdjustment.type === "credit" ? (
                                <Plus className="h-4 w-4 mr-2" />
                              ) : (
                                <Minus className="h-4 w-4 mr-2" />
                              )}
                              Confirm Adjustment
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setWalletAdjustModalOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleUserAction("delete", user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of{" "}
              {totalUsers} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(totalUsers / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(Math.ceil(totalUsers / pageSize), currentPage + 1))}
                disabled={currentPage === Math.ceil(totalUsers / pageSize)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Drawer */}
      <Sheet open={profileDrawerOpen} onOpenChange={setProfileDrawerOpen}>
        <SheetContent className="w-[800px] sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUser?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedUser?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{selectedUser?.username}</span>
              {getStatusBadge(selectedUser?.status)}
            </SheetTitle>
            <SheetDescription>
              User ID: {selectedUser?.id} • Joined {selectedUser?.joinDate}
            </SheetDescription>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="kyc">KYC Docs</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-sm font-medium">{selectedUser?.fullName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{selectedUser?.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium">{selectedUser?.phone}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p className="text-sm font-medium">{selectedUser?.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bank/UPI Details</CardTitle>
                    <Dialog open={editBankModalOpen} onOpenChange={setEditBankModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Bank Details</DialogTitle>
                          <DialogDescription>
                            Update bank and UPI information for {selectedUser?.username}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="accountNumber">Account Number</Label>
                              <Input
                                id="accountNumber"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="ifscCode">IFSC Code</Label>
                              <Input
                                id="ifscCode"
                                value={bankDetails.ifscCode}
                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="upiId">UPI ID</Label>
                            <Input
                              id="upiId"
                              value={bankDetails.upiId}
                              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Input
                                id="bankName"
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="accountHolderName">Account Holder Name</Label>
                              <Input
                                id="accountHolderName"
                                value={bankDetails.accountHolderName}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleBankDetailsUpdate} className="flex-1">
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditBankModalOpen(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Account Number</Label>
                      <p className="text-sm font-medium">{selectedUser?.bankDetails?.accountNumber}</p>
                    </div>
                    <div>
                      <Label>IFSC Code</Label>
                      <p className="text-sm font-medium">{selectedUser?.bankDetails?.ifscCode}</p>
                    </div>
                    <div>
                      <Label>UPI ID</Label>
                      <p className="text-sm font-medium">{selectedUser?.bankDetails?.upiId}</p>
                    </div>
                    <div>
                      <Label>Bank Name</Label>
                      <p className="text-sm font-medium">{selectedUser?.bankDetails?.bankName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* KYC Documents Tab */}
            <TabsContent value="kyc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedUser?.kycDocuments?.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={doc.url || "/placeholder.svg"}
                              alt={doc.type}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium capitalize">{doc.type.replace("_", " ")}</h4>
                            <p className="text-sm text-gray-600">Uploaded: {doc.uploadDate}</p>
                            {getKYCStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <select
                            value={doc.status}
                            onChange={(e) => {
                              // Handle status change
                              console.log(`Changing ${doc.type} status to ${e.target.value}`)
                            }}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Merged data from deposits and withdrawals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedUser?.payments?.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${payment.type === "deposit" ? "bg-green-100" : "bg-red-100"}`}
                          >
                            {payment.type === "deposit" ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : (
                              <Minus className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{payment.refId}</p>
                            <p className="text-sm text-gray-600">{payment.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${payment.type === "deposit" ? "text-green-600" : "text-red-600"}`}
                          >
                            {payment.type === "deposit" ? "+" : "-"}${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">{payment.timestamp}</p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gameplay Tab */}
            <TabsContent value="gameplay" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gameplay Statistics</CardTitle>
                  <CardDescription>Data joined from match_lineups, player_stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedUser?.gameplay?.totalMatches}</p>
                      <p className="text-sm text-gray-600">Total Matches</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedUser?.gameplay?.wins}</p>
                      <p className="text-sm text-gray-600">Wins</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedUser?.gameplay?.averageKills}</p>
                      <p className="text-sm text-gray-600">Avg Kills</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{selectedUser?.gameplay?.winRate}%</p>
                      <p className="text-sm text-gray-600">Win Rate</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label>Current Team(s)</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedUser?.gameplay?.currentTeams?.map((team, index) => (
                          <Badge key={index} variant="outline">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Favorite Game</Label>
                        <p className="text-sm font-medium">{selectedUser?.gameplay?.favoriteGame}</p>
                      </div>
                      <div>
                        <Label>Total Earnings</Label>
                        <p className="text-sm font-medium text-green-600">${selectedUser?.gameplay?.totalEarnings}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>In-App Transactions</CardTitle>
                  <CardDescription>In-app purchases, bets placed, refunds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedUser?.transactions?.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.id}</p>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <p className="text-xs text-gray-500 capitalize">{transaction.type.replace("_", " ")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{transaction.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Trail Tab */}
            <TabsContent value="audit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>Last 10 admin actions on this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedUser?.auditTrail?.map((audit, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Shield className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{audit.action.replace("_", " ")}</p>
                            <p className="text-sm text-gray-600">{audit.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{audit.details}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Admin: {audit.admin}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  )
}
