import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request) {
  const sql = neon(process.env.DATABASE_URL)
  try {
    const nationalResult = await sql`
      SELECT id, total_votes, is_locked, fraud_alerts 
      FROM national_voting_data 
      LIMIT 1
    `

    const nationalData =
      nationalResult && nationalResult.rows && nationalResult.rows.length > 0
        ? nationalResult.rows[0]
        : null

    if (nationalData) {
      const teamResults = await sql`
        SELECT team_name, votes, percentage, fraud_flags 
        FROM national_team_votes 
        WHERE national_id = ${nationalData.id}
        ORDER BY votes DESC
      `

      nationalData.team_votes = teamResults?.rows || []
    }

    return NextResponse.json(nationalData || {}) // Return empty object if no national data
  } catch (error) {
    console.error("Failed to fetch national voting data:", error)
    return NextResponse.json(
      { error: "Failed to fetch national voting data", details: error.message },
      { status: 500 }
    )
  }
}

