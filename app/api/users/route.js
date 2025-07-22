import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page")) || 1
  const limit = Number.parseInt(searchParams.get("limit")) || 25
  const search = searchParams.get("search") || ""
  const filter = searchParams.get("filter") || "all"

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Fetch users from the database with pagination and filtering
    const users = await sql`
      SELECT * FROM admins
      WHERE 
        name ILIKE ${"%" + search + "%"} OR
        email ILIKE ${"%" + search + "%"}
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `

    // Get total count of users (for pagination)
    const [{ count }] = await sql`SELECT COUNT(*) FROM admins`

    return NextResponse.json(
      {
        users: users.map((user) => ({
          id: user.id,
          username: user.name,
          email: user.email,
          fullName: user.name,
          avatar: "/placeholder.svg?height=40&width=40",
          status: user.status,
          verified: true,
          joinDate: new Date().toISOString().slice(0, 10),
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
        })),
        total: Number.parseInt(count),
        page: page,
        totalPages: Math.ceil(Number.parseInt(count) / limit),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}
