# FastFrench Components - Quick Reference

## Import Everything

```tsx
import {
  // Core
  Button, Card, CardHeader, CardBody, CardFooter,
  Modal, ProgressBar, Badge,

  // Utility
  IconButton, ToastProvider, useToast,
  Navbar, Skeleton, SkeletonCard, SkeletonText, Confetti,

  // Feature
  XPDisplay, StreakCounter, DailyGoalRing,
  AchievementCard, LevelUpModal, CountdownTimer,

  // Types
  type ButtonVariant, type BadgeVariant,
  type Achievement, type UserProgress,
} from '@/components';
```

## Common Patterns

### Basic Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Loading Button
```tsx
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### Icon Button
```tsx
import { Play } from 'lucide-react';
<IconButton icon={Play} variant="primary" aria-label="Play audio" />
```

### Toast Notification
```tsx
const { showToast } = useToast();
showToast('Success!', 'success', 3000);
```

### Modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Title">
  <p>Content here</p>
</Modal>
```

### Card with Sections
```tsx
<Card hoverable gradient>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardBody>
    <p>Content</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Progress Bar
```tsx
<ProgressBar progress={75} color="primary" showLabel />
```

### Badge
```tsx
<Badge variant="success" dot>Completed</Badge>
```

### XP Display
```tsx
<XPDisplay
  currentXP={750}
  nextLevelXP={1000}
  level={5}
  rank="Apprentice"
/>
```

### Streak Counter
```tsx
<StreakCounter
  streak={14}
  freezes={2}
  maxStreak={21}
/>
```

### Daily Goal Ring
```tsx
<DailyGoalRing current={35} goal={50} />
```

### Achievement Card
```tsx
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

### Level Up Modal
```tsx
<LevelUpModal
  isOpen={showLevelUp}
  onClose={handleClose}
  newLevel={6}
  newRank="Scholar"
  xpEarned={100}
  nextLevelXP={1200}
/>
```

### Countdown Timer
```tsx
<CountdownTimer
  targetDate={new Date('2025-12-25')}
  title="Paris Trip Countdown"
/>
```

### Skeleton Loaders
```tsx
<SkeletonCard />
<SkeletonText lines={3} />
<Skeleton variant="circular" width={48} height={48} />
```

### Confetti
```tsx
const [showConfetti, setShowConfetti] = useState(false);

<Confetti active={showConfetti} duration={3000} />

// Trigger it
setShowConfetti(true);
setTimeout(() => setShowConfetti(false), 3000);
```

## Color Palette

```css
Primary (French Navy): #1e3a8a
Primary Blue: #3b82f6
Accent Red: #dc2626
```

## Animation Springs

```tsx
import { defaultSpring, snappySpring } from '@/components';

// defaultSpring: { stiffness: 300, damping: 25 }
// snappySpring: { stiffness: 400, damping: 17 }
```

## App Setup

### 1. Wrap App with ToastProvider

```tsx
import { ToastProvider } from '@/components';

function App() {
  return (
    <ToastProvider>
      {/* Your app */}
    </ToastProvider>
  );
}
```

### 2. Add Navbar to Layout

```tsx
import { Navbar } from '@/components';

function Layout() {
  return (
    <>
      <main className="pb-16">{/* Content */}</main>
      <Navbar />
    </>
  );
}
```

## Testing Components

See `/src/components/ComponentShowcase.tsx` for a live demo of all components!

## File Structure

```
src/components/
├── Button.tsx              (Core button component)
├── Card.tsx                (Card with header/body/footer)
├── Modal.tsx               (Overlay modal)
├── ProgressBar.tsx         (Animated progress)
├── Badge.tsx               (Label badges)
├── IconButton.tsx          (Circular icon buttons)
├── Toast.tsx               (Notification system)
├── Navbar.tsx              (Bottom navigation)
├── Skeleton.tsx            (Loading skeletons)
├── Confetti.tsx            (Celebration animation)
├── XPDisplay.tsx           (XP and level display)
├── StreakCounter.tsx       (Streak tracking)
├── DailyGoalRing.tsx       (Circular progress ring)
├── AchievementCard.tsx     (Achievement display)
├── LevelUpModal.tsx        (Level up celebration)
├── CountdownTimer.tsx      (Countdown display)
├── ComponentShowcase.tsx   (Demo page)
├── index.ts                (Exports)
├── types.ts                (Shared types)
└── README.md               (Full documentation)
```
