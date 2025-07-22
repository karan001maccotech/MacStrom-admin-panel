import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request) {
  const sql = neon(process.env.DATABASE_URL)
  try {
    const result = await sql`SELECT id, type, description, severity, affected_votes, teams, reason FROM fraud_heuristics ORDER BY severity DESC, id ASC`
    const heuristics = result && result.rows ? result.rows : []
    return NextResponse.json(heuristics)
  } catch (error) {
    console.error("Failed to fetch fraud heuristics:", error)
    return NextResponse.json({ error: "Failed to fetch fraud heuristics", details: error.message }, { status: 500 })
  }
}
