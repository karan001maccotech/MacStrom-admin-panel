import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const { rows } = await sql`
            SELECT
                COUNT(*) AS total_tournaments,
                COUNT(CASE WHEN status = 'live' THEN 1 END) AS live_tournaments,
                COUNT(CASE WHEN status = 'scheduled' THEN 1 END) AS scheduled_tournaments,
                SUM(prize_pool) AS total_prize_pool
            FROM tournaments;
        `
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No tournament stats found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    // Ensure numeric values are parsed as floats if they come as strings from the DB
    const parsedStats = {
      ...rows[0],
      total_prize_pool: Number.parseFloat(rows[0].total_prize_pool || 0),
    }
    return new Response(JSON.stringify(parsedStats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch tournament stats:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch tournament stats", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
