import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM match_rooms`

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "No match room data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const matchRooms = result.map((room) => ({
      id: room.id,
      name: room.name,
      game: room.game,
      status: room.status,
      capacity: room.capacity,
      currentPlayers: room.current_players,
      serverRegion: room.server_region,
      ping: room.ping,
      uptime: room.uptime,
    }))

    return new Response(JSON.stringify(matchRooms), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch match room data:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch match room data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
