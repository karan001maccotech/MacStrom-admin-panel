import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set.")
    return new Response(JSON.stringify({ error: "Server configuration error: Database URL is missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const sql = neon(process.env.DATABASE_URL)
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d" // Default to 30 days

  let limit = 7 // Default for 7d
  if (period === "30d") limit = 30
  else if (period === "90d") limit = 90
  else if (period === "1y") limit = 12 // For 12 months

  try {
    const result = await sql.query(`
      SELECT
        month_year,
        revenue,
        growth
      FROM monthly_revenue
      ORDER BY month_year DESC
      LIMIT ${limit};
    `)
    const monthlyRevenue = result && result.rows ? result.rows.reverse() : [] // Reverse to show oldest first

    return new Response(JSON.stringify(monthlyRevenue), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching monthly revenue:", error)
    return new Response(JSON.stringify({ error: `Failed to fetch monthly revenue: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
