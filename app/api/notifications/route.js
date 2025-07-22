import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM notifications ORDER BY time DESC LIMIT 10`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No notification data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const notifications = result.map((notification) => ({
      id: notification.id,
      message: notification.message,
      type: notification.type,
      time: notification.time,
    }))

    return new Response(JSON.stringify(notifications), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch notification data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch notification data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
