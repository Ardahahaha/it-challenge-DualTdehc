import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { irlSessions, irlParticipants } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid session ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const sessionId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { participantName } = body;

    // Validate required field
    if (!participantName || typeof participantName !== 'string' || participantName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Participant name is required',
          code: 'MISSING_PARTICIPANT_NAME' 
        },
        { status: 400 }
      );
    }

    const sanitizedName = participantName.trim();

    // Verify session exists
    const session = await db.select()
      .from(irlSessions)
      .where(eq(irlSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        { 
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const sessionData = session[0];

    // Count current participants
    const participantCount = await db.select({ 
      count: sql<number>`count(*)` 
    })
      .from(irlParticipants)
      .where(eq(irlParticipants.sessionId, sessionId));

    const currentCount = Number(participantCount[0].count);

    // Check if session is full
    if (currentCount >= sessionData.maxParticipants) {
      return NextResponse.json(
        { 
          error: `Session is full (${currentCount}/${sessionData.maxParticipants} participants)`,
          code: 'SESSION_FULL' 
        },
        { status: 400 }
      );
    }

    // Check for duplicate participant name
    const existingParticipant = await db.select()
      .from(irlParticipants)
      .where(
        and(
          eq(irlParticipants.sessionId, sessionId),
          eq(irlParticipants.participantName, sanitizedName)
        )
      )
      .limit(1);

    if (existingParticipant.length > 0) {
      return NextResponse.json(
        { 
          error: 'You have already joined this session',
          code: 'DUPLICATE_PARTICIPANT' 
        },
        { status: 400 }
      );
    }

    // Insert new participant
    const newParticipant = await db.insert(irlParticipants)
      .values({
        sessionId: sessionId,
        participantName: sanitizedName,
        joinedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newParticipant[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}