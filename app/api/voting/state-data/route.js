import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request) {
  const sql = neon(process.env.DATABASE_URL)
  try {
    const stateResults = await sql`
      SELECT id, state_name, total_votes, is_locked, fraud_alerts 
      FROM state_voting_data 
      ORDER BY state_name
    `
    const states = stateResults?.rows || []

    const stateDataWithTeams = await Promise.all(
      states.map(async (state) => {
        const teamResults = await sql`
          SELECT team_name, votes, percentage, fraud_flags 
          FROM state_team_votes 
          WHERE state_id = ${state.id}
          ORDER BY votes DESC
        `
        const teams = teamResults?.rows || []
        return {
          ...state,
          teams,
        }
      })
    )

    return NextResponse.json(stateDataWithTeams)
  } catch (error) {
    console.error("Failed to fetch state voting data:", error)
    return NextResponse.json({ error: "Failed to fetch state voting data", details: error.message }, { status: 500 })
  }
}
