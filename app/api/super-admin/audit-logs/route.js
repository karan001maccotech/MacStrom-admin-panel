import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const severity = searchParams.get("severity") || "all"
    const limit = Number.parseInt(searchParams.get("limit")) || 50
    const offset = Number.parseInt(searchParams.get("offset")) || 0

    let whereClause = "WHERE 1=1"
    const params = []

    if (search) {
      whereClause += ` AND (admin_name ILIKE $${params.length + 1} OR action ILIKE $${params.length + 1} OR details ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (severity !== "all") {
      whereClause += ` AND severity = $${params.length + 1}`
      params.push(severity)
    }

    const auditLogs = await sql`
      SELECT 
        id,
        admin_id,
        admin_name,
        action,
        resource,
        details,
        ip_address,
        user_agent,
        severity,
        created_at as timestamp
      FROM admin_audit 
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return Response.json(auditLogs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return Response.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { admin_id, admin_name, action, resource, details, ip_address, user_agent, severity } = body

    const result = await sql`
      INSERT INTO admin_audit (admin_id, admin_name, action, resource, details, ip_address, user_agent, severity)
      VALUES (${admin_id}, ${admin_name}, ${action}, ${resource || null}, ${details}, ${ip_address || null}, ${user_agent || null}, ${severity || "medium"})
      RETURNING *
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("Error creating audit log:", error)
    return Response.json({ error: "Failed to create audit log" }, { status: 500 })
  }
}
