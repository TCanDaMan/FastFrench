-- FastFrench Database Functions
-- Core business logic for XP, levels, streaks, and achievements

-- ============================================================================
-- FUNCTION: Calculate level from XP
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER;
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100)) + 1
  -- This creates a nice progression curve
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- Level 4: 900-1599 XP
  -- etc.
  level := FLOOR(SQRT(xp / 100.0)) + 1;

  -- Cap at level 50
  IF level > 50 THEN
    level := 50;
  END IF;

  RETURN level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- FUNCTION: Calculate rank from level
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_rank_from_level(level INTEGER)
RETURNS user_rank AS $$
BEGIN
  CASE
    WHEN level >= 40 THEN RETURN 'maitre'::user_rank;
    WHEN level >= 30 THEN RETURN 'parisien'::user_rank;
    WHEN level >= 20 THEN RETURN 'voyageur'::user_rank;
    WHEN level >= 10 THEN RETURN 'touriste'::user_rank;
    ELSE RETURN 'debutant'::user_rank;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- FUNCTION: Add XP to user and update level/rank
-- ============================================================================
CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS TABLE(
  new_xp INTEGER,
  new_level INTEGER,
  new_rank user_rank,
  level_up BOOLEAN,
  rank_up BOOLEAN
) AS $$
DECLARE
  v_old_xp INTEGER;
  v_old_level INTEGER;
  v_old_rank user_rank;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_new_rank user_rank;
  v_level_up BOOLEAN;
  v_rank_up BOOLEAN;
BEGIN
  -- Get current stats
  SELECT total_xp, current_level, current_rank
  INTO v_old_xp, v_old_level, v_old_rank
  FROM profiles
  WHERE id = p_user_id;

  -- Calculate new values
  v_new_xp := v_old_xp + p_xp_amount;
  v_new_level := calculate_level_from_xp(v_new_xp);
  v_new_rank := calculate_rank_from_level(v_new_level);

  v_level_up := v_new_level > v_old_level;
  v_rank_up := v_new_rank != v_old_rank;

  -- Update profile
  UPDATE profiles
  SET
    total_xp = v_new_xp,
    current_level = v_new_level,
    current_rank = v_new_rank,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Return results
  RETURN QUERY SELECT
    v_new_xp,
    v_new_level,
    v_new_rank,
    v_level_up,
    v_rank_up;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Update user streak
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS TABLE(
  current_streak INTEGER,
  longest_streak INTEGER,
  streak_broken BOOLEAN
) AS $$
DECLARE
  v_last_practice DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_streak_freeze BOOLEAN;
  v_streak_broken BOOLEAN := false;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- Get current streak data
  SELECT last_practice_date, profiles.current_streak, profiles.longest_streak, streak_freeze_available
  INTO v_last_practice, v_current_streak, v_longest_streak, v_streak_freeze
  FROM profiles
  WHERE id = p_user_id;

  -- If practicing today, no change needed
  IF v_last_practice = v_today THEN
    RETURN QUERY SELECT v_current_streak, v_longest_streak, false;
    RETURN;
  END IF;

  -- If last practice was yesterday, increment streak
  IF v_last_practice = v_yesterday THEN
    v_current_streak := v_current_streak + 1;

    -- Update longest streak if necessary
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;

  -- If last practice was before yesterday
  ELSIF v_last_practice < v_yesterday THEN
    -- Check if streak freeze is available
    IF v_streak_freeze AND v_last_practice = v_yesterday - INTERVAL '1 day' THEN
      -- Use streak freeze (one day grace period)
      v_streak_freeze := false;
      v_current_streak := v_current_streak + 1;

      IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
      END IF;
    ELSE
      -- Streak is broken, reset to 1
      v_current_streak := 1;
      v_streak_broken := true;
    END IF;

  -- First time practicing
  ELSIF v_last_practice IS NULL THEN
    v_current_streak := 1;
    IF v_longest_streak = 0 THEN
      v_longest_streak := 1;
    END IF;
  END IF;

  -- Award streak freeze every 7 days
  IF v_current_streak > 0 AND v_current_streak % 7 = 0 THEN
    v_streak_freeze := true;
  END IF;

  -- Update profile
  UPDATE profiles
  SET
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    streak_freeze_available = v_streak_freeze,
    last_practice_date = v_today,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_streak_broken;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Check and award achievements
-- ============================================================================
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS TABLE(
  achievement_id UUID,
  achievement_name TEXT,
  xp_reward INTEGER
) AS $$
DECLARE
  v_achievement RECORD;
  v_user_value INTEGER;
  v_already_earned BOOLEAN;
BEGIN
  -- Loop through all achievements
  FOR v_achievement IN
    SELECT a.id, a.name, a.requirement_type, a.requirement_value, a.xp_reward
    FROM achievements a
  LOOP
    -- Check if user already has this achievement
    SELECT EXISTS(
      SELECT 1 FROM user_achievements
      WHERE user_id = p_user_id AND user_achievements.achievement_id = v_achievement.id
    ) INTO v_already_earned;

    -- Skip if already earned
    CONTINUE WHEN v_already_earned;

    -- Get user's current value for this requirement type
    CASE v_achievement.requirement_type
      WHEN 'xp_earned' THEN
        SELECT total_xp INTO v_user_value FROM profiles WHERE id = p_user_id;

      WHEN 'streak_days' THEN
        SELECT current_streak INTO v_user_value FROM profiles WHERE id = p_user_id;

      WHEN 'words_learned' THEN
        SELECT COUNT(*)::INTEGER INTO v_user_value
        FROM vocabulary WHERE user_id = p_user_id;

      WHEN 'words_reviewed' THEN
        SELECT COALESCE(SUM(times_correct + times_incorrect), 0)::INTEGER INTO v_user_value
        FROM vocabulary WHERE user_id = p_user_id;

      WHEN 'phrases_practiced' THEN
        SELECT COALESCE(SUM(practiced_count), 0)::INTEGER INTO v_user_value
        FROM user_phrase_progress WHERE user_id = p_user_id;

      WHEN 'practice_sessions' THEN
        SELECT COUNT(DISTINCT date)::INTEGER INTO v_user_value
        FROM daily_progress WHERE user_id = p_user_id;

      WHEN 'time_spent_minutes' THEN
        SELECT COALESCE(SUM(time_spent_minutes), 0)::INTEGER INTO v_user_value
        FROM daily_progress WHERE user_id = p_user_id;

      ELSE
        v_user_value := 0;
    END CASE;

    -- Award achievement if requirement met
    IF v_user_value >= v_achievement.requirement_value THEN
      -- Insert achievement
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (p_user_id, v_achievement.id);

      -- Add XP reward
      PERFORM add_user_xp(p_user_id, v_achievement.xp_reward);

      -- Return this achievement
      RETURN QUERY SELECT
        v_achievement.id,
        v_achievement.name,
        v_achievement.xp_reward;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Update vocabulary using SM-2 spaced repetition
-- ============================================================================
CREATE OR REPLACE FUNCTION update_vocabulary_review(
  p_vocabulary_id UUID,
  p_quality INTEGER -- 0-5 rating (0=complete blackout, 5=perfect response)
)
RETURNS void AS $$
DECLARE
  v_vocab RECORD;
  v_new_easiness DECIMAL(3,2);
  v_new_repetitions INTEGER;
  v_new_interval INTEGER;
  v_new_review_date TIMESTAMPTZ;
BEGIN
  -- Get current vocabulary data
  SELECT * INTO v_vocab FROM vocabulary WHERE id = p_vocabulary_id;

  -- SM-2 Algorithm
  -- Update easiness factor
  v_new_easiness := v_vocab.easiness_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));

  -- Minimum easiness is 1.3
  IF v_new_easiness < 1.3 THEN
    v_new_easiness := 1.3;
  END IF;

  -- Update repetitions and interval
  IF p_quality < 3 THEN
    -- Incorrect response, reset repetitions
    v_new_repetitions := 0;
    v_new_interval := 1;
  ELSE
    -- Correct response
    IF v_vocab.repetitions = 0 THEN
      v_new_interval := 1;
    ELSIF v_vocab.repetitions = 1 THEN
      v_new_interval := 6;
    ELSE
      v_new_interval := ROUND(v_vocab.interval * v_new_easiness);
    END IF;

    v_new_repetitions := v_vocab.repetitions + 1;
  END IF;

  -- Calculate next review date
  v_new_review_date := NOW() + (v_new_interval || ' days')::INTERVAL;

  -- Update vocabulary
  UPDATE vocabulary
  SET
    easiness_factor = v_new_easiness,
    repetitions = v_new_repetitions,
    interval = v_new_interval,
    next_review_date = v_new_review_date,
    times_correct = CASE WHEN p_quality >= 3 THEN times_correct + 1 ELSE times_correct END,
    times_incorrect = CASE WHEN p_quality < 3 THEN times_incorrect + 1 ELSE times_incorrect END,
    mastered = CASE WHEN v_new_repetitions >= 5 AND v_new_easiness >= 2.5 THEN true ELSE false END,
    updated_at = NOW()
  WHERE id = p_vocabulary_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Record daily progress
-- ============================================================================
CREATE OR REPLACE FUNCTION record_daily_progress(
  p_user_id UUID,
  p_xp_earned INTEGER DEFAULT 0,
  p_words_learned INTEGER DEFAULT 0,
  p_words_reviewed INTEGER DEFAULT 0,
  p_phrases_practiced INTEGER DEFAULT 0,
  p_time_spent_minutes INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_progress (
    user_id,
    date,
    xp_earned,
    words_learned,
    words_reviewed,
    phrases_practiced,
    time_spent_minutes
  )
  VALUES (
    p_user_id,
    CURRENT_DATE,
    p_xp_earned,
    p_words_learned,
    p_words_reviewed,
    p_phrases_practiced,
    p_time_spent_minutes
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    xp_earned = daily_progress.xp_earned + EXCLUDED.xp_earned,
    words_learned = daily_progress.words_learned + EXCLUDED.words_learned,
    words_reviewed = daily_progress.words_reviewed + EXCLUDED.words_reviewed,
    phrases_practiced = daily_progress.phrases_practiced + EXCLUDED.phrases_practiced,
    time_spent_minutes = daily_progress.time_spent_minutes + EXCLUDED.time_spent_minutes;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get words due for review
-- ============================================================================
CREATE OR REPLACE FUNCTION get_due_vocabulary(p_user_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  id UUID,
  french_word TEXT,
  english_translation TEXT,
  phonetic TEXT,
  category phrase_category,
  example_sentence TEXT,
  times_correct INTEGER,
  times_incorrect INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.french_word,
    v.english_translation,
    v.phonetic,
    v.category,
    v.example_sentence,
    v.times_correct,
    v.times_incorrect
  FROM vocabulary v
  WHERE v.user_id = p_user_id
    AND v.next_review_date <= NOW()
    AND NOT v.mastered
  ORDER BY v.next_review_date ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FUNCTION: Get user statistics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE(
  total_words INTEGER,
  mastered_words INTEGER,
  total_phrases_practiced INTEGER,
  total_achievements INTEGER,
  total_practice_days INTEGER,
  total_time_minutes INTEGER,
  avg_daily_xp NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM vocabulary WHERE user_id = p_user_id),
    (SELECT COUNT(*)::INTEGER FROM vocabulary WHERE user_id = p_user_id AND mastered = true),
    (SELECT COALESCE(SUM(practiced_count), 0)::INTEGER FROM user_phrase_progress WHERE user_id = p_user_id),
    (SELECT COUNT(*)::INTEGER FROM user_achievements WHERE user_id = p_user_id),
    (SELECT COUNT(*)::INTEGER FROM daily_progress WHERE user_id = p_user_id),
    (SELECT COALESCE(SUM(time_spent_minutes), 0)::INTEGER FROM daily_progress WHERE user_id = p_user_id),
    (SELECT COALESCE(AVG(xp_earned), 0)::NUMERIC(10,2) FROM daily_progress WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION add_user_xp IS 'Adds XP to user and automatically updates level and rank';
COMMENT ON FUNCTION update_user_streak IS 'Updates user streak based on practice activity';
COMMENT ON FUNCTION check_and_award_achievements IS 'Checks all achievements and awards any newly earned ones';
COMMENT ON FUNCTION update_vocabulary_review IS 'Updates vocabulary item using SM-2 spaced repetition algorithm';
COMMENT ON FUNCTION record_daily_progress IS 'Records or updates daily progress stats';
COMMENT ON FUNCTION get_due_vocabulary IS 'Returns vocabulary items due for review';
COMMENT ON FUNCTION get_user_stats IS 'Returns comprehensive user statistics';
