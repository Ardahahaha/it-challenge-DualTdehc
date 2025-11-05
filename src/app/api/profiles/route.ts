import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq, like, and, or, ne, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
const VALID_NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
const VALID_VISIBILITY = ['public', 'private'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(profiles).where(eq(profiles.visibility, 'public'));

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        and(
          eq(profiles.visibility, 'public'),
          or(
            like(profiles.username, searchTerm),
            like(profiles.bio, searchTerm)
          )
        )
      ) as any;
    }

    const results = await query
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const { username, avatarUrl, bio, domaines, niveau, visibility } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur est requis', code: 'USERNAME_REQUIRED' },
        { status: 400 }
      );
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        {
          error: 'Format de nom d\'utilisateur invalide (3-20 caractères, lettres, chiffres, points, tirets, underscores uniquement)',
          code: 'INVALID_USERNAME_FORMAT'
        },
        { status: 400 }
      );
    }

    const existingUsername = await db.select()
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà utilisé', code: 'USERNAME_EXISTS' },
        { status: 409 }
      );
    }

    const existingProfile = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json(
        { error: 'Vous avez déjà un profil', code: 'PROFILE_EXISTS' },
        { status: 409 }
      );
    }

    const profileNiveau = niveau || 'Débutant';
    if (!VALID_NIVEAUX.includes(profileNiveau)) {
      return NextResponse.json(
        { error: 'Niveau invalide', code: 'INVALID_NIVEAU' },
        { status: 400 }
      );
    }

    const profileVisibility = visibility || 'public';
    if (!VALID_VISIBILITY.includes(profileVisibility)) {
      return NextResponse.json(
        { error: 'Visibilité invalide', code: 'INVALID_VISIBILITY' },
        { status: 400 }
      );
    }

    let domainesString = null;
    if (domaines) {
      try {
        if (typeof domaines === 'string') {
          JSON.parse(domaines);
          domainesString = domaines;
        } else if (Array.isArray(domaines)) {
          domainesString = JSON.stringify(domaines);
        } else {
          return NextResponse.json(
            { error: 'Les domaines doivent être un tableau JSON', code: 'INVALID_DOMAINES' },
            { status: 400 }
          );
        }
      } catch (e) {
        return NextResponse.json(
          { error: 'Format JSON invalide pour les domaines', code: 'INVALID_DOMAINES_JSON' },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();

    const newProfile = await db.insert(profiles)
      .values({
        userId,
        username: username.trim(),
        avatarUrl: avatarUrl?.trim() || null,
        bio: bio?.trim() || null,
        domaines: domainesString,
        niveau: profileNiveau,
        visibility: profileVisibility,
        xp: 0,
        level: 1,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    const { username, avatarUrl, bio, domaines, niveau, visibility } = body;

    const existingProfile = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json(
        { error: 'Profil non trouvé', code: 'PROFILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (username !== undefined) {
      const trimmedUsername = username.trim();
      
      if (!USERNAME_REGEX.test(trimmedUsername)) {
        return NextResponse.json(
          {
            error: 'Format de nom d\'utilisateur invalide (3-20 caractères, lettres, chiffres, points, tirets, underscores uniquement)',
            code: 'INVALID_USERNAME_FORMAT'
          },
          { status: 400 }
        );
      }

      if (trimmedUsername !== existingProfile[0].username) {
        const usernameExists = await db.select()
          .from(profiles)
          .where(
            and(
              eq(profiles.username, trimmedUsername),
              ne(profiles.userId, userId)
            )
          )
          .limit(1);

        if (usernameExists.length > 0) {
          return NextResponse.json(
            { error: 'Ce nom d\'utilisateur est déjà utilisé', code: 'USERNAME_EXISTS' },
            { status: 409 }
          );
        }
      }

      updates.username = trimmedUsername;
    }

    if (avatarUrl !== undefined) {
      updates.avatarUrl = avatarUrl?.trim() || null;
    }

    if (bio !== undefined) {
      updates.bio = bio?.trim() || null;
    }

    if (domaines !== undefined) {
      if (domaines === null) {
        updates.domaines = null;
      } else {
        try {
          if (typeof domaines === 'string') {
            JSON.parse(domaines);
            updates.domaines = domaines;
          } else if (Array.isArray(domaines)) {
            updates.domaines = JSON.stringify(domaines);
          } else {
            return NextResponse.json(
              { error: 'Les domaines doivent être un tableau JSON', code: 'INVALID_DOMAINES' },
              { status: 400 }
            );
          }
        } catch (e) {
          return NextResponse.json(
            { error: 'Format JSON invalide pour les domaines', code: 'INVALID_DOMAINES_JSON' },
            { status: 400 }
          );
        }
      }
    }

    if (niveau !== undefined) {
      if (!VALID_NIVEAUX.includes(niveau)) {
        return NextResponse.json(
          { error: 'Niveau invalide', code: 'INVALID_NIVEAU' },
          { status: 400 }
        );
      }
      updates.niveau = niveau;
    }

    if (visibility !== undefined) {
      if (!VALID_VISIBILITY.includes(visibility)) {
        return NextResponse.json(
          { error: 'Visibilité invalide', code: 'INVALID_VISIBILITY' },
          { status: 400 }
        );
      }
      updates.visibility = visibility;
    }

    const updatedProfile = await db.update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();

    return NextResponse.json(updatedProfile[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur: ' + (error as Error).message },
      { status: 500 }
    );
  }
}