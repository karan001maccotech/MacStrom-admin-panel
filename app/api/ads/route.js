import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM ad_banners ORDER BY created_at DESC LIMIT 1`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No ad banner data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const adBanner = {
      id: result[0].id,
      title: result[0].title,
      imageUrl: result[0].image_url,
      clickUrl: result[0].click_url,
      sponsor: result[0].sponsor,
      duration: result[0].duration,
    }

    return new Response(JSON.stringify(adBanner), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch ad banner data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch ad banner data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
