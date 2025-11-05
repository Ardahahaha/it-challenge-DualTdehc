-- =====================================================
-- XP SYSTEM: Functions, Views, and Triggers
-- =====================================================

-- Function to add XP with automatic level calculation
CREATE OR REPLACE FUNCTION public.fn_add_xp(
  p_user uuid,
  p_domain text,
  p_delta int,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_xp int;
  v_new_level int;
BEGIN
  -- Insert XP log entry
  INSERT INTO public.xp_logs(user_id, domain, delta, reason)
  VALUES (p_user, p_domain, p_delta, p_reason);
  
  -- Calculate total XP across all domains
  SELECT COALESCE(SUM(delta), 0) INTO v_total_xp
  FROM public.xp_logs
  WHERE user_id = p_user;
  
  -- Calculate level (100 XP per level)
  v_new_level := FLOOR(v_total_xp / 100);
  
  -- Update profile level
  UPDATE public.profiles
  SET level = v_new_level,
      updated_at = now()
  WHERE id = p_user;
END;
$$;

-- View for aggregated XP totals by domain
CREATE OR REPLACE VIEW public.v_user_xp_totals AS
SELECT 
  user_id,
  domain,
  SUM(delta) as xp_total,
  COUNT(*) as event_count,
  MAX(created_at) as last_earned_at
FROM public.xp_logs
GROUP BY user_id, domain;

-- View for overall user XP summary
CREATE OR REPLACE VIEW public.v_user_xp_summary AS
SELECT 
  user_id,
  SUM(delta) as total_xp,
  COUNT(*) as total_events,
  COUNT(DISTINCT domain) as domains_count,
  MAX(created_at) as last_earned_at
FROM public.xp_logs
GROUP BY user_id;

-- =====================================================
-- SKILLS SYSTEM: Functions
-- =====================================================

-- Function to set or update skill level with timestamp
CREATE OR REPLACE FUNCTION public.fn_set_skill_level(
  p_user uuid,
  p_skill int,
  p_level int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_skills(user_id, skill_id, level, last_updated)
  VALUES (p_user, p_skill, p_level, now())
  ON CONFLICT (user_id, skill_id) 
  DO UPDATE SET 
    level = EXCLUDED.level,
    last_updated = now();
END;
$$;

-- View for user skills with skill details
CREATE OR REPLACE VIEW public.v_user_skills_detailed AS
SELECT 
  us.user_id,
  us.skill_id,
  us.level,
  us.last_updated,
  s.code as skill_code,
  s.label as skill_label,
  s.domain as skill_domain
FROM public.user_skills us
JOIN public.skills s ON s.id = us.skill_id;

-- =====================================================
-- HISTORY SYSTEM: Functions
-- =====================================================

-- Function to write history entry
CREATE OR REPLACE FUNCTION public.fn_write_history(
  p_user uuid,
  p_kind public.history_kind,
  p_ref uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.history(user_id, kind, ref_id)
  VALUES (p_user, p_kind, p_ref);
END;
$$;

-- View for enriched history with related data
CREATE OR REPLACE VIEW public.v_history_enriched AS
SELECT 
  h.id,
  h.user_id,
  h.kind,
  h.ref_id,
  h.created_at,
  CASE 
    WHEN h.kind = 'match' THEN (
      SELECT json_build_object(
        'status', m.status,
        'mode', m.mode,
        'opponent_id', CASE WHEN m.created_by = h.user_id THEN m.invited_id ELSE m.created_by END
      )
      FROM public.matches m WHERE m.id = h.ref_id
    )
    WHEN h.kind = 'xp' THEN (
      SELECT json_build_object(
        'domain', x.domain,
        'delta', x.delta,
        'reason', x.reason
      )
      FROM public.xp_logs x WHERE x.id = h.ref_id
    )
    ELSE NULL
  END as metadata
FROM public.history h;

-- =====================================================
-- MATCH SYSTEM: Triggers for auto-history
-- =====================================================

-- Trigger to auto-create history on match finish
CREATE OR REPLACE FUNCTION public.trg_match_finished_history()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only trigger when status changes to 'finished'
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    -- Create history for creator
    INSERT INTO public.history(user_id, kind, ref_id)
    VALUES (NEW.created_by, 'match', NEW.id);
    
    -- Create history for invited user
    INSERT INTO public.history(user_id, kind, ref_id)
    VALUES (NEW.invited_id, 'match', NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_matches_finished
AFTER UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.trg_match_finished_history();

-- =====================================================
-- STATS AGGREGATION: Functions
-- =====================================================

-- Function to get comprehensive user stats
CREATE OR REPLACE FUNCTION public.fn_get_user_stats(p_user uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats json;
BEGIN
  SELECT json_build_object(
    'total_matches', (
      SELECT COUNT(*) 
      FROM public.matches 
      WHERE (created_by = p_user OR invited_id = p_user)
    ),
    'matches_won', (
      SELECT COUNT(*) 
      FROM public.matches m
      JOIN public.match_events me ON me.match_id = m.id
      WHERE (m.created_by = p_user OR m.invited_id = p_user)
        AND m.status = 'finished'
        AND me.type = 'finish'
        AND (me.payload->>'winner_id')::uuid = p_user
    ),
    'matches_lost', (
      SELECT COUNT(*) 
      FROM public.matches m
      JOIN public.match_events me ON me.match_id = m.id
      WHERE (m.created_by = p_user OR m.invited_id = p_user)
        AND m.status = 'finished'
        AND me.type = 'finish'
        AND (me.payload->>'winner_id')::uuid != p_user
        AND me.payload->>'winner_id' IS NOT NULL
    ),
    'total_xp', (
      SELECT COALESCE(SUM(delta), 0)
      FROM public.xp_logs
      WHERE user_id = p_user
    ),
    'level', (
      SELECT COALESCE(level, 0)
      FROM public.profiles
      WHERE id = p_user
    ),
    'win_rate', (
      SELECT CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(
          (COUNT(*) FILTER (WHERE (me.payload->>'winner_id')::uuid = p_user)::numeric / COUNT(*)::numeric) * 100,
          1
        )
      END
      FROM public.matches m
      JOIN public.match_events me ON me.match_id = m.id
      WHERE (m.created_by = p_user OR m.invited_id = p_user)
        AND m.status = 'finished'
        AND me.type = 'finish'
    )
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$$;

-- =====================================================
-- LEADERBOARD: Views
-- =====================================================

-- Global XP leaderboard
CREATE OR REPLACE VIEW public.v_leaderboard_xp AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.level,
  COALESCE(SUM(x.delta), 0) as total_xp,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(x.delta), 0) DESC) as rank
FROM public.profiles p
LEFT JOIN public.xp_logs x ON x.user_id = p.id
WHERE p.is_public = true
GROUP BY p.id, p.username, p.avatar_url, p.level
ORDER BY total_xp DESC;

-- Match wins leaderboard
CREATE OR REPLACE VIEW public.v_leaderboard_wins AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.level,
  COUNT(DISTINCT m.id) as total_wins,
  ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT m.id) DESC) as rank
FROM public.profiles p
LEFT JOIN public.matches m ON (m.created_by = p.id OR m.invited_id = p.id)
LEFT JOIN public.match_events me ON me.match_id = m.id
WHERE p.is_public = true
  AND m.status = 'finished'
  AND me.type = 'finish'
  AND (me.payload->>'winner_id')::uuid = p.id
GROUP BY p.id, p.username, p.avatar_url, p.level
ORDER BY total_wins DESC;

-- =====================================================
-- CLEANUP: Drop old views if exist
-- =====================================================

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.fn_add_xp TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_set_skill_level TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_write_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_get_user_stats TO authenticated;

GRANT SELECT ON public.v_user_xp_totals TO authenticated;
GRANT SELECT ON public.v_user_xp_summary TO authenticated;
GRANT SELECT ON public.v_user_skills_detailed TO authenticated;
GRANT SELECT ON public.v_history_enriched TO authenticated;
GRANT SELECT ON public.v_leaderboard_xp TO authenticated;
GRANT SELECT ON public.v_leaderboard_wins TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION public.fn_add_xp IS 'Award XP to user and auto-update level. 100 XP = 1 level.';
COMMENT ON FUNCTION public.fn_set_skill_level IS 'Set or update user skill level with automatic timestamp.';
COMMENT ON FUNCTION public.fn_write_history IS 'Create history entry for user action.';
COMMENT ON FUNCTION public.fn_get_user_stats IS 'Get comprehensive stats for user including matches, XP, win rate.';

COMMENT ON VIEW public.v_user_xp_totals IS 'Aggregated XP totals per user and domain.';
COMMENT ON VIEW public.v_user_xp_summary IS 'Overall XP summary per user across all domains.';
COMMENT ON VIEW public.v_user_skills_detailed IS 'User skills with full skill metadata joined.';
COMMENT ON VIEW public.v_history_enriched IS 'History with enriched metadata from related tables.';
COMMENT ON VIEW public.v_leaderboard_xp IS 'Global leaderboard ranked by total XP.';
COMMENT ON VIEW public.v_leaderboard_wins IS 'Global leaderboard ranked by match wins.';
