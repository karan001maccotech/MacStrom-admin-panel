"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Share2,
  Palette,
  FileText,
  HelpCircle,
  Shield,
  Users,
  Plug,
  Database,
  Crown,
  Save,
  Upload,
  ExternalLink,
  Eye,
  Edit,
  Plus,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  Key,
  Ban,
} from "lucide-react"

export default function SettingsPage() {
  const [userRole, setUserRole] = useState("super_admin") // This would come from auth context
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createAdminModalOpen, setCreateAdminModalOpen] = useState(false)
  const [editDocModalOpen, setEditDocModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [markdownPreview, setMarkdownPreview] = useState(false)

  // Permission system for tabs
  const tabPermissions = {
    general: ["super_admin", "admin"],
    social: ["super_admin", "admin"],
    branding: ["super_admin"],
    policies: ["super_admin"],
    howto: ["super_admin", "admin"],
    security: ["super_admin"],
    roles: ["super_admin"],
    integrations: ["super_admin"],
    backup: ["super_admin"],
    docs: ["super_admin"],
  }

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    leagueName: "BattleNation Championship",
    appName: "BattleNation",
    supportEmail: "support@battlenation.com",
    supportPhone: "+1-800-BATTLE",
    timezone: "America/New_York",
  })

  // Social Media Settings State
  const [socialSettings, setSocialSettings] = useState({
    youtubeUrl: "https://youtube.com/@battlenation",
    instagramUrl: "https://instagram.com/battlenation",
    facebookUrl: "https://facebook.com/battlenation",
    twitterUrl: "https://twitter.com/battlenation",
    discordInvite: "https://discord.gg/battlenation",
  })

  // Branding Settings State
  const [brandingSettings, setBrandingSettings] = useState({
    logoUrl: "/placeholder.svg?height=100&width=200",
    appIconUrl: "/placeholder.svg?height=512&width=512",
    splashVideoUrl: "https://cdn.battlenation.com/splash.mp4",
    version: "1.2.3",
  })

  // Legal Documents State
  const [legalDocs, setLegalDocs] = useState([
    {
      id: 1,
      type: "terms",
      title: "Terms & Conditions",
      version: "2.1",
      content: "# Terms & Conditions\n\nWelcome to BattleNation...",
      isLive: true,
      lastUpdated: "2024-01-08 14:32:15",
      updatedBy: "John Smith",
    },
    {
      id: 2,
      type: "privacy",
      title: "Privacy Policy",
      version: "1.8",
      content: "# Privacy Policy\n\nYour privacy is important to us...",
      isLive: true,
      lastUpdated: "2024-01-05 11:22:33",
      updatedBy: "Sarah Johnson",
    },
    {
      id: 3,
      type: "refund",
      title: "Refund Policy",
      version: "1.3",
      content: "# Refund Policy\n\nRefunds are processed according to...",
      isLive: true,
      lastUpdated: "2023-12-20 09:15:45",
      updatedBy: "Mike Chen",
    },
    {
      id: 4,
      type: "responsible_gaming",
      title: "Responsible Gaming Policy",
      version: "1.1",
      content: "# Responsible Gaming\n\nWe promote responsible gaming practices...",
      isLive: true,
      lastUpdated: "2023-11-15 16:45:22",
      updatedBy: "Lisa Wong",
    },
  ])

  // How to Play Steps State
  const [howToPlaySteps, setHowToPlaySteps] = useState([
    {
      id: 1,
      step: "Register",
      title: "Create Your Account",
      content: "Download the app and create your BattleNation account with email verification.",
      gifUrl: "/placeholder.svg?height=200&width=300",
      order: 1,
    },
    {
      id: 2,
      step: "Join Team",
      title: "Join or Create a Team",
      content: "Browse available teams or create your own team with friends.",
      gifUrl: "/placeholder.svg?height=200&width=300",
      order: 2,
    },
    {
      id: 3,
      step: "Pay Entry Fee",
      title: "Pay Tournament Entry",
      content: "Pay the entry fee using UPI, cards, or wallet balance.",
      gifUrl: "/placeholder.svg?height=200&width=300",
      order: 3,
    },
    {
      id: 4,
      step: "Receive Match Code",
      title: "Get Your Match Code",
      content: "Receive unique match codes for each tournament round.",
      gifUrl: "/placeholder.svg?height=200&width=300",
      order: 4,
    },
    {
      id: 5,
      step: "Play & Upload Results",
      title: "Play and Submit Results",
      content: "Play your matches and upload screenshots for verification.",
      gifUrl: "/placeholder.svg?height=200&width=300",
      order: 5,
    },
  ])

  // FAQs State
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do I join a tournament?",
      answer: "Navigate to the tournaments section, select a tournament, and click 'Join' after paying the entry fee.",
    },
    {
      id: 2,
      question: "What happens if I lose my match code?",
      answer: "Contact support immediately. We can regenerate match codes before the match starts.",
    },
    {
      id: 3,
      question: "How are winners determined?",
      answer: "Winners are determined based on match results verified through screenshots and game APIs.",
    },
  ])

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  })

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@battlenation.com",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-01-08 14:32:15",
      permissions: {
        manage_users: true,
        manage_tournaments: true,
        manage_finance: true,
        manage_settings: true,
        view_reports: true,
      },
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@battlenation.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-07 09:45:22",
      permissions: {
        manage_users: true,
        manage_tournaments: true,
        manage_finance: false,
        manage_settings: false,
        view_reports: true,
      },
    },
  ])

  // Integration Settings State
  const [integrationSettings, setIntegrationSettings] = useState({
    fcmServerKey: "****-****-****-****",
    razorpayKeyId: "rzp_****",
    razorpaySecret: "****-****-****",
    slackWebhook: "https://hooks.slack.com/****",
    maxmindLicenseKey: "****-****-****",
  })

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    permissions: {
      manage_users: false,
      manage_tournaments: false,
      manage_finance: false,
      manage_settings: false,
      view_reports: false,
    },
  })

  // Internal Docs State (SuperAdmin only)
  const [internalDocs, setInternalDocs] = useState([
    {
      id: 1,
      title: "Incident Response Flow",
      content: "# Incident Response Procedure\n\n## Step 1: Assessment\n...",
      lastUpdated: "2024-01-08 10:30:00",
    },
    {
      id: 2,
      title: "Payout Manual Override",
      content: "# Manual Payout Override Process\n\n## When to Use\n...",
      lastUpdated: "2024-01-05 15:45:00",
    },
    {
      id: 3,
      title: "Admin Onboarding Checklist",
      content: "# New Admin Onboarding\n\n## Pre-boarding\n...",
      lastUpdated: "2023-12-28 09:15:00",
    },
  ])

  // Check if user has permission for tab
  const hasTabPermission = (tab) => {
    return tabPermissions[tab]?.includes(userRole) || false
  }

  // Debounced save function for general settings
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === "general") {
        saveGeneralSettings()
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [generalSettings])

  const saveGeneralSettings = async () => {
    try {
      setSaving(true)
      await fetch("/api/admin/settings/general", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generalSettings),
      })

      // Broadcast via WebSocket
      // ws.send(JSON.stringify({ type: 'settings-update', data: generalSettings }))
    } catch (error) {
      console.error("Failed to save general settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const testLink = (url) => {
    if (validateUrl(url)) {
      window.open(url, "_blank")
    } else {
      alert("Invalid URL format")
    }
  }

  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Upload failed:", error)
      return null
    }
  }

  const publishDocument = async (docId) => {
    try {
      await fetch(`/api/admin/legal-docs/${docId}/publish`, {
        method: "POST",
      })

      // Update local state
      setLegalDocs((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                isLive: true,
                version: (Number.parseFloat(doc.version) + 0.1).toFixed(1),
                lastUpdated: new Date().toISOString().slice(0, 19).replace("T", " "),
              }
            : doc,
        ),
      )

      // Broadcast via WebSocket for mobile app to fetch
      // ws.send(JSON.stringify({ type: 'legal-doc-update', docId }))
    } catch (error) {
      console.error("Failed to publish document:", error)
    }
  }

  const createAdmin = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      })

      if (response.ok) {
        const createdAdmin = await response.json()
        setAdminUsers((prev) => [...prev, createdAdmin])
        setCreateAdminModalOpen(false)
        setNewAdmin({
          name: "",
          email: "",
          password: "",
          role: "admin",
          permissions: {
            manage_users: false,
            manage_tournaments: false,
            manage_finance: false,
            manage_settings: false,
            view_reports: false,
          },
        })
      }
    } catch (error) {
      console.error("Failed to create admin:", error)
    }
  }

  const disableAdmin = async (adminId) => {
    try {
      await fetch(`/api/admin/users/${adminId}/disable`, {
        method: "POST",
      })

      setAdminUsers((prev) => prev.map((admin) => (admin.id === adminId ? { ...admin, status: "disabled" } : admin)))

      // Force logout via WebSocket
      // ws.send(JSON.stringify({ type: 'force-logout', adminId }))
    } catch (error) {
      console.error("Failed to disable admin:", error)
    }
  }

  const generateBackup = async (type) => {
    try {
      const response = await fetch(`/api/admin/backup/${type}`, {
        method: "POST",
      })

      const data = await response.json()

      // Create download link with presigned URL (valid 15 min)
      const a = document.createElement("a")
      a.href = data.downloadUrl
      a.download = data.filename
      a.click()
    } catch (error) {
      console.error("Failed to generate backup:", error)
    }
  }

  const availableTabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "policies", label: "Policies & Docs", icon: FileText },
    { id: "howto", label: "How to Play", icon: HelpCircle },
    { id: "security", label: "Security", icon: Shield },
    { id: "roles", label: "Roles", icon: Users },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "backup", label: "Backup", icon: Database },
    { id: "docs", label: "SuperAdmin Docs", icon: Crown },
  ].filter((tab) => hasTabPermission(tab.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Modular settings with role-based access controls</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Role: {userRole.replace("_", " ").toUpperCase()}
          </Badge>
          {saving && (
            <Badge className="bg-blue-100 text-blue-800">
              <Clock className="h-3 w-3 mr-1" />
              Saving...
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          {availableTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>Basic application configuration with auto-save</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="leagueName">League Name</Label>
                  <Input
                    id="leagueName"
                    value={generalSettings.leagueName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, leagueName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    value={generalSettings.appName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Social Media Links</span>
              </CardTitle>
              <CardDescription>Configure social media URLs with validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(socialSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace("Url", " URL").replace(/([A-Z])/g, " $1")}
                      </Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => setSocialSettings({ ...socialSettings, [key]: e.target.value })}
                        className={!validateUrl(value) && value ? "border-red-300" : ""}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => testLink(value)} disabled={!validateUrl(value)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test Link
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  // Save social settings
                  fetch("/api/admin/settings/social", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(socialSettings),
                  })
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Social Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings Tab */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Branding Assets</span>
              </CardTitle>
              <CardDescription>Upload logos, icons, and media with S3 integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Label>Logo (PNG/SVG)</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <img
                      src={brandingSettings.logoUrl || "/placeholder.svg"}
                      alt="Logo"
                      className="mx-auto h-20 w-auto object-contain mb-4"
                    />
                    <input
                      type="file"
                      accept=".png,.svg"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const url = await uploadFile(file, "logo")
                          if (url) {
                            setBrandingSettings({ ...brandingSettings, logoUrl: url })
                          }
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("logo-upload").click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Label>App Icon (512×512)</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <img
                      src={brandingSettings.appIconUrl || "/placeholder.svg"}
                      alt="App Icon"
                      className="mx-auto h-20 w-20 object-contain mb-4 rounded-lg"
                    />
                    <input
                      type="file"
                      accept=".png"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const url = await uploadFile(file, "app-icon")
                          if (url) {
                            setBrandingSettings({ ...brandingSettings, appIconUrl: url })
                          }
                        }
                      }}
                      className="hidden"
                      id="icon-upload"
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("icon-upload").click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Icon
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Label>Splash Video URL (MP4)</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <video
                      src={brandingSettings.splashVideoUrl}
                      className="mx-auto h-20 w-auto object-contain mb-4"
                      controls
                      muted
                    />
                    <Input
                      placeholder="Enter video URL"
                      value={brandingSettings.splashVideoUrl}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, splashVideoUrl: e.target.value })}
                      className="mb-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Current Version: {brandingSettings.version}</p>
                  <p className="text-sm text-gray-600">Assets are cached with CDN versioning</p>
                </div>
                <Button
                  onClick={() => {
                    // Increment version and broadcast via WebSocket
                    const newVersion = (Number.parseFloat(brandingSettings.version) + 0.1).toFixed(1)
                    setBrandingSettings({ ...brandingSettings, version: newVersion })
                    // ws.send(JSON.stringify({ type: 'branding-update', version: newVersion }))
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies & Documents Tab */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Legal Documents</span>
              </CardTitle>
              <CardDescription>Manage legal documents with version control and markdown editing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{doc.title}</h4>
                        <Badge variant="outline">v{doc.version}</Badge>
                        {doc.isLive && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Last updated: {doc.lastUpdated} by {doc.updatedBy}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog open={editDocModalOpen} onOpenChange={setEditDocModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDoc(doc)
                              setMarkdownPreview(false)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Edit {selectedDoc?.title}</DialogTitle>
                            <DialogDescription>
                              Version {selectedDoc?.version} • Markdown Editor with Split Pane
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant={markdownPreview ? "outline" : "default"}
                                size="sm"
                                onClick={() => setMarkdownPreview(false)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant={markdownPreview ? "default" : "outline"}
                                size="sm"
                                onClick={() => setMarkdownPreview(true)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
                              <div>
                                <Label>Markdown Content</Label>
                                <Textarea
                                  value={selectedDoc?.content || ""}
                                  onChange={(e) => setSelectedDoc({ ...selectedDoc, content: e.target.value })}
                                  className="h-full font-mono text-sm"
                                  placeholder="Enter markdown content..."
                                />
                              </div>
                              <div>
                                <Label>Preview</Label>
                                <div className="h-full p-4 border border-gray-300 rounded-lg overflow-auto bg-white">
                                  <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        selectedDoc?.content?.replace(/^# /gm, "<h1>").replace(/\n/g, "<br>") || "",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  // Save document
                                  setLegalDocs((prev) => prev.map((d) => (d.id === selectedDoc.id ? selectedDoc : d)))
                                  setEditDocModalOpen(false)
                                }}
                                className="flex-1"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Draft
                              </Button>
                              <Button
                                onClick={() => {
                                  publishDocument(selectedDoc.id)
                                  setEditDocModalOpen(false)
                                }}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Publish Live
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => publishDocument(doc.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How to Play Tab */}
        <TabsContent value="howto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>How to Play Guide</span>
                </CardTitle>
                <CardDescription>Step-by-step guide with markdown and GIF support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {howToPlaySteps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.content}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <img
                          src={step.gifUrl || "/placeholder.svg"}
                          alt={step.title}
                          className="w-20 h-16 object-cover rounded border"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{faq.question}</h4>
                          <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication (TOTP)</h4>
                  <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                />
              </div>

              <div>
                <Label>IP Whitelist (CIDR format)</Label>
                <div className="space-y-2 mt-2">
                  {securitySettings.ipWhitelist.map((ip, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input value={ip} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newList = securitySettings.ipWhitelist.filter((_, i) => i !== index)
                          setSecuritySettings({ ...securitySettings, ipWhitelist: newList })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newIp = prompt("Enter IP address or CIDR range:")
                      if (newIp) {
                        setSecuritySettings({
                          ...securitySettings,
                          ipWhitelist: [...securitySettings.ipWhitelist, newIp],
                        })
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add IP Range
                  </Button>
                </div>
              </div>

              <div>
                <Label>Password Policy</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordPolicy: {
                            ...securitySettings.passwordPolicy,
                            minLength: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: { ...securitySettings.passwordPolicy, requireUppercase: checked },
                          })
                        }
                      />
                      <Label>Require Uppercase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: { ...securitySettings.passwordPolicy, requireNumbers: checked },
                          })
                        }
                      />
                      <Label>Require Numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={securitySettings.passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: { ...securitySettings.passwordPolicy, requireSpecialChars: checked },
                          })
                        }
                      />
                      <Label>Require Special Characters</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  // Save security settings and enforce via auth middleware
                  fetch("/api/admin/settings/security", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(securitySettings),
                  })
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Management Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Admin Roles</span>
                  </CardTitle>
                  <CardDescription>Manage admin users and permissions</CardDescription>
                </div>
                <Dialog open={createAdminModalOpen} onOpenChange={setCreateAdminModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Admin</DialogTitle>
                      <DialogDescription>Add a new admin user with specific permissions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newAdmin.name}
                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <select
                            id="role"
                            value={newAdmin.role}
                            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {Object.entries(newAdmin.permissions).map(([permission, enabled]) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={enabled}
                                onCheckedChange={(checked) =>
                                  setNewAdmin({
                                    ...newAdmin,
                                    permissions: { ...newAdmin.permissions, [permission]: checked },
                                  })
                                }
                              />
                              <Label className="text-sm capitalize">{permission.replace("_", " ")}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={createAdmin} className="flex-1">
                          Create Admin
                        </Button>
                        <Button variant="outline" onClick={() => setCreateAdminModalOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{admin.name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {admin.role.replace("_", " ")}
                          </Badge>
                          <Badge
                            className={
                              admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {admin.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        <p className="text-xs text-gray-500">Last login: {admin.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {Object.values(admin.permissions).filter(Boolean).length} permissions
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={admin.status === "active" ? "text-red-600" : "text-green-600"}
                        onClick={() => disableAdmin(admin.id)}
                      >
                        {admin.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plug className="h-5 w-5" />
                <span>Third-Party Integrations</span>
              </CardTitle>
              <CardDescription>Configure API keys and webhooks (AES256 encrypted)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fcmServerKey">FCM Server Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="fcmServerKey"
                      type="password"
                      value={integrationSettings.fcmServerKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, fcmServerKey: e.target.value })}
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="razorpayKeyId"
                      type="password"
                      value={integrationSettings.razorpayKeyId}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, razorpayKeyId: e.target.value })
                      }
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="razorpaySecret"
                      type="password"
                      value={integrationSettings.razorpaySecret}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, razorpaySecret: e.target.value })
                      }
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="slackWebhook"
                      type="password"
                      value={integrationSettings.slackWebhook}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, slackWebhook: e.target.value })}
                    />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxmindLicenseKey">MaxMind License Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="maxmindLicenseKey"
                      type="password"
                      value={integrationSettings.maxmindLicenseKey}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, maxmindLicenseKey: e.target.value })
                      }
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  All secrets are AES256 encrypted in the database and never returned in GET requests.
                </p>
              </div>

              <Button
                onClick={() => {
                  // Save integration settings with encryption
                  fetch("/api/admin/settings/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(integrationSettings),
                  })
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Backup & Recovery</span>
              </CardTitle>
              <CardDescription>Generate backups and schedule automated backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Database Dump</h4>
                  <p className="text-sm text-gray-600 mb-4">Complete database backup with all tables</p>
                  <Button onClick={() => generateBackup("database")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download DB Dump
                  </Button>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">S3 Manifest</h4>
                  <p className="text-sm text-gray-600 mb-4">List of all uploaded files and assets</p>
                  <Button onClick={() => generateBackup("s3")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download S3 Manifest
                  </Button>
                </div>

                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Scheduled Backup</h4>
                  <p className="text-sm text-gray-600 mb-4">Automated nightly backups via cron</p>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Schedule
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Security Notice</h4>
                </div>
                <p className="text-sm text-blue-800 mt-2">
                  Backup download links are presigned S3 URLs valid for 15 minutes only. Links expire automatically for
                  security.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SuperAdmin Docs Tab */}
        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Internal Documentation</span>
              </CardTitle>
              <CardDescription>SuperAdmin-only internal SOPs and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internalDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-gray-600">Last updated: {doc.lastUpdated}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
