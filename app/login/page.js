"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Clock, Smartphone, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(null)
  const [show2FA, setShow2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [pendingUser, setPendingUser] = useState(null)

  // Demo credentials
  const demoCredentials = [
    {
      role: "Super Admin",
      email: "superadmin@battlenation.com",
      password: "SuperAdmin123!",
      description: "Full system access including Super Admin Panel",
      color: "bg-red-100 text-red-800",
    },
    {
      role: "Admin",
      email: "admin@battlenation.com",
      password: "Admin123!",
      description: "User management, tournaments, daily operations",
      color: "bg-blue-100 text-blue-800",
    },
    {
      role: "Moderator",
      email: "moderator@battlenation.com",
      password: "Moderator123!",
      description: "Basic user management and support functions",
      color: "bg-green-100 text-green-800",
    },
  ]

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        const remaining = lockoutTime - Date.now()
        if (remaining <= 0) {
          setLockoutTime(null)
          setLoginAttempts(0)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [lockoutTime])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const handleDemoLogin = (credentials) => {
    setFormData({
      email: credentials.email,
      password: credentials.password,
      rememberMe: false,
    })
  }

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    return true
  }

  const simulateLogin = async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo authentication logic
    const demoUsers = {
      "superadmin@battlenation.com": {
        id: 1,
        name: "Super Admin",
        email: "superadmin@battlenation.com",
        role: "super_admin",
        permissions: [
          "super_admin_panel",
          "admin_management",
          "financial_data",
          "system_settings",
          "audit_logs",
          "user_management",
          "tournament_management",
          "voting_center",
          "match_management",
          "daily_operations",
          "reports",
          "support",
        ],
        requires2FA: true,
      },
      "admin@battlenation.com": {
        id: 2,
        name: "Admin User",
        email: "admin@battlenation.com",
        role: "admin",
        permissions: [
          "user_management",
          "tournament_management",
          "voting_center",
          "match_management",
          "daily_operations",
          "reports",
          "support",
        ],
        requires2FA: false,
      },
      "moderator@battlenation.com": {
        id: 3,
        name: "Moderator User",
        email: "moderator@battlenation.com",
        role: "moderator",
        permissions: ["user_management", "support", "notifications"],
        requires2FA: false,
      },
    }

    const user = demoUsers[email]
    if (!user || password !== getDemoPassword(email)) {
      throw new Error("Invalid email or password")
    }

    return user
  }

  const getDemoPassword = (email) => {
    const passwords = {
      "superadmin@battlenation.com": "SuperAdmin123!",
      "admin@battlenation.com": "Admin123!",
      "moderator@battlenation.com": "Moderator123!",
    }
    return passwords[email]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (lockoutTime && lockoutTime > Date.now()) {
      setError("Account is locked. Please try again later.")
      return
    }

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const user = await simulateLogin(formData.email, formData.password)

      if (user.requires2FA) {
        setPendingUser(user)
        setShow2FA(true)
        setLoading(false)
        return
      }

      // Login successful
      login(user, formData.rememberMe)

      // Audit log
      console.log("Login successful:", {
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1", // Would be actual IP in production
        userAgent: navigator.userAgent,
      })

      router.push("/")
    } catch (err) {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)

      if (newAttempts >= 5) {
        setLockoutTime(Date.now() + 30 * 60 * 1000) // 30 minutes
        setError("Too many failed attempts. Account locked for 30 minutes.")
      } else {
        setError(`${err.message}. ${5 - newAttempts} attempts remaining.`)
      }

      // Audit log failed attempt
      console.log("Login failed:", {
        email: formData.email,
        attempts: newAttempts,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
    }

    setLoading(false)
  }

  const handle2FASubmit = async (e) => {
    e.preventDefault()

    if (!twoFactorCode) {
      setError("Please enter the 2FA code")
      return
    }

    setLoading(true)

    try {
      // Demo 2FA validation (use 123456 for demo)
      if (twoFactorCode !== "123456") {
        throw new Error("Invalid 2FA code")
      }

      login(pendingUser, formData.rememberMe)
      router.push("/")
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  const getLockoutTimeRemaining = () => {
    if (!lockoutTime) return 0
    return Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000))
  }

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Code</label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Demo: Use code <code className="bg-gray-100 px-1 rounded">123456</code>
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShow2FA(false)
                    setPendingUser(null)
                    setTwoFactorCode("")
                    setError("")
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading || twoFactorCode.length !== 6} className="flex-1">
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">BattleNation Admin Portal</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="admin@battlenation.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {lockoutTime && (
                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Account locked. Try again in {Math.floor(getLockoutTimeRemaining() / 60)}:
                    {(getLockoutTimeRemaining() % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || (lockoutTime && lockoutTime > Date.now())}
                className="w-full py-3"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">Secure admin access • All actions are logged and monitored</p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Demo Credentials</h3>
            <p className="text-gray-600 mb-6">Use these demo accounts to test different access levels and features.</p>
          </div>

          <div className="space-y-4">
            {demoCredentials.map((cred, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={cred.color}>{cred.role}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cred.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDemoLogin(cred)}>
                      Use Account
                    </Button>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <code className="bg-gray-100 px-1 rounded">{cred.email}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-3 w-3" />
                      <code className="bg-gray-100 px-1 rounded">{cred.password}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Security Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Account lockout after 5 failed attempts</li>
                    <li>• Two-factor authentication for Super Admin</li>
                    <li>• Session management and audit logging</li>
                    <li>• Role-based access control</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
