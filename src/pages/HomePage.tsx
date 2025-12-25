import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Flame, BookOpen, Brain, MessageCircle, Trophy, Target, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const displayName = profile?.display_name || 'Learner'
  const totalXp = profile?.total_xp || 0
  const currentStreak = profile?.current_streak || 0
  const dailyGoal = profile?.daily_xp_goal || 20

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white pb-24 pt-16 lg:pt-20">
      <div className="max-w-2xl px-4" style={{ marginInline: 'auto' }}>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold">Bonjour, {displayName}!</h1>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Flame className="w-5 h-5" />
              <span className="text-2xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-xs text-zinc-500">Day Streak</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-2xl font-bold">{totalXp}</span>
            </div>
            <p className="text-xs text-zinc-500">Total XP</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Target className="w-5 h-5" />
              <span className="text-2xl font-bold">0/{dailyGoal}</span>
            </div>
            <p className="text-xs text-zinc-500">Daily Goal</p>
          </div>
        </motion.div>

        {/* Paris Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-5 mb-6"
        >
          <div className="relative z-10">
            <p className="text-rose-100 text-sm font-medium mb-1">Paris Trip Countdown</p>
            <p className="text-4xl font-bold mb-1">~100 days</p>
            <p className="text-rose-100 text-sm">Keep practicing daily!</p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-80">
            🗼
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={() => navigate('/practice')}
            className="bg-zinc-900 rounded-2xl p-5 text-left border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-0.5">Practice</h3>
            <p className="text-sm text-zinc-500">Review flashcards</p>
          </button>

          <button
            onClick={() => navigate('/phrases')}
            className="bg-zinc-900 rounded-2xl p-5 text-left border border-zinc-800 hover:border-purple-500 hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-0.5">Phrases</h3>
            <p className="text-sm text-zinc-500">Travel essentials</p>
          </button>

          <button
            onClick={() => navigate('/lessons')}
            className="bg-zinc-900 rounded-2xl p-5 text-left border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-0.5">Lessons</h3>
            <p className="text-sm text-zinc-500">Structured learning</p>
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="bg-zinc-900 rounded-2xl p-5 text-left border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-0.5">Progress</h3>
            <p className="text-sm text-zinc-500">Track your stats</p>
          </button>
        </motion.div>

        {/* Start Learning CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Pro Tip</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Practice for just 10 minutes a day to build a lasting habit. Consistency beats intensity!
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
