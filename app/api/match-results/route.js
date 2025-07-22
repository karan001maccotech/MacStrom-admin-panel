import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    // This is a placeholder. You'll need to define your match_results table and query it.
    // For now, returning dummy data or an empty array.
    const dummyResults = [
      { id: 1, match_id: 101, winner_team_id: 1, loser_team_id: 2, score: "2-1", mvp_player_id: 5, date: "2025-07-20" },
      { id: 2, match_id: 102, winner_team_id: 3, loser_team_id: 4, score: "3-0", mvp_player_id: 8, date: "2025-07-21" },
    ]
    // Example of how you might fetch from a 'match_results' table if it existed:
    // const { rows } = await sql`SELECT * FROM match_results ORDER BY date DESC;`;
    return new Response(JSON.stringify(dummyResults), {
      // Replace dummyResults with rows if fetching from DB
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to fetch match results:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch match results", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request) {
  try {
    const { match_id, winner_team_id, loser_team_id, score, mvp_player_id, date } = await request.json()
    // This is a placeholder. You'll need to define your match_results table and insert into it.
    // Example of how you might insert into a 'match_results' table if it existed:
    // const { rows } = await sql`
    //     INSERT INTO match_results (match_id, winner_team_id, loser_team_id, score, mvp_player_id, date)
    //     VALUES (${match_id}, ${winner_team_id}, ${loser_team_id}, ${score}, ${mvp_player_id}, ${date})
    //     RETURNING *;
    // `;
    const newResult = {
      id: Math.floor(Math.random() * 1000) + 100,
      match_id,
      winner_team_id,
      loser_team_id,
      score,
      mvp_player_id,
      date,
    }
    return new Response(JSON.stringify(newResult), {
      // Replace newResult with rows[0] if inserting into DB
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to create match result:", error)
    return new Response(JSON.stringify({ error: "Failed to create match result", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
