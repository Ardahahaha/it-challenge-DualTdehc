import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { irlSessions, irlParticipants } from '@/db/schema';
import { eq, like, or, desc, sql } from 'drizzle-orm';

const VALID_TYPES = ['presentiel', 'distanciel'];
const VALID_DOMAINS = ['Développement web/logiciel', 'Cybersécurité', 'Développement IA/ML'];
const VALID_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];
const VALID_DURATIONS = ['30min', '45min', '1h', '1h30', '2h'];
const VALID_STATUSES = ['upcoming', 'completed', 'cancelled'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const typeFilter = searchParams.get('type');

    // Single session by ID with participants
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const session = await db
        .select()
        .from(irlSessions)
        .where(eq(irlSessions.id, parseInt(id)))
        .limit(1);

      if (session.length === 0) {
        return NextResponse.json(
          { error: 'Session not found', code: 'SESSION_NOT_FOUND' },
          { status: 404 }
        );
      }

      const participants = await db
        .select({
          id: irlParticipants.id,
          participantName: irlParticipants.participantName,
          joinedAt: irlParticipants.joinedAt,
        })
        .from(irlParticipants)
        .where(eq(irlParticipants.sessionId, parseInt(id)))
        .orderBy(irlParticipants.joinedAt);

      return NextResponse.json({
        ...session[0],
        participant_count: participants.length,
        participants,
      });
    }

    // List all sessions with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    // Base query with optional type filter
    let sessionsQuery = db.select().from(irlSessions);
    
    if (typeFilter && VALID_TYPES.includes(typeFilter)) {
      sessionsQuery = sessionsQuery.where(eq(irlSessions.type, typeFilter));
    }

    const sessions = await sessionsQuery
      .orderBy(desc(irlSessions.date), desc(irlSessions.time))
      .limit(limit)
      .offset(offset);

    // For each session, count participants separately
    const sessionsWithCounts = await Promise.all(
      sessions.map(async (session) => {
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(irlParticipants)
          .where(eq(irlParticipants.sessionId, session.id));
        
        return {
          ...session,
          participant_count: Number(countResult[0].count),
        };
      })
    );

    if (search) {
      const searchTerm = search.toLowerCase();
      const filtered = sessionsWithCounts.filter(
        (s) =>
          (s.location && s.location.toLowerCase().includes(searchTerm)) ||
          s.domain.toLowerCase().includes(searchTerm) ||
          s.level.toLowerCase().includes(searchTerm) ||
          s.organizerName.toLowerCase().includes(searchTerm) ||
          (s.objective && s.objective.toLowerCase().includes(searchTerm))
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(sessionsWithCounts);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      domain, 
      location, 
      date, 
      time, 
      duration, 
      level, 
      objective,
      timezone,
      videoLink,
      status,
      organizerName, 
      maxParticipants, 
      message 
    } = body;

    // Validate required fields
    const requiredFields = ['type', 'domain', 'date', 'time', 'duration', 'level', 'objective', 'organizerName'];
    const missingFields = requiredFields.filter((field) => !body[field] || body[field].toString().trim() === '');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(type.trim())) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate domain
    if (!VALID_DOMAINS.includes(domain.trim())) {
      return NextResponse.json(
        {
          error: `Invalid domain. Must be one of: ${VALID_DOMAINS.join(', ')}`,
          code: 'INVALID_DOMAIN',
        },
        { status: 400 }
      );
    }

    // Validate level
    if (!VALID_LEVELS.includes(level.trim())) {
      return NextResponse.json(
        {
          error: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`,
          code: 'INVALID_LEVEL',
        },
        { status: 400 }
      );
    }

    // Validate duration
    if (!VALID_DURATIONS.includes(duration.trim())) {
      return NextResponse.json(
        {
          error: `Invalid duration. Must be one of: ${VALID_DURATIONS.join(', ')}`,
          code: 'INVALID_DURATION',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status.trim())) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Type-specific validations
    if (type.trim() === 'presentiel') {
      if (!location || location.trim() === '') {
        return NextResponse.json(
          {
            error: 'Location is required for presentiel sessions',
            code: 'MISSING_LOCATION',
          },
          { status: 400 }
        );
      }
    }

    if (type.trim() === 'distanciel') {
      if (!timezone || timezone.trim() === '') {
        return NextResponse.json(
          {
            error: 'Timezone is required for distanciel sessions',
            code: 'MISSING_TIMEZONE',
          },
          { status: 400 }
        );
      }
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date.trim())) {
      return NextResponse.json(
        {
          error: 'Invalid date format. Must be YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT',
        },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(time.trim())) {
      return NextResponse.json(
        {
          error: 'Invalid time format. Must be HH:MM',
          code: 'INVALID_TIME_FORMAT',
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      type: type.trim(),
      domain: domain.trim(),
      location: location ? location.trim() : null,
      date: date.trim(),
      time: time.trim(),
      duration: duration.trim(),
      level: level.trim(),
      objective: objective.trim(),
      timezone: timezone ? timezone.trim() : null,
      videoLink: videoLink ? videoLink.trim() : null,
      status: status ? status.trim() : 'upcoming',
      organizerName: organizerName.trim(),
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : 4,
      message: message ? message.trim() : null,
      createdAt: new Date().toISOString(),
    };

    const newSession = await db.insert(irlSessions).values(insertData).returning();

    return NextResponse.json(newSession[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}