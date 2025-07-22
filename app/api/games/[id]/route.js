import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request, { params }) {
  const { id } = params
  try {
    const { rows } = await sql`SELECT * FROM games WHERE id = ${id};`
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Game not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(`Failed to fetch game with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to fetch game", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  try {
    const { name, type, image_url } = await request.json()
    if (!name || !type) {
      return new Response(JSON.stringify({ error: "Game name and type are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    const { rows } = await sql`
            UPDATE games
            SET name = ${name}, type = ${type}, image_url = ${image_url || null}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *;
        `
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Game not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(`Failed to update game with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to update game", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    const { rowCount } = await sql`DELETE FROM games WHERE id = ${id};`
    if (rowCount === 0) {
      return new Response(JSON.stringify({ error: "Game not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(`Failed to delete game with ID ${id}:`, error)
    return new Response(JSON.stringify({ error: "Failed to delete game", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
