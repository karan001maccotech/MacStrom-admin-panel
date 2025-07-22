import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request) {
  const sql = neon(process.env.DATABASE_URL)
  try {
    const result = await sql`SELECT * FROM voting_stats LIMIT 1`;
    console.log("Voting Stats DB Result:", result);

    const stats =
      result && result.rows && result.rows.length > 0
        ? result.rows[0]
        : {
          total_votes: 0,
          active_polls: 0,
          suspicious_activity: 0,
          fraud_detected: 0,
          participation_rate: 0.0,
          top_voted_team: "N/A",
        }
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch voting stats:", error)
    return NextResponse.json({ error: "Failed to fetch voting stats", details: error.message }, { status: 500 })
  }
}
