import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function PATCH(request) {
  const { leagueName, appName, supportEmail, supportPhone, timezone } = await request.json()

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Update general settings in the database
    await sql`
      UPDATE general_settings
      SET
        league_name = ${leagueName},
        app_name = ${appName},
        support_email = ${supportEmail},
        support_phone = ${supportPhone},
        timezone = ${timezone}
      WHERE id = 1; -- Assuming there is only one row in general_settings
    `

    return NextResponse.json({ message: "General settings updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to update general settings:", error)
    return NextResponse.json({ message: "Failed to update general settings" }, { status: 500 })
  }
}
