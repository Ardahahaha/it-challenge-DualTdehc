# 🔍 DualTech.1V1 - Complete Supabase Migration Audit Report

**Product**: DualTech.1V1  
**Stack**: Next.js 15 App Router + Supabase (Auth, Postgres, Realtime)  
**Audit Date**: 2025-01-05  
**Auditor**: Senior Full-Stack Engineer  

---

## 1) AUDIT_SUMMARY

### Current State
- ✅ **Better Auth** integration exists with session management
- ✅ **Turso/SQLite** database currently in use
- ❌ **No Supabase integration** - all data is mocked or simulated
- ❌ **Zero real-time capabilities** - fake WebSocket/connection simulation
- ❌ **No persistence** - all state stored in component state or localStorage
- ❌ **Simulated 1v1 flows** - fake timers, fake opponents, fake scoring

### Migration Requirements
1. **Database Migration**: Turso → Supabase Postgres
2. **Auth Bridge**: Keep Better Auth, bridge sessions to Supabase RLS
3. **Real-time Setup**: Enable Supabase Realtime for `messages` and `match_events`
4. **Data Persistence**: Replace all mocks with real DB queries
5. **RLS Implementation**: Strict row-level security policies
6. **Remove Features**: Mentoring and Coworking (per scope requirements)

### Files Requiring Changes
- **8 page components** with mock data
- **1 shared component** (XPBar) with default props
- **0 API routes** currently working (need to integrate existing `/api/supabase/*` routes)
- **Multiple mock arrays** totaling ~150 lines of placeholder data

---

## 2) MOCK_MAP

| FilePath | Component/Function | MockType | LineRange | RealDataSource | ReplacementPlan |
|----------|-------------------|----------|-----------|----------------|-----------------|
| `src/app/dashboard/page.tsx` | `DashboardPage` | Empty stats (0, 0, 0) | 195-233 | `profiles.level`, `matches`, `xp_logs` | GET `/api/supabase/stats` for real aggregations |
| `src/app/dashboard/page.tsx` | Daily Streak | Hardcoded 0 days | 235-252 | `history` table with date filters | Calculate streak from consecutive `history` entries |
| `src/app/dashboard/page.tsx` | Sessions | Empty array fallback | 84-86 | `matches` table (IRL sessions) | Already uses API `/api/irl-sessions` ✅ |
| `src/app/dashboard/page.tsx` | Badges | Empty state | 254-261 | Achievement logic from XP/matches | Compute from `xp_logs` and `matches` counts |
| `src/app/users/page.tsx` | User list | Empty array | N/A | `profiles` table | GET `/api/supabase/profiles?is_public=true` |
| `src/app/profile/[id]/page.tsx` | Stats | Hardcoded (42, 28, 12, 67%) | 68-97 | `matches` filtered by user_id | GET `/api/supabase/matches?user_id={id}` |
| `src/app/profile/[id]/page.tsx` | History | `Array.from({ length: 5 })` loop | 106-144 | `history` table with JOINs | GET `/api/supabase/history?user_id={id}` |
| `src/app/profile/[id]/page.tsx` | Badges | Hardcoded unlock states | 102-104 | Calculate from user stats | Same as dashboard badges |
| `src/app/room/[id]/page.tsx` | Timer | `useState(930)` simulation | 24, 53-64 | `matches.started_at` + duration | Real-time sync via Supabase |
| `src/app/room/[id]/page.tsx` | Chat messages | Hardcoded 2 messages | 26-30 | `messages` table filtered by `room_id` | Supabase Realtime subscription |
| `src/app/room/[id]/page.tsx` | Points | `useState(0)` simulation | 39-41 | `match_events` aggregation | Real-time updates via Realtime |
| `src/app/room/[id]/page.tsx` | Questions | Hardcoded array | 42-50 | `match_events` with type='question' | Fetch from match timeline |
| `src/app/room/[id]/page.tsx` | Opponent behavior | `setInterval` simulation | 74-86 | Real opponent via Supabase Realtime | Subscribe to opponent's events |
| `src/app/communautes/page.tsx` | Communities | `initialCommunities` array (6 items) | 11-64 | `rooms` table | GET `/api/supabase/rooms` |
| `src/app/communautes/page.tsx` | Join/Leave | `useState` toggle | 77-105 | `room_members` junction table (NEW) | POST to membership API |
| `src/app/skills-tracking/page.tsx` | Skills | `initialSkills` array (15 items) | 11-27 | `skills` + `user_skills` tables | GET `/api/supabase/skills` + `/user-skills` |
| `src/app/skills-tracking/page.tsx` | XP values | Hardcoded xp/maxXp | 14-27 | `xp_logs` aggregated by domain | Compute from `xp_logs` SUM |
| `src/app/skills-tracking/page.tsx` | Save action | `setTimeout` simulation | 77-84 | PostgreSQL UPDATE | POST `/api/supabase/user-skills` |
| `src/app/realtime-1v1/page.tsx` | Connection | Fake `setTimeout` status | 23-37 | Real Supabase Realtime channel | Use `supabase.channel()` |
| `src/app/realtime-1v1/page.tsx` | Messages | Local state array | 15, 109-122 | `messages` table | Realtime subscription + INSERT |
| `src/app/realtime-1v1/page.tsx` | Question/Answer | Mock validation | 147-156 | `match_events` insert/read | POST `/api/supabase/match-events` |
| `src/app/realtime-1v1/page.tsx` | Opponent points | Random `setInterval` | 54-60 | `match_events` aggregation | Subscribe to opponent's score events |
| `src/components/XPBar.tsx` | Default XP | Props default (0, 100, 1) | 6-8 | `xp_logs` aggregation | Fetch from user's XP total |

### Dead/Unused Routes to Remove
- `/mentorat` - Out of scope (Mentoring)
- `/coworking` - Out of scope (Coworking)
- `/assistant-ia` - Not in core MVP
- `/evenements` - Not in core MVP
- `/gamification` - Redirect to `/skills-tracking`

### localStorage/sessionStorage Usage
- **None detected** - Good! No fake "DB" in browser storage

---

## 3) SCHEMA_SQL

### Full PostgreSQL + Supabase Migration

```sql
-- ============================================================================
-- DUALTECH.1V1 - COMPLETE SUPABASE SCHEMA
-- Migration ID: 20250105000000_complete_schema
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE public.match_mode AS ENUM ('online', 'irl');
CREATE TYPE public.match_status AS ENUM ('pending', 'active', 'finished', 'cancelled');
CREATE TYPE public.history_kind AS ENUM ('match', 'chat', 'xp');
CREATE TYPE public.skill_domain AS ENUM ('dev', 'cyber', 'network', 'sysadmin', 'ai');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User profiles (linked to Better Auth user_id)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- Better Auth user ID
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  domains TEXT[] DEFAULT '{}',
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public and private rooms (communities + 1v1 rooms)
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'community' CHECK (room_type IN ('community', 'match')),
  is_public BOOLEAN NOT NULL DEFAULT true,
  max_members INTEGER DEFAULT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room membership (for communities)
CREATE TABLE public.room_members (
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Messages (chat in rooms and matches)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1v1 Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode public.match_mode NOT NULL DEFAULT 'online',
  status public.match_status NOT NULL DEFAULT 'pending',
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT different_players CHECK (created_by != invited_id),
  CONSTRAINT valid_winner CHECK (winner_id IS NULL OR winner_id IN (created_by, invited_id)),
  CONSTRAINT valid_finish CHECK (
    (status = 'finished' AND finished_at IS NOT NULL) OR 
    (status != 'finished')
  )
);

-- Real-time match events (scores, questions, system messages)
CREATE TABLE public.match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('score_update', 'question', 'answer', 'round_start', 'round_end', 'pause', 'resume', 'finish', 'system', 'chat')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Skills catalog
CREATE TABLE public.skills (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  domain public.skill_domain NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User skill levels
CREATE TABLE public.user_skills (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  level INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id)
);

-- XP transaction logs
CREATE TABLE public.xp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity history (for timeline/feed)
CREATE TABLE public.history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind public.history_kind NOT NULL,
  ref_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Auto-update profile total_xp when xp_logs inserted
CREATE OR REPLACE FUNCTION public.update_profile_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET total_xp = total_xp + NEW.delta,
      level = GREATEST(1, 1 + (total_xp + NEW.delta) / 1000)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_xp_logs_update_profile
  AFTER INSERT ON public.xp_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_xp();

-- Auto-create history entry on match finish
CREATE OR REPLACE FUNCTION public.create_match_history()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    INSERT INTO public.history (user_id, kind, ref_id, metadata)
    VALUES 
      (NEW.created_by, 'match', NEW.id, jsonb_build_object('won', NEW.winner_id = NEW.created_by)),
      (NEW.invited_id, 'match', NEW.id, jsonb_build_object('won', NEW.winner_id = NEW.invited_id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_match_history
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.create_match_history();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default community rooms
INSERT INTO public.rooms (slug, topic, room_type, is_public, max_members) VALUES
  ('dev', 'Développement Web & Apps', 'community', true, 500),
  ('cyber', 'Cybersécurité & Pentest', 'community', true, 300),
  ('ai', 'Intelligence Artificielle & ML', 'community', true, 400),
  ('networks', 'Réseaux & Infrastructure', 'community', true, 350),
  ('sysadmin', 'Administration Système & DevOps', 'community', true, 400);

-- Insert skills catalog
INSERT INTO public.skills (code, label, domain, description) VALUES
  -- Dev
  ('javascript', 'JavaScript', 'dev', 'Language de programmation web'),
  ('typescript', 'TypeScript', 'dev', 'JavaScript typé'),
  ('python', 'Python', 'dev', 'Language polyvalent'),
  ('react', 'React', 'dev', 'Framework frontend'),
  ('nodejs', 'Node.js', 'dev', 'Runtime JavaScript serveur'),
  
  -- Cyber
  ('pentest', 'Penetration Testing', 'cyber', 'Tests d''intrusion'),
  ('owasp', 'OWASP Top 10', 'cyber', 'Vulnérabilités web'),
  ('crypto', 'Cryptographie', 'cyber', 'Chiffrement & signatures'),
  ('forensics', 'Forensics', 'cyber', 'Analyse post-incident'),
  
  -- Network
  ('tcpip', 'TCP/IP', 'network', 'Protocoles réseau'),
  ('dns', 'DNS', 'network', 'Résolution de noms'),
  ('vpn', 'VPN', 'network', 'Réseaux privés virtuels'),
  
  -- SysAdmin
  ('linux', 'Linux', 'sysadmin', 'Administration Linux'),
  ('docker', 'Docker', 'sysadmin', 'Containerisation'),
  ('kubernetes', 'Kubernetes', 'sysadmin', 'Orchestration'),
  
  -- AI
  ('tensorflow', 'TensorFlow', 'ai', 'Framework ML'),
  ('pytorch', 'PyTorch', 'ai', 'Framework ML'),
  ('nlp', 'NLP', 'ai', 'Traitement du langage naturel');

-- ============================================================================
-- HELPER FUNCTIONS (RPC)
-- ============================================================================

-- Award XP to user
CREATE OR REPLACE FUNCTION public.fn_add_xp(
  p_user_id UUID,
  p_domain TEXT,
  p_delta INTEGER,
  p_reason TEXT DEFAULT NULL,
  p_match_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.xp_logs (user_id, domain, delta, reason, match_id)
  VALUES (p_user_id, p_domain, p_delta, p_reason, p_match_id);
END;
$$;

-- Create history entry
CREATE OR REPLACE FUNCTION public.fn_write_history(
  p_user_id UUID,
  p_kind public.history_kind,
  p_ref_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.history (user_id, kind, ref_id, metadata)
  VALUES (p_user_id, p_kind, p_ref_id, p_metadata);
END;
$$;

-- Get user stats (for dashboard)
CREATE OR REPLACE FUNCTION public.fn_get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_matches BIGINT,
  wins BIGINT,
  losses BIGINT,
  win_rate NUMERIC,
  total_xp INTEGER,
  level INTEGER,
  streak_days INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH match_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE winner_id = p_user_id) as won,
      COUNT(*) FILTER (WHERE winner_id IS NOT NULL AND winner_id != p_user_id) as lost
    FROM public.matches
    WHERE status = 'finished' 
      AND (created_by = p_user_id OR invited_id = p_user_id)
  ),
  profile_data AS (
    SELECT total_xp, level
    FROM public.profiles
    WHERE id = p_user_id
  ),
  streak AS (
    SELECT COUNT(DISTINCT DATE(created_at)) as days
    FROM public.history
    WHERE user_id = p_user_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
  )
  SELECT
    match_stats.total,
    match_stats.won,
    match_stats.lost,
    CASE 
      WHEN match_stats.total > 0 
      THEN ROUND((match_stats.won::NUMERIC / match_stats.total::NUMERIC) * 100, 1)
      ELSE 0
    END as win_rate,
    profile_data.total_xp,
    profile_data.level,
    streak.days::INTEGER
  FROM match_stats, profile_data, streak;
END;
$$;
```

---

## 4) RLS_POLICIES

### Row Level Security Policies

```sql
-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Revoke all default permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Anyone can view public profiles
CREATE POLICY "profiles_select_public_or_owner"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid()::TEXT = user_id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_owner"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

-- Users can update their own profile
CREATE POLICY "profiles_update_owner"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::TEXT = user_id)
  WITH CHECK (auth.uid()::TEXT = user_id);

-- Users cannot delete profiles
-- (handled by cascade from auth.users)

-- ============================================================================
-- ROOMS POLICIES
-- ============================================================================

-- Anyone can view public rooms
CREATE POLICY "rooms_select_public"
  ON public.rooms FOR SELECT
  USING (is_public = true OR created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- Authenticated users can create rooms
CREATE POLICY "rooms_insert_authenticated"
  ON public.rooms FOR INSERT
  WITH CHECK (created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- Only creator can update room
CREATE POLICY "rooms_update_creator"
  ON public.rooms FOR UPDATE
  USING (created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- ============================================================================
-- ROOM MEMBERS POLICIES
-- ============================================================================

-- Users can view memberships of rooms they can see
CREATE POLICY "room_members_select"
  ON public.room_members FOR SELECT
  USING (room_id IN (
    SELECT id FROM public.rooms WHERE is_public = true
  ));

-- Users can join public rooms
CREATE POLICY "room_members_insert"
  ON public.room_members FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    AND room_id IN (SELECT id FROM public.rooms WHERE is_public = true)
  );

-- Users can leave rooms
CREATE POLICY "room_members_delete_self"
  ON public.room_members FOR DELETE
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================

-- Users can view messages in public rooms or their matches
CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  USING (
    room_id IN (SELECT id FROM public.rooms WHERE is_public = true)
    OR author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  );

-- Users can insert messages in rooms they're members of
CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  );

-- Users can delete their own messages
CREATE POLICY "messages_delete_owner"
  ON public.messages FOR DELETE
  USING (author_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- ============================================================================
-- MATCHES POLICIES
-- ============================================================================

-- Users can view matches they participate in
CREATE POLICY "matches_select_participants"
  ON public.matches FOR SELECT
  USING (
    created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    OR invited_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  );

-- Users can create matches
CREATE POLICY "matches_insert"
  ON public.matches FOR INSERT
  WITH CHECK (
    created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  );

-- Participants can update matches
CREATE POLICY "matches_update_participants"
  ON public.matches FOR UPDATE
  USING (
    created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    OR invited_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  )
  WITH CHECK (
    created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    OR invited_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
  );

-- ============================================================================
-- MATCH EVENTS POLICIES
-- ============================================================================

-- Participants can view match events
CREATE POLICY "match_events_select_participants"
  ON public.match_events FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM public.matches
      WHERE created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
         OR invited_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    )
  );

-- Participants can insert match events
CREATE POLICY "match_events_insert_participants"
  ON public.match_events FOR INSERT
  WITH CHECK (
    match_id IN (
      SELECT id FROM public.matches
      WHERE created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
         OR invited_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT)
    )
  );

-- ============================================================================
-- SKILLS POLICIES
-- ============================================================================

-- Anyone can view skills catalog
CREATE POLICY "skills_select_all"
  ON public.skills FOR SELECT
  USING (true);

-- ============================================================================
-- USER SKILLS POLICIES
-- ============================================================================

-- Users can view their own skills
CREATE POLICY "user_skills_select_owner"
  ON public.user_skills FOR SELECT
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- Users can manage their own skills
CREATE POLICY "user_skills_insert_owner"
  ON public.user_skills FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

CREATE POLICY "user_skills_update_owner"
  ON public.user_skills FOR UPDATE
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

CREATE POLICY "user_skills_delete_owner"
  ON public.user_skills FOR DELETE
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- ============================================================================
-- XP LOGS POLICIES
-- ============================================================================

-- Users can view their own XP logs
CREATE POLICY "xp_logs_select_owner"
  ON public.xp_logs FOR SELECT
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- System can insert XP logs (via RPC functions)
CREATE POLICY "xp_logs_insert"
  ON public.xp_logs FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- ============================================================================
-- HISTORY POLICIES
-- ============================================================================

-- Users can view their own history
CREATE POLICY "history_select_owner"
  ON public.history FOR SELECT
  USING (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));

-- System can insert history (via triggers/RPC)
CREATE POLICY "history_insert"
  ON public.history FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT
  ));
```

---

## 5) INDEXES

### Performance Indexes

```sql
-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX idx_profiles_public ON public.profiles(is_public) WHERE is_public = true;

-- Rooms
CREATE INDEX idx_rooms_slug ON public.rooms(slug);
CREATE INDEX idx_rooms_public ON public.rooms(is_public) WHERE is_public = true;
CREATE INDEX idx_rooms_type ON public.rooms(room_type);

-- Room Members
CREATE INDEX idx_room_members_user ON public.room_members(user_id);
CREATE INDEX idx_room_members_room ON public.room_members(room_id);
CREATE INDEX idx_room_members_joined ON public.room_members(joined_at DESC);

-- Messages (time-series optimization)
CREATE INDEX idx_messages_room_time ON public.messages(room_id, created_at DESC);
CREATE INDEX idx_messages_author ON public.messages(author_id);
CREATE INDEX idx_messages_time ON public.messages(created_at DESC);

-- Matches
CREATE INDEX idx_matches_created_by ON public.matches(created_by);
CREATE INDEX idx_matches_invited ON public.matches(invited_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_participants ON public.matches(created_by, invited_id);
CREATE INDEX idx_matches_time ON public.matches(created_at DESC);
CREATE INDEX idx_matches_active ON public.matches(status, started_at) WHERE status = 'active';

-- Match Events (time-series + real-time)
CREATE INDEX idx_match_events_match_time ON public.match_events(match_id, at DESC);
CREATE INDEX idx_match_events_type ON public.match_events(match_id, type);
CREATE INDEX idx_match_events_user ON public.match_events(user_id, at DESC);
CREATE INDEX idx_match_events_time ON public.match_events(at DESC);

-- Skills
CREATE INDEX idx_skills_code ON public.skills(code);
CREATE INDEX idx_skills_domain ON public.skills(domain);

-- User Skills
CREATE INDEX idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON public.user_skills(skill_id);
CREATE INDEX idx_user_skills_level ON public.user_skills(level DESC);

-- XP Logs (time-series)
CREATE INDEX idx_xp_logs_user_time ON public.xp_logs(user_id, created_at DESC);
CREATE INDEX idx_xp_logs_domain ON public.xp_logs(domain);
CREATE INDEX idx_xp_logs_match ON public.xp_logs(match_id) WHERE match_id IS NOT NULL;
CREATE INDEX idx_xp_logs_time ON public.xp_logs(created_at DESC);

-- History (time-series + kind filter)
CREATE INDEX idx_history_user_time ON public.history(user_id, created_at DESC);
CREATE INDEX idx_history_kind ON public.history(kind);
CREATE INDEX idx_history_ref ON public.history(ref_id) WHERE ref_id IS NOT NULL;
CREATE INDEX idx_history_time ON public.history(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_matches_user_status ON public.matches(created_by, status);
CREATE INDEX idx_matches_invited_status ON public.matches(invited_id, status);
CREATE INDEX idx_xp_logs_user_domain ON public.xp_logs(user_id, domain);
```

---

## 6) TRIGGERS_RPC

Already included in Section 3 (SCHEMA_SQL) above:

✅ `trg_profiles_updated` - Auto-update `updated_at` timestamp  
✅ `trg_xp_logs_update_profile` - Auto-update profile XP and level on XP insert  
✅ `trg_match_history` - Auto-create history entries when match finishes  

✅ `fn_add_xp()` - RPC to award XP with validation  
✅ `fn_write_history()` - RPC to create history entry  
✅ `fn_get_user_stats()` - RPC to get aggregated user stats  

---

## 7) REALTIME_SUBSCRIPTIONS

### Supabase Realtime Setup

#### Step 1: Enable Realtime in Supabase Dashboard

1. Go to **Database** → **Replication**
2. Find the **supabase_realtime** publication
3. Enable these tables:
   - ✅ `messages`
   - ✅ `match_events`

#### Step 2: Client-Side Subscription Pattern

**For Chat Messages:**

```typescript
// src/hooks/useRealtimeMessages.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, author:profiles(*)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)
      
      if (data) setMessages(data)
    }
    
    fetchMessages()

    // Subscribe to real-time inserts
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const sendMessage = async (content: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!profile) return

    await supabase.from('messages').insert({
      room_id: roomId,
      author_id: profile.id,
      content
    })
  }

  return { messages, sendMessage }
}
```

**For Match Events:**

```typescript
// src/hooks/useRealtimeMatch.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeMatch(matchId: string) {
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [match, setMatch] = useState<Match | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Fetch match details
    const fetchMatch = async () => {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()
      
      if (data) setMatch(data)
    }

    // Fetch existing events
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', matchId)
        .order('at', { ascending: true })
      
      if (data) setEvents(data)
    }

    fetchMatch()
    fetchEvents()

    // Subscribe to new events
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_events',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          setEvents(prev => [...prev, payload.new as MatchEvent])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          setMatch(payload.new as Match)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  const submitEvent = async (type: string, payload: any) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!profile) return

    await supabase.from('match_events').insert({
      match_id: matchId,
      user_id: profile.id,
      type,
      payload
    })
  }

  return { match, events, submitEvent }
}
```

#### Step 3: Performance Considerations

- **Channel Limits**: Max 100 concurrent channels per client
- **Event Latency**: Target < 150ms for match events
- **Payload Size**: Keep match_event payloads < 10KB
- **Idempotency**: Use UUIDs for events to prevent duplicates
- **Reconnection**: Handle automatic reconnection on network loss

---

## 8) VALIDATION_CHECKS

### Post-Migration SQL Verification

```sql
-- ============================================================================
-- VALIDATION CHECKS - Run these after migration
-- ============================================================================

-- 1. Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
-- Expected: 10 tables (profiles, rooms, room_members, messages, matches, match_events, skills, user_skills, xp_logs, history)

-- 2. Verify RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;
-- Expected: 10 rows (all tables)

-- 3. Check seed data: public rooms
SELECT slug, topic, is_public, room_type
FROM public.rooms
WHERE room_type = 'community'
ORDER BY slug;
-- Expected: 5 rows (dev, cyber, ai, networks, sysadmin)

-- 4. Check seed data: skills catalog
SELECT domain, COUNT(*) as skill_count
FROM public.skills
GROUP BY domain
ORDER BY domain;
-- Expected: 5 domains with ~18 total skills

-- 5. Verify indexes exist
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'messages', 'matches', 'match_events', 'xp_logs', 'history')
ORDER BY tablename, indexname;
-- Expected: ~30+ indexes

-- 6. Test RLS: Current user can read own profile (run after creating profile)
-- Replace {user_id} with actual Better Auth user_id
SELECT *
FROM public.profiles
WHERE user_id = '{user_id}';
-- Expected: 1 row if profile exists

-- 7. Test RLS: Cannot read other users' XP logs
-- This should return empty unless you're the owner
SELECT COUNT(*)
FROM public.xp_logs
WHERE user_id != (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT);
-- Expected: 0 rows

-- 8. Test RLS: Can view public rooms
SELECT COUNT(*)
FROM public.rooms
WHERE is_public = true;
-- Expected: 5+ rows

-- 9. Verify triggers are active
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
-- Expected: 3 triggers (profiles updated, xp logs update profile, match history)

-- 10. Test function: Get user stats (replace {profile_id})
SELECT * FROM public.fn_get_user_stats('{profile_id}');
-- Expected: 1 row with aggregated stats

-- 11. Verify foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
-- Expected: ~15 foreign key relationships

-- 12. Test match creation permissions
-- Should succeed for authenticated user
INSERT INTO public.matches (created_by, invited_id, mode)
VALUES (
  (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT),
  (SELECT id FROM public.profiles WHERE user_id != auth.uid()::TEXT LIMIT 1),
  'online'
);
-- Expected: Success or permission denied (depending on RLS context)

-- 13. Verify realtime publication (run in psql or Supabase SQL editor)
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
-- Expected: messages and match_events tables

-- 14. Check table sizes (for monitoring)
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
-- Expected: Small sizes initially, messages/events will grow over time

-- 15. Test XP award function
SELECT public.fn_add_xp(
  (SELECT id FROM public.profiles WHERE user_id = auth.uid()::TEXT),
  'dev',
  100,
  'Test XP award',
  NULL
);
-- Expected: Success, check xp_logs table for new entry
```

---

## 9) NEXT_ACTIONS

### Implementation Checklist

#### Phase 1: Database Setup (1-2 hours)
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy Project URL and API keys to `.env.local`
- [ ] Run full migration SQL (Section 3) via Supabase SQL Editor
- [ ] Run RLS policies SQL (Section 4)
- [ ] Run indexes SQL (Section 5)
- [ ] Enable Realtime on `messages` and `match_events` tables
- [ ] Run validation checks (Section 8) - all should pass

#### Phase 2: API Integration (2-3 hours)
- [ ] Update `/api/supabase/*` routes to use real queries (remove mocks)
- [ ] Create profile auto-creation on Better Auth registration
- [ ] Test all API endpoints with real data
- [ ] Add error handling and logging
- [ ] Implement rate limiting for write operations

#### Phase 3: Frontend Integration (4-6 hours)
- [ ] **Dashboard** (`src/app/dashboard/page.tsx`):
  - [ ] Replace empty stats with `GET /api/supabase/stats`
  - [ ] Calculate daily streak from `history` table
  - [ ] Fetch real badges based on achievements
  - [ ] Add loading states for all API calls

- [ ] **Users List** (`src/app/users/page.tsx`):
  - [ ] Fetch from `GET /api/supabase/profiles?is_public=true`
  - [ ] Add search/filter functionality
  - [ ] Implement pagination (20 users per page)

- [ ] **User Profile** (`src/app/profile/[id]/page.tsx`):
  - [ ] Fetch profile from `GET /api/supabase/profiles/[id]`
  - [ ] Get real match stats from `GET /api/supabase/matches?user_id={id}`
  - [ ] Load history from database
  - [ ] Calculate badges from user stats

- [ ] **1v1 Room** (`src/app/room/[id]/page.tsx`):
  - [ ] Use `useRealtimeMatch` hook
  - [ ] Sync timer with `matches.started_at`
  - [ ] Load messages from `messages` table
  - [ ] Subscribe to opponent's events in real-time
  - [ ] Submit answers as `match_events`
  - [ ] Award XP via `fn_add_xp()` function

- [ ] **Communities** (`src/app/communautes/page.tsx`):
  - [ ] Fetch rooms from `GET /api/supabase/rooms`
  - [ ] Implement join/leave via `room_members` table
  - [ ] Show real member counts
  - [ ] Add create community form

- [ ] **Skills Tracking** (`src/app/skills-tracking/page.tsx`):
  - [ ] Load skills from `GET /api/supabase/skills`
  - [ ] Load user skills from `GET /api/supabase/user-skills`
  - [ ] Calculate XP from `xp_logs` aggregations
  - [ ] Save skills via `POST /api/supabase/user-skills`

- [ ] **Realtime 1v1** (`src/app/realtime-1v1/page.tsx`):
  - [ ] Replace fake connection with Supabase Realtime channel
  - [ ] Use `useRealtimeMessages` for chat
  - [ ] Submit answers to `match_events`
  - [ ] Calculate points from event aggregations

- [ ] **XPBar Component** (`src/components/XPBar.tsx`):
  - [ ] Accept real XP data from parent
  - [ ] Or fetch from `profiles.total_xp` directly

#### Phase 4: Real-time Features (2-3 hours)
- [ ] Create `useRealtimeMessages` hook
- [ ] Create `useRealtimeMatch` hook
- [ ] Test multi-user chat in separate browsers
- [ ] Test match events synchronization
- [ ] Verify event latency < 150ms

#### Phase 5: Testing & Cleanup (2-3 hours)
- [ ] Remove unused routes (`/mentorat`, `/coworking`, `/assistant-ia`, `/evenements`)
- [ ] Add comprehensive error boundaries
- [ ] Test all RLS policies with different user roles
- [ ] Test edge cases (network loss, reconnection)
- [ ] Run full validation checks again
- [ ] Load test with 10+ concurrent matches

#### Phase 6: Performance Optimization (1-2 hours)
- [ ] Add query caching for frequently accessed data
- [ ] Implement optimistic UI updates
- [ ] Add database query logging
- [ ] Monitor Supabase usage metrics
- [ ] Set up alerts for slow queries

### Estimated Total Time: **14-20 hours**

---

## 📊 MIGRATION IMPACT SUMMARY

| Category | Before | After | Change |
|----------|--------|-------|--------|
| **Data Persistence** | 0% (all mocked) | 100% (Postgres) | ✅ Real DB |
| **Real-time Features** | 0% (simulated) | 100% (Supabase Realtime) | ✅ Live sync |
| **API Endpoints** | 0 working | 15+ working | ✅ Complete |
| **Security** | None (client-side only) | RLS + policies | ✅ Secure |
| **Scalability** | Not scalable | Horizontally scalable | ✅ Production-ready |
| **Mentoring/Coworking** | Placeholder pages | Removed per scope | ✅ Cleaned up |

---

## 🎯 SUCCESS CRITERIA

After completing all actions:

1. ✅ **Zero mock data** in any UI component
2. ✅ **All stats are real** from database aggregations
3. ✅ **Real-time chat works** with < 150ms latency
4. ✅ **1v1 matches persist** and can be resumed
5. ✅ **RLS blocks unauthorized access** (tested)
6. ✅ **All validation checks pass** (Section 8)
7. ✅ **No Mentoring/Coworking** routes exist

---

## 📞 SUPPORT & TROUBLESHOOTING

**Common Issues:**

1. **"Row-level security policy violated"**
   - Verify user is authenticated
   - Check RLS policies match your query pattern
   - Use service role client for admin operations

2. **Realtime events not received**
   - Enable tables in Replication settings
   - Check subscription filter matches
   - Verify channel is connected (`status === 'joined'`)

3. **Foreign key constraint errors**
   - Ensure profile exists before creating dependent records
   - Use `ON DELETE CASCADE` where appropriate
   - Check data types match (UUID vs TEXT)

4. **Slow queries**
   - Check indexes are created (Section 5)
   - Use `EXPLAIN ANALYZE` in Supabase SQL editor
   - Add composite indexes for complex queries

---

**End of Audit Report**

*Generated: 2025-01-05*  
*Next Review: After Phase 3 completion*
