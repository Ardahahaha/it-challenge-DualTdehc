import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { irlSessions, irlParticipants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const sessionId = parseInt(id);

    // Check if session exists
    const existingSession = await db
      .select()
      .from(irlSessions)
      .where(eq(irlSessions.id, sessionId))
      .limit(1);

    if (existingSession.length === 0) {
      return NextResponse.json(
        {
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete all participants associated with this session first (CASCADE)
    await db
      .delete(irlParticipants)
      .where(eq(irlParticipants.sessionId, sessionId));

    // Delete the session
    const deleted = await db
      .delete(irlSessions)
      .where(eq(irlSessions.id, sessionId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Session deleted successfully',
        deletedId: sessionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}