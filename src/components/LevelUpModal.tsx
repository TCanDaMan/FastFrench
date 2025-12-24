import { motion } from 'framer-motion';
import { Trophy, Zap, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { Confetti } from './Confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newRank: string;
  xpEarned: number;
  nextLevelXP: number;
}

export const LevelUpModal = ({
  isOpen,
  onClose,
  newLevel,
  newRank,
  xpEarned,
  nextLevelXP,
}: LevelUpModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <Confetti active={showConfetti} duration={3000} />
      <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
        <div className="text-center py-6">
          {/* Trophy animation */}
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6">
                <Trophy size={64} className="text-white" fill="currentColor" />
              </div>
            </div>
          </motion.div>

          {/* Level up text */}
          <motion.h2
            className="text-3xl font-bold text-primary-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Level Up!
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-5xl font-bold text-primary-900">{newLevel}</span>
            <Badge variant="primary" size="lg">
              {newRank}
            </Badge>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={20} className="text-primary-900" fill="currentColor" />
                <span className="text-2xl font-bold text-primary-900">+{xpEarned}</span>
              </div>
              <p className="text-sm text-gray-600">XP Earned</p>
            </div>

            <div className="bg-accent-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ArrowRight size={20} className="text-accent-600" />
                <span className="text-2xl font-bold text-accent-600">{nextLevelXP}</span>
              </div>
              <p className="text-sm text-gray-600">Next Level</p>
            </div>
          </motion.div>

          {/* Motivational message */}
          <motion.p
            className="text-gray-600 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Fantastic progress! Keep learning and growing your French skills!
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="primary" size="lg" onClick={onClose} fullWidth>
              Continue Learning
            </Button>
          </motion.div>
        </div>
      </Modal>
    </>
  );
};
