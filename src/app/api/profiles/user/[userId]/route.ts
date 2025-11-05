import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Validate userId parameter
    const { userId } = await context.params;
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'ID utilisateur requis',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Authenticate the request
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json(
        { 
          error: 'Non autorisé',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // Query the profile by userId
    const profile = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { 
          error: 'Profil non trouvé',
          code: 'PROFILE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(profile[0], { status: 200 });

  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      },
      { status: 500 }
    );
  }
}