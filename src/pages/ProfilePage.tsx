import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Mail, Calendar, Target } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

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
    <div className="min-h-screen bg-zinc-950 text-white" style={{ paddingBottom: '5rem', paddingTop: '5rem' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: '32rem', marginInline: 'auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-6"
        >
          Profile
        </motion.h1>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-zinc-950 text-2xl font-bold">
              {profile ? getInitials(profile.display_name) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {profile?.display_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-zinc-400">
                {profile ? getRankLabel(profile.current_rank) : 'Beginner'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 pt-4 border-t border-zinc-700" style={{ gap: '1rem' }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {profile?.current_streak || 0}
              </div>
              <div className="text-xs text-zinc-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {profile?.total_xp || 0}
              </div>
              <div className="text-xs text-zinc-500">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {profile?.current_level || 1}
              </div>
              <div className="text-xs text-zinc-500">Level</div>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">Email</div>
                <div className="text-sm font-medium text-white">{user?.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">Member since</div>
                <div className="text-sm font-medium text-white">
                  {formatDate(user?.created_at || null)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">Daily Goal</div>
                <div className="text-sm font-medium text-white">
                  {profile?.daily_xp_goal || 20} XP per day
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium flex-1 text-left">Sign Out</span>
          </button>
        </motion.div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
            <p className="text-zinc-400 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

