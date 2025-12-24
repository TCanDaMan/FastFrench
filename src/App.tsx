import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, Trophy, GraduationCap, MessageCircle } from 'lucide-react'
import HomePage from './pages/HomePage'
import LessonsPage from './pages/LessonsPage'
import PracticePage from './pages/PracticePage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import PhrasesPage from './pages/PhrasesPage'
import { PronunciationPage } from './pages/PronunciationPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/lessons" element={<ProtectedRoute><LessonsPage /></ProtectedRoute>} />
          <Route path="/phrases" element={<ProtectedRoute><PhrasesPage /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
          <Route path="/pronunciation" element={<ProtectedRoute><PronunciationPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>

        {/* Bottom Navigation - becomes top nav on large screens */}
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 lg:bottom-auto lg:top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-b border-zinc-800 safe-area-inset-bottom z-50"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex justify-around lg:justify-center lg:gap-12 items-center h-16 lg:h-14">
              <NavItem to="/" icon={Home} label="Home" />
              <NavItem to="/lessons" icon={BookOpen} label="Lessons" />
              <NavItem to="/phrases" icon={MessageCircle} label="Phrases" />
              <NavItem to="/practice" icon={GraduationCap} label="Practice" />
              <NavItem to="/progress" icon={Trophy} label="Progress" />
            </div>
          </div>
        </motion.nav>
      </div>
    </BrowserRouter>
  )
}

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors">
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}

export default App
