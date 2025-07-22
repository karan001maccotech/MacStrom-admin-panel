import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM matches`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No match data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const matches = result.map((match) => ({
      id: match.id,
      title: match.title,
      game: match.game,
      type: match.type,
      status: match.status,
      scheduledTime: match.scheduled_time,
      actualStartTime: match.actual_start_time,
      estimatedDuration: match.estimated_duration,
      currentDuration: match.current_duration,
      teams: [], // TODO: Fetch teams separately
      roomId: match.room_id,
      spectators: match.spectators,
      streamUrl: match.stream_url,
      referee: match.referee,
      issues: [], // TODO: Fetch issues separately
    }))

    return new Response(JSON.stringify(matches), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch match data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch match data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
