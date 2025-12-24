-- FastFrench Initial Schema Migration
-- Creates all core tables for the French learning app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User rank enum
CREATE TYPE user_rank AS ENUM (
  'debutant',
  'touriste',
  'voyageur',
  'parisien',
  'maitre'
);

-- Phrase category enum
CREATE TYPE phrase_category AS ENUM (
  'greetings',
  'restaurant',
  'directions',
  'shopping',
  'transportation',
  'accommodation',
  'emergencies',
  'social',
  'numbers',
  'time',
  'weather',
  'culture'
);

-- Challenge type enum
CREATE TYPE challenge_type AS ENUM (
  'daily',
  'weekly'
);

-- Requirement type enum
CREATE TYPE requirement_type AS ENUM (
  'xp_earned',
  'words_learned',
  'words_reviewed',
  'phrases_practiced',
  'streak_days',
  'practice_sessions',
  'perfect_lessons',
  'time_spent_minutes'
);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 50),
  current_rank user_rank NOT NULL DEFAULT 'debutant',
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  streak_freeze_available BOOLEAN NOT NULL DEFAULT false,
  last_practice_date DATE,
  daily_xp_goal INTEGER NOT NULL DEFAULT 20 CHECK (daily_xp_goal IN (10, 20, 50)),
  paris_trip_date DATE,
  preferred_difficulty INTEGER DEFAULT 3 CHECK (preferred_difficulty >= 1 AND preferred_difficulty <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_profiles_id ON profiles(id);
CREATE INDEX idx_profiles_current_rank ON profiles(current_rank);

-- ============================================================================
-- VOCABULARY TABLE
-- ============================================================================
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  french_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  phonetic TEXT, -- IPA pronunciation
  category phrase_category NOT NULL,
  example_sentence TEXT,

  -- Spaced repetition (SM-2 algorithm)
  next_review_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  easiness_factor DECIMAL(3,2) NOT NULL DEFAULT 2.5 CHECK (easiness_factor >= 1.3),
  repetitions INTEGER NOT NULL DEFAULT 0 CHECK (repetitions >= 0),
  interval INTEGER NOT NULL DEFAULT 0 CHECK (interval >= 0),

  -- Progress tracking
  times_correct INTEGER NOT NULL DEFAULT 0 CHECK (times_correct >= 0),
  times_incorrect INTEGER NOT NULL DEFAULT 0 CHECK (times_incorrect >= 0),
  mastered BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, french_word)
);

-- Indexes for vocabulary queries
CREATE INDEX idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX idx_vocabulary_next_review ON vocabulary(user_id, next_review_date) WHERE NOT mastered;
CREATE INDEX idx_vocabulary_category ON vocabulary(category);
CREATE INDEX idx_vocabulary_mastered ON vocabulary(user_id, mastered);

-- ============================================================================
-- PHRASES TABLE (Shared library)
-- ============================================================================
CREATE TABLE phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  french_phrase TEXT NOT NULL UNIQUE,
  english_translation TEXT NOT NULL,
  phonetic TEXT,
  category phrase_category NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
  usage_context TEXT,
  audio_url TEXT, -- For TTS caching
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for phrase queries
CREATE INDEX idx_phrases_category ON phrases(category);
CREATE INDEX idx_phrases_difficulty ON phrases(difficulty);
CREATE INDEX idx_phrases_category_difficulty ON phrases(category, difficulty);

-- ============================================================================
-- USER PHRASE PROGRESS TABLE
-- ============================================================================
CREATE TABLE user_phrase_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phrase_id UUID NOT NULL REFERENCES phrases(id) ON DELETE CASCADE,
  practiced_count INTEGER NOT NULL DEFAULT 0 CHECK (practiced_count >= 0),
  last_practiced TIMESTAMPTZ,
  comfort_level INTEGER DEFAULT 1 CHECK (comfort_level >= 1 AND comfort_level <= 5),

  UNIQUE(user_id, phrase_id)
);

-- Indexes for user phrase progress
CREATE INDEX idx_user_phrase_progress_user_id ON user_phrase_progress(user_id);
CREATE INDEX idx_user_phrase_progress_phrase_id ON user_phrase_progress(phrase_id);
CREATE INDEX idx_user_phrase_progress_comfort ON user_phrase_progress(user_id, comfort_level);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  requirement_type requirement_type NOT NULL,
  requirement_value INTEGER NOT NULL CHECK (requirement_value > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for achievement lookups
CREATE INDEX idx_achievements_requirement ON achievements(requirement_type);

-- ============================================================================
-- USER ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- Indexes for user achievements
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(user_id, earned_at DESC);

-- ============================================================================
-- DAILY PROGRESS TABLE
-- ============================================================================
CREATE TABLE daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
  words_learned INTEGER NOT NULL DEFAULT 0 CHECK (words_learned >= 0),
  words_reviewed INTEGER NOT NULL DEFAULT 0 CHECK (words_reviewed >= 0),
  phrases_practiced INTEGER NOT NULL DEFAULT 0 CHECK (phrases_practiced >= 0),
  time_spent_minutes INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- Indexes for daily progress queries
CREATE INDEX idx_daily_progress_user_date ON daily_progress(user_id, date DESC);
CREATE INDEX idx_daily_progress_user_id ON daily_progress(user_id);

-- ============================================================================
-- CHALLENGES TABLE
-- ============================================================================
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_type challenge_type NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  requirement_type requirement_type NOT NULL,
  requirement_value INTEGER NOT NULL CHECK (requirement_value > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (end_date >= start_date)
);

-- Indexes for challenge queries
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenges_type ON challenges(challenge_type);

-- ============================================================================
-- USER CHALLENGES TABLE
-- ============================================================================
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,

  UNIQUE(user_id, challenge_id)
);

-- Indexes for user challenges
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_completed ON user_challenges(user_id, completed);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON vocabulary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE profiles IS 'User profiles with gamification stats';
COMMENT ON TABLE vocabulary IS 'User-specific vocabulary with spaced repetition data';
COMMENT ON TABLE phrases IS 'Shared phrase library for all users';
COMMENT ON TABLE user_phrase_progress IS 'User progress on shared phrases';
COMMENT ON TABLE achievements IS 'Achievement definitions';
COMMENT ON TABLE user_achievements IS 'Earned achievements per user';
COMMENT ON TABLE daily_progress IS 'Daily statistics for progress tracking';
COMMENT ON TABLE challenges IS 'Daily and weekly challenges';
COMMENT ON TABLE user_challenges IS 'User progress on challenges';
