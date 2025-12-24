import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-20 lg:pb-8 lg:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md sm:max-w-xl lg:max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 mb-4 sm:mb-6"
          >
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            FastFrench
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-md mx-auto">
            Learn French quickly with bite-sized lessons
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
        >
          <StatCard value="0" label="Day Streak" color="from-primary-500 to-primary-600" />
          <StatCard value="0" label="Lessons" color="from-accent-500 to-accent-600" />
          <StatCard value="0" label="Words" color="from-yellow-500 to-yellow-600" />
        </motion.div>

        {/* Main Content Grid - Desktop shows side by side */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daily Goal</h2>
              <span className="text-sm text-gray-500">0/10 XP</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              />
            </div>
          </motion.div>

          {/* Paris Trip Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Paris Trip</h2>
            <p className="text-3xl sm:text-4xl font-bold mb-1">~100 days</p>
            <p className="text-sm opacity-90">Keep practicing daily!</p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="w-full lg:w-auto lg:px-12 mt-6 sm:mt-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 lg:mx-auto"
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
  color: string
}

function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-3 sm:p-4 lg:p-6 text-center">
      <div className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600">{label}</div>
    </div>
  )
}
