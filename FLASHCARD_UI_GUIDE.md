# Flashcard System UI Guide

## Visual Component Breakdown

### 1. Practice Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Practice                                                   │
│  Master French vocabulary with spaced repetition           │
│                                                             │
│  [Practice] [Browse]   ← Navigation Tabs                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 📚       │ │ 🔴       │ │ ⭐       │ │ ✅       │      │
│  │ 110      │ │ 110      │ │ 0        │ │ 0        │      │
│  │ Total    │ │ Due for  │ │ Mastered │ │ Reviewed │      │
│  │ Words    │ │ Review   │ │          │ │ Today    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐  │
│  │ 🔴 Review Due Words     │ │ ✨ Learn New Words      │  │
│  │ Practice words due for  │ │ Add 10 new words to     │  │
│  │ review                  │ │ your vocabulary         │  │
│  │                         │ │                         │  │
│  │ 110 words          Start│ │ 10 words           Start│  │
│  └─────────────────────────┘ └─────────────────────────┘  │
│                                                             │
│  Practice by Category                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │
│  │👋  │ │🍽️  │ │🗺️  │ │🛍️  │ │🚇  │                       │
│  │20  │ │20  │ │15  │ │15  │ │10  │                       │
│  └────┘ └────┘ └────┘ └────┘ └────┘                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │
│  │🏨  │ │🔢  │ │🕐  │ │⭐  │ │🚨  │                       │
│  │0   │ │10  │ │10  │ │0   │ │10  │                       │
│  └────┘ └────┘ └────┘ └────┘ └────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Flashcard Component (Front)

```
┌─────────────────────────────────────────────────────────────┐
│  Card 1 of 110                      👋 Greetings & Basics   │
│  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Progress Bar     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        👋                                   │
│                                                             │
│                     Bonjour                                 │
│                                                             │
│                     bɔ̃.ʒuʁ                                  │
│                                                             │
│                  ┌──────────────┐                           │
│                  │ 🔊 Play      │  ← Audio Button           │
│                  └──────────────┘                           │
│                                                             │
│                  Tap to reveal                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Flashcard Component (Back)

```
┌─────────────────────────────────────────────────────────────┐
│  Card 1 of 110                      👋 Greetings & Basics   │
│  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Progress Bar     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      ┌────┐                                 │
│                      │ 👋 │  ← Category Icon                │
│                      └────┘                                 │
│                                                             │
│                      Hello                                  │
│                                                             │
│              ┌────────────────────────┐                     │
│              │ Example:               │                     │
│              │ Bonjour, comment       │                     │
│              │ allez-vous?            │                     │
│              └────────────────────────┘                     │
│                                                             │
│                  Tap to flip back                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐              │
│  │ Again  │ │ Hard   │ │ Good   │ │ Easy   │  ← Ratings   │
│  │ <1 day │ │ 1 day  │ │ 3-6 d  │ │ >6 day │              │
│  └────────┘ └────────┘ └────────┘ └────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 4. Session Summary Modal

```
                 ┌─────────────────────────┐
                 │          🎉            │
                 │   Session Complete!    │
                 │   Great job practicing!│
                 │                        │
                 │  ┌─────┐    ┌─────┐   │
                 │  │ 20  │    │ 85% │   │
                 │  │Words│    │Accu-│   │
                 │  │Rev. │    │racy │   │
                 │  └─────┘    └─────┘   │
                 │  ┌─────┐    ┌─────┐   │
                 │  │+250 │    │17/20│   │
                 │  │ XP  │    │Corr.│   │
                 │  └─────┘    └─────┘   │
                 │                        │
                 │   [Continue]           │
                 └─────────────────────────┘
```

### 5. Vocabulary List View

```
┌─────────────────────────────────────────────────────────────┐
│  Vocabulary                              [+ Add Word]       │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ 🔍 Search vocabulary...                          │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  [🌟 All] [👋 Greetings] [🍽️ Restaurant] [🗺️ Directions]   │
│                                                             │
│  [A-Z] [Due Date] [Mastery]  ← Sort Options                │
│                                                             │
│  110 words                                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ┌──┐                                                │   │
│  │ │👋│ Bonjour                                        │   │
│  │ └──┘ bɔ̃.ʒuʁ                                         │   │
│  │                                                     │   │
│  │ Hello / Good day                                    │   │
│  │ "Bonjour, comment allez-vous?"                      │   │
│  │                                                     │   │
│  │ Mastery: 0%                         ✓ 0   ✗ 0      │   │
│  │ ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │   │
│  │                                                     │   │
│  │ 🔴 Due for review   Greetings & Basics             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [More cards...]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6. Add Word Modal

```
                 ┌──────────────────────────────┐
                 │ Add Custom Word          [×] │
                 ├──────────────────────────────┤
                 │                              │
                 │ French Word *                │
                 │ ┌──────────────────────────┐ │
                 │ │ e.g., Bonjour            │ │
                 │ └──────────────────────────┘ │
                 │                              │
                 │ English Translation *        │
                 │ ┌──────────────────────────┐ │
                 │ │ e.g., Hello              │ │
                 │ └──────────────────────────┘ │
                 │                              │
                 │ Phonetic (IPA) *             │
                 │ ┌──────────────────────────┐ │
                 │ │ e.g., bɔ̃.ʒuʁ              │ │
                 │ └──────────────────────────┘ │
                 │                              │
                 │ Category                     │
                 │ [👋] [🍽️] [🗺️] [🛍️] [🚇]     │
                 │ [🏨] [🔢] [🕐] [⭐] [🚨]     │
                 │                              │
                 │ Example Sentence (Optional)  │
                 │ ┌──────────────────────────┐ │
                 │ │                          │ │
                 │ │                          │ │
                 │ └──────────────────────────┘ │
                 │                              │
                 │ [Cancel]      [Add Word]     │
                 └──────────────────────────────┘
```

## Color Scheme

### Category Gradients

```css
👋 Greetings:       from-blue-500 to-blue-600
🍽️ Restaurant:      from-orange-500 to-orange-600
🗺️ Directions:      from-green-500 to-green-600
🛍️ Shopping:        from-pink-500 to-pink-600
🚇 Transportation:  from-purple-500 to-purple-600
🏨 Accommodation:   from-indigo-500 to-indigo-600
🔢 Numbers:         from-cyan-500 to-cyan-600
🕐 Time:            from-teal-500 to-teal-600
⭐ Common:          from-yellow-500 to-yellow-600
🚨 Emergency:       from-red-500 to-red-600
```

### Rating Button Colors

```css
Again (Red):    bg-red-500 hover:bg-red-600
Hard (Orange):  bg-orange-500 hover:bg-orange-600
Good (Green):   bg-green-500 hover:bg-green-600
Easy (Blue):    bg-blue-500 hover:bg-blue-600
```

### Status Indicators

```css
Due for Review:  bg-red-100 text-red-700 (light mode)
                 bg-red-900 text-red-300 (dark mode)

Mastered:        bg-green-100 text-green-700 (light mode)
                 bg-green-900 text-green-300 (dark mode)

Next Review:     bg-gray-100 text-gray-700 (light mode)
                 bg-gray-700 text-gray-300 (dark mode)
```

## Animations

### Flashcard Flip

```css
Duration: 0.6s
Type: Spring (stiffness: 100)
Transform: rotateY(0deg → 180deg)
```

### Card Swipe

```css
Exit Left (Again):
  x: -300px
  opacity: 0
  duration: 0.3s

Exit Right (Easy):
  x: 300px
  opacity: 0
  duration: 0.3s
```

### Progress Bar

```css
Width: 0% → X%
Duration: 0.3s
Gradient: from-blue-500 to-purple-600
```

### Button Hover

```css
Scale: 1.0 → 1.05
Duration: 0.2s
Shadow: Increased on hover
```

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Touch-optimized (48px tap targets)
- Bottom sheet for modals

### Tablet (768px - 1024px)
- Two-column grid for stats
- Larger cards
- Side-by-side practice modes

### Desktop (> 1024px)
- Four-column grid for stats
- Maximum width: 1280px
- Keyboard shortcuts active
- Hover states on all interactive elements

## Interaction Patterns

### Card Flip
```
State: Front
User Action: Click/Tap card
Result: Smooth 3D flip to back
Duration: 0.6s
```

### Card Swipe (Mobile)
```
State: Card visible
User Action: Swipe left
Result: Card exits left, rated as "Again"
Next: Show next card

User Action: Swipe right
Result: Card exits right, rated as "Easy"
Next: Show next card
```

### Rating Buttons
```
State: Card flipped to back
User Action: Click rating button
Result:
  1. Card exits (direction based on rating)
  2. Word progress updated (SM-2)
  3. XP awarded
  4. Next card appears
  5. If last card, show session summary
```

### Audio Playback
```
State: Card front visible
User Action: Click speaker icon
Result:
  1. Icon animates (pulse)
  2. Text-to-speech speaks French word
  3. Animation stops when complete
Fallback: If TTS unavailable, show message
```

## Accessibility Features

### Keyboard Navigation
```
Practice View:
  Space     → Flip card
  ←        → Rate as "Again"
  →        → Rate as "Easy"
  Esc       → Return to selection

Browse View:
  /         → Focus search
  Esc       → Clear search
  Tab       → Navigate filters
```

### Screen Reader Support
```
- All buttons have aria-labels
- Card state announced on flip
- Progress updates announced
- Form fields properly labeled
- Modal focus trap active
```

### Visual Accessibility
```
- High contrast ratios (WCAG AA)
- No color-only information
- Large tap targets (48px min)
- Clear focus indicators
- Reduced motion support
```

## State Indicators

### Word Status Badges

```
🔴 Due for review
   - Red badge
   - Indicates word needs practice
   - Shows on cards due today or overdue

⭐ Mastered
   - Green badge with star
   - 5+ successful reviews
   - 90%+ accuracy
   - High easiness factor

Next: [interval]
   - Gray badge
   - Shows next review date
   - "Tomorrow", "3 days", "2 weeks", etc.
```

### Progress Bars

```
0-25%:   Red     (Struggling)
25-50%:  Orange  (Learning)
50-75%:  Yellow  (Familiar)
75-90%:  Blue    (Proficient)
90-100%: Green   (Mastered)
```

### Session Stats

```
Words Reviewed:  Blue background
Accuracy:        Green background
XP Earned:       Purple background
Correct Answers: Yellow background
```

## Loading States

### Initial Load
```
1. Show empty practice page
2. Initialize vocabulary store
3. Load from localStorage
4. If empty, load initialVocabulary
5. Calculate stats
6. Render interface
```

### Switching Views
```
1. Fade out current view (0.2s)
2. Switch content
3. Fade in new view (0.2s)
Total: 0.4s smooth transition
```

## Empty States

### No Due Words
```
┌─────────────────────────────────┐
│           🎉                    │
│                                 │
│     All caught up!              │
│                                 │
│  You have no words due for      │
│  review. Great job!             │
│                                 │
│  [Learn New Words]              │
└─────────────────────────────────┘
```

### No New Words
```
┌─────────────────────────────────┐
│           📚                    │
│                                 │
│   All words learned!            │
│                                 │
│  You've added all 110           │
│  pre-loaded words.              │
│                                 │
│  [Add Custom Words]             │
└─────────────────────────────────┘
```

### Search No Results
```
┌─────────────────────────────────┐
│           🔍                    │
│                                 │
│     No words found              │
│                                 │
│  Try a different search term    │
│  or category filter             │
└─────────────────────────────────┘
```

## Best Practices for UI

### Card Design
- Use large, readable fonts (48px+ for main word)
- High contrast between text and background
- Smooth animations (60fps)
- Clear visual hierarchy

### Color Usage
- Category colors help recognition
- Consistent color meaning (red = again, green = good)
- Gradients add depth
- Dark mode support for all colors

### Spacing
- Generous padding (24px+)
- Clear visual separation
- Breathing room around interactive elements
- Consistent spacing scale (4, 8, 12, 16, 24, 32, 48px)

### Typography
- Clear font hierarchy
- Readable sizes (16px+ body text)
- Proper line height (1.5-1.6)
- Consistent font weights

### Feedback
- Immediate visual feedback on interactions
- Clear success/error states
- Progress indicators for long operations
- Haptic feedback on mobile (when available)

This UI guide ensures consistent, beautiful, and accessible flashcard interface!
