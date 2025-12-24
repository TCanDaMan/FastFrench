# Flashcard System Quick Start

## Getting Started

### 1. Navigate to Practice Page

```bash
# The flashcard system is available at /practice
# Click "Practice" in the bottom navigation
```

### 2. Choose Your Practice Mode

**Review Due Words** (Recommended for daily practice)
- Reviews vocabulary that's due based on spaced repetition
- Shows number of words waiting for review
- Focuses on retention and reinforcement

**Learn New Words**
- Adds 10 new words to your learning queue
- Perfect for expanding vocabulary
- Words become due for review after initial learning

**Practice by Category**
- Focus on specific topics (e.g., Restaurant, Directions)
- Great for preparing for specific situations
- 10 categories with 100+ total words

### 3. Using Flashcards

#### Desktop
- **Click card** to flip between French and English
- **Press Space** to flip card
- **Left Arrow** = "Again" (didn't remember)
- **Right Arrow** = "Easy" (remembered perfectly)
- **Click speaker icon** for pronunciation

#### Mobile
- **Tap card** to flip
- **Swipe left** = "Again"
- **Swipe right** = "Easy"
- **Tap speaker** for audio

#### Rating Your Recall
Choose the rating that best matches your recall:

- **Again** (Red) - Didn't remember
  - Resets progress
  - Review again tomorrow
  - 0 XP

- **Hard** (Orange) - Remembered but struggled
  - Minimal progress
  - Review in 1 day
  - 10 XP

- **Good** (Green) - Remembered with slight hesitation
  - Normal progress
  - Review in 3-6 days
  - 10-15 XP

- **Easy** (Blue) - Perfect recall
  - Maximum progress
  - Review in 6+ days
  - 15-20 XP

### 4. Understanding the Card

**Front (French)**
- French word in large text
- IPA phonetic pronunciation
- Play audio button
- Category badge

**Back (English)**
- English translation
- Example sentence (if available)
- Category icon

### 5. Session Summary

After completing practice:
- **Words Reviewed**: Total cards in session
- **Accuracy**: Percentage of correct answers
- **XP Earned**: Experience points gained
- **Correct Answers**: Number marked as Hard/Good/Easy

## Daily Practice Routine

### Recommended Schedule

**Morning (10 min)**
- Review due words (15-20 cards)
- Focus on retention

**Evening (10 min)**
- Learn new words (10 cards)
- Review any failed cards from morning

### Tips for Success

1. **Be Honest with Ratings**
   - Don't mark "Easy" if you hesitated
   - The algorithm works best with accurate feedback

2. **Practice Daily**
   - Consistency builds retention
   - Even 5 minutes helps maintain streak

3. **Use Audio**
   - Listen to pronunciation
   - Repeat out loud for better retention

4. **Focus on Context**
   - Read example sentences
   - Visualize using the word in Paris

5. **Don't Overwhelm**
   - Start with 10 new words per day
   - Increase as comfortable

## Category Guide

### Essential Categories to Start

**1. Greetings & Basics** (20 words)
- Start here!
- Foundation for all interactions
- Examples: Bonjour, Merci, S'il vous plaît

**2. Restaurant & Food** (20 words)
- Critical for dining out
- Most used in Paris
- Examples: Menu, L'addition, Café

**3. Directions & Places** (15 words)
- Navigate the city
- Find attractions
- Examples: Où est, À gauche, À droite

### Specialized Categories

**Transportation** (10 words)
- Metro, bus, taxi vocabulary
- Essential for getting around

**Shopping** (15 words)
- Making purchases
- Asking prices

**Emergency** (10 words)
- Safety-critical phrases
- Low frequency but high importance

**Numbers & Time** (20 words)
- Telling time
- Counting, prices

## Browse & Manage Vocabulary

### Vocabulary List View

**Access**: Click "Browse" tab on Practice page

**Features**:
- Search across French and English
- Filter by category
- Sort by alphabetical, due date, or mastery
- See mastery progress for each word
- Add custom vocabulary

### Adding Custom Words

1. Click "Add Word" button
2. Fill in required fields:
   - French word
   - English translation
   - Phonetic pronunciation (IPA)
3. Select category
4. Add example sentence (optional)
5. Click "Add Word"

**Finding IPA Pronunciation**:
- Visit [Wiktionary](https://en.wiktionary.org)
- Search for French word
- Copy IPA from pronunciation section
- Example: "bonjour" → bɔ̃.ʒuʁ

## Understanding Progress

### Mastery Levels

- **0-25%**: New/Struggling
  - Just started learning
  - Frequent mistakes

- **25-50%**: Learning
  - Making progress
  - Still needs practice

- **50-75%**: Familiar
  - Good retention
  - Occasional mistakes

- **75-90%**: Proficient
  - Strong retention
  - Rare mistakes

- **90-100%**: Mastered
  - Consistent perfect recall
  - 5+ successful reviews
  - Long review intervals

### Review Intervals

The system automatically schedules reviews:

- **New words**: Review tomorrow
- **After 1st success**: Review in 1 day
- **After 2nd success**: Review in 6 days
- **After 3rd+ success**: Interval multiplies by easiness factor
- **After failure**: Reset to 1 day

## Troubleshooting

### Cards Not Appearing?

**No due words:**
- All caught up! Try learning new words
- Or practice by category

**No new words:**
- All 110 words already added
- Add custom vocabulary
- Focus on mastering existing words

### Progress Not Saving?

- Check browser localStorage is enabled
- Clear cache if issues persist
- Data syncs automatically to localStorage

### Audio Not Working?

- Ensure browser supports Web Speech API
- Check device volume
- Chrome and Safari have best support
- Firefox may require enabling in settings

## XP & Gamification

### Earning XP

**Base Rewards**:
- Correct answer: 10 XP
- Perfect recall (Easy): +5 XP bonus
- First-time correct: +10 XP bonus
- Difficult word (low EF): +5 XP bonus

**Maximum**: 30 XP per word

### Daily Goals

Set daily XP goals:
- Casual: 10 XP (1 word)
- Regular: 20 XP (2 words)
- Serious: 50 XP (5 words)

### Leveling Up

XP contributes to overall level:
- Level 1: 0-100 XP
- Level 2: 100-250 XP
- Level 3: 250-500 XP
- And so on...

## Keyboard Shortcuts

**In Practice**:
- `Space` - Flip card
- `←` - Rate as "Again"
- `→` - Rate as "Easy"
- `Esc` - Return to practice selection

**In Browse**:
- `/` - Focus search
- `Esc` - Clear search

## Best Practices

### For Memory Retention

1. **Space out sessions** - 2-3 times per day better than 1 long session
2. **Sleep after learning** - Consolidates memory
3. **Use mnemonic devices** - Create associations
4. **Practice before using** - Review before your Paris trip
5. **Immerse yourself** - Listen to French content

### For Long-term Success

1. **Track your streak** - Build consistency
2. **Review before sleeping** - Enhances retention
3. **Combine with lessons** - Use vocabulary in context
4. **Set realistic goals** - Start small, build up
5. **Celebrate progress** - Check mastery stats regularly

## Support

For issues or questions:
- Check FLASHCARD_SYSTEM.md for technical details
- Review vocabulary in Browse tab
- Reset individual words if needed (coming soon)

---

**Remember**: The key to mastery is consistent daily practice. Even 5-10 minutes per day will build strong vocabulary retention for your Paris trip!

Bonne chance! 🇫🇷
