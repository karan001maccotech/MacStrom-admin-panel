// app/api/daily-duels/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// GET all duels with filtering and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url, "http://localhost:3000");
    // console.log("Search Params:", searchParams.toString());
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 25;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";

    // Base query with count
    let query = sql`
      SELECT 
        id, title, type, entry_fee, prize_pool, max_participants,
        current_participants, status, start_time, end_time, winner,
        created_at, 
        COUNT(*) OVER() as total_count
      FROM daily_duels
      WHERE title ILIKE ${`%${search}%`}
    `;

    // Add status filter if provided
    if (status) {
      query = sql`${query} AND status = ${status}`;
    }

    // Add type filter if provided
    if (type) {
      query = sql`${query} AND type = ${type}`;
    }

    // Add pagination and ordering
    query = sql`
      ${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `;

    const result = await query;

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          duels: [],
          total: 0,
          page,
          totalPages: 0,
        },
        { status: 200 }
      );
    }

    const total = Number(result[0].total_count);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        duels: result.map((duel) => ({
          id: duel.id,
          title: duel.title,
          type: duel.type,
          entryFee: duel.entry_fee,
          prizePool: duel.prize_pool,
          maxParticipants: duel.max_participants,
          currentParticipants: duel.current_participants,
          status: duel.status,
          startTime: duel.start_time,
          endTime: duel.end_time,
          winner: duel.winner,
          createdAt: duel.created_at,
        })),
        total,
        page,
        totalPages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to fetch duels:", error);
    return NextResponse.json(
      { error: "Failed to fetch duels" },
      { status: 500 }
    );
  }
}

// POST create new duel
export async function POST(request) {
  try {
    // Authenticate admin (implement your auth logic)
    // const authError = await authenticateAdmin(request);
    // if (authError) return authError;

    const {
      title,
      type,
      entry_fee,
      max_participants,
      commission,
      start_time,
      description = "",
    } = await request.json();

    // Basic validation
    if (!title || !type || !start_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (entry_fee < 0 || max_participants < 2 || commission < 0 || commission > 100) {
      return NextResponse.json(
        { error: "Invalid input values" },
        { status: 400 }
      );
    }

    // Calculate prize pool and platform earnings
    const prize_pool = entry_fee * max_participants * (1 - commission / 100);
    const platform_earnings = entry_fee * max_participants * (commission / 100);

    // Insert new duel
    const newDuel = await sql`
      INSERT INTO daily_duels (
        title, type, entry_fee, prize_pool, max_participants,
        commission, platform_earnings, start_time, description
      ) VALUES (
        ${title}, ${type}, ${entry_fee}, ${prize_pool}, ${max_participants},
        ${commission}, ${platform_earnings}, ${start_time}, ${description}
      )
      RETURNING *
    `;

    return NextResponse.json(newDuel[0], { status: 201 });

  } catch (error) {
    console.error("Failed to create duel:", error);
    return NextResponse.json(
      { error: "Failed to create duel" },
      { status: 500 }
    );
  }
}