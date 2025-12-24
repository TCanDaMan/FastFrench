// Phrase Types for FastFrench Travel Phrases

export type PhraseCategory =
  | 'greetings'
  | 'social'
  | 'restaurant'
  | 'directions'
  | 'transportation'
  | 'shopping'
  | 'accommodation'
  | 'emergencies'
  | 'numbers'
  | 'time';

export interface Phrase {
  id: string;
  french: string;
  english: string;
  phonetic: string; // IPA pronunciation
  category: PhraseCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  usageContext: string; // When to use this phrase
  audioUrl?: string; // For cached audio
}

export interface CategoryInfo {
  name: string;
  icon: string; // emoji
  color: string; // tailwind color class
  bgColor: string; // tailwind background color
  description: string;
  emoji: string; // category emoji
}

export interface PhraseProgress {
  phraseId: string;
  practiced: number; // how many times practiced
  lastPracticed: Date | null;
  comfortLevel: 1 | 2 | 3 | 4 | 5; // user's self-rated comfort
  isLearned: boolean; // marked as learned
}

export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  category?: PhraseCategory;
  phrasesReviewed: string[]; // phrase IDs
  correctCount: number;
  totalCount: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: PhraseCategory;
  phraseIds: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  context: string;
  icon: string;
}

// Category information mapping
export const CATEGORY_INFO: Record<PhraseCategory, CategoryInfo> = {
  greetings: {
    name: 'Greetings',
    icon: '👋',
    emoji: '👋',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Essential greetings and basic politeness',
  },
  social: {
    name: 'Social',
    icon: '💬',
    emoji: '💬',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Basic conversation and social interactions',
  },
  restaurant: {
    name: 'Restaurant',
    icon: '🍽️',
    emoji: '🍽️',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Ordering food and dining out',
  },
  directions: {
    name: 'Directions',
    icon: '🧭',
    emoji: '🧭',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Finding your way around Paris',
  },
  transportation: {
    name: 'Transportation',
    icon: '🚇',
    emoji: '🚇',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Metro, trains, and getting around',
  },
  shopping: {
    name: 'Shopping',
    icon: '🛍️',
    emoji: '🛍️',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Markets, boutiques, and shopping',
  },
  accommodation: {
    name: 'Accommodation',
    icon: '🏨',
    emoji: '🏨',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    description: 'Hotels and lodging',
  },
  emergencies: {
    name: 'Emergencies',
    icon: '🚨',
    emoji: '🚨',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Emergency situations and important needs',
  },
  numbers: {
    name: 'Numbers',
    icon: '🔢',
    emoji: '🔢',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Essential numbers for daily use',
  },
  time: {
    name: 'Time',
    icon: '⏰',
    emoji: '⏰',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Telling time and talking about days',
  },
};
