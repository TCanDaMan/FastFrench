# FastFrench Components - Integration Guide

## Step-by-Step Setup

### 1. Setup Toast Provider

In your `main.tsx` or `App.tsx`:

```tsx
import { ToastProvider } from '@/components';

function App() {
  return (
    <ToastProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </ToastProvider>
  );
}
```

### 2. Add Navigation

In your layout component:

```tsx
import { Navbar } from '@/components';

function Layout({ children }) {
  return (
    <>
      <main className="min-h-screen pb-16">
        {children}
      </main>
      <Navbar />
    </>
  );
}
```

### 3. Use Components in Pages

Example Dashboard page:

```tsx
import { useState } from 'react';
import {
  XPDisplay,
  StreakCounter,
  DailyGoalRing,
  Button,
  Card,
  CardHeader,
  CardBody,
  useToast,
} from '@/components';

export function Dashboard() {
  const { showToast } = useToast();
  const [userProgress, setUserProgress] = useState({
    currentXP: 750,
    nextLevelXP: 1000,
    level: 5,
    rank: 'Apprentice',
  });

  const handleStartLesson = () => {
    showToast('Starting lesson...', 'info');
    // Navigate to lesson
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <XPDisplay
          currentXP={userProgress.currentXP}
          nextLevelXP={userProgress.nextLevelXP}
          level={userProgress.level}
          rank={userProgress.rank}
        />
        <StreakCounter streak={14} freezes={2} maxStreak={21} />
        <DailyGoalRing current={35} goal={50} />
      </div>

      {/* Today's Lessons */}
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-4">Today's Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hoverable gradient>
            <CardHeader>
              <h3 className="text-lg font-bold">Basic Greetings</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">
                Learn essential French greetings and introductions
              </p>
              <Button variant="primary" onClick={handleStartLesson}>
                Start Lesson
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### 4. Achievement System

Example Achievements page:

```tsx
import { AchievementCard } from '@/components';
import { Star, Flame, Trophy, Zap } from 'lucide-react';

const achievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: Star,
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    xpReward: 200,
    unlocked: true,
    unlockedAt: new Date('2024-12-10'),
  },
  {
    id: '3',
    name: 'Marathon Runner',
    description: 'Maintain a 30-day streak',
    icon: Zap,
    xpReward: 500,
    unlocked: false,
    progress: 14,
    progressMax: 30,
  },
];

export function Achievements() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary-900">Achievements</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            icon={achievement.icon}
            xpReward={achievement.xpReward}
            unlocked={achievement.unlocked}
            progress={achievement.progress}
            progressMax={achievement.progressMax}
            unlockedAt={achievement.unlockedAt}
          />
        ))}
      </div>
    </div>
  );
}
```

### 5. Level Up Flow

Example of triggering level up:

```tsx
import { useState } from 'react';
import { LevelUpModal, useToast } from '@/components';

export function useGamefication() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({
    newLevel: 0,
    newRank: '',
    xpEarned: 0,
    nextLevelXP: 0,
  });
  const { showToast } = useToast();

  const addXP = (xp: number) => {
    // Your XP logic here
    const currentXP = 950;
    const nextLevelXP = 1000;

    if (currentXP + xp >= nextLevelXP) {
      // Level up!
      setLevelUpData({
        newLevel: 6,
        newRank: 'Scholar',
        xpEarned: xp,
        nextLevelXP: 1200,
      });
      setShowLevelUp(true);
    } else {
      showToast(`+${xp} XP earned!`, 'success');
    }
  };

  return {
    addXP,
    LevelUpModalComponent: (
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        {...levelUpData}
      />
    ),
  };
}
```

### 6. Loading States

Example using skeletons:

```tsx
import { SkeletonCard, Card } from '@/components';

export function LessonList() {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>{/* Lesson content */}</Card>
      ))}
    </div>
  );
}
```

### 7. Form Validation with Toast

Example form with toast notifications:

```tsx
import { Button, useToast } from '@/components';

export function ProfileForm() {
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Save data
      await saveProfile();
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" variant="primary">
        Save Changes
      </Button>
    </form>
  );
}
```

### 8. Countdown Integration

Example profile with Paris trip countdown:

```tsx
import { CountdownTimer, Card } from '@/components';

export function Profile() {
  const tripDate = new Date('2025-07-14'); // Bastille Day!

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary-900">Profile</h1>

      <CountdownTimer
        targetDate={tripDate}
        title="Paris Trip Countdown"
      />

      {/* Rest of profile */}
    </div>
  );
}
```

## Common Patterns

### Modal Workflow

```tsx
const [showModal, setShowModal] = useState(false);

// Trigger
<Button onClick={() => setShowModal(true)}>Open</Button>

// Modal
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirmation"
>
  <p>Are you sure?</p>
  <div className="flex gap-2 mt-4">
    <Button variant="primary" onClick={handleConfirm}>Yes</Button>
    <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
  </div>
</Modal>
```

### Progress Tracking

```tsx
const [progress, setProgress] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
  }, 1000);
  return () => clearInterval(timer);
}, []);

<ProgressBar progress={progress} color="primary" />
```

### Confetti on Achievement

```tsx
const [showConfetti, setShowConfetti] = useState(false);

const unlockAchievement = () => {
  setShowConfetti(true);
  showToast('Achievement unlocked!', 'success');
  setTimeout(() => setShowConfetti(false), 3000);
};

<Confetti active={showConfetti} duration={3000} />
```

## TypeScript Types

```tsx
import type {
  Achievement,
  UserProgress,
  StreakInfo,
  DailyGoal,
} from '@/components';

// Use in your state
const [achievements, setAchievements] = useState<Achievement[]>([]);
const [progress, setProgress] = useState<UserProgress | null>(null);
```

## Styling Tips

1. All components use Tailwind CSS classes
2. Components inherit from your global theme
3. CSS custom properties for colors
4. Mobile-first responsive design
5. Dark mode ready (when you add dark mode support)

## Performance Tips

1. Use `SkeletonCard` while data loads
2. Lazy load `ComponentShowcase` in development only
3. Toast auto-dismisses to prevent memory leaks
4. Confetti cleans up automatically
5. Modal prevents body scroll when open

## Accessibility

1. Always provide `aria-label` for IconButtons
2. Modal closes on ESC key
3. Keyboard navigation supported
4. Screen reader friendly
5. Proper ARIA attributes included

## Next Steps

1. Check `/src/components/ComponentShowcase.tsx` for live examples
2. Read `/src/components/README.md` for detailed documentation
3. See `/src/components/QUICK_REFERENCE.md` for quick patterns
4. Customize colors in `/src/index.css`
5. Add your own components following the same patterns

Happy coding!
