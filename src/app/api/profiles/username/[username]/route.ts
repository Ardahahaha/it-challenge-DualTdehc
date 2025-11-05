import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;

    // Validate username parameter
    if (!username || username.trim() === '') {
      return NextResponse.json(
        {
          error: 'Le nom d\'utilisateur est requis',
          code: 'INVALID_USERNAME'
        },
        { status: 400 }
      );
    }

    // Optional authentication check
    let session = null;
    try {
      session = await auth.api.getSession({ headers: request.headers });
    } catch (error) {
      // Session check failed, but that's ok - this is a public endpoint
      session = null;
    }

    // Query profile by username
    const profile = await db.select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1);

    // Check if profile exists
    if (profile.length === 0) {
      return NextResponse.json(
        {
          error: 'Profil non trouvé',
          code: 'PROFILE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const foundProfile = profile[0];

    // Check visibility
    if (foundProfile.visibility === 'private') {
      // Check if user is authenticated and is the profile owner
      if (!session || !session.user || session.user.id !== foundProfile.userId) {
        return NextResponse.json(
          {
            error: 'Ce profil est privé',
            code: 'PRIVATE_PROFILE'
          },
          { status: 403 }
        );
      }
    }

    // Return the profile
    return NextResponse.json(foundProfile, { status: 200 });

  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json(
      {
        error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}