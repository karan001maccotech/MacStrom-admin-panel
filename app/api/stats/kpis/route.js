import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM kpis ORDER BY created_at DESC LIMIT 1`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No KPI data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const kpiData = {
      users: {
        total: result[0].users_total,
        active: result[0].users_active,
        change: result[0].users_change,
        changeType: result[0].users_change > 0 ? "positive" : "negative",
      },
      revenue: {
        total: result[0].revenue_total,
        change: result[0].revenue_change,
        changeType: result[0].revenue_change > 0 ? "positive" : "negative",
      },
      activeTeams: {
        total: result[0].active_teams_total,
        change: result[0].active_teams_change,
        changeType: result[0].active_teams_change > 0 ? "positive" : "negative",
      },
      votes: {
        state: result[0].votes_state,
        national: result[0].votes_national,
        change: result[0].votes_change,
        changeType: result[0].votes_change > 0 ? "positive" : "negative",
      },
      openProblems: {
        total: result[0].open_problems_total,
        critical: result[0].open_problems_critical,
        high: result[0].open_problems_high,
        medium: result[0].open_problems_medium,
        change: result[0].open_problems_change,
        changeType: result[0].open_problems_change > 0 ? "positive" : "negative",
      },
    }

    return new Response(JSON.stringify(kpiData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch KPI data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch KPI data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
