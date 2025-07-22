import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // Fetch teams from the database
    const teams = await sql`SELECT * FROM teams`

    // Fetch team members for each team
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await sql`SELECT * FROM team_members WHERE team_id = ${team.id}`
        return { ...team, members }
      }),
    )

    return NextResponse.json(teamsWithMembers, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch teams:", error)
    return NextResponse.json({ message: "Failed to fetch teams" }, { status: 500 })
  }
}
