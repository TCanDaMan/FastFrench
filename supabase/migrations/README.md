# FastFrench Supabase Migrations

This directory contains SQL migration files for the FastFrench database schema.

## Migration Files

### 001_initial_schema.sql
Creates the complete database schema including:
- **Custom Types**: `user_rank`, `phrase_category`, `challenge_type`, `requirement_type`
- **Tables**:
  - `profiles` - User profiles with gamification stats
  - `vocabulary` - User vocabulary with spaced repetition (SM-2 algorithm)
  - `phrases` - Shared phrase library
  - `user_phrase_progress` - User progress on phrases
  - `achievements` - Achievement definitions
  - `user_achievements` - Earned achievements
  - `daily_progress` - Daily statistics tracking
  - `challenges` - Daily/weekly challenges
  - `user_challenges` - User challenge progress
- **Indexes**: Optimized for common queries
- **Triggers**: Auto-update `updated_at` timestamps

### 002_rls_policies.sql
Implements Row Level Security (RLS) policies:
- Users can only access their own data
- Shared resources (phrases, achievements, challenges) are publicly readable
- Profile visibility for leaderboards and social features
- Secure data isolation between users

### 003_functions.sql
Core database functions:
- `calculate_level_from_xp(xp)` - Converts XP to level (1-50)
- `calculate_rank_from_level(level)` - Determines rank from level
- `add_user_xp(user_id, xp_amount)` - Adds XP and updates level/rank
- `update_user_streak(user_id)` - Manages daily streaks with freeze support
- `check_and_award_achievements(user_id)` - Automatically awards achievements
- `update_vocabulary_review(vocabulary_id, quality)` - SM-2 spaced repetition
- `record_daily_progress(...)` - Records daily stats
- `get_due_vocabulary(user_id, limit)` - Retrieves words due for review
- `get_user_stats(user_id)` - Comprehensive user statistics

### 004_seed_achievements.sql
Seeds 60+ achievements across categories:
- **Beginner** (Levels 1-10): First steps, early milestones
- **Streaks**: 3, 7, 14, 30, 100-day achievements
- **Intermediate** (Levels 10-30): Vocabulary, phrases, reviews
- **Advanced** (Levels 30-50): Ultimate XP, time investment
- **Special**: Paris landmarks, time-based, social achievements

### 005_seed_phrases.sql
Seeds 60+ essential Paris travel phrases:
- **Greetings** (13 phrases): Basic politeness and greetings
- **Social** (9 phrases): Conversation essentials
- **Restaurant** (8 phrases): Dining out
- **Directions** (5 phrases): Finding your way
- **Transportation** (5 phrases): Metro, trains, airports
- **Shopping** (5 phrases): Buying items
- **Accommodation** (4 phrases): Hotel interactions
- **Emergencies** (4 phrases): Getting help
- **Numbers/Time** (5 phrases): Essential counting and time

All phrases include:
- French text
- English translation
- IPA phonetic pronunciation
- Category classification
- Difficulty rating (1-5)
- Usage context tips

## How to Apply Migrations

### Using Supabase CLI

1. **Link your project** (first time only):
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. **Apply all migrations**:
   ```bash
   supabase db push
   ```

3. **Or apply migrations individually**:
   ```bash
   supabase db push --file supabase/migrations/001_initial_schema.sql
   supabase db push --file supabase/migrations/002_rls_policies.sql
   # ... etc
   ```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file in order
4. Execute each one

### Local Development

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Or run individual migrations
psql -h localhost -p 54322 -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

## Database Schema Overview

### User Flow
1. User signs up → `profiles` record created
2. User learns words → `vocabulary` entries created with SM-2 data
3. User practices phrases → `user_phrase_progress` tracked
4. Daily activity → `daily_progress` recorded
5. Achievements earned → `user_achievements` awarded
6. XP gained → Level/rank updated automatically

### Gamification System

**XP to Level Calculation**:
- Formula: `level = floor(sqrt(xp / 100)) + 1`
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- Level 50: 240,100+ XP

**Ranks**:
- Débutant (Beginner): Levels 1-9
- Touriste (Tourist): Levels 10-19
- Voyageur (Traveler): Levels 20-29
- Parisien (Parisian): Levels 30-39
- Maître (Master): Levels 40-50

**Streaks**:
- Updated daily on practice
- Streak freeze earned every 7 days
- One day grace period with freeze
- Tracks current and longest streak

### Spaced Repetition (SM-2)

The vocabulary system uses the SuperMemo SM-2 algorithm:
- `easiness_factor`: How easy the word is (1.3-2.5+)
- `interval`: Days until next review
- `repetitions`: Number of successful reviews
- Quality rating 0-5 affects scheduling
- Words marked as "mastered" after 5+ successful reviews

## Example Usage

### Create a user profile
```sql
INSERT INTO profiles (id, display_name, daily_xp_goal)
VALUES (auth.uid(), 'Jean Dupont', 20);
```

### Add vocabulary
```sql
INSERT INTO vocabulary (user_id, french_word, english_translation, category)
VALUES (auth.uid(), 'Bonjour', 'Hello', 'greetings');
```

### Award XP
```sql
SELECT * FROM add_user_xp(auth.uid(), 50);
```

### Update streak
```sql
SELECT * FROM update_user_streak(auth.uid());
```

### Check achievements
```sql
SELECT * FROM check_and_award_achievements(auth.uid());
```

### Get words due for review
```sql
SELECT * FROM get_due_vocabulary(auth.uid(), 20);
```

### Review a word
```sql
SELECT update_vocabulary_review(
  'vocabulary-uuid',
  4  -- Quality: 0-5
);
```

## Performance Considerations

All tables include strategic indexes for:
- User lookups
- Date-based queries
- Category filtering
- Review scheduling
- Progress tracking

## Security

- RLS enabled on all tables
- User data isolated per `auth.uid()`
- Shared resources (phrases, achievements) publicly readable
- Authenticated-only insert on shared resources

## Future Enhancements

Consider adding:
- Social features (friends, leaderboards)
- Custom user-generated content
- Audio file storage
- Progress sharing
- Competition/multiplayer modes
- Advanced analytics tables
