import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/profile', label: 'Profile', icon: User },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-inset-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[60px] py-2"
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div className="relative">
                  <Icon
                    size={24}
                    className={`transition-colors ${
                      isActive ? 'text-primary-900' : 'text-gray-400'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary-900 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{ x: '-50%' }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary-900' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
