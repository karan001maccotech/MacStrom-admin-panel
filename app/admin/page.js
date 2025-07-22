"use client"

import DashboardOverview from "@/components/dashboard-overview"
import { useState } from "react" // Import useState if DashboardOverview uses it

export default function AdminDashboardPage() {
  // This component will receive props from the layout if needed,
  // but for now, it just renders the DashboardOverview.
  // The realTimeStats are managed in the layout now.
  const [realTimeStats] = useState({
    activeUsers: 12847,
    liveMatches: 23,
    totalRevenue: 89432,
    pendingProblems: 7,
  }) // Dummy state for now, as layout manages it.

  return <DashboardOverview stats={realTimeStats} userRole="admin" />
}
