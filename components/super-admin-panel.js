"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Crown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Database,
  Cpu,
  HardDrive,
  CheckCircle,
  Eye,
  Edit,
  Search,
  Download,
  Clock,
  MapPin,
  LogOut,
  Ban,
  Plus,
  Lock,
  FileText,
  RefreshCw,
  Loader2,
} from "lucide-react"

export default function SuperAdminPanel({ stats }) {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedWidget, setSelectedWidget] = useState("overview")
  const [auditSearchTerm, setAuditSearchTerm] = useState("")
  const [auditFilter, setAuditFilter] = useState("all")
  const [ledgerAmount, setLedgerAmount] = useState("")
  const [ledgerReason, setLedgerReason] = useState("")
  const [ledgerPin, setLedgerPin] = useState("")
  const [showLedgerForm, setShowLedgerForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for dynamic data
  const [plData, setPlData] = useState({})
  const [adminUsers, setAdminUsers] = useState([])
  const [systemHealth, setSystemHealth] = useState({})
  const [auditLogs, setAuditLogs] = useState([])
  const [platformBalance, setPlatformBalance] = useState({})

  // Fetch P&L data
  const fetchPlData = async (period = selectedPeriod) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/super-admin/pl-data?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setPlData((prev) => ({ ...prev, [period]: data }))
      }
    } catch (error) {
      console.error("Error fetching P&L data:", error)
      setError("Failed to fetch P&L data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/super-admin/admin-users")
      if (response.ok) {
        const data = await response.json()
        setAdminUsers(data)
      }
    } catch (error) {
      console.error("Error fetching admin users:", error)
      setError("Failed to fetch admin users")
    } finally {
      setLoading(false)
    }
  }

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      const response = await fetch("/api/super-admin/system-health")
      if (response.ok) {
        const data = await response.json()

        // Transform the data to match the expected format
        const transformedData = {
          cpu: {
            usage: data.cpu_usage?.metric_value || 0,
            status: data.cpu_usage?.status || "healthy",
            threshold: data.cpu_usage?.threshold_value || 80,
          },
          memory: {
            usage: data.memory_usage?.metric_value || 0,
            status: data.memory_usage?.status || "healthy",
            threshold: data.memory_usage?.threshold_value || 85,
          },
          database: {
            connections: data.database_connections?.metric_value || 0,
            maxConnections: data.database_connections?.additional_data?.max_connections || 100,
            status: data.database_connections?.status || "healthy",
          },
          redis: {
            hitRate: data.redis_hit_rate?.metric_value || 0,
            status: data.redis_hit_rate?.status || "healthy",
            threshold: data.redis_hit_rate?.threshold_value || 90,
          },
          diskSpace: {
            usage: data.disk_usage?.metric_value || 0,
            status: data.disk_usage?.status || "healthy",
            threshold: data.disk_usage?.threshold_value || 90,
          },
          networkIO: {
            inbound: 1.2,
            outbound: 0.8,
            status: "healthy",
          },
          apiResponseTime: {
            avg: data.api_response_time_avg?.metric_value || 0,
            p95: data.api_response_time_p95?.metric_value || 0,
            status: data.api_response_time_avg?.status || "healthy",
          },
          errorRate: {
            rate: data.error_rate?.metric_value || 0,
            status: data.error_rate?.status || "healthy",
            threshold: data.error_rate?.threshold_value || 1.0,
          },
        }

        setSystemHealth(transformedData)
      }
    } catch (error) {
      console.error("Error fetching system health:", error)
      setError("Failed to fetch system health")
    }
  }

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        search: auditSearchTerm,
        severity: auditFilter,
        limit: "50",
        offset: "0",
      })

      const response = await fetch(`/api/super-admin/audit-logs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data)
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      setError("Failed to fetch audit logs")
    }
  }

  // Fetch platform balance
  const fetchPlatformBalance = async () => {
    try {
      const response = await fetch("/api/super-admin/platform-ledger")
      if (response.ok) {
        const data = await response.json()
        setPlatformBalance({
          currentBalance: Number.parseFloat(data.current_balance),
          pendingTransactions: Number.parseFloat(data.pending_transactions),
          lastAdjustment: {
            amount: Number.parseFloat(data.last_adjustment_amount || 0),
            type: data.last_adjustment_type,
            reason: data.last_adjustment_reason,
            timestamp: data.last_adjustment_timestamp,
            adminName: data.last_adjustment_admin,
          },
        })
      }
    } catch (error) {
      console.error("Error fetching platform balance:", error)
      setError("Failed to fetch platform balance")
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPlData()
    fetchAdminUsers()
    fetchSystemHealth()
    fetchAuditLogs()
    fetchPlatformBalance()
  }, [])

  // Fetch P&L data when period changes
  useEffect(() => {
    fetchPlData(selectedPeriod)
  }, [selectedPeriod])

  // Fetch audit logs when search/filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAuditLogs()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [auditSearchTerm, auditFilter])

  // Real-time system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSystemHealth()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getHealthStatus = (metric, value, threshold) => {
    if (metric === "redis") {
      return value >= threshold ? "healthy" : value >= threshold - 5 ? "warning" : "critical"
    }
    return value <= threshold ? "healthy" : value <= threshold + 10 ? "warning" : "critical"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: { label: "Super Admin", className: "bg-purple-100 text-purple-800" },
      admin: { label: "Admin", className: "bg-blue-100 text-blue-800" },
      moderator: { label: "Moderator", className: "bg-green-100 text-green-800" },
    }
    const config = roleConfig[role] || roleConfig.moderator
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      critical: { label: "Critical", className: "bg-red-100 text-red-800" },
      high: { label: "High", className: "bg-orange-100 text-orange-800" },
      medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800" },
      low: { label: "Low", className: "bg-blue-100 text-blue-800" },
    }
    const config = severityConfig[severity] || severityConfig.low
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.admin_name.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchTerm.toLowerCase())

    if (auditFilter === "all") return matchesSearch
    return matchesSearch && log.severity === auditFilter
  })

  const handleLedgerAdjustment = async () => {
    if (!ledgerAmount || !ledgerReason || !ledgerPin) {
      alert("Please fill in all fields including PIN")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/super-admin/platform-ledger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(ledgerAmount),
          reason: ledgerReason,
          admin_name: "John Smith", // Current admin - should come from auth context
          pin: ledgerPin,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPlatformBalance({
          currentBalance: Number.parseFloat(data.current_balance),
          pendingTransactions: Number.parseFloat(data.pending_transactions),
          lastAdjustment: {
            amount: Number.parseFloat(data.last_adjustment_amount),
            type: data.last_adjustment_type,
            reason: data.last_adjustment_reason,
            timestamp: data.last_adjustment_timestamp,
            adminName: data.last_adjustment_admin,
          },
        })

        // Reset form
        setLedgerAmount("")
        setLedgerReason("")
        setLedgerPin("")
        setShowLedgerForm(false)

        // Refresh audit logs
        fetchAuditLogs()

        alert("Ledger adjustment completed successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to process ledger adjustment")
      }
    } catch (error) {
      console.error("Error processing ledger adjustment:", error)
      alert("Failed to process ledger adjustment")
    } finally {
      setLoading(false)
    }
  }

  const exportAuditLogs = () => {
    const csvContent = [
      ["Timestamp", "Admin", "Action", "Resource", "Details", "IP Address", "Severity"].join(","),
      ...filteredAuditLogs.map((log) =>
        [
          log.timestamp,
          log.admin_name,
          log.action,
          log.resource,
          `"${log.details}"`,
          log.ip_address,
          log.severity,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const refreshData = () => {
    fetchPlData()
    fetchAdminUsers()
    fetchSystemHealth()
    fetchAuditLogs()
    fetchPlatformBalance()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshData}>
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
        <div className="flex items-center space-x-3">
          <Crown className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Super Admin Panel</h2>
            <p className="text-gray-600">Deep system oversight and administrative controls</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedWidget}
            onChange={(e) => setSelectedWidget(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="overview">P&L Overview</option>
            <option value="admins">Admin Management</option>
            <option value="health">System Health</option>
            <option value="audit">Audit Log Viewer</option>
            <option value="ledger">Manual Ledger</option>
          </select>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* P&L Overview Widget */}
      {selectedWidget === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Profit & Loss Overview</span>
                  </CardTitle>
                  <CardDescription>Data source: materialized view pl_summary_daily</CardDescription>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : plData[selectedPeriod] ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-sm font-medium text-green-700 mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-900">
                      ${Number.parseFloat(plData[selectedPeriod].revenue).toLocaleString()}
                    </p>
                    {selectedPeriod === "today" && plData[selectedPeriod].revenue_comparison && (
                      <div className="flex items-center justify-center mt-2 text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">+{plData[selectedPeriod].revenue_comparison}%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                    <TrendingDown className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-sm font-medium text-red-700 mb-2">Total Costs</p>
                    <p className="text-3xl font-bold text-red-900">
                      ${Number.parseFloat(plData[selectedPeriod].costs).toLocaleString()}
                    </p>
                    {selectedPeriod === "today" && plData[selectedPeriod].costs_comparison && (
                      <div className="flex items-center justify-center mt-2 text-red-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">+{plData[selectedPeriod].costs_comparison}%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-sm font-medium text-purple-700 mb-2">Net Profit</p>
                    <p className="text-3xl font-bold text-purple-900">
                      ${Number.parseFloat(plData[selectedPeriod].net_profit).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-sm font-medium text-purple-600">
                        {Number.parseFloat(plData[selectedPeriod].profit_margin).toFixed(1)}% margin
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">No data available for {selectedPeriod}</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Management Widget */}
      {selectedWidget === "admins" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Admin Management</span>
            </CardTitle>
            <CardDescription>Data source: admins, admin_permissions tables</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                        <AvatarFallback>
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{admin.name}</h4>
                          {getRoleBadge(admin.role)}
                          <Badge variant={admin.status === "active" ? "default" : "secondary"}>{admin.status}</Badge>
                          {admin.session_active && (
                            <Badge className="bg-green-100 text-green-800">
                              <Activity className="h-3 w-3 mr-1" />
                              Online
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Last login: {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}
                          </span>
                          {admin.last_login_ip && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              IP: {admin.last_login_ip}
                            </span>
                          )}
                          {admin.location && <span>{admin.location}</span>}
                        </div>
                        {admin.device_info && <p className="text-xs text-gray-500 mt-1">{admin.device_info}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{admin.permissions} permissions</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {admin.session_active && (
                        <Button variant="ghost" size="sm" className="text-orange-600">
                          <LogOut className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* System Health Widget */}
      {selectedWidget === "health" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health Monitor</span>
            </CardTitle>
            <CardDescription>Data source: Prometheus /metrics via Grafana API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Cpu className="h-8 w-8 text-blue-500" />
                  <Badge
                    className={`ml-2 ${getStatusColor(getHealthStatus("cpu", systemHealth.cpu?.usage, systemHealth.cpu?.threshold))}`}
                  >
                    {getHealthStatus("cpu", systemHealth.cpu?.usage, systemHealth.cpu?.threshold)}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.cpu?.usage?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <Progress value={systemHealth.cpu?.usage || 0} className="h-2 mt-2" />
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Database className="h-8 w-8 text-green-500" />
                  <Badge
                    className={`ml-2 ${getStatusColor(getHealthStatus("memory", systemHealth.memory?.usage, systemHealth.memory?.threshold))}`}
                  >
                    {getHealthStatus("memory", systemHealth.memory?.usage, systemHealth.memory?.threshold)}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.memory?.usage?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <Progress value={systemHealth.memory?.usage || 0} className="h-2 mt-2" />
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Database className="h-8 w-8 text-purple-500" />
                  <Badge className={`ml-2 ${getStatusColor("healthy")}`}>healthy</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {systemHealth.database?.connections || 0}/{systemHealth.database?.maxConnections || 100}
                </p>
                <p className="text-sm text-gray-600">DB Connections</p>
                <Progress
                  value={
                    ((systemHealth.database?.connections || 0) / (systemHealth.database?.maxConnections || 100)) * 100
                  }
                  className="h-2 mt-2"
                />
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <HardDrive className="h-8 w-8 text-orange-500" />
                  <Badge
                    className={`ml-2 ${getStatusColor(getHealthStatus("redis", systemHealth.redis?.hitRate, systemHealth.redis?.threshold))}`}
                  >
                    {getHealthStatus("redis", systemHealth.redis?.hitRate, systemHealth.redis?.threshold)}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.redis?.hitRate?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">Redis Hit Rate</p>
                <Progress value={systemHealth.redis?.hitRate || 0} className="h-2 mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response Time (avg)</span>
                    <span className="text-sm font-medium">{systemHealth.apiResponseTime?.avg || 0}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response Time (p95)</span>
                    <span className="text-sm font-medium">{systemHealth.apiResponseTime?.p95 || 0}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">{systemHealth.errorRate?.rate || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Network & Storage</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network Inbound</span>
                    <span className="text-sm font-medium">{systemHealth.networkIO?.inbound || 0} GB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network Outbound</span>
                    <span className="text-sm font-medium">{systemHealth.networkIO?.outbound || 0} GB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disk Usage</span>
                    <span className="text-sm font-medium">{systemHealth.diskSpace?.usage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Viewer Widget */}
      {selectedWidget === "audit" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Audit Log Viewer</span>
                </CardTitle>
                <CardDescription>Data source: admin_audit table</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={exportAuditLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by admin, action, or details..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredAuditLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{log.action.replace(/_/g, " ")}</h4>
                      {getSeverityBadge(log.severity)}
                    </div>
                    <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Admin: {log.admin_name}</span>
                    <span>Resource: {log.resource}</span>
                    <span>IP: {log.ip_address}</span>
                    <span>User Agent: {log.user_agent}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Ledger Adjustment Widget */}
      {selectedWidget === "ledger" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Platform Ledger Status</span>
              </CardTitle>
              <CardDescription>Data source: platform_earnings table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-sm font-medium text-blue-700 mb-2">Current Balance</p>
                  <p className="text-3xl font-bold text-blue-900">
                    ${(platformBalance.currentBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <p className="text-sm font-medium text-yellow-700 mb-2">Pending Transactions</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    $
                    {(platformBalance.pendingTransactions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {platformBalance.lastAdjustment && platformBalance.lastAdjustment.amount && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Last Manual Adjustment</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium">
                        {platformBalance.lastAdjustment.type === "credit" ? "+" : "-"}$
                        {Math.abs(platformBalance.lastAdjustment.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium capitalize">{platformBalance.lastAdjustment.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Admin:</span>
                      <p className="font-medium">{platformBalance.lastAdjustment.adminName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <p className="font-medium">
                        {new Date(platformBalance.lastAdjustment.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600">Reason:</span>
                    <p className="font-medium">{platformBalance.lastAdjustment.reason}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Manual Ledger Adjustment</span>
              </CardTitle>
              <CardDescription>Requires PIN verification. All changes are logged and audited.</CardDescription>
            </CardHeader>
            <CardContent>
              {!showLedgerForm ? (
                <Button onClick={() => setShowLedgerForm(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Make Ledger Adjustment
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Adjustment Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter amount (+ for credit, - for debit)"
                        value={ledgerAmount}
                        onChange={(e) => setLedgerAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pin">Security PIN</Label>
                      <Input
                        id="pin"
                        type="password"
                        placeholder="Enter your PIN"
                        value={ledgerPin}
                        onChange={(e) => setLedgerPin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for Adjustment</Label>
                    <Input
                      id="reason"
                      placeholder="Provide detailed reason for this adjustment"
                      value={ledgerReason}
                      onChange={(e) => setLedgerReason(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleLedgerAdjustment} className="flex-1" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm Adjustment
                    </Button>
                    <Button variant="outline" onClick={() => setShowLedgerForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
