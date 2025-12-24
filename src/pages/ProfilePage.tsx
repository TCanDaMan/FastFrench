import { motion } from 'framer-motion'
import { Settings, LogOut, Bell, Globe } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Profile
        </motion.h1>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User</h2>
              <p className="text-gray-600">Beginner</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">0</div>
              <div className="text-xs text-gray-600">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-xs text-gray-600">Rank</div>
            </div>
          </div>
        </motion.div>

        {/* Settings Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <MenuItem icon={Settings} label="Settings" />
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Globe} label="Language" />
          <MenuItem icon={LogOut} label="Sign Out" danger />
        </motion.div>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ElementType
  label: string
  danger?: boolean
}

function MenuItem({ icon: Icon, label, danger }: MenuItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
        danger ? 'text-red-600' : 'text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
