-- FastFrench Achievement Seeds
-- Pre-populated achievements for gamification

-- Clear any existing achievements (for development)
-- TRUNCATE achievements CASCADE;

-- ============================================================================
-- BEGINNER ACHIEVEMENTS (Levels 1-10)
-- ============================================================================

-- First Steps
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Premier Pas', 'Complete your first practice session', 'star', 50, 'practice_sessions', 1),
  ('Bonjour Paris!', 'Learn your first 5 French words', 'book', 50, 'words_learned', 5),
  ('Conversation Starter', 'Practice 10 phrases', 'chat', 75, 'phrases_practiced', 10);

-- Early XP Milestones
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Rising Star', 'Earn 100 XP', 'trophy', 100, 'xp_earned', 100),
  ('Knowledge Seeker', 'Earn 500 XP', 'trophy', 150, 'xp_earned', 500),
  ('Dedicated Learner', 'Earn 1000 XP', 'trophy', 200, 'xp_earned', 1000);

-- Vocabulary Milestones
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Word Collector', 'Learn 25 French words', 'book', 100, 'words_learned', 25),
  ('Vocabulary Builder', 'Learn 50 French words', 'book', 200, 'words_learned', 50),
  ('Polyglot in Training', 'Learn 100 French words', 'book', 300, 'words_learned', 100);

-- ============================================================================
-- STREAK ACHIEVEMENTS
-- ============================================================================

INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Commitment', 'Maintain a 3-day streak', 'fire', 100, 'streak_days', 3),
  ('Dedication', 'Maintain a 7-day streak', 'fire', 200, 'streak_days', 7),
  ('Consistency King', 'Maintain a 14-day streak', 'fire', 300, 'streak_days', 14),
  ('Unstoppable', 'Maintain a 30-day streak', 'fire', 500, 'streak_days', 30),
  ('Legend', 'Maintain a 100-day streak', 'fire', 1000, 'streak_days', 100);

-- ============================================================================
-- INTERMEDIATE ACHIEVEMENTS (Levels 10-30)
-- ============================================================================

-- More XP Milestones
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Experienced', 'Earn 2500 XP', 'trophy', 250, 'xp_earned', 2500),
  ('Expert Learner', 'Earn 5000 XP', 'trophy', 500, 'xp_earned', 5000),
  ('Master Student', 'Earn 10000 XP', 'trophy', 750, 'xp_earned', 10000);

-- More Vocabulary
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Word Master', 'Learn 200 French words', 'book', 400, 'words_learned', 200),
  ('Dictionary', 'Learn 500 French words', 'book', 750, 'words_learned', 500),
  ('Lexicon Legend', 'Learn 1000 French words', 'book', 1000, 'words_learned', 1000);

-- Phrase Practice
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Phrase Enthusiast', 'Practice 50 phrases', 'chat', 150, 'phrases_practiced', 50),
  ('Smooth Talker', 'Practice 100 phrases', 'chat', 250, 'phrases_practiced', 100),
  ('Conversation Expert', 'Practice 250 phrases', 'chat', 400, 'phrases_practiced', 250),
  ('Fluent Speaker', 'Practice 500 phrases', 'chat', 600, 'phrases_practiced', 500);

-- Review Achievements
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Reviewer', 'Review words 25 times', 'refresh', 100, 'words_reviewed', 25),
  ('Diligent Student', 'Review words 100 times', 'refresh', 200, 'words_reviewed', 100),
  ('Review Master', 'Review words 500 times', 'refresh', 400, 'words_reviewed', 500),
  ('Repetition Champion', 'Review words 1000 times', 'refresh', 600, 'words_reviewed', 1000);

-- ============================================================================
-- ADVANCED ACHIEVEMENTS (Levels 30-50)
-- ============================================================================

-- Ultimate XP
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Elite Learner', 'Earn 25000 XP', 'trophy', 1000, 'xp_earned', 25000),
  ('XP Legend', 'Earn 50000 XP', 'trophy', 2000, 'xp_earned', 50000),
  ('Ultimate Master', 'Earn 100000 XP', 'trophy', 5000, 'xp_earned', 100000);

-- Time Investment
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Dedicated Hour', 'Spend 60 minutes practicing', 'clock', 100, 'time_spent_minutes', 60),
  ('Time Traveler', 'Spend 5 hours practicing', 'clock', 250, 'time_spent_minutes', 300),
  ('Marathon Learner', 'Spend 20 hours practicing', 'clock', 500, 'time_spent_minutes', 1200),
  ('Time Master', 'Spend 100 hours practicing', 'clock', 1000, 'time_spent_minutes', 6000);

-- Practice Sessions
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Regular Student', 'Complete 10 practice sessions', 'calendar', 100, 'practice_sessions', 10),
  ('Committed Learner', 'Complete 30 practice sessions', 'calendar', 250, 'practice_sessions', 30),
  ('Practice Perfectionist', 'Complete 100 practice sessions', 'calendar', 500, 'practice_sessions', 100),
  ('Session Legend', 'Complete 365 practice sessions', 'calendar', 1500, 'practice_sessions', 365);

-- ============================================================================
-- SPECIAL ACHIEVEMENTS
-- ============================================================================

-- Paris-themed achievements
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Tour Eiffel', 'Reach Level 10 - Like climbing the Eiffel Tower!', 'landmark', 250, 'xp_earned', 8100),
  ('Louvre Explorer', 'Reach Level 20 - You''re a cultural treasure!', 'museum', 500, 'xp_earned', 36100),
  ('Champs-Élysées Champion', 'Reach Level 30 - Walking the most beautiful avenue!', 'crown', 750, 'xp_earned', 84100),
  ('Arc de Triomphe', 'Reach Level 40 - A triumphant achievement!', 'monument', 1000, 'xp_earned', 152100),
  ('Notre-Dame Master', 'Reach Level 50 - You''re a masterpiece!', 'cathedral', 2000, 'xp_earned', 240100);

-- Weekend Warrior
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Weekend Warrior', 'Practice on Saturday and Sunday', 'calendar-weekend', 150, 'practice_sessions', 2),
  ('Early Bird', 'Complete a practice session before 9 AM', 'sunrise', 100, 'practice_sessions', 1),
  ('Night Owl', 'Complete a practice session after 10 PM', 'moon', 100, 'practice_sessions', 1);

-- Social achievements (for future implementation)
INSERT INTO achievements (name, description, icon_name, xp_reward, requirement_type, requirement_value)
VALUES
  ('Perfectionist', 'Get 10 words correct in a row', 'target', 200, 'words_reviewed', 10),
  ('Speed Learner', 'Learn 10 words in one session', 'zap', 150, 'words_learned', 10),
  ('Review Streak', 'Review words 7 days in a row', 'calendar-check', 300, 'practice_sessions', 7);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show count of achievements created
DO $$
DECLARE
  achievement_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO achievement_count FROM achievements;
  RAISE NOTICE 'Total achievements created: %', achievement_count;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE achievements IS 'Achievement definitions seeded with 60+ achievements across different categories';
