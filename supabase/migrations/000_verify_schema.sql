-- FastFrench Schema Verification Script
-- Run this after applying migrations to verify everything is set up correctly

\echo '================================'
\echo 'FastFrench Schema Verification'
\echo '================================'

-- Check all tables exist
\echo '\n1. Checking Tables...'
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'vocabulary',
    'phrases',
    'user_phrase_progress',
    'achievements',
    'user_achievements',
    'daily_progress',
    'challenges',
    'user_challenges'
  )
ORDER BY tablename;

-- Check all custom types exist
\echo '\n2. Checking Custom Types...'
SELECT
  typname,
  typtype,
  typowner::regrole
FROM pg_type
WHERE typname IN (
  'user_rank',
  'phrase_category',
  'challenge_type',
  'requirement_type'
)
ORDER BY typname;

-- Check all functions exist
\echo '\n3. Checking Functions...'
SELECT
  proname as function_name,
  pg_get_function_arguments(oid) as arguments,
  pg_get_functiondef(oid) IS NOT NULL as has_definition
FROM pg_proc
WHERE proname IN (
  'calculate_level_from_xp',
  'calculate_rank_from_level',
  'add_user_xp',
  'update_user_streak',
  'check_and_award_achievements',
  'update_vocabulary_review',
  'record_daily_progress',
  'get_due_vocabulary',
  'get_user_stats',
  'update_updated_at_column'
)
ORDER BY proname;

-- Check RLS is enabled
\echo '\n4. Checking Row Level Security...'
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'vocabulary',
    'phrases',
    'user_phrase_progress',
    'achievements',
    'user_achievements',
    'daily_progress',
    'challenges',
    'user_challenges'
  )
ORDER BY tablename;

-- Count RLS policies
\echo '\n5. Checking RLS Policies...'
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Check indexes
\echo '\n6. Checking Indexes...'
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'vocabulary',
    'phrases',
    'user_phrase_progress',
    'achievements',
    'user_achievements',
    'daily_progress',
    'challenges',
    'user_challenges'
  )
ORDER BY tablename, indexname;

-- Check triggers
\echo '\n7. Checking Triggers...'
SELECT
  event_object_table as table_name,
  trigger_name,
  event_manipulation as trigger_event,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN (
    'profiles',
    'vocabulary'
  )
ORDER BY event_object_table, trigger_name;

-- Check seeded data counts
\echo '\n8. Checking Seeded Data...'
SELECT 'achievements' as table_name, COUNT(*) as row_count FROM achievements
UNION ALL
SELECT 'phrases', COUNT(*) FROM phrases
ORDER BY table_name;

-- Check achievement breakdown
\echo '\n9. Achievement Breakdown by Type...'
SELECT
  requirement_type,
  COUNT(*) as count,
  SUM(xp_reward) as total_xp_rewards
FROM achievements
GROUP BY requirement_type
ORDER BY count DESC;

-- Check phrase breakdown
\echo '\n10. Phrase Breakdown by Category...'
SELECT
  category,
  COUNT(*) as count,
  AVG(difficulty)::numeric(3,2) as avg_difficulty
FROM phrases
GROUP BY category
ORDER BY count DESC;

-- Test level calculation
\echo '\n11. Testing Level Calculation...'
SELECT
  xp,
  calculate_level_from_xp(xp) as level,
  calculate_rank_from_level(calculate_level_from_xp(xp)) as rank
FROM (
  VALUES
    (0),
    (100),
    (500),
    (1000),
    (5000),
    (10000),
    (25000),
    (50000),
    (100000),
    (240100)
) AS t(xp);

-- Check foreign key constraints
\echo '\n12. Foreign Key Constraints...'
SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  confrelid::regclass AS references_table
FROM pg_constraint
WHERE contype = 'f'
  AND connamespace = 'public'::regnamespace
ORDER BY table_name, constraint_name;

-- Summary
\echo '\n================================'
\echo 'Verification Complete!'
\echo '================================'
\echo '\nExpected counts:'
\echo '  - Tables: 9'
\echo '  - Custom Types: 4'
\echo '  - Functions: 10'
\echo '  - RLS Policies: 30+'
\echo '  - Achievements: 60+'
\echo '  - Phrases: 60+'
\echo '\nIf all checks pass, your database is ready!'
\echo '================================'
