'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useHabits } from '@/hooks/useFirestore'
import { useTasks } from '@/hooks/useFirestore'
import { useJournal } from '@/hooks/useFirestore'
import { useReviews } from '@/hooks/useFirestore'
import { useLicense } from '@/hooks/useLicense'
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Calendar,
  BarChart3,
  FileText,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Activity,
  Star,
  Award,
  Flame,
  MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import HabitCard from '@/components/HabitCard'
import TaskCard from '@/components/TaskCard'
import DailyCounter from '@/components/DailyCounter'
import FloatingAction from '@/components/FloatingAction'
import OnboardingWizard from '@/components/OnboardingWizard'
import ProgressDashboard from '@/components/ProgressDashboard'
import DataOwnershipCenter from '@/components/DataOwnershipCenter'
import GoalsTracker from '@/components/GoalsTracker'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import AdminAnalytics from '@/components/AdminAnalytics'
import LilyChat from '@/components/LilyChat'

type TabType = 'habits' | 'tasks' | 'analytics' | 'goals' | 'data' | 'admin' | 'reviews' | 'lily'

// Animation variants for power-up sequence
const fadeGlowVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: 'easeOut',
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)'
    }
  }
}

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { habits, loading: habitsLoading } = useHabits(user?.uid || null)
  const { tasks, loading: tasksLoading } = useTasks(user?.uid || null)
  const { entries: journalEntries, loading: journalLoading } = useJournal(user?.uid || null)
  const { reviews, loading: reviewsLoading } = useReviews(user?.uid || null)
  const { license, loading: licenseLoading } = useLicense(user?.uid || null)
  
  const [activeTab, setActiveTab] = useState<TabType>('habits')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user && !habitsLoading && habits.length === 0) {
      setShowOnboarding(true)
    }
  }, [user, habitsLoading, habits])

  useEffect(() => {
    // Check if user is admin (you can implement your own admin logic)
    if (user?.email?.includes('admin') || user?.uid === 'admin-uid') {
      setIsAdmin(true)
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Welcome to MomentumX</h1>
          <p className="text-text-secondary mb-6">Please sign in to access your dashboard</p>
          <a 
            href="/app/auth/login" 
            className="btn-primary inline-block"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const loading = habitsLoading || tasksLoading || journalLoading || reviewsLoading || licenseLoading

  const tabs = [
    { id: 'habits', label: 'Habits', icon: Target, color: 'text-accent-blue' },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle, color: 'text-accent-green' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-accent-purple' },
    { id: 'goals', label: 'Goals', icon: Award, color: 'text-accent-orange' },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-accent-purple' },
    { id: 'data', label: 'Data', icon: FileText, color: 'text-accent-blue' },
    ...(license?.tier === 'coach' || license?.tier === 'business' ? [{ id: 'lily', label: 'Lily Chat', icon: MessageCircle, color: 'text-accent-pink' }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings, color: 'text-accent-red' }] : [])
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Habits</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Habit</span>
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-4 bg-background-tertiary rounded mb-4"></div>
                    <div className="h-3 bg-background-tertiary rounded mb-2"></div>
                    <div className="h-3 bg-background-tertiary rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Target className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No Habits Yet</h3>
                <p className="text-text-secondary mb-6">Start building your momentum by creating your first habit</p>
                <button className="btn-primary">Create Your First Habit</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            )}
          </div>
        )

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Tasks</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-4 bg-background-tertiary rounded mb-4"></div>
                    <div className="h-3 bg-background-tertiary rounded mb-2"></div>
                    <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <CheckCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No Tasks Yet</h3>
                <p className="text-text-secondary mb-6">Organize your day by adding tasks to track</p>
                <button className="btn-primary">Add Your First Task</button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate?.toISOString() || new Date().toISOString()}
                    completed={task.status === 'completed'}
                    priority={task.priority}
                    tags={task.tags}
                    onToggleComplete={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    direction="ltr"
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Analytics</h2>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">7D</button>
                <button className="btn-secondary text-sm">30D</button>
                <button className="btn-secondary text-sm">90D</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProgressDashboard habits={habits} tasks={tasks} userId={user.uid} />
              <AnalyticsDashboard 
                habits={habits} 
                tasks={tasks} 
                journalEntries={journalEntries} 
                reviews={reviews} 
                userId={user.uid} 
              />
            </div>
          </div>
        )

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Goals & Momentum</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>
            
            <GoalsTracker userId={user.uid} />
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Data Ownership</h2>
            </div>
            
            <DataOwnershipCenter 
              habits={habits}
              tasks={tasks}
              journalEntries={journalEntries}
              reviews={reviews}
              user={{
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
              }}
            />
          </div>
        )

      case 'admin':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Admin Analytics</h2>
            </div>
            
            <AdminAnalytics isAdmin={isAdmin} />
          </div>
        )

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Weekly Reviews</h2>
              <button
                onClick={() => window.location.href = '/app/reviews'}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Go to Reviews</span>
              </button>
            </div>
            
            <div className="glass-card p-6">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-accent-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">Weekly Reflection</h3>
                <p className="text-text-secondary mb-4">
                  Track your weekly progress, mood, and insights with our comprehensive review system.
                </p>
                <button
                  onClick={() => window.location.href = '/app/reviews'}
                  className="btn-primary"
                >
                  Start Weekly Review
                </button>
              </div>
            </div>
          </div>
        )

      case 'lily':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Chat with Lily</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">AI Coach Online</span>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <LilyChat />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar user={{
        displayName: user?.displayName || undefined,
        email: user?.email || undefined,
        photoURL: user?.photoURL || undefined
      }} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Welcome back, {user.displayName || user.email}
              </h1>
              <p className="text-text-secondary">
                Continue your momentum journey
              </p>
            </div>
            <DailyCounter />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-background-secondary rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {renderTabContent()}
        </motion.div>

        {/* Floating Action Button */}
        <FloatingAction />
      </div>

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onComplete={async (data) => {
            // Handle onboarding completion
            setShowOnboarding(false)
            toast.success('Welcome to your momentum journey!')
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  )
} 