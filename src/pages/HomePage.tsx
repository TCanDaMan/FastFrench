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
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8 pt-4 lg:pt-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Bonjour, {displayName}!</h1>
              <p className="text-blue-100">Ready to learn some French?</p>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mt-6"
          >
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-300 mb-1">
                <Flame className="w-5 h-5" />
                <span className="text-2xl font-bold">{currentStreak}</span>
              </div>
              <p className="text-xs text-blue-100">Day Streak</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-300 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-2xl font-bold">{totalXp}</span>
              </div>
              <p className="text-xs text-blue-100">Total XP</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-300 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-2xl font-bold">0/{dailyGoal}</span>
              </div>
              <p className="text-xs text-blue-100">Daily Goal</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        {/* Paris Countdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-5 text-white shadow-xl mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium mb-1">Paris Trip Countdown</p>
              <p className="text-3xl lg:text-4xl font-bold">~100 days</p>
              <p className="text-rose-100 text-sm mt-1">Keep practicing daily!</p>
            </div>
            <div className="text-6xl">🗼</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <button
            onClick={() => navigate('/practice')}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left group border-2 border-transparent hover:border-blue-500"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors">
              <Brain className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Practice</h3>
            <p className="text-sm text-gray-500">Review flashcards</p>
          </button>

          <button
            onClick={() => navigate('/phrases')}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left group border-2 border-transparent hover:border-purple-500"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-colors">
              <MessageCircle className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Phrases</h3>
            <p className="text-sm text-gray-500">Travel essentials</p>
          </button>

          <button
            onClick={() => navigate('/lessons')}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left group border-2 border-transparent hover:border-green-500"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-500 transition-colors">
              <BookOpen className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Lessons</h3>
            <p className="text-sm text-gray-500">Structured learning</p>
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left group border-2 border-transparent hover:border-amber-500"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-500 transition-colors">
              <Trophy className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Progress</h3>
            <p className="text-sm text-gray-500">Track your stats</p>
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
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-700">
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
