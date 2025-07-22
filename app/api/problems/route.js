import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM problems`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No problem data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const problems = result.map((problem) => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      severity: problem.severity,
      status: problem.status,
      category: problem.category,
      userId: problem.user_id,
      userName: problem.user_name,
      assignedTo: problem.assigned_to,
      createdAt: problem.created_at,
      updatedAt: problem.updated_at,
      slaTimer: problem.sla_timer,
    }))

    return new Response(JSON.stringify(problems), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch problem data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch problem data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
