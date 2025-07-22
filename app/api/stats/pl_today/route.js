import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM pl_data ORDER BY created_at DESC LIMIT 1`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No P&L data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const plData = {
      grossRevenue: result[0].gross_revenue,
      totalCosts: result[0].total_costs,
      netProfitLoss: result[0].net_profit_loss,
      profitMargin: result[0].profit_margin,
      comparison: {
        revenue: result[0].comparison_revenue,
        costs: result[0].comparison_costs,
        profit: result[0].comparison_profit,
      },
    }

    return new Response(JSON.stringify(plData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch P&L data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch P&L data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
