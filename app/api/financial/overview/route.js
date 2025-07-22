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

  try {
    const result = await sql.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'entry_fee' THEN amount ELSE 0 END), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN type = 'payout' THEN ABS(amount) ELSE 0 END), 0) AS total_payouts,
        COALESCE(SUM(CASE WHEN type = 'processing_fee' THEN ABS(amount) ELSE 0 END), 0) AS processing_fees,
        COALESCE(SUM(amount), 0) AS net_profit,
        12.5 AS monthly_growth -- Placeholder, calculate dynamically if data available
      FROM recent_transactions;
    `)

    // Ensure result.rows exists and has at least one element
    const overviewData =
      result && result.rows && result.rows.length > 0
        ? result.rows[0]
        : {
            total_revenue: 0,
            total_payouts: 0,
            processing_fees: 0,
            net_profit: 0,
            monthly_growth: 0,
          }

    return new Response(JSON.stringify(overviewData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching financial overview:", error)
    return new Response(JSON.stringify({ error: `Failed to fetch financial overview: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
