"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, AlertTriangle, Loader2 } from "lucide-react"

export default function ProtectedRoute({ children, requiredRole = null, requiredPermissions = [], fallback = null }) {
  const { user, loading, isAuthenticated, isSuperAdmin, isAdmin, isModerator, hasPermission } = useAuth()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      setChecking(false)
    }
  }, [loading])

  // Show loading state
  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/login"
    return null
  }

  // Check role-based access
  if (requiredRole) {
    let hasRoleAccess = false

    switch (requiredRole) {
      case "super_admin":
        hasRoleAccess = isSuperAdmin()
        break
      case "admin":
        hasRoleAccess = isAdmin()
        break
      case "moderator":
        hasRoleAccess = isModerator()
        break
      default:
        hasRoleAccess = true
    }

    if (!hasRoleAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Access Denied</h3>
                <p className="text-gray-600">You don't have the required permissions to access this page.</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Required Role: {requiredRole}</p>
                  <p className="text-sm text-gray-500">Your Role: {user?.role}</p>
                </div>
                <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) => hasPermission(permission))

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Insufficient Permissions</h3>
                <p className="text-gray-600">You don't have the required permissions to access this feature.</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Required Permissions:</p>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    {requiredPermissions.map((permission) => (
                      <li key={permission}>{permission}</li>
                    ))}
                  </ul>
                </div>
                <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // Render custom fallback if provided
  if (fallback) {
    return fallback
  }

  // Render protected content
  return children
}
