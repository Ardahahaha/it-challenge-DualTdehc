-- ============================================================================
-- XP, SKILLS, AND HISTORY RPC FUNCTIONS + VIEWS
-- Migration: 20250105000002
-- ============================================================================

-- ============================================================================
-- 1) XP MANAGEMENT
-- ============================================================================

-- View: Aggregate XP totals by user and domain
CREATE OR REPLACE VIEW public.v_user_xp_totals AS
SELECT 
  user_id,
  domain,
  SUM(delta) as xp_total,
  COUNT(*) as xp_count,
  MAX(created_at) as last_updated
FROM public.xp_logs
GROUP BY user_id, domain;

-- Function: Add XP with validation and level calculation
CREATE OR REPLACE FUNCTION public.fn_add_xp(
  p_user_id uuid,
  p_domain text,
  p_delta int,
  p_reason text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_xp_total int;
  v_old_level int;
  v_new_level int;
  v_xp_log_id uuid;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  
  IF p_domain IS NULL OR p_domain = '' THEN
    RAISE EXCEPTION 'domain cannot be empty';
  END IF;
  
  IF p_delta = 0 THEN
    RAISE EXCEPTION 'delta cannot be zero';
  END IF;

  -- Get current level
  SELECT level INTO v_old_level
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_old_level IS NULL THEN
    RAISE EXCEPTION 'Profile not found for user_id: %', p_user_id;
  END IF;

  -- Insert XP log
  INSERT INTO public.xp_logs(user_id, domain, delta, reason)
  VALUES (p_user_id, p_domain, p_delta, p_reason)
  RETURNING id INTO v_xp_log_id;

  -- Calculate new total XP across all domains
  SELECT COALESCE(SUM(delta), 0) INTO v_new_xp_total
  FROM public.xp_logs
  WHERE user_id = p_user_id;

  -- Calculate new level (100 XP per level, simple formula)
  v_new_level := GREATEST(1, FLOOR(v_new_xp_total / 100.0));

  -- Update profile level if changed
  IF v_new_level != v_old_level THEN
    UPDATE public.profiles
    SET level = v_new_level,
        updated_at = NOW()
    WHERE id = p_user_id;
  END IF;

  -- Create history entry for XP gain
  PERFORM public.fn_write_history(p_user_id, 'xp', v_xp_log_id);

  -- Return summary
  RETURN json_build_object(
    'xp_log_id', v_xp_log_id,
    'old_level', v_old_level,
    'new_level', v_new_level,
    'total_xp', v_new_xp_total,
    'delta', p_delta,
    'domain', p_domain,
    'level_up', v_new_level > v_old_level
  );
END;
$$;

-- ============================================================================
-- 2) SKILLS MANAGEMENT
-- ============================================================================

-- Function: Set skill level with timestamp
CREATE OR REPLACE FUNCTION public.fn_set_skill_level(
  p_user_id uuid,
  p_skill_id int,
  p_level int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  
  IF p_skill_id IS NULL THEN
    RAISE EXCEPTION 'skill_id cannot be null';
  END IF;
  
  IF p_level < 0 OR p_level > 100 THEN
    RAISE EXCEPTION 'level must be between 0 and 100';
  END IF;

  -- Verify skill exists
  IF NOT EXISTS (SELECT 1 FROM public.skills WHERE id = p_skill_id) THEN
    RAISE EXCEPTION 'Skill not found: %', p_skill_id;
  END IF;

  -- Verify profile exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Profile not found: %', p_user_id;
  END IF;

  -- Upsert skill level
  INSERT INTO public.user_skills(user_id, skill_id, level, last_updated)
  VALUES (p_user_id, p_skill_id, p_level, NOW())
  ON CONFLICT (user_id, skill_id)
  DO UPDATE SET
    level = EXCLUDED.level,
    last_updated = NOW();
END;
$$;

-- View: User skills with skill details
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

-- ============================================================================
-- 3) HISTORY MANAGEMENT
-- ============================================================================

-- Function: Write history entry
CREATE OR REPLACE FUNCTION public.fn_write_history(
  p_user_id uuid,
  p_kind public.history_kind,
  p_ref_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_history_id uuid;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  
  IF p_kind IS NULL THEN
    RAISE EXCEPTION 'kind cannot be null';
  END IF;

  -- Verify profile exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Profile not found: %', p_user_id;
  END IF;

  -- Insert history entry
  INSERT INTO public.history(user_id, kind, ref_id)
  VALUES (p_user_id, p_kind, p_ref_id)
  RETURNING id INTO v_history_id;

  RETURN v_history_id;
END;
$$;

-- View: History with related data
CREATE OR REPLACE VIEW public.v_user_history_detailed AS
SELECT 
  h.id,
  h.user_id,
  h.kind,
  h.ref_id,
  h.created_at,
  CASE 
    WHEN h.kind = 'match' THEN (
      SELECT json_build_object(
        'id', m.id,
        'status', m.status,
        'mode', m.mode,
        'created_by', m.created_by,
        'invited_id', m.invited_id,
        'winner_id', m.winner_id
      )
      FROM public.matches m WHERE m.id = h.ref_id
    )
    WHEN h.kind = 'chat' THEN (
      SELECT json_build_object(
        'id', msg.id,
        'room_id', msg.room_id,
        'content', LEFT(msg.content, 100)
      )
      FROM public.messages msg WHERE msg.id = h.ref_id
    )
    WHEN h.kind = 'xp' THEN (
      SELECT json_build_object(
        'id', x.id,
        'domain', x.domain,
        'delta', x.delta,
        'reason', x.reason
      )
      FROM public.xp_logs x WHERE x.id = h.ref_id
    )
  END as details
FROM public.history h;

-- ============================================================================
-- 4) MATCH COMPLETION TRIGGERS
-- ============================================================================

-- Function: Auto-award XP on match completion
CREATE OR REPLACE FUNCTION public.fn_match_complete_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger when status changes to 'finished'
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    -- Award XP to winner (50 XP)
    IF NEW.winner_id IS NOT NULL THEN
      PERFORM public.fn_add_xp(
        NEW.winner_id,
        'combat',
        50,
        'Won 1v1 match #' || NEW.id
      );
    END IF;

    -- Award participation XP to both players (10 XP)
    PERFORM public.fn_add_xp(
      NEW.created_by,
      'combat',
      10,
      'Completed 1v1 match #' || NEW.id
    );

    IF NEW.invited_id != NEW.created_by THEN
      PERFORM public.fn_add_xp(
        NEW.invited_id,
        'combat',
        10,
        'Completed 1v1 match #' || NEW.id
      );
    END IF;

    -- Write history for both players
    PERFORM public.fn_write_history(NEW.created_by, 'match', NEW.id);
    IF NEW.invited_id != NEW.created_by THEN
      PERFORM public.fn_write_history(NEW.invited_id, 'match', NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: Award XP on match completion
DROP TRIGGER IF EXISTS trg_match_complete_xp ON public.matches;
CREATE TRIGGER trg_match_complete_xp
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_match_complete_xp();

-- ============================================================================
-- 5) STATISTICS VIEWS
-- ============================================================================

-- View: User statistics summary
CREATE OR REPLACE VIEW public.v_user_stats AS
SELECT 
  p.id as user_id,
  p.username,
  p.level,
  -- Match stats
  COUNT(DISTINCT CASE WHEN m.status = 'finished' THEN m.id END) as total_matches,
  COUNT(DISTINCT CASE WHEN m.winner_id = p.id THEN m.id END) as wins,
  COUNT(DISTINCT CASE WHEN m.status = 'finished' AND m.winner_id IS NOT NULL AND m.winner_id != p.id THEN m.id END) as losses,
  COUNT(DISTINCT CASE WHEN m.status = 'finished' AND m.winner_id IS NULL THEN m.id END) as draws,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN m.status = 'finished' THEN m.id END) > 0 
    THEN ROUND(
      (COUNT(DISTINCT CASE WHEN m.winner_id = p.id THEN m.id END)::numeric / 
       COUNT(DISTINCT CASE WHEN m.status = 'finished' THEN m.id END)::numeric) * 100, 
      1
    )
    ELSE 0
  END as win_rate,
  -- XP stats
  COALESCE(SUM(x.delta), 0) as total_xp,
  -- Skill stats
  COUNT(DISTINCT us.skill_id) as skills_count,
  COALESCE(AVG(us.level), 0) as avg_skill_level,
  -- Activity
  MAX(GREATEST(
    COALESCE(m.created_at, '1970-01-01'::timestamptz),
    COALESCE(x.created_at, '1970-01-01'::timestamptz),
    COALESCE(us.last_updated, '1970-01-01'::timestamptz)
  )) as last_activity
FROM public.profiles p
LEFT JOIN public.matches m ON (m.created_by = p.id OR m.invited_id = p.id)
LEFT JOIN public.xp_logs x ON x.user_id = p.id
LEFT JOIN public.user_skills us ON us.user_id = p.id
GROUP BY p.id, p.username, p.level;

-- ============================================================================
-- 6) GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.fn_add_xp TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_set_skill_level TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_write_history TO authenticated;

-- Grant select on views to authenticated users
GRANT SELECT ON public.v_user_xp_totals TO authenticated;
GRANT SELECT ON public.v_user_skills_detailed TO authenticated;
GRANT SELECT ON public.v_user_history_detailed TO authenticated;
GRANT SELECT ON public.v_user_stats TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
