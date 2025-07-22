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
  const filter = searchParams.get("filter") || "all"

  let query = `SELECT transaction_id, type, "user", tournament, amount, status, timestamp, payment_method FROM recent_transactions`
  const params = []

  if (filter !== "all") {
    query += ` WHERE type = $1`
    params.push(filter)
  }
  query += ` ORDER BY timestamp DESC LIMIT 10;`

  try {
    const result = await sql.query(query, params)
    const transactions = result && result.rows ? result.rows : []

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return new Response(JSON.stringify({ error: `Failed to fetch recent transactions: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
