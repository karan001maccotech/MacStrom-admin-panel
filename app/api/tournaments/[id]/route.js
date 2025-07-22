import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request, { params }) {
  const { id } = params
  try {
    const { rows } = await sql`
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
            WHERE t.id = ${id};
        `
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Tournament not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    // Ensure numeric values are parsed as floats if they come as strings from the DB
    const parsedRow = {
      ...rows[0],
      entry_fee: Number.parseFloat(rows[0].entry_fee),
      prize_pool: Number.parseFloat(rows[0].prize_pool),
    }
    return new Response(JSON.stringify(parsedRow), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(`Failed to fetch tournament with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to fetch tournament", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(request, { params }) {
  const { id } = params
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
            UPDATE tournaments
            SET
                game_id = ${game_id},
                title = ${title},
                type = ${type},
                start_date = ${start_date},
                end_date = ${end_date},
                status = ${status || "scheduled"},
                entry_fee = ${entry_fee || 0},
                prize_pool = ${prize_pool || 0},
                current_participants = ${current_participants || 0},
                max_participants = ${max_participants || 0},
                current_round = ${current_round || null},
                organizer = ${organizer || null},
                featured = ${featured || false},
                progress = ${progress || 0},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *;
        `
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Tournament not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    // Ensure numeric values are parsed as floats if they come as strings from the DB
    const parsedRow = {
      ...rows[0],
      entry_fee: Number.parseFloat(rows[0].entry_fee),
      prize_pool: Number.parseFloat(rows[0].prize_pool),
    }
    return new Response(JSON.stringify(parsedRow), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(`Failed to update tournament with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to update tournament", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    const { rowCount } = await sql`DELETE FROM tournaments WHERE id = ${id};`
    if (rowCount === 0) {
      return new Response(JSON.stringify({ error: "Tournament not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(`Failed to delete tournament with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to delete tournament", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
