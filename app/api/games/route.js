import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {

    const result = await sql`SELECT * FROM games ORDER BY name ASC;`

    // Handle case where no games are found
    if (!result || result.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(result))
      },
    });
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch games",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify({
          error: "Failed to fetch games",
          details: error.message
        }))
      },
    });
  }
}

export async function POST(request) {
  try {
    const { name, type, image_url } = await request.json()
    if (!name || !type) {
      return new Response(JSON.stringify({ error: "Game name and type are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    const { rows } = await sql`
            INSERT INTO games (name, type, image_url)
            VALUES (${name}, ${type}, ${image_url || null})
            RETURNING *;
        `
    return new Response(JSON.stringify(rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to create game:", error)
    return new Response(JSON.stringify({ error: "Failed to create game", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
