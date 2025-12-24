// Core Components
export { Button } from './Button';
export type { ButtonVariant, ButtonSize } from './Button';

export { Card, CardHeader, CardBody, CardFooter } from './Card';

export { Modal } from './Modal';

export { ProgressBar } from './ProgressBar';

export { Badge } from './Badge';
export type { BadgeVariant, BadgeSize } from './Badge';

// Utility Components
export { IconButton } from './IconButton';
export type { IconButtonVariant, IconButtonSize } from './IconButton';

export { ToastProvider, useToast } from './Toast';
export type { ToastVariant } from './Toast';

export { Navbar } from './Navbar';

export { Skeleton, SkeletonCard, SkeletonText } from './Skeleton';

export { Confetti } from './Confetti';

// Feature Components
export { XPDisplay } from './XPDisplay';

export { StreakCounter } from './StreakCounter';

export { DailyGoalRing } from './DailyGoalRing';

export { AchievementCard } from './AchievementCard';

export { LevelUpModal } from './LevelUpModal';

export { CountdownTimer } from './CountdownTimer';

// Shared Types
export type {
  Size,
  ExtendedSize,
  ColorVariant,
  SpringConfig,
  Achievement,
  UserProgress,
  StreakInfo,
  DailyGoal,
  ToastType,
  ToastConfig,
} from './types';

export { defaultSpring, snappySpring } from './types';
