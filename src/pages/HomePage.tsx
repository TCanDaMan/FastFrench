import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Flame, BookOpen, Brain, MessageCircle, Trophy, Target } from 'lucide-react'
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
    <div className="min-h-screen w-full bg-black text-white pb-28 pt-20 lg:pt-24">
      {/* Hero Banner */}
      <div className="max-w-4xl px-4" style={{ marginInline: 'auto' }}>
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Bonjour, {displayName}!</h1>
              <p className="text-purple-200">Ready to learn some French?</p>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-300 mb-1">
                <Flame className="w-5 h-5" />
                <span className="text-2xl font-bold">{currentStreak}</span>
              </div>
              <p className="text-sm text-purple-200">Day Streak</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-green-300 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-2xl font-bold">{totalXp}</span>
              </div>
              <p className="text-sm text-purple-200">Total XP</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-pink-300 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-2xl font-bold">0/{dailyGoal}</span>
              </div>
              <p className="text-sm text-purple-200">Daily Goal</p>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl px-4 mt-8" style={{ marginInline: 'auto' }}>
        {/* Paris Countdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 shadow-2xl mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium mb-1">Paris Trip Countdown</p>
              <p className="text-4xl lg:text-5xl font-bold mb-2">~100 days</p>
              <p className="text-orange-200 text-sm">Keep practicing daily!</p>
            </div>
            <div className="text-7xl">🗼</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/practice')}
            className="bg-zinc-900 rounded-3xl p-6 text-left group border-2 border-zinc-800 hover:border-blue-500 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <Brain className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">Practice</h3>
            <p className="text-sm text-zinc-400">Review flashcards</p>
          </button>

          <button
            onClick={() => navigate('/phrases')}
            className="bg-zinc-900 rounded-3xl p-6 text-left group border-2 border-zinc-800 hover:border-purple-500 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
              <MessageCircle className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">Phrases</h3>
            <p className="text-sm text-zinc-400">Travel essentials</p>
          </button>

          <button
            onClick={() => navigate('/lessons')}
            className="bg-zinc-900 rounded-3xl p-6 text-left group border-2 border-zinc-800 hover:border-green-500 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <BookOpen className="w-7 h-7 text-green-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">Lessons</h3>
            <p className="text-sm text-zinc-400">Structured learning</p>
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="bg-zinc-900 rounded-3xl p-6 text-left group border-2 border-zinc-800 hover:border-amber-500 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
              <Trophy className="w-7 h-7 text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">Progress</h3>
            <p className="text-sm text-zinc-400">Track your stats</p>
          </button>
        </motion.div>

        {/* Start Learning CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 text-lg"
        >
          Start Learning
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        {/* Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Pro Tip</h4>
              <p className="text-sm text-zinc-400">
                Practice for just 10 minutes a day to build a lasting habit.
                Consistency beats intensity!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
