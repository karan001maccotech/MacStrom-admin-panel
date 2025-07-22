import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const adminUsers = await sql`
      SELECT 
        a.id,
        a.name,
        a.email,
        a.role,
        a.status,
        a.last_login,
        s.ip_address as last_login_ip,
        s.location,
        s.device_info,
        s.is_active as session_active,
        COUNT(p.permission) as permissions
      FROM admins a
      LEFT JOIN admin_sessions s ON a.id = s.admin_id AND s.is_active = true
      LEFT JOIN admin_permissions p ON a.id = p.admin_id
      GROUP BY a.id, a.name, a.email, a.role, a.status, a.last_login, s.ip_address, s.location, s.device_info, s.is_active
      ORDER BY a.id
    `

    return Response.json(adminUsers)
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return Response.json({ error: "Failed to fetch admin users" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, adminId } = body

    if (action === "terminate_session") {
      await sql`
        UPDATE admin_sessions 
        SET is_active = false 
        WHERE admin_id = ${adminId}
      `
    } else if (action === "disable_admin") {
      await sql`
        UPDATE admins 
        SET status = 'disabled' 
        WHERE id = ${adminId}
      `
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error updating admin user:", error)
    return Response.json({ error: "Failed to update admin user" }, { status: 500 })
  }
}
