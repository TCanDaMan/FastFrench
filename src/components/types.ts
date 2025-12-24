/**
 * Shared types for FastFrench UI components
 */

import { LucideIcon } from 'lucide-react';

// Common size type used across multiple components
export type Size = 'sm' | 'md' | 'lg';
export type ExtendedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common color variants
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

// Animation configurations
export interface SpringConfig {
  stiffness: number;
  damping: number;
}

export const defaultSpring: SpringConfig = {
  stiffness: 300,
  damping: 25,
};

export const snappySpring: SpringConfig = {
  stiffness: 400,
  damping: 17,
};

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  xpReward: number;
  unlocked: boolean;
  progress?: number;
  progressMax?: number;
  unlockedAt?: Date;
  category?: 'learning' | 'streak' | 'social' | 'milestone';
}

// User progress types
export interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  rank: string;
  totalXP: number;
}

// Streak types
export interface StreakInfo {
  current: number;
  max: number;
  freezes: number;
  lastActivity: Date;
}

// Daily goal types
export interface DailyGoal {
  targetXP: number;
  currentXP: number;
  completed: boolean;
  streak: number;
}

// Toast types (re-export for convenience)
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
  id?: string;
}
