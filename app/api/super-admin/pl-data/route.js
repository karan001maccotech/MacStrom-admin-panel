import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today"

    const plData = await sql`
      SELECT * FROM pl_summary_daily 
      WHERE period = ${period} 
      ORDER BY date DESC 
      LIMIT 1
    `

    if (plData.length === 0) {
      return Response.json({ error: "No P&L data found" }, { status: 404 })
    }

    return Response.json(plData[0])
  } catch (error) {
    console.error("Error fetching P&L data:", error)
    return Response.json({ error: "Failed to fetch P&L data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      period,
      revenue,
      costs,
      net_profit,
      profit_margin,
      revenue_comparison,
      costs_comparison,
      profit_comparison,
    } = body

    const result = await sql`
      INSERT INTO pl_summary_daily (date, period, revenue, costs, net_profit, profit_margin, revenue_comparison, costs_comparison, profit_comparison)
      VALUES (CURRENT_DATE, ${period}, ${revenue}, ${costs}, ${net_profit}, ${profit_margin}, ${revenue_comparison || 0}, ${costs_comparison || 0}, ${profit_comparison || 0})
      ON CONFLICT (date, period) 
      DO UPDATE SET 
        revenue = EXCLUDED.revenue,
        costs = EXCLUDED.costs,
        net_profit = EXCLUDED.net_profit,
        profit_margin = EXCLUDED.profit_margin,
        revenue_comparison = EXCLUDED.revenue_comparison,
        costs_comparison = EXCLUDED.costs_comparison,
        profit_comparison = EXCLUDED.profit_comparison,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating P&L data:", error)
    return Response.json({ error: "Failed to update P&L data" }, { status: 500 })
  }
}
