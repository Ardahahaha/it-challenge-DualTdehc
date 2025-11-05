import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Update IRL Sessions table to support both in-person and remote sessions
export const irlSessions = sqliteTable('irl_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // "presentiel" or "distanciel"
  domain: text('domain').notNull(), // "Développement web/logiciel", "Cybersécurité", "Développement IA/ML"
  location: text('location'), // Nullable now (required for presentiel, null for distanciel)
  date: text('date').notNull(),
  time: text('time').notNull(),
  duration: text('duration').notNull(), // "30min", "45min", "1h", "1h30", "2h"
  level: text('level').notNull(),
  objective: text('objective').notNull(),
  timezone: text('timezone'), // Nullable (only for distanciel)
  videoLink: text('video_link'), // Nullable (only for distanciel)
  status: text('status').notNull().default('upcoming'), // "upcoming", "completed", "cancelled"
  organizerName: text('organizer_name').notNull(),
  maxParticipants: integer('max_participants').notNull().default(4),
  message: text('message'),
  createdAt: text('created_at').notNull(),
});

export const irlParticipants = sqliteTable('irl_participants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => irlSessions.id),
  participantName: text('participant_name').notNull(),
  joinedAt: text('joined_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// User profiles table
export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  username: text('username').notNull().unique(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  domaines: text('domaines'), // JSON array stored as text
  niveau: text('niveau').notNull().default('Débutant'),
  visibility: text('visibility').notNull().default('public'),
  xp: integer('xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});