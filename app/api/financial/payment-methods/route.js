import { neon } from "@neondatabase/serverless"

export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set.")
    return new Response(JSON.stringify({ error: "Server configuration error: Database URL is missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    const result = await sql.query(`
      SELECT
        method_name,
        transactions_count,
        percentage,
        revenue
      FROM payment_methods
      ORDER BY percentage DESC;
    `)
    const paymentMethods = result && result.rows ? result.rows : []

    return new Response(JSON.stringify(paymentMethods), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return new Response(JSON.stringify({ error: `Failed to fetch payment methods: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
