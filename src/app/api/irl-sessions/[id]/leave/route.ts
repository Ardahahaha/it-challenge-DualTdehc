import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { irlSessions, irlParticipants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate session ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid session ID is required',
          code: 'INVALID_SESSION_ID' 
        },
        { status: 400 }
      );
    }

    const sessionId = parseInt(id);

    // Get participantName from query params or body
    const searchParams = request.nextUrl.searchParams;
    let participantName = searchParams.get('participantName');
    
    if (!participantName) {
      try {
        const body = await request.json();
        participantName = body.participantName;
      } catch {
        // Body parsing failed
      }
    }

    // Validate participantName
    if (!participantName || participantName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Participant name is required',
          code: 'MISSING_PARTICIPANT_NAME' 
        },
        { status: 400 }
      );
    }

    const sanitizedParticipantName = participantName.trim();

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

    // Find and delete participant
    const deletedParticipant = await db.delete(irlParticipants)
      .where(
        and(
          eq(irlParticipants.sessionId, sessionId),
          eq(irlParticipants.participantName, sanitizedParticipantName)
        )
      )
      .returning();

    if (deletedParticipant.length === 0) {
      return NextResponse.json(
        { 
          error: 'You are not a participant of this session',
          code: 'PARTICIPANT_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Successfully left the session',
        participantName: sanitizedParticipantName
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}