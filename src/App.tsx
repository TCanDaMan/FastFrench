import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Home, Trophy, GraduationCap, MessageCircle } from 'lucide-react'
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

function Navigation() {
  const location = useLocation()

  // Hide nav on auth pages
  const hideNav = ['/login', '/signup', '/auth/callback'].includes(location.pathname)
  if (hideNav) return null

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/phrases', icon: MessageCircle, label: 'Phrases' },
    { to: '/practice', icon: GraduationCap, label: 'Practice' },
    { to: '/progress', icon: Trophy, label: 'Progress' },
  ]

  return (
    <nav className="fixed bottom-0 lg:bottom-auto lg:top-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t lg:border-t-0 lg:border-b border-border safe-area-bottom z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around lg:justify-center items-center h-16 lg:h-14 lg:gap-8">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base">
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
        <Navigation />
      </div>
    </BrowserRouter>
  )
}

export default App
