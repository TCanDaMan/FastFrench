// Supabase Database Types
// Auto-generated types based on database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          current_level: number
          current_rank: 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre'
          total_xp: number
          current_streak: number
          longest_streak: number
          streak_freeze_available: boolean
          last_practice_date: string | null
          daily_xp_goal: 10 | 20 | 50
          paris_trip_date: string | null
          preferred_difficulty: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          current_level?: number
          current_rank?: 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre'
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          streak_freeze_available?: boolean
          last_practice_date?: string | null
          daily_xp_goal?: 10 | 20 | 50
          paris_trip_date?: string | null
          preferred_difficulty?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          current_level?: number
          current_rank?: 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre'
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          streak_freeze_available?: boolean
          last_practice_date?: string | null
          daily_xp_goal?: 10 | 20 | 50
          paris_trip_date?: string | null
          preferred_difficulty?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon_name: string
          xp_reward: number
          requirement_type: 'xp_earned' | 'words_learned' | 'words_reviewed' | 'phrases_practiced' | 'streak_days' | 'practice_sessions' | 'perfect_lessons' | 'time_spent_minutes'
          requirement_value: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon_name: string
          xp_reward?: number
          requirement_type: 'xp_earned' | 'words_learned' | 'words_reviewed' | 'phrases_practiced' | 'streak_days' | 'practice_sessions' | 'perfect_lessons' | 'time_spent_minutes'
          requirement_value: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon_name?: string
          xp_reward?: number
          requirement_type?: 'xp_earned' | 'words_learned' | 'words_reviewed' | 'phrases_practiced' | 'streak_days' | 'practice_sessions' | 'perfect_lessons' | 'time_spent_minutes'
          requirement_value?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      daily_progress: {
        Row: {
          id: string
          user_id: string
          date: string
          xp_earned: number
          words_learned: number
          words_reviewed: number
          phrases_practiced: number
          time_spent_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          xp_earned?: number
          words_learned?: number
          words_reviewed?: number
          phrases_practiced?: number
          time_spent_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          xp_earned?: number
          words_learned?: number
          words_reviewed?: number
          phrases_practiced?: number
          time_spent_minutes?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_rank: 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre'
      phrase_category: 'greetings' | 'restaurant' | 'directions' | 'shopping' | 'transportation' | 'accommodation' | 'emergencies' | 'social' | 'numbers' | 'time' | 'weather' | 'culture'
      challenge_type: 'daily' | 'weekly'
      requirement_type: 'xp_earned' | 'words_learned' | 'words_reviewed' | 'phrases_practiced' | 'streak_days' | 'practice_sessions' | 'perfect_lessons' | 'time_spent_minutes'
    }
  }
}
