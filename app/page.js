"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Trophy,
  DollarSign,
  Activity,
  Bell,
  Search,
  Menu,
  ChevronDown,
  BarChart3,
  Shield,
  Vote,
  Calendar,
  Target,
  Gamepad2,
  Zap,
  AlertTriangle,
  MessageSquare,
  ImageIcon,
  FileText,
  Headphones,
  Crown,
  Settings,
  Swords,
  PlusCircle,
} from "lucide-react"
import SuperAdminPanel from "../components/super-admin-panel.js"
import DashboardOverview from "../components/dashboard-overview.js"
import UserManagement from "../components/user-management.js"
import TeamManagement from "../components/team-management.js"
import VotingCenter from "../components/voting-center.js"
import MatchManagement from "../components/match-management.js"
import MatchResults from "../components/match-results.js"
import DailyDuels from "../components/daily-duels.js"
import DailyBets from "../components/daily-bets.js"
import ProblemCenter from "../components/problem-center.js"
import NotificationCenter from "../components/notification-center.js"
import SponsorAds from "../components/sponsor-ads.js"
import FinancialManagement from "../components/financial-management.js"
import ReportsCenter from "../components/reports-center.js"
import SupportDesk from "../components/support-desk.js"
import SettingsPage from "./settings/page.js"
import AllGames from "../components/all-games.js"
import TournamentMatches from "../components/tournament-matches.js" // Updated import
import { useAuth } from "../lib/auth-context.js"
import ProtectedRoute from "../components/protected-route.js"
import Link from "next/link" // Import Link for navigation
import { redirect } from "next/navigation"

export default function AdminPanel() {
  const { user, logout, isSuperAdmin, isAdmin, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "High betting liability detected on Match #4521", type: "warning", time: "2 min ago" },
    { id: 2, message: "KYC verification pending for 15 users", type: "info", time: "15 min ago" },
    { id: 3, message: "Match room #789 experiencing connectivity issues", type: "error", time: "1 hour ago" },
  ])

  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 12847,
    liveMatches: 23,
    totalRevenue: 89432,
    pendingProblems: 7,
  })

  // Redirect to the admin dashboard as the default entry point
  if (!user) {
    redirect("/admin")
    return null // This component will not render anything
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        liveMatches: Math.max(0, prev.liveMatches + Math.floor(Math.random() * 3) - 1),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
        pendingProblems: Math.max(0, prev.pendingProblems + Math.floor(Math.random() * 3) - 1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Permission system based on user role
  const permissions = {
    super_admin: [
      "super_only",
      "view_dashboard",
      "manage_users",
      "manage_teams",
      "view_votes",
      "manage_matches",
      "manage_results",
      "manage_duels",
      "manage_bets",
      "view_problems",
      "send_notifications",
      "manage_ads",
      "manage_finance",
      "view_reports",
      "manage_support",
      "manage_settings",
      "manage_games", // New permission
      "manage_tournaments", // New permission
    ],
    admin: [
      "view_dashboard",
      "manage_users",
      "manage_teams",
      "view_votes",
      "manage_matches",
      "manage_results",
      "view_problems",
      "send_notifications",
      "view_reports",
      "manage_support",
      "manage_settings",
      "manage_games", // New permission
      "manage_tournaments", // New permission
    ],
    moderator: ["view_dashboard", "manage_users", "view_votes", "view_problems", "manage_support"],
  }

  const sidebarItems = [
    {
      id: "super",
      label: "Super Admin Panel",
      route: "/admin/super",
      icon: Crown,
      permission: "super_only",
      description: "Profit & Loss, Admin Mgmt, System Health",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      route: "/admin/dashboard",
      icon: BarChart3,
      permission: "view_dashboard",
      description: "Live KPIs + shortcuts",
    },
    {
      id: "users",
      label: "Users",
      route: "/admin/users",
      icon: Users,
      permission: "manage_users",
      description: "CRUD, KYC, bans",
    },
    {
      id: "teams",
      label: "Teams",
      route: "/admin/teams",
      icon: Shield,
      permission: "manage_teams",
      description: "Roster & votes",
    },
    {
      id: "votes",
      label: "Voting Center",
      route: "/admin/votes",
      icon: Vote,
      permission: "view_votes",
      description: "Vote analytics & fraud control",
    },
    {
      id: "games", // New parent item
      label: "Games",
      route: "/admin/games",
      icon: Swords, // New icon
      permission: "manage_games",
      description: "Manage game titles and tournaments",
      subItems: [
        {
          id: "all-games",
          label: "All Games",
          route: "/admin/games/all",
          permission: "manage_games",
          description: "View and manage all game titles",
        },
        {
          id: "add-game", // New sub-item for adding games
          label: "Add New Game",
          route: "/games/add-game", // Points to the new page
          permission: "manage_games",
          description: "Add a new game to the catalog",
        },
        {
          id: "tournament-matches", // Updated ID to reflect component name
          label: "Matches", // User requested "Matches"
          route: "/admin/games/tournaments",
          permission: "manage_tournaments",
          description: "Create and manage tournaments",
        },
      ],
    },
    {
      id: "matches",
      label: "Matches",
      route: "/admin/matches",
      icon: Calendar,
      permission: "manage_matches",
      description: "Fixture calendar, match room, autoscheduler",
    },
    {
      id: "results",
      label: "Match Results",
      route: "/admin/results",
      icon: Target,
      permission: "manage_results",
      description: "Round & player stats entry",
    },
    {
      id: "duels",
      label: "Daily Duels",
      route: "/admin/duels",
      icon: Gamepad2,
      permission: "manage_duels",
      description: "1v1 creation & settlement",
    },
    {
      id: "bets",
      label: "Daily Bets",
      route: "/admin/bets",
      icon: DollarSign,
      permission: "manage_bets",
      description: "Configure betting markets, monitor liability",
    },
    {
      id: "problems",
      label: "Problem Center",
      route: "/admin/problems",
      icon: AlertTriangle,
      permission: "view_problems",
      description: "Realtime incidents & SLA clock",
    },
    {
      id: "notifications",
      label: "Notification Center",
      route: "/admin/notifications",
      icon: MessageSquare,
      permission: "send_notifications",
      description: "Compose, schedule pushes",
    },
    {
      id: "ads",
      label: "Sponsor Ads",
      route: "/admin/ads",
      icon: ImageIcon,
      permission: "manage_ads",
      description: "Upload & timeslot sponsor media",
    },
    {
      id: "finance",
      label: "Finance",
      route: "/admin/finance",
      icon: DollarSign,
      permission: "manage_finance",
      description: "All money flows, payout approvals",
    },
    {
      id: "reports",
      label: "Reports",
      route: "/admin/reports",
      icon: FileText,
      permission: "view_reports",
      description: "CSV/PDF exports & scheduled reports",
    },
    {
      id: "support",
      label: "Support Desk",
      route: "/admin/support",
      icon: Headphones,
      permission: "manage_support",
      description: "Ticket replies + canned templates",
    },
    {
      id: "settings",
      label: "Settings",
      route: "/admin/settings",
      icon: Settings,
      permission: "manage_settings",
      description: "System configuration & admin management",
    },
  ]

  // Filter sidebar items based on user permissions
  const filteredSidebarItems = sidebarItems.filter((item) => {
    const hasMainPermission = permissions[user?.role]?.includes(item.permission)
    if (item.subItems) {
      item.subItems = item.subItems.filter((subItem) => permissions[user?.role]?.includes(subItem.permission))
      return item.subItems.length > 0 || hasMainPermission // Show parent if any sub-item is visible or if parent has direct permission
    }
    return hasMainPermission
  })

  const checkPermission = (permission) => {
    return permissions[user?.role]?.includes(permission) || false
  }

  const renderActiveComponent = () => {
    const currentItem =
      sidebarItems.find((item) => item.id === activeTab) ||
      sidebarItems.flatMap((item) => item.subItems || []).find((subItem) => subItem.id === activeTab)

    if (!currentItem || !checkPermission(currentItem?.permission)) {
      return (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access this section.</p>
        </div>
      )
    }

    switch (activeTab) {
      case "super":
        return <SuperAdminPanel stats={realTimeStats} />
      case "dashboard":
        return <DashboardOverview stats={realTimeStats} userRole={user?.role} />
      case "users":
        return <UserManagement />
      case "teams":
        return <TeamManagement />
      case "votes":
        return <VotingCenter />
      case "all-games":
        return <AllGames />
      case "tournament-matches": // Updated case
        return <TournamentMatches />
      case "matches":
        return <MatchManagement />
      case "results":
        return <MatchResults />
      case "duels":
        return <DailyDuels />
      case "bets":
        return <DailyBets />
      case "problems":
        return <ProblemCenter />
      case "notifications":
        return <NotificationCenter />
      case "ads":
        return <SponsorAds />
      case "finance":
        return <FinancialManagement />
      case "reports":
        return <ReportsCenter />
      case "support":
        return <SupportDesk />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardOverview stats={realTimeStats} userRole={user?.role} />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">BattleNation Admin</h1>
                <Badge variant="outline" className="text-xs">
                  {user?.role?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users, matches, problems..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{user?.role?.replace("_", " ") || "admin"}</p>
                </div>
                <button onClick={logout} className="p-1 hover:bg-gray-100 rounded" title="Logout">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}
          >
            <nav className="mt-8 px-4">
              <ul className="space-y-1">
                {filteredSidebarItems.map((item) => (
                  <li key={item.id}>
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => {
                            // For parent items with subItems, we might want to just expand/collapse or set active to first subitem
                            // For now, clicking parent just sets it active, subitems handle actual navigation
                            setActiveTab(item.id)
                            // setSidebarOpen(false); // Keep sidebar open to show sub-items
                          }}
                          className={`w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-colors group ${
                            activeTab === item.id || item.subItems?.some((sub) => sub.id === activeTab)
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium block">{item.label}</span>
                            <span className="text-xs text-gray-500 mt-1 block leading-tight">{item.description}</span>
                          </div>
                        </button>
                        {(activeTab === item.id || item.subItems.some((sub) => sub.id === activeTab)) && (
                          <ul className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-3">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.id}>
                                {subItem.id === "add-game" ? (
                                  <Link
                                    href={subItem.route}
                                    onClick={() => {
                                      setActiveTab(subItem.id)
                                      setSidebarOpen(false)
                                    }}
                                    className={`w-full flex items-start space-x-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                                      activeTab === subItem.id
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium block text-sm">{subItem.label}</span>
                                      <span className="text-xs text-gray-400 mt-0.5 block leading-tight">
                                        {subItem.description}
                                      </span>
                                    </div>
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveTab(subItem.id)
                                      setSidebarOpen(false)
                                    }}
                                    className={`w-full flex items-start space-x-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                                      activeTab === subItem.id
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium block text-sm">{subItem.label}</span>
                                      <span className="text-xs text-gray-400 mt-0.5 block leading-tight">
                                        {subItem.description}
                                      </span>
                                    </div>
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTab(item.id)
                          setSidebarOpen(false)
                        }}
                        className={`w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-colors group ${
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium block">{item.label}</span>
                          <span className="text-xs text-gray-500 mt-1 block leading-tight">{item.description}</span>
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Real-time Stats Sidebar */}
            <div className="mt-8 px-4 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Live Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium">{realTimeStats.activeUsers.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Live Matches</span>
                  <span className="text-sm font-medium text-orange-600">{realTimeStats.liveMatches}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Today</span>
                  <span className="text-sm font-medium text-green-600">
                    ${realTimeStats.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Issues</span>
                  <span
                    className={`text-sm font-medium ${
                      realTimeStats.pendingProblems > 5 ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {realTimeStats.pendingProblems}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 px-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{renderActiveComponent()}</main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  )
}
