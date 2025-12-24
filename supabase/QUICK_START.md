# FastFrench Database Quick Start Guide

## Setup (One-Time)

### 1. Apply Migrations

```bash
# Using Supabase CLI
cd /mnt/c/Users/Tyler/Vibe\ Coding/FastFrench
supabase db push

# Or manually in Supabase Dashboard SQL Editor
# Copy/paste each file in order: 001, 002, 003, 004, 005
```

### 2. Verify Installation

```bash
# Run verification script
psql -h your-host -U postgres -d postgres -f supabase/migrations/000_verify_schema.sql
```

## Common Operations

### User Management

#### Create Profile (on signup)
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: user.id, // from auth.users
    display_name: 'Jean Dupont',
    daily_xp_goal: 20,
    paris_trip_date: '2025-06-15' // optional
  });
```

#### Get User Profile
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

### XP and Leveling

#### Award XP
```typescript
const { data } = await supabase
  .rpc('add_user_xp', {
    p_user_id: user.id,
    p_xp_amount: 50
  });

// Returns: { new_xp, new_level, new_rank, level_up, rank_up }
if (data[0].level_up) {
  // Show level up animation!
}
```

### Streaks

#### Update Streak (call daily on first practice)
```typescript
const { data } = await supabase
  .rpc('update_user_streak', {
    p_user_id: user.id
  });

// Returns: { current_streak, longest_streak, streak_broken }
if (data[0].streak_broken) {
  // Show streak broken message
}
```

### Vocabulary

#### Add New Word
```typescript
const { data, error } = await supabase
  .from('vocabulary')
  .insert({
    user_id: user.id,
    french_word: 'Bonjour',
    english_translation: 'Hello',
    phonetic: 'bɔ̃.ʒuʁ',
    category: 'greetings',
    example_sentence: 'Bonjour, comment allez-vous?'
  });
```

#### Get Words Due for Review
```typescript
const { data: dueWords } = await supabase
  .rpc('get_due_vocabulary', {
    p_user_id: user.id,
    p_limit: 20
  });
```

#### Review a Word (SM-2 Algorithm)
```typescript
// quality: 0-5 (0=total forget, 5=perfect recall)
await supabase.rpc('update_vocabulary_review', {
  p_vocabulary_id: wordId,
  p_quality: 4
});
```

### Phrases

#### Get Phrases by Category
```typescript
const { data: phrases } = await supabase
  .from('phrases')
  .select('*')
  .eq('category', 'restaurant')
  .lte('difficulty', userDifficultyLevel)
  .order('difficulty');
```

#### Track Phrase Practice
```typescript
const { data, error } = await supabase
  .from('user_phrase_progress')
  .upsert({
    user_id: user.id,
    phrase_id: phraseId,
    practiced_count: 1,
    last_practiced: new Date().toISOString(),
    comfort_level: 3
  })
  .select();
```

### Achievements

#### Check and Award Achievements
```typescript
const { data: newAchievements } = await supabase
  .rpc('check_and_award_achievements', {
    p_user_id: user.id
  });

// Returns array of newly awarded achievements
if (newAchievements.length > 0) {
  // Show achievement popup!
  newAchievements.forEach(achievement => {
    console.log(`Unlocked: ${achievement.achievement_name} (+${achievement.xp_reward} XP)`);
  });
}
```

#### Get User Achievements
```typescript
const { data: achievements } = await supabase
  .from('user_achievements')
  .select(`
    *,
    achievement:achievements(*)
  `)
  .eq('user_id', user.id)
  .order('earned_at', { ascending: false });
```

### Daily Progress

#### Record Practice Session
```typescript
await supabase.rpc('record_daily_progress', {
  p_user_id: user.id,
  p_xp_earned: 50,
  p_words_learned: 5,
  p_words_reviewed: 10,
  p_phrases_practiced: 3,
  p_time_spent_minutes: 15
});
```

#### Get Progress History (for graphs)
```typescript
const { data: history } = await supabase
  .from('daily_progress')
  .select('*')
  .eq('user_id', user.id)
  .gte('date', thirtyDaysAgo)
  .order('date', { ascending: true });
```

### Statistics

#### Get User Stats
```typescript
const { data: stats } = await supabase
  .rpc('get_user_stats', {
    p_user_id: user.id
  });

// Returns:
// {
//   total_words,
//   mastered_words,
//   total_phrases_practiced,
//   total_achievements,
//   total_practice_days,
//   total_time_minutes,
//   avg_daily_xp
// }
```

## Complete Practice Flow Example

```typescript
async function completePracticeSession(userId: string) {
  // 1. Update streak
  const { data: streakData } = await supabase
    .rpc('update_user_streak', { p_user_id: userId });

  // 2. Award XP
  const xpEarned = 50;
  const { data: xpData } = await supabase
    .rpc('add_user_xp', {
      p_user_id: userId,
      p_xp_amount: xpEarned
    });

  // 3. Record daily progress
  await supabase.rpc('record_daily_progress', {
    p_user_id: userId,
    p_xp_earned: xpEarned,
    p_words_learned: 5,
    p_words_reviewed: 10,
    p_phrases_practiced: 3,
    p_time_spent_minutes: 15
  });

  // 4. Check achievements
  const { data: newAchievements } = await supabase
    .rpc('check_and_award_achievements', { p_user_id: userId });

  return {
    streak: streakData[0],
    levelUp: xpData[0].level_up,
    rankUp: xpData[0].rank_up,
    newLevel: xpData[0].new_level,
    newRank: xpData[0].new_rank,
    achievements: newAchievements
  };
}
```

## Database Enums Reference

### user_rank
- `debutant` (Levels 1-9)
- `touriste` (Levels 10-19)
- `voyageur` (Levels 20-29)
- `parisien` (Levels 30-39)
- `maitre` (Levels 40-50)

### phrase_category
- `greetings`
- `restaurant`
- `directions`
- `shopping`
- `transportation`
- `accommodation`
- `emergencies`
- `social`
- `numbers`
- `time`
- `weather`
- `culture`

### challenge_type
- `daily`
- `weekly`

### requirement_type
- `xp_earned`
- `words_learned`
- `words_reviewed`
- `phrases_practiced`
- `streak_days`
- `practice_sessions`
- `perfect_lessons`
- `time_spent_minutes`

## TypeScript Types (for type safety)

```typescript
export type UserRank = 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre';

export type PhraseCategory =
  | 'greetings'
  | 'restaurant'
  | 'directions'
  | 'shopping'
  | 'transportation'
  | 'accommodation'
  | 'emergencies'
  | 'social'
  | 'numbers'
  | 'time'
  | 'weather'
  | 'culture';

export interface Profile {
  id: string;
  display_name: string;
  current_level: number;
  current_rank: UserRank;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  streak_freeze_available: boolean;
  last_practice_date: string | null;
  daily_xp_goal: 10 | 20 | 50;
  paris_trip_date: string | null;
  preferred_difficulty: number;
  created_at: string;
  updated_at: string;
}

export interface Vocabulary {
  id: string;
  user_id: string;
  french_word: string;
  english_translation: string;
  phonetic: string | null;
  category: PhraseCategory;
  example_sentence: string | null;
  next_review_date: string;
  easiness_factor: number;
  repetitions: number;
  interval: number;
  times_correct: number;
  times_incorrect: number;
  mastered: boolean;
  created_at: string;
  updated_at: string;
}

export interface Phrase {
  id: string;
  french_phrase: string;
  english_translation: string;
  phonetic: string | null;
  category: PhraseCategory;
  difficulty: number;
  usage_context: string | null;
  audio_url: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}
```

## Performance Tips

1. **Use RPC functions** for complex operations (they're optimized)
2. **Batch operations** when possible
3. **Use select()** to only fetch needed columns
4. **Enable real-time subscriptions** for live updates
5. **Cache static data** (phrases, achievements)

## Troubleshooting

### Common Issues

**RLS Policy Errors**
```typescript
// Make sure user is authenticated
const { data: { user } } = await supabase.auth.getUser();
```

**Foreign Key Violations**
```typescript
// Always use auth.uid() for user_id
// Ensure references (phrase_id, achievement_id) exist
```

**Enum Type Errors**
```typescript
// Use exact enum values (case-sensitive)
// TypeScript types above help prevent this
```

## Next Steps

1. Implement frontend components
2. Add real-time subscriptions for live updates
3. Set up automated backups
4. Configure Edge Functions for complex operations
5. Add analytics tracking
6. Implement audio TTS integration
7. Build leaderboard system
8. Add social features

## Support

For database schema questions, refer to:
- `/supabase/migrations/README.md` - Detailed documentation
- `/supabase/migrations/000_verify_schema.sql` - Verification script
- Supabase docs: https://supabase.com/docs
