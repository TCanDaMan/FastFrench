import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Flame, Brain, MessageCircle, Trophy, Target, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useGamification } from '../hooks/useGamification'

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { dailyProgress } = useGamification()

  const displayName = profile?.display_name || 'Learner'
  const totalXp = profile?.total_xp || 0
  const currentStreak = profile?.current_streak || 0

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white" style={{ paddingBottom: '6rem', paddingTop: '5rem' }}>
      <div className="px-4 sm:px-6 lg:px-8 mx-auto" style={{ maxWidth: '72rem' }}>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center hover:shadow-glow-gold transition-shadow"
            >
              <User className="w-6 h-6 text-zinc-950" />
            </button>
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
          className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8"
        >
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3 text-orange-400 mb-2">
              <Flame className="w-6 h-6" />
              <span className="text-3xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-sm text-zinc-400">Day Streak</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3 text-yellow-400 mb-2">
              <Trophy className="w-6 h-6" />
              <span className="text-3xl font-bold">{totalXp}</span>
            </div>
            <p className="text-sm text-zinc-400">Total XP</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <Target className="w-6 h-6" />
              <span className="text-3xl font-bold">{dailyProgress.current}/{dailyProgress.goal}</span>
            </div>
            <p className="text-sm text-zinc-400">Daily Goal</p>
          </div>
        </motion.div>

        {/* Paris Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl shadow-indigo-900/30"
        >
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-2">Paris Trip Countdown</p>
            <p className="text-5xl font-bold mb-2">~100 days</p>
            <p className="text-indigo-200 text-base">Keep practicing daily!</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-40">
            🗼
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-5 mb-8"
        >
          <button
            onClick={() => navigate('/practice')}
            className="bg-zinc-900 rounded-2xl p-6 text-left border border-zinc-700 shadow-lg shadow-black/20 hover:border-indigo-500 hover:bg-zinc-800 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">Practice</h3>
            <p className="text-sm text-zinc-400">Review flashcards</p>
          </button>

          <button
            onClick={() => navigate('/phrases')}
            className="bg-zinc-900 rounded-2xl p-6 text-left border border-zinc-700 shadow-lg shadow-black/20 hover:border-purple-500 hover:bg-zinc-800 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">Phrases</h3>
            <p className="text-sm text-zinc-400">Travel essentials</p>
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="bg-zinc-900 rounded-2xl p-6 text-left border border-zinc-700 shadow-lg shadow-black/20 hover:border-amber-500 hover:bg-zinc-800 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">Progress</h3>
            <p className="text-sm text-zinc-400">Track your stats</p>
          </button>
        </motion.div>

        {/* Start Learning CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="w-full gradient-gold hover:shadow-glow-gold text-zinc-950 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-1.5">Pro Tip</h4>
              <p className="text-base text-zinc-400 leading-relaxed">
                Practice for just 10 minutes a day to build a lasting habit. Consistency beats intensity!
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
