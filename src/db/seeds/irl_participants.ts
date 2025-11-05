import { db } from '@/db';
import { irlParticipants } from '@/db/schema';

async function main() {
    const sampleParticipants = [
        // Session 1 (max: 4) - Full
        {
            sessionId: 1,
            participantName: 'Marie Dubois',
            joinedAt: new Date('2024-12-10T10:30:00').toISOString(),
        },
        {
            sessionId: 1,
            participantName: 'Pierre Martin',
            joinedAt: new Date('2024-12-10T14:15:00').toISOString(),
        },
        {
            sessionId: 1,
            participantName: 'Sophie Laurent',
            joinedAt: new Date('2024-12-11T09:20:00').toISOString(),
        },
        {
            sessionId: 1,
            participantName: 'Thomas Bernard',
            joinedAt: new Date('2024-12-11T16:45:00').toISOString(),
        },

        // Session 2 (max: 6) - Partially filled (3 participants)
        {
            sessionId: 2,
            participantName: 'Julie Petit',
            joinedAt: new Date('2024-12-12T11:00:00').toISOString(),
        },
        {
            sessionId: 2,
            participantName: 'Lucas Moreau',
            joinedAt: new Date('2024-12-13T15:30:00').toISOString(),
        },
        {
            sessionId: 2,
            participantName: 'Emma Leroy',
            joinedAt: new Date('2024-12-14T10:10:00').toISOString(),
        },

        // Session 3 (max: 4) - Partially filled (2 participants)
        {
            sessionId: 3,
            participantName: 'Antoine Roux',
            joinedAt: new Date('2024-12-13T09:45:00').toISOString(),
        },
        {
            sessionId: 3,
            participantName: 'Camille Simon',
            joinedAt: new Date('2024-12-14T14:20:00').toISOString(),
        },

        // Session 4 (max: 5) - Full
        {
            sessionId: 4,
            participantName: 'Nicolas Fournier',
            joinedAt: new Date('2024-12-14T10:00:00').toISOString(),
        },
        {
            sessionId: 4,
            participantName: 'Léa Michel',
            joinedAt: new Date('2024-12-15T11:30:00').toISOString(),
        },
        {
            sessionId: 4,
            participantName: 'Hugo Girard',
            joinedAt: new Date('2024-12-15T16:00:00').toISOString(),
        },
        {
            sessionId: 4,
            participantName: 'Chloé Dupont',
            joinedAt: new Date('2024-12-16T09:15:00').toISOString(),
        },
        {
            sessionId: 4,
            participantName: 'Maxime Lambert',
            joinedAt: new Date('2024-12-16T13:45:00').toISOString(),
        },

        // Session 5 (max: 4, completed) - Full (joined before session date)
        {
            sessionId: 5,
            participantName: 'Océane Bonnet',
            joinedAt: new Date('2024-12-15T10:30:00').toISOString(),
        },
        {
            sessionId: 5,
            participantName: 'Alexandre Garcia',
            joinedAt: new Date('2024-12-15T14:00:00').toISOString(),
        },
        {
            sessionId: 5,
            participantName: 'Manon Rousseau',
            joinedAt: new Date('2024-12-16T11:20:00').toISOString(),
        },
        {
            sessionId: 5,
            participantName: 'Gabriel Blanc',
            joinedAt: new Date('2024-12-16T15:30:00').toISOString(),
        },

        // Session 6 (max: 6) - Empty (no participants)

        // Session 7 (max: 4) - Partially filled (1 participant)
        {
            sessionId: 7,
            participantName: 'Sarah Fontaine',
            joinedAt: new Date('2024-12-18T09:00:00').toISOString(),
        },

        // Session 8 (max: 5, cancelled) - Partially filled (2 participants joined before cancellation)
        {
            sessionId: 8,
            participantName: 'Paul Vincent',
            joinedAt: new Date('2024-12-17T10:15:00').toISOString(),
        },
        {
            sessionId: 8,
            participantName: 'Inès Chevalier',
            joinedAt: new Date('2024-12-17T14:30:00').toISOString(),
        },

        // Session 9 (max: 4) - Partially filled (3 participants)
        {
            sessionId: 9,
            participantName: 'Louis Gauthier',
            joinedAt: new Date('2024-12-19T11:00:00').toISOString(),
        },
        {
            sessionId: 9,
            participantName: 'Clara Morel',
            joinedAt: new Date('2024-12-20T09:30:00').toISOString(),
        },
        {
            sessionId: 9,
            participantName: 'Raphaël André',
            joinedAt: new Date('2024-12-20T15:45:00').toISOString(),
        },

        // Session 10 (max: 6) - Full
        {
            sessionId: 10,
            participantName: 'Jade Lefebvre',
            joinedAt: new Date('2024-12-20T10:00:00').toISOString(),
        },
        {
            sessionId: 10,
            participantName: 'Nathan Mercier',
            joinedAt: new Date('2024-12-21T11:15:00').toISOString(),
        },
        {
            sessionId: 10,
            participantName: 'Zoé Legrand',
            joinedAt: new Date('2024-12-21T14:30:00').toISOString(),
        },
        {
            sessionId: 10,
            participantName: 'Arthur Roy',
            joinedAt: new Date('2024-12-22T09:45:00').toISOString(),
        },
        {
            sessionId: 10,
            participantName: 'Lucie Garnier',
            joinedAt: new Date('2024-12-22T13:20:00').toISOString(),
        },
        {
            sessionId: 10,
            participantName: 'Victor Faure',
            joinedAt: new Date('2024-12-23T10:30:00').toISOString(),
        },

        // Session 11 (max: 5, completed) - Partially filled (2 participants joined before session)
        {
            sessionId: 11,
            participantName: 'Anaïs Muller',
            joinedAt: new Date('2024-12-21T10:00:00').toISOString(),
        },
        {
            sessionId: 11,
            participantName: 'Mathis Giraud',
            joinedAt: new Date('2024-12-22T14:15:00').toISOString(),
        },

        // Session 12 (max: 4) - Empty (no participants)
    ];

    await db.insert(irlParticipants).values(sampleParticipants);
    
    console.log('✅ IRL participants seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});