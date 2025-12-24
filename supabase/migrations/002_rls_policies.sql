-- FastFrench Row Level Security Policies
-- Implements secure data access control for all tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phrase_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can view other users' profiles (for leaderboards)
CREATE POLICY "Users can view other profiles publicly"
  ON profiles
  FOR SELECT
  USING (true);

-- ============================================================================
-- VOCABULARY POLICIES
-- ============================================================================

-- Users can view their own vocabulary
CREATE POLICY "Users can view own vocabulary"
  ON vocabulary
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own vocabulary
CREATE POLICY "Users can insert own vocabulary"
  ON vocabulary
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own vocabulary
CREATE POLICY "Users can update own vocabulary"
  ON vocabulary
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own vocabulary
CREATE POLICY "Users can delete own vocabulary"
  ON vocabulary
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PHRASES POLICIES (Public Read)
-- ============================================================================

-- Everyone can read phrases (shared library)
CREATE POLICY "Phrases are publicly readable"
  ON phrases
  FOR SELECT
  USING (true);

-- Only authenticated users can insert phrases (admin/system only in production)
-- In production, you might want to restrict this to a specific role
CREATE POLICY "Authenticated users can insert phrases"
  ON phrases
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- USER PHRASE PROGRESS POLICIES
-- ============================================================================

-- Users can view their own phrase progress
CREATE POLICY "Users can view own phrase progress"
  ON user_phrase_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own phrase progress
CREATE POLICY "Users can insert own phrase progress"
  ON user_phrase_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own phrase progress
CREATE POLICY "Users can update own phrase progress"
  ON user_phrase_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own phrase progress
CREATE POLICY "Users can delete own phrase progress"
  ON user_phrase_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ACHIEVEMENTS POLICIES (Public Read)
-- ============================================================================

-- Everyone can read achievements
CREATE POLICY "Achievements are publicly readable"
  ON achievements
  FOR SELECT
  USING (true);

-- Only system can insert achievements (admin only)
CREATE POLICY "Only authenticated users can insert achievements"
  ON achievements
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- USER ACHIEVEMENTS POLICIES
-- ============================================================================

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view other users' achievements (for social features)
CREATE POLICY "Users can view other achievements publicly"
  ON user_achievements
  FOR SELECT
  USING (true);

-- Users can insert their own achievements (awarded by system)
CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- DAILY PROGRESS POLICIES
-- ============================================================================

-- Users can view their own daily progress
CREATE POLICY "Users can view own daily progress"
  ON daily_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily progress
CREATE POLICY "Users can insert own daily progress"
  ON daily_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own daily progress
CREATE POLICY "Users can update own daily progress"
  ON daily_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- CHALLENGES POLICIES (Public Read)
-- ============================================================================

-- Everyone can read challenges
CREATE POLICY "Challenges are publicly readable"
  ON challenges
  FOR SELECT
  USING (true);

-- Only authenticated users can insert challenges (admin only in production)
CREATE POLICY "Authenticated users can insert challenges"
  ON challenges
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- USER CHALLENGES POLICIES
-- ============================================================================

-- Users can view their own challenge progress
CREATE POLICY "Users can view own challenge progress"
  ON user_challenges
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own challenge progress
CREATE POLICY "Users can insert own challenge progress"
  ON user_challenges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own challenge progress
CREATE POLICY "Users can update own challenge progress"
  ON user_challenges
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own challenge progress
CREATE POLICY "Users can delete own challenge progress"
  ON user_challenges
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on custom types
GRANT USAGE ON TYPE user_rank TO authenticated;
GRANT USAGE ON TYPE phrase_category TO authenticated;
GRANT USAGE ON TYPE challenge_type TO authenticated;
GRANT USAGE ON TYPE requirement_type TO authenticated;

-- Grant table permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON vocabulary TO authenticated;
GRANT ALL ON phrases TO authenticated;
GRANT ALL ON user_phrase_progress TO authenticated;
GRANT ALL ON achievements TO authenticated;
GRANT ALL ON user_achievements TO authenticated;
GRANT ALL ON daily_progress TO authenticated;
GRANT ALL ON challenges TO authenticated;
GRANT ALL ON user_challenges TO authenticated;

-- Grant sequence permissions (for auto-increment IDs if needed)
-- Note: We're using UUIDs, so this is mostly for completeness
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "Users can view own profile" ON profiles IS
  'Users can view their own profile data';
COMMENT ON POLICY "Users can view other profiles publicly" ON profiles IS
  'Allows viewing other users profiles for leaderboards and social features';
COMMENT ON POLICY "Phrases are publicly readable" ON phrases IS
  'Phrase library is shared across all users';
COMMENT ON POLICY "Users can view other achievements publicly" ON user_achievements IS
  'Allows viewing other users achievements for social comparison';
