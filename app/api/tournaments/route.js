import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const results = await sql`
            SELECT
                t.id,
                t.game_id,
                g.name AS game_name,
                t.title,
                t.type,
                t.start_date,
                t.end_date,
                t.status,
                t.entry_fee,
                t.prize_pool,
                t.current_participants,
                t.max_participants,
                t.current_round,
                t.organizer,
                t.featured,
                t.progress,
                t.created_at,
                t.updated_at
            FROM tournaments t
            JOIN games g ON t.game_id = g.id
            ORDER BY t.start_date DESC;
        `
    // Ensure numeric values are parsed as floats if they come as strings from the DB
    const parsedRows = results.map((result) => ({
      ...result,
      entry_fee: Number.parseFloat(result.entry_fee),
      prize_pool: Number.parseFloat(result.prize_pool),
    }))
    return new Response(JSON.stringify(parsedRows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch tournaments:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch tournaments", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request) {
  try {
    const {
      game_id,
      title,
      type,
      start_date,
      end_date,
      status,
      entry_fee,
      prize_pool,
      current_participants,
      max_participants,
      current_round,
      organizer,
      featured,
      progress,
    } = await request.json()

    if (!game_id || !title || !type || !start_date || !end_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { rows } = await sql`
            INSERT INTO tournaments (
                game_id, title, type, start_date, end_date, status,
                entry_fee, prize_pool, current_participants, max_participants,
                current_round, organizer, featured, progress
            )
            VALUES (
                ${game_id}, ${title}, ${type}, ${start_date}, ${end_date}, ${status || "scheduled"},
                ${entry_fee || 0}, ${prize_pool || 0}, ${current_participants || 0}, ${max_participants || 0},
                ${current_round || null}, ${organizer || null}, ${featured || false}, ${progress || 0}
            )
            RETURNING *;
        `
    // Ensure numeric values are parsed as floats if they come as strings from the DB
    const parsedRow = {
      ...rows[0],
      entry_fee: Number.parseFloat(rows[0].entry_fee),
      prize_pool: Number.parseFloat(rows[0].prize_pool),
    }
    return new Response(JSON.stringify(parsedRow), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to create tournament:", error)
    return new Response(JSON.stringify({ error: "Failed to create tournament", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
