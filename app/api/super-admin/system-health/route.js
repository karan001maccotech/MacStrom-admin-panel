import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const healthMetrics = await sql`
      SELECT 
        metric_name,
        metric_value,
        threshold_value,
        status,
        additional_data,
        recorded_at
      FROM system_health 
      WHERE recorded_at >= NOW() - INTERVAL '1 hour'
      ORDER BY metric_name, recorded_at DESC
    `

    // Group by metric_name and get the latest value for each
    const latestMetrics = {}
    healthMetrics.forEach((metric) => {
      if (!latestMetrics[metric.metric_name]) {
        latestMetrics[metric.metric_name] = metric
      }
    })

    return Response.json(latestMetrics)
  } catch (error) {
    console.error("Error fetching system health:", error)
    return Response.json({ error: "Failed to fetch system health" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { metric_name, metric_value, threshold_value, status, additional_data } = body

    const result = await sql`
      INSERT INTO system_health (metric_name, metric_value, threshold_value, status, additional_data)
      VALUES (${metric_name}, ${metric_value}, ${threshold_value || null}, ${status}, ${additional_data || "{}"})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating system health:", error)
    return Response.json({ error: "Failed to update system health" }, { status: 500 })
  }
}
