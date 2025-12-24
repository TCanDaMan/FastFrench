import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Wait a moment to see if auth state updates
    const timer = setTimeout(() => {
      if (user) {
        setStatus('success')
        // Redirect to home after showing success
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setStatus('error')
        setErrorMessage('Authentication failed. Please try again.')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            {status === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
                  <h2 className="text-2xl font-bold text-gray-900">Signing you in...</h2>
                  <p className="text-gray-600">Please wait a moment</p>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                  <p className="text-gray-600">Redirecting you to your dashboard...</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
                  <p className="text-gray-600">{errorMessage}</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
