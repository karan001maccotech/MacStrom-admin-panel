"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const userInfo = localStorage.getItem("user_info")

      if (!token || !userInfo) {
        setLoading(false)
        return
      }

      // For demo purposes, we'll simulate token verification
      // In production, this would make an API call to verify the token
      const userData = JSON.parse(userInfo)
      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, token) => {
    localStorage.setItem("admin_token", token)
    localStorage.setItem("user_info", JSON.stringify(userData))
    localStorage.setItem("user_role", userData.role)
    localStorage.setItem("user_permissions", JSON.stringify(userData.permissions))

    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("user_info")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_permissions")
    localStorage.removeItem("remember_me")

    setUser(null)
    setIsAuthenticated(false)

    // Redirect to login
    window.location.href = "/login"
  }

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  const isSuperAdmin = () => {
    return user?.role === "super_admin"
  }

  const isAdmin = () => {
    return user?.role === "admin" || user?.role === "super_admin"
  }

  const isModerator = () => {
    return user?.role === "moderator" || user?.role === "admin" || user?.role === "super_admin"
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    isModerator,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
