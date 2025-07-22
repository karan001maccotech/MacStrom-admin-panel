import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function PUT(request, { params }) {
  const { id } = params
  const { members } = await request.json()

  if (!members || members.length === 0) {
    return NextResponse.json({ message: "No members provided" }, { status: 400 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Update team members in the database
    await Promise.all(
      members.map(async (member) => {
        await sql`
          UPDATE team_members
          SET
            position = ${member.position},
            active = ${member.active}
          WHERE id = ${member.userId} AND team_id = ${id}
        `
      }),
    )

    return NextResponse.json({ message: "Team members updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to update team members:", error)
    return NextResponse.json({ message: "Failed to update team members" }, { status: 500 })
  }
}
