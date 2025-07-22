// app/api/daily-duels/[id]/verify/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Verify the duel exists and has a winner
    const duel = await sql`
      SELECT * FROM daily_duels 
      WHERE id = ${id} AND winner IS NOT NULL
    `;

    if (!duel || duel.length === 0) {
      return NextResponse.json(
        { error: "Duel not found or no winner set" },
        { status: 404 }
      );
    }

    // Update duel status
    const updatedDuel = await sql`
      UPDATE daily_duels 
      SET 
        status = 'Completed',
        verified = true,
        payout_triggered = true,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Record platform earnings
    await sql`
      INSERT INTO platform_earnings (
        source, duel_id, amount, commission_rate
      ) VALUES (
        'daily_duel', ${id}, ${duel[0].platform_earnings}, ${duel[0].commission}
      )
    `;

    return NextResponse.json(updatedDuel[0]);

  } catch (error) {
    console.error("Failed to verify duel:", error);
    return NextResponse.json(
      { error: "Failed to verify duel" },
      { status: 500 }
    );
  }
}