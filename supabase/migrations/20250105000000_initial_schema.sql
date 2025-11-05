-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users or links with Better Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL, -- Better Auth user ID
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  domains TEXT[] DEFAULT '{}',
  level INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table (public chat rooms)
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (chat messages with Realtime support)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table (1v1 duels)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('online', 'irl')) DEFAULT 'online',
  status TEXT CHECK (status IN ('pending', 'active', 'finished')) DEFAULT 'pending',
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Match events table (real-time duel events)
CREATE TABLE IF NOT EXISTS match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  at TIMESTAMPTZ DEFAULT NOW()
);

-- XP logs table (progression tracking)
CREATE TABLE IF NOT EXISTS xp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table (skill catalog)
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  domain TEXT NOT NULL
);

-- User skills table (user skill levels)
CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 1000),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- History table (activity history)
CREATE TABLE IF NOT EXISTS history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('match', 'chat', 'xp')) NOT NULL,
  ref_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id_created_at ON messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match_id_at ON match_events(match_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_logs_user_id_created_at ON xp_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_user_id_created_at ON history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_created_by ON matches(created_by);
CREATE INDEX IF NOT EXISTS idx_matches_invited_id ON matches(invited_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed default rooms (dev, cyber, ai, networks, sysadmin)
INSERT INTO rooms (slug, topic, is_public) VALUES
  ('dev', 'Développement Web & Mobile', TRUE),
  ('cyber', 'Cybersécurité & Ethical Hacking', TRUE),
  ('ai', 'Intelligence Artificielle & Machine Learning', TRUE),
  ('networks', 'Réseaux & Infrastructure', TRUE),
  ('sysadmin', 'Administration Système & DevOps', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed default skills
INSERT INTO skills (code, label, domain) VALUES
  ('javascript', 'JavaScript', 'dev'),
  ('python', 'Python', 'dev'),
  ('react', 'React', 'dev'),
  ('nodejs', 'Node.js', 'dev'),
  ('typescript', 'TypeScript', 'dev'),
  ('pentest', 'Penetration Testing', 'cyber'),
  ('owasp', 'OWASP Top 10', 'cyber'),
  ('cryptography', 'Cryptographie', 'cyber'),
  ('tensorflow', 'TensorFlow', 'ai'),
  ('pytorch', 'PyTorch', 'ai'),
  ('nlp', 'Natural Language Processing', 'ai'),
  ('docker', 'Docker', 'sysadmin'),
  ('kubernetes', 'Kubernetes', 'sysadmin'),
  ('linux', 'Linux Administration', 'sysadmin'),
  ('tcpip', 'TCP/IP', 'networks'),
  ('dns', 'DNS', 'networks'),
  ('vpn', 'VPN', 'networks')
ON CONFLICT (code) DO NOTHING;
