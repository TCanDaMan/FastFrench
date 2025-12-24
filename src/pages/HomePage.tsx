import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Flame, BookOpen, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-24 lg:pb-8 pt-4 lg:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 mb-6 shadow-xl"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            FastFrench
          </h1>

          <p className="text-lg text-gray-600">
            Learn French quickly with bite-sized lessons
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <StatCard
            value="0"
            label="Day Streak"
            icon={Flame}
            gradient="from-orange-500 to-red-500"
          />
          <StatCard
            value="0"
            label="Lessons"
            icon={BookOpen}
            gradient="from-blue-500 to-indigo-500"
          />
          <StatCard
            value="0"
            label="Words"
            icon={Brain}
            gradient="from-emerald-500 to-teal-500"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Daily Goal</h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">0/10 XP</span>
            </div>

            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">Complete lessons to earn XP!</p>
          </motion.div>

          {/* Paris Trip Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🗼</span>
              <h2 className="text-xl font-bold">Paris Trip</h2>
            </div>
            <p className="text-4xl font-bold mb-2">~100 days</p>
            <p className="text-sm opacity-90">Keep practicing daily to be ready!</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <ActionCard
            title="Practice Vocabulary"
            subtitle="Review flashcards"
            emoji="📚"
            onClick={() => navigate('/practice')}
          />
          <ActionCard
            title="Learn Phrases"
            subtitle="Travel essentials"
            emoji="💬"
            onClick={() => navigate('/phrases')}
          />
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}

interface StatCardProps {
  value: string
  label: string
  icon: React.ElementType
  gradient: string
}

function StatCard({ value, label, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 text-center">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${gradient} mb-2`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  )
}

interface ActionCardProps {
  title: string
  subtitle: string
  emoji: string
  onClick: () => void
}

function ActionCard({ title, subtitle, emoji, onClick }: ActionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-md p-4 text-left hover:border-primary-300 hover:shadow-lg transition-all"
    >
      <span className="text-2xl mb-2 block">{emoji}</span>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.button>
  )
}
