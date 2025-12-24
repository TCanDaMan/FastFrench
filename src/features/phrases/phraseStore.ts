import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Phrase, PhraseCategory, PhraseProgress, PracticeSession } from '../../types/phrases';
import { PHRASES } from '../../data/phrases';
import { syncService } from '../../lib/syncService';

interface PhraseStore {
  // Data
  phrases: Phrase[];
  progress: Map<string, PhraseProgress>;
  sessions: PracticeSession[];
  lastSyncedAt: Date | null;

  // Computed stats
  getTotalPhrases: () => number;
  getLearnedPhrases: () => number;
  getCategoryProgress: (category: PhraseCategory) => {
    total: number;
    learned: number;
    practiced: number;
  };

  // Phrase queries
  getPhrasesByCategory: (category: PhraseCategory) => Phrase[];
  getPhraseById: (id: string) => Phrase | undefined;
  getProgress: (phraseId: string) => PhraseProgress | null;

  // Recommendations
  getRecommendedPhrases: (limit?: number) => Phrase[];
  getPhrasesByDifficulty: (difficulty: 1 | 2 | 3 | 4 | 5) => Phrase[];
  getUnpracticedPhrases: (category?: PhraseCategory) => Phrase[];

  // Progress actions
  recordPractice: (phraseId: string, correct: boolean) => void;
  updateComfortLevel: (phraseId: string, level: 1 | 2 | 3 | 4 | 5) => void;
  markAsLearned: (phraseId: string) => void;
  markAsUnlearned: (phraseId: string) => void;

  // Session management
  startSession: (category?: PhraseCategory) => string;
  endSession: (sessionId: string, correctCount: number, totalCount: number) => void;

  // Reset
  resetProgress: () => void;

  // Sync management
  syncToCloud: (userId: string) => Promise<void>;
  syncFromCloud: (userId: string) => Promise<void>;
}

// Helper to convert Map to array for persistence
const mapToArray = (map: Map<string, PhraseProgress>): [string, PhraseProgress][] => {
  return Array.from(map.entries());
};

const arrayToMap = (array: [string, PhraseProgress][]): Map<string, PhraseProgress> => {
  return new Map(array.map(([key, value]) => [
    key,
    {
      ...value,
      lastPracticed: value.lastPracticed ? new Date(value.lastPracticed) : null,
    },
  ]));
};

export const usePhraseStore = create<PhraseStore>()(
  persist(
    (set, get) => ({
      phrases: PHRASES,
      progress: new Map<string, PhraseProgress>(),
      sessions: [],
      lastSyncedAt: null,

      // Computed stats
      getTotalPhrases: () => get().phrases.length,

      getLearnedPhrases: () => {
        return Array.from(get().progress.values()).filter(p => p.isLearned).length;
      },

      getCategoryProgress: (category: PhraseCategory) => {
        const categoryPhrases = get().phrases.filter(p => p.category === category);
        const total = categoryPhrases.length;
        const learned = categoryPhrases.filter(p => {
          const progress = get().progress.get(p.id);
          return progress?.isLearned;
        }).length;
        const practiced = categoryPhrases.filter(p => {
          const progress = get().progress.get(p.id);
          return progress && progress.practiced > 0;
        }).length;

        return { total, learned, practiced };
      },

      // Phrase queries
      getPhrasesByCategory: (category: PhraseCategory) => {
        return get().phrases.filter(p => p.category === category);
      },

      getPhraseById: (id: string) => {
        return get().phrases.find(p => p.id === id);
      },

      getProgress: (phraseId: string) => {
        return get().progress.get(phraseId) || null;
      },

      // Recommendations - phrases to learn next
      getRecommendedPhrases: (limit = 10) => {
        const { phrases, progress } = get();

        // Prioritize:
        // 1. Unpracticed phrases with difficulty 1-2
        // 2. Phrases practiced < 3 times
        // 3. Lowest comfort level phrases

        const scored = phrases.map(phrase => {
          const prog = progress.get(phrase.id);
          let score = 0;

          // Never practiced = high priority
          if (!prog || prog.practiced === 0) {
            score += 100;
            // Easy phrases first
            score += (6 - phrase.difficulty) * 10;
          } else {
            // Practiced but not mastered
            if (!prog.isLearned) {
              score += 50;
            }
            // Low comfort level
            score += (6 - (prog.comfortLevel || 3)) * 8;
            // Practiced few times
            if (prog.practiced < 5) {
              score += (5 - prog.practiced) * 5;
            }
          }

          return { phrase, score };
        });

        return scored
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(s => s.phrase);
      },

      getPhrasesByDifficulty: (difficulty) => {
        return get().phrases.filter(p => p.difficulty === difficulty);
      },

      getUnpracticedPhrases: (category) => {
        const { phrases, progress } = get();
        let filtered = phrases;

        if (category) {
          filtered = filtered.filter(p => p.category === category);
        }

        return filtered.filter(p => {
          const prog = progress.get(p.id);
          return !prog || prog.practiced === 0;
        });
      },

      // Progress actions
      recordPractice: (phraseId: string, correct: boolean) => {
        set(state => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(phraseId);

          if (existing) {
            // Update existing
            newProgress.set(phraseId, {
              ...existing,
              practiced: existing.practiced + 1,
              lastPracticed: new Date(),
              comfortLevel: correct
                ? Math.min(5, existing.comfortLevel + 1) as 1 | 2 | 3 | 4 | 5
                : Math.max(1, existing.comfortLevel - 1) as 1 | 2 | 3 | 4 | 5,
            });
          } else {
            // Create new
            newProgress.set(phraseId, {
              phraseId,
              practiced: 1,
              lastPracticed: new Date(),
              comfortLevel: correct ? 3 : 2,
              isLearned: false,
            });
          }

          return { progress: newProgress };
        });
      },

      updateComfortLevel: (phraseId: string, level: 1 | 2 | 3 | 4 | 5) => {
        set(state => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(phraseId);

          if (existing) {
            newProgress.set(phraseId, {
              ...existing,
              comfortLevel: level,
            });
          } else {
            newProgress.set(phraseId, {
              phraseId,
              practiced: 0,
              lastPracticed: null,
              comfortLevel: level,
              isLearned: false,
            });
          }

          return { progress: newProgress };
        });
      },

      markAsLearned: (phraseId: string) => {
        set(state => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(phraseId);

          if (existing) {
            newProgress.set(phraseId, {
              ...existing,
              isLearned: true,
              comfortLevel: 5,
            });
          } else {
            newProgress.set(phraseId, {
              phraseId,
              practiced: 0,
              lastPracticed: null,
              comfortLevel: 5,
              isLearned: true,
            });
          }

          return { progress: newProgress };
        });
      },

      markAsUnlearned: (phraseId: string) => {
        set(state => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(phraseId);

          if (existing) {
            newProgress.set(phraseId, {
              ...existing,
              isLearned: false,
            });
          }

          return { progress: newProgress };
        });
      },

      // Session management
      startSession: (category) => {
        const sessionId = `session-${Date.now()}`;
        set(state => ({
          sessions: [
            ...state.sessions,
            {
              id: sessionId,
              startTime: new Date(),
              category,
              phrasesReviewed: [],
              correctCount: 0,
              totalCount: 0,
            },
          ],
        }));
        return sessionId;
      },

      endSession: (sessionId: string, correctCount: number, totalCount: number) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  endTime: new Date(),
                  correctCount,
                  totalCount,
                }
              : session
          ),
        }));
      },

      // Reset
      resetProgress: () => {
        set({ progress: new Map(), sessions: [] });
      },

      // Sync to Supabase
      syncToCloud: async (userId: string) => {
        const { progress } = get();

        if (!syncService.isOnline() || progress.size === 0) {
          return;
        }

        const progressArray = Array.from(progress.values());
        const result = await syncService.syncPhraseProgressToCloud(userId, progressArray);

        if (result.success) {
          set({ lastSyncedAt: new Date() });
        }
      },

      // Sync from Supabase
      syncFromCloud: async (userId: string) => {
        if (!syncService.isOnline()) {
          return;
        }

        const cloudProgress = await syncService.fetchPhraseProgressFromCloud(userId);

        if (cloudProgress.length > 0) {
          const localProgress = Array.from(get().progress.values());
          const mergedProgress = syncService.mergePhraseProgress(localProgress, cloudProgress);

          const progressMap = new Map<string, PhraseProgress>();
          mergedProgress.forEach(p => progressMap.set(p.phraseId, p));

          set({ progress: progressMap, lastSyncedAt: new Date() });
        }
      },
    }),
    {
      name: 'fastfrench-phrases',
      // Custom storage to handle Map serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            state: {
              ...data.state,
              progress: arrayToMap(data.state.progress || []),
              lastSyncedAt: data.state.lastSyncedAt ? new Date(data.state.lastSyncedAt) : null,
            },
          };
        },
        setItem: (name, value) => {
          const data = {
            state: {
              ...value.state,
              progress: mapToArray(value.state.progress),
              lastSyncedAt: value.state.lastSyncedAt?.toISOString() || null,
            },
          };
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
