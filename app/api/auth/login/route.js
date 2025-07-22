import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request) {
  const { email, password, rememberMe } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Fetch user from the database
    const [user] = await sql`SELECT * FROM admins WHERE email = ${email}`

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Basic password check (replace with bcrypt in production)
    if (password !== user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Simulate 2FA requirement for super_admin
    const requires2FA = user.role === "super_admin"

    // Create a token (replace with JWT in production)
    const token = `demo_token_${Date.now()}`

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: [], // Fetch permissions from admin_permissions table
        requires2FA: requires2FA,
      },
      token: token,
      requires2FA: requires2FA,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
