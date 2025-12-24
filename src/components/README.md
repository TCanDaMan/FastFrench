# FastFrench UI Components

A comprehensive library of beautiful, animated UI components for the FastFrench language learning PWA. Built with React, TypeScript, Tailwind CSS v4, and Framer Motion.

## Table of Contents

- [Core Components](#core-components)
- [Utility Components](#utility-components)
- [Feature Components](#feature-components)
- [Usage Examples](#usage-examples)

---

## Core Components

### Button

A versatile button component with multiple variants, sizes, and loading states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean

**Example:**
```tsx
import { Button } from '@/components';

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

---

### Card

Beautiful card component with optional gradient headers and hover effects.

**Subcomponents:**
- `CardHeader` - Header section with padding
- `CardBody` - Main content area
- `CardFooter` - Footer with gray background

**Props:**
- `hoverable`: boolean - Adds lift effect on hover
- `gradient`: boolean - Adds French flag gradient border

**Example:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components';

<Card hoverable gradient>
  <CardHeader>
    <h2>Lesson 1</h2>
  </CardHeader>
  <CardBody>
    <p>Content here</p>
  </CardBody>
  <CardFooter>
    <Button>Continue</Button>
  </CardFooter>
</Card>
```

---

### Modal

Smooth slide-up modal with backdrop and keyboard support (ESC to close).

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean

**Example:**
```tsx
import { Modal } from '@/components';

<Modal isOpen={isOpen} onClose={handleClose} title="Achievement Unlocked" size="md">
  <p>Congratulations on your progress!</p>
</Modal>
```

---

### ProgressBar

Animated progress bar with percentage labels and color variants.

**Props:**
- `progress`: number (0-100)
- `showLabel`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'primary' | 'accent' | 'success'
- `animated`: boolean

**Example:**
```tsx
import { ProgressBar } from '@/components';

<ProgressBar progress={75} showLabel color="primary" size="md" />
```

---

### Badge

Small badges for labels, levels, and status indicators.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean - Shows colored dot indicator

**Example:**
```tsx
import { Badge } from '@/components';

<Badge variant="success" size="md" dot>
  Completed
</Badge>
```

---

## Utility Components

### IconButton

Circular icon buttons with hover and press animations.

**Props:**
- `icon`: LucideIcon (from lucide-react)
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `aria-label`: string (required for accessibility)

**Example:**
```tsx
import { IconButton } from '@/components';
import { Play } from 'lucide-react';

<IconButton icon={Play} variant="primary" size="md" aria-label="Play audio" />
```

---

### Toast

Toast notification system with auto-dismiss and variants.

**Setup:**
Wrap your app with `ToastProvider`:
```tsx
import { ToastProvider } from '@/components';

<ToastProvider>
  <App />
</ToastProvider>
```

**Usage:**
```tsx
import { useToast } from '@/components';

const { showToast } = useToast();

// Show a toast
showToast('Lesson completed!', 'success', 3000);
```

**Variants:**
- 'success' - Green with checkmark
- 'error' - Red with X
- 'info' - Blue with info icon
- 'warning' - Yellow with warning icon

---

### Navbar

Bottom navigation bar with active state indicators and smooth transitions.

**Example:**
```tsx
import { Navbar } from '@/components';

<Navbar />
```

Routes: Home (/), Learn (/learn), Achievements (/achievements), Profile (/profile)

---

### Skeleton

Loading skeleton components for better perceived performance.

**Variants:**
- `Skeleton` - Basic skeleton with customizable dimensions
- `SkeletonCard` - Pre-built card skeleton
- `SkeletonText` - Text skeleton with multiple lines

**Example:**
```tsx
import { Skeleton, SkeletonCard, SkeletonText } from '@/components';

<SkeletonCard />
<SkeletonText lines={3} />
<Skeleton variant="circular" width={48} height={48} />
```

---

### Confetti

Celebratory confetti animation for achievements and level-ups.

**Props:**
- `active`: boolean - Controls animation visibility
- `duration`: number - Animation duration in ms (default: 3000)

**Example:**
```tsx
import { Confetti } from '@/components';

<Confetti active={showConfetti} duration={3000} />
```

---

## Feature Components

### XPDisplay

Shows current XP with animated progress to next level and rank badge.

**Props:**
- `currentXP`: number
- `nextLevelXP`: number
- `level`: number
- `rank`: string (optional, default: 'Beginner')

**Example:**
```tsx
import { XPDisplay } from '@/components';

<XPDisplay
  currentXP={750}
  nextLevelXP={1000}
  level={5}
  rank="Apprentice"
/>
```

---

### StreakCounter

Fire icon with streak number, flame animation, and streak freeze indicator.

**Props:**
- `streak`: number - Current streak in days
- `freezes`: number (optional) - Available streak freezes
- `maxStreak`: number (optional) - Personal best streak

**Example:**
```tsx
import { StreakCounter } from '@/components';

<StreakCounter
  streak={14}
  freezes={2}
  maxStreak={21}
/>
```

---

### DailyGoalRing

Circular progress ring for daily XP goal with beautiful fill animation.

**Props:**
- `current`: number - Current XP earned today
- `goal`: number - Daily XP goal

**Example:**
```tsx
import { DailyGoalRing } from '@/components';

<DailyGoalRing current={45} goal={50} />
```

---

### AchievementCard

Card showing achievement with icon, name, description, XP reward, and progress.

**Props:**
- `name`: string
- `description`: string
- `icon`: LucideIcon
- `xpReward`: number
- `unlocked`: boolean
- `progress`: number (optional)
- `progressMax`: number (optional)
- `unlockedAt`: Date (optional)

**Example:**
```tsx
import { AchievementCard } from '@/components';
import { Star } from 'lucide-react';

<AchievementCard
  name="First Steps"
  description="Complete your first lesson"
  icon={Star}
  xpReward={50}
  unlocked={true}
  unlockedAt={new Date()}
/>
```

---

### LevelUpModal

Celebration modal when user levels up with confetti, new rank, and XP info.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `newLevel`: number
- `newRank`: string
- `xpEarned`: number
- `nextLevelXP`: number

**Example:**
```tsx
import { LevelUpModal } from '@/components';

<LevelUpModal
  isOpen={showLevelUp}
  onClose={() => setShowLevelUp(false)}
  newLevel={6}
  newRank="Apprentice"
  xpEarned={100}
  nextLevelXP={1200}
/>
```

---

### CountdownTimer

Paris trip countdown timer showing days, hours, minutes, and seconds.

**Props:**
- `targetDate`: Date - The countdown target
- `title`: string (optional, default: 'Paris Trip Countdown')

**Example:**
```tsx
import { CountdownTimer } from '@/components';

<CountdownTimer
  targetDate={new Date('2025-12-25')}
  title="Paris Trip Countdown"
/>
```

---

## Design System

### Colors

The components use the French-inspired color palette:

- **Primary Navy**: #1e3a8a (French blue)
- **Primary Blue**: #3b82f6
- **Accent Red**: #dc2626 (French red)
- **White**: #ffffff
- **Cream**: #fefce8

### Animations

All components use Framer Motion with:
- Spring animations for bouncy, natural feel
- Stiffness: 300-400 for snappy responses
- Damping: 15-25 for smooth motion

### Responsive Design

All components are mobile-first and responsive:
- Use on touch devices with proper tap targets
- Adapt to different screen sizes
- Support for iOS safe areas

---

## Best Practices

1. **Import from index**: Always import from `@/components` for tree-shaking
2. **Accessibility**: Use aria-labels on IconButtons and interactive elements
3. **Loading states**: Use Skeleton components while data loads
4. **Animations**: Keep animations under 500ms for better UX
5. **Toast notifications**: Use appropriate variants for user feedback
6. **Dark mode ready**: Components use CSS custom properties

---

## Contributing

When adding new components:
1. Follow existing naming conventions
2. Add TypeScript types for all props
3. Include Framer Motion animations
4. Test on mobile and desktop
5. Update this README with examples
6. Export from index.ts

---

Built with love for language learners!
