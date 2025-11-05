-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- PROFILES: Read if public or own profile
CREATE POLICY "Profiles are viewable by everyone if public"
  ON profiles FOR SELECT
  USING (is_public = TRUE OR id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = (current_setting('app.current_user_id', TRUE))::UUID);

-- ROOMS: Public read-only
CREATE POLICY "Public rooms are viewable"
  ON rooms FOR SELECT
  USING (is_public = TRUE);

-- MESSAGES: Public read, authenticated users can insert/delete own
CREATE POLICY "Messages in public rooms are viewable"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM rooms WHERE rooms.id = messages.room_id AND rooms.is_public = TRUE
  ));

CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (author_id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (author_id = (current_setting('app.current_user_id', TRUE))::UUID);

-- MATCHES: Participants can view and update
CREATE POLICY "Users can view matches they're part of"
  ON matches FOR SELECT
  USING (
    created_by = (current_setting('app.current_user_id', TRUE))::UUID OR
    invited_id = (current_setting('app.current_user_id', TRUE))::UUID
  );

CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  WITH CHECK (created_by = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Participants can update matches"
  ON matches FOR UPDATE
  USING (
    created_by = (current_setting('app.current_user_id', TRUE))::UUID OR
    invited_id = (current_setting('app.current_user_id', TRUE))::UUID
  );

-- MATCH_EVENTS: Participants can view and insert
CREATE POLICY "Users can view events for their matches"
  ON match_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_events.match_id AND (
      matches.created_by = (current_setting('app.current_user_id', TRUE))::UUID OR
      matches.invited_id = (current_setting('app.current_user_id', TRUE))::UUID
    )
  ));

CREATE POLICY "Participants can insert match events"
  ON match_events FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_events.match_id AND (
      matches.created_by = (current_setting('app.current_user_id', TRUE))::UUID OR
      matches.invited_id = (current_setting('app.current_user_id', TRUE))::UUID
    )
  ));

-- XP_LOGS: Users can view own logs
CREATE POLICY "Users can view own xp logs"
  ON xp_logs FOR SELECT
  USING (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can insert own xp logs"
  ON xp_logs FOR INSERT
  WITH CHECK (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

-- SKILLS: Public read-only
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (TRUE);

-- USER_SKILLS: Public read, users can update own
CREATE POLICY "User skills are viewable"
  ON user_skills FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  USING (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  WITH CHECK (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

-- HISTORY: Users can view own history
CREATE POLICY "Users can view own history"
  ON history FOR SELECT
  USING (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

CREATE POLICY "Users can insert own history"
  ON history FOR INSERT
  WITH CHECK (user_id = (current_setting('app.current_user_id', TRUE))::UUID);

-- Enable Realtime for messages and match_events tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE match_events;
