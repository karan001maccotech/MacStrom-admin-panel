// app/api/webhooks/route.js
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// GET all webhook events with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 25;
    const eventType = searchParams.get('eventType');
    const duelId = searchParams.get('duelId');

    // Base query with count
    let query = sql`
      SELECT 
        id, duel_id, event_type, payload, created_at,
        COUNT(*) OVER() as total_count
      FROM webhook_events
      WHERE 1=1
    `;

    // Add event type filter if provided
    if (eventType) {
      query = sql`${query} AND event_type = ${eventType}`;
    }

    // Add duel ID filter if provided
    if (duelId) {
      query = sql`${query} AND duel_id = ${duelId}`;
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
          events: [],
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
        events: result.map(event => ({
          id: event.id,
          duelId: event.duel_id,
          eventType: event.event_type,
          payload: event.payload,
          createdAt: event.created_at,
        })),
        total,
        page,
        totalPages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Failed to fetch webhook events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook events' },
      { status: 500 }
    );
  }
}

// POST receive new webhook
export async function POST(request) {
  try {
    const webhookData = await request.json();

    // Validate required fields
    if (!webhookData.duelId || !webhookData.eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: duelId and eventType are required' },
        { status: 400 }
      );
    }

    // Store the webhook event
    const newEvent = await sql`
      INSERT INTO webhook_events (
        duel_id, event_type, payload
      ) VALUES (
        ${webhookData.duelId}, 
        ${webhookData.eventType}, 
        ${webhookData}
      )
      RETURNING *
    `;

    // If this is a duel result, update the duel record
    if (webhookData.eventType === 'duel_result') {
      await sql`
        UPDATE daily_duels
        SET 
          webhook_received = true,
          winner = ${webhookData.winner},
          status = 'Awaiting Verification',
          updated_at = NOW()
        WHERE id = ${webhookData.duelId}
      `;
    }

    return NextResponse.json(newEvent[0], { status: 201 });

  } catch (error) {
    console.error('Failed to process webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}