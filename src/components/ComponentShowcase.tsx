import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ProgressBar,
  Badge,
  IconButton,
  useToast,
  SkeletonCard,
  SkeletonText,
  Confetti,
  XPDisplay,
  StreakCounter,
  DailyGoalRing,
  AchievementCard,
  LevelUpModal,
  CountdownTimer,
} from './index';
import { Play, Heart, Star, Zap } from 'lucide-react';

/**
 * Component Showcase - Demo page to visualize all UI components
 * Use this for development and testing
 */
export const ComponentShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">
            FastFrench Component Library
          </h1>
          <p className="text-gray-600">
            A showcase of all available UI components
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>
              Loading
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Icon Buttons</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <IconButton icon={Play} variant="primary" aria-label="Play" />
            <IconButton icon={Heart} variant="secondary" aria-label="Like" />
            <IconButton icon={Star} variant="ghost" aria-label="Star" />
            <IconButton icon={Play} variant="primary" size="sm" aria-label="Play small" />
            <IconButton icon={Play} variant="primary" size="lg" aria-label="Play large" />
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info" dot>
              With Dot
            </Badge>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Progress Bars</h2>
          <div className="space-y-4 max-w-md">
            <ProgressBar progress={25} color="primary" />
            <ProgressBar progress={50} color="accent" />
            <ProgressBar progress={75} color="success" />
            <ProgressBar progress={100} color="primary" />
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hoverable>
              <CardHeader>
                <h3 className="text-lg font-bold">Basic Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">This is a hoverable card with shadow.</p>
              </CardBody>
            </Card>

            <Card gradient>
              <CardHeader>
                <h3 className="text-lg font-bold">Gradient Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">This card has a French flag gradient.</p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Modals & Toasts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Modals & Toasts</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Open Modal
            </Button>
            <Button variant="primary" onClick={() => showToast('Success!', 'success')}>
              Success Toast
            </Button>
            <Button variant="danger" onClick={() => showToast('Error occurred', 'error')}>
              Error Toast
            </Button>
            <Button variant="secondary" onClick={() => showToast('Information', 'info')}>
              Info Toast
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }}
            >
              Show Confetti
            </Button>
          </div>
        </section>

        {/* Skeletons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Loading Skeletons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <div className="bg-white rounded-xl p-6">
              <SkeletonText lines={4} />
            </div>
          </div>
        </section>

        {/* Feature Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Feature Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <XPDisplay currentXP={750} nextLevelXP={1000} level={5} rank="Apprentice" />

            <StreakCounter streak={14} freezes={2} maxStreak={21} />

            <DailyGoalRing current={35} goal={50} />
          </div>
        </section>

        {/* Achievement Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Achievement Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AchievementCard
              name="First Steps"
              description="Complete your first lesson"
              icon={Star}
              xpReward={50}
              unlocked={true}
              unlockedAt={new Date()}
            />

            <AchievementCard
              name="Marathon Runner"
              description="Maintain a 30-day streak"
              icon={Zap}
              xpReward={500}
              unlocked={false}
              progress={14}
              progressMax={30}
            />
          </div>
        </section>

        {/* Countdown Timer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Countdown Timer</h2>
          <div className="max-w-2xl">
            <CountdownTimer
              targetDate={new Date('2025-12-25')}
              title="Paris Trip Countdown"
            />
          </div>
        </section>

        {/* Level Up Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900">Level Up Modal</h2>
          <Button variant="primary" onClick={() => setShowLevelUp(true)}>
            Trigger Level Up
          </Button>
        </section>
      </div>

      {/* Modals */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Example Modal">
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example modal with smooth animations and backdrop blur.
          </p>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close Modal
          </Button>
        </div>
      </Modal>

      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={6}
        newRank="Scholar"
        xpEarned={100}
        nextLevelXP={1200}
      />

      <Confetti active={showConfetti} />
    </div>
  );
};
