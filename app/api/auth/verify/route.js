import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Authorization header missing or invalid" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Simulate token verification (replace with JWT verification)
    const [user] = await sql`SELECT * FROM admins WHERE id = 1` // Assuming user ID 1 is always valid

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Token verified",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: [], // Fetch permissions from admin_permissions table
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ message: "Token verification failed" }, { status: 500 })
  }
}
