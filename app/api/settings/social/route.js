import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request) {
  const { youtubeUrl, instagramUrl, facebookUrl, twitterUrl, discordInvite } = await request.json()

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Update social links in the database
    await sql`
      UPDATE social_links
      SET
        youtube_url = ${youtubeUrl},
        instagram_url = ${instagramUrl},
        facebook_url = ${facebookUrl},
        twitter_url = ${twitterUrl},
        discord_invite = ${discordInvite}
      WHERE id = 1; -- Assuming there is only one row in social_links
    `

    return NextResponse.json({ message: "Social links updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to update social links:", error)
    return NextResponse.json({ message: "Failed to update social links" }, { status: 500 })
  }
}
