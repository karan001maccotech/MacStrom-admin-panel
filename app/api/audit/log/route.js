import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request) {
  const { action, details, timestamp } = await request.json()

  if (!action || !details || !timestamp) {
    return NextResponse.json({ message: "Action, details, and timestamp are required" }, { status: 400 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Insert audit log into the database
    await sql`
      INSERT INTO admin_audit (admin_id, action, resource, details, timestamp, ip_address, user_agent, severity)
      VALUES (1, ${action}, 'N/A', ${details}, ${timestamp}, '127.0.0.1', 'N/A', 'low')
    `

    return NextResponse.json({ message: "Audit log created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Failed to create audit log:", error)
    return NextResponse.json({ message: "Failed to create audit log" }, { status: 500 })
  }
}
