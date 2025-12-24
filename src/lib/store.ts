import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  dailyXp: number
  addXp: (xp: number) => void
  resetDailyXp: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      dailyXp: 0,
      addXp: (xp) => set((state) => ({ dailyXp: state.dailyXp + xp })),
      resetDailyXp: () => set({ dailyXp: 0 }),
    }),
    {
      name: 'fastfrench-storage',
    }
  )
)
