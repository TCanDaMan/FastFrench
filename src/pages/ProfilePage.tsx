import { motion } from 'framer-motion'
import { Settings, LogOut, Bell, Globe, Mail, Calendar, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRankLabel = (rank: string) => {
    const labels = {
      debutant: 'Beginner',
      touriste: 'Tourist',
      voyageur: 'Traveler',
      parisien: 'Parisian',
      maitre: 'Master'
    }
    return labels[rank as keyof typeof labels] || 'Beginner'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
              {profile ? getInitials(profile.display_name) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.display_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-gray-600">
                {profile ? getRankLabel(profile.current_rank) : 'Beginner'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {profile?.current_streak || 0}
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {profile?.total_xp || 0}
              </div>
              <div className="text-xs text-gray-600">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {profile?.current_level || 1}
              </div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm font-medium text-gray-900">{user?.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Member since</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(user?.created_at || null)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Daily Goal</div>
                <div className="text-sm font-medium text-gray-900">
                  {profile?.daily_xp_goal || 20} XP per day
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <MenuItem icon={Settings} label="Settings" />
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Globe} label="Language" />
          <MenuItem icon={LogOut} label="Sign Out" danger onClick={handleSignOut} />
        </motion.div>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ElementType
  label: string
  danger?: boolean
  onClick?: () => void
}

function MenuItem({ icon: Icon, label, danger, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
        danger ? 'text-red-600' : 'text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
