import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const ledgerData = await sql`
      SELECT * FROM platform_ledger 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (ledgerData.length === 0) {
      return Response.json({ error: "No ledger data found" }, { status: 404 })
    }

    return Response.json(ledgerData[0])
  } catch (error) {
    console.error("Error fetching platform ledger:", error)
    return Response.json({ error: "Failed to fetch platform ledger" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { amount, reason, admin_name, pin } = body

    // In a real app, verify the PIN securely
    if (pin !== "1234") {
      return Response.json({ error: "Invalid PIN" }, { status: 401 })
    }

    // Get current balance
    const currentLedger = await sql`
      SELECT current_balance FROM platform_ledger 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    const currentBalance = currentLedger[0]?.current_balance || 0
    const newBalance = Number.parseFloat(currentBalance) + Number.parseFloat(amount)
    const adjustmentType = Number.parseFloat(amount) > 0 ? "credit" : "debit"

    // Update ledger
    const result = await sql`
      UPDATE platform_ledger 
      SET 
        current_balance = ${newBalance},
        last_adjustment_amount = ${amount},
        last_adjustment_type = ${adjustmentType},
        last_adjustment_reason = ${reason},
        last_adjustment_admin = ${admin_name},
        last_adjustment_timestamp = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    // Create audit log
    await sql`
      INSERT INTO admin_audit (admin_id, admin_name, action, resource, details, severity)
      VALUES (1, ${admin_name}, 'LEDGER_ADJUSTMENT', 'ledger:platform', 
              ${`Manual ${adjustmentType} adjustment: ${Number.parseFloat(amount) > 0 ? "+" : ""}$${Math.abs(Number.parseFloat(amount))} - ${reason}`}, 
              'critical')
    `

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating platform ledger:", error)
    return Response.json({ error: "Failed to update platform ledger" }, { status: 500 })
  }
}
