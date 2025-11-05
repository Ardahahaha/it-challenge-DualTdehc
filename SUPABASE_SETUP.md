# 🚀 Supabase Setup Guide

This project uses **Supabase** for database, real-time subscriptions, and data persistence, while keeping **Better Auth** for authentication.

## 📋 Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Node.js 18+ installed
3. Existing Better Auth setup (already configured)

---

## 🔧 Setup Steps

### 1. **Install Dependencies** ✅ (Already Done)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. **Get Supabase Credentials**

Go to your Supabase Dashboard:

**URL & Keys:**
- Navigate to: **Settings > API**
- Copy these values:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Keep secret!)

**Database URL (for migrations):**
- Navigate to: **Settings > Database > Connection String > URI**
- Copy the PostgreSQL connection string

### 3. **Configure Environment Variables**

Create/update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep existing Better Auth vars
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
```

### 4. **Run Database Migrations**

Option A: **Using Supabase CLI** (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Option B: **Manual SQL Execution**

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy contents of `supabase/migrations/20250105000000_initial_schema.sql`
3. Run the SQL
4. Copy contents of `supabase/migrations/20250105000001_enable_rls.sql`
5. Run the SQL

### 5. **Enable Realtime on Tables**

In Supabase Dashboard:
1. Go to **Database > Replication**
2. Enable **Realtime** for these tables:
   - `messages`
   - `match_events`

Or run this SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE match_events;
```

### 6. **Verify Setup**

Check that these tables exist in **Database > Tables**:
- ✅ profiles
- ✅ rooms (with 5 seeded rooms: dev, cyber, ai, networks, sysadmin)
- ✅ messages
- ✅ matches
- ✅ match_events
- ✅ xp_logs
- ✅ skills (with 17 seeded skills)
- ✅ user_skills
- ✅ history

---

## 🔐 Authentication Flow

This project uses a **hybrid auth approach**:

1. **Better Auth** handles user registration, login, sessions
2. **Supabase** stores profile data and handles RLS

**How it works:**
- When a user signs up via Better Auth, a profile is created in Supabase
- Better Auth session → Supabase profile lookup via `user_id`
- Supabase RLS uses `app.current_user_id` set by API routes (not Supabase Auth)

---

## 📊 Database Schema

### Core Tables

**profiles** - User profiles (linked to Better Auth)
- `id` (UUID, PK)
- `user_id` (TEXT, Better Auth user ID)
- `username` (TEXT, unique)
- `avatar_url`, `bio`, `domains[]`, `level`, `is_public`

**rooms** - Public chat rooms
- `id` (UUID, PK)
- `slug` (TEXT, unique - e.g., "dev", "cyber")
- `topic` (TEXT)

**messages** - Chat messages (Realtime enabled)
- `id` (UUID, PK)
- `room_id` (FK → rooms)
- `author_id` (FK → profiles)
- `content` (TEXT)

**matches** - 1v1 duels
- `id` (UUID, PK)
- `created_by`, `invited_id` (FK → profiles)
- `mode` (online/irl)
- `status` (pending/active/finished)

**match_events** - Real-time duel events (Realtime enabled)
- `id` (UUID, PK)
- `match_id` (FK → matches)
- `type` (TEXT - e.g., "score_update", "message")
- `payload` (JSONB)

**xp_logs** - XP tracking
- `id` (UUID, PK)
- `user_id` (FK → profiles)
- `domain` (TEXT - e.g., "dev", "cyber")
- `delta` (INTEGER - XP change)

**skills** - Skill catalog (seeded)
**user_skills** - User skill levels
**history** - Activity history

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled. Key policies:

- **profiles**: Read if public or own; write own only
- **messages**: Read all public rooms; insert/delete own
- **matches**: Read/write if participant
- **match_events**: Read/write if match participant
- **xp_logs**: Read/write own only

RLS uses `current_setting('app.current_user_id')` which is set by API routes based on Better Auth session.

---

## 🎯 Next Steps

After setup:

1. Test database connection: Check server logs for any Supabase errors
2. Create a profile: Register a new user via Better Auth
3. Test real-time: Open chat in two tabs and send messages
4. Verify RLS: Try accessing other users' private data (should fail)

---

## 🐛 Troubleshooting

**"relation does not exist" error:**
- Migrations didn't run. Check **Database > Tables** in Supabase Dashboard
- Re-run migrations using SQL Editor

**"Failed to fetch" or CORS errors:**
- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- Verify Supabase project is not paused (free tier pauses after inactivity)

**RLS blocking access:**
- API routes must set `app.current_user_id` before queries
- Use service role key for admin operations (bypasses RLS)

**Realtime not working:**
- Enable Realtime in **Database > Replication**
- Check browser console for subscription errors
- Verify anon key has realtime permissions

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Realtime Docs](https://supabase.com/docs/guides/realtime)
- [@supabase/ssr Package](https://github.com/supabase/ssr)
