import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, Trophy, User, GraduationCap } from 'lucide-react'
import HomePage from './pages/HomePage'
import LessonsPage from './pages/LessonsPage'
import PracticePage from './pages/PracticePage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        {/* Bottom Navigation */}
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom"
        >
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-around items-center h-16">
              <NavItem to="/" icon={Home} label="Home" />
              <NavItem to="/lessons" icon={BookOpen} label="Lessons" />
              <NavItem to="/practice" icon={GraduationCap} label="Practice" />
              <NavItem to="/progress" icon={Trophy} label="Progress" />
              <NavItem to="/profile" icon={User} label="Profile" />
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
    <Link to={to} className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}

export default App
