'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Calendar, 
  Target, 
  Heart, 
  Shield, 
  CheckCircle,
  Clock,
  Globe,
  Phone,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface OnboardingData {
  name: string
  recoveryStartDate: string
  timezone: string
  selectedHabits: string[]
  motivationType: 'islamic' | 'self-discipline' | 'stoic' | 'ai-coach'
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface OnboardingWizardProps {
  isOpen: boolean
  onComplete: (data: OnboardingData) => Promise<void>
  onClose: () => void
}

const habitPresets = [
  { id: 'prayer', label: 'Daily Prayer', icon: '🕌', category: 'Faith' },
  { id: 'walking', label: 'Morning Walk', icon: '🚶', category: 'Health' },
  { id: 'dopamine-detox', label: 'Dopamine Detox', icon: '🧠', category: 'Mental Health' },
  { id: 'journaling', label: 'Daily Journaling', icon: '📝', category: 'Reflection' },
  { id: 'reading', label: 'Reading Quran/Books', icon: '📚', category: 'Learning' },
  { id: 'meditation', label: 'Meditation', icon: '🧘', category: 'Mindfulness' },
  { id: 'exercise', label: 'Exercise', icon: '💪', category: 'Health' },
  { id: 'gratitude', label: 'Gratitude Practice', icon: '🙏', category: 'Mindfulness' },
  { id: 'water', label: 'Drink Water', icon: '💧', category: 'Health' },
  { id: 'sleep', label: 'Early Sleep', icon: '😴', category: 'Health' }
]

const motivationTypes = [
  {
    id: 'islamic',
    label: 'Islamic Path',
    description: 'Strengthen your faith and connection with Allah',
    icon: '🕌',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'self-discipline',
    label: 'Self-Discipline',
    description: 'Build unshakeable willpower and character',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'stoic',
    label: 'Stoic Philosophy',
    description: 'Embrace wisdom and emotional resilience',
    icon: '🏛️',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'ai-coach',
    label: 'AI Coach',
    description: 'Personalized guidance and accountability',
    icon: '🤖',
    color: 'from-pink-500 to-rose-600'
  }
]

const steps = [
  { id: 1, title: 'Welcome', icon: Star },
  { id: 2, title: 'Your Name', icon: User },
  { id: 3, title: 'Recovery Start', icon: Calendar },
  { id: 4, title: 'Choose Habits', icon: Target },
  { id: 5, title: 'Motivation', icon: Heart },
  { id: 6, title: 'Emergency Contact', icon: Shield },
  { id: 7, title: 'Complete', icon: CheckCircle }
]

export default function OnboardingWizard({ isOpen, onComplete, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    name: '',
    recoveryStartDate: new Date().toISOString().split('T')[0],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    selectedHabits: [],
    motivationType: 'islamic'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setData({
        name: '',
        recoveryStartDate: new Date().toISOString().split('T')[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        selectedHabits: [],
        motivationType: 'islamic'
      })
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (data.selectedHabits.length < 3) {
      toast.error('Please select at least 3 habits')
      return
    }

    setIsSubmitting(true)
    try {
      await onComplete(data)
      toast.success('Welcome to your 180-day momentum journey!')
    } catch (error: any) {
      toast.error('Failed to complete setup: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleHabit = (habitId: string) => {
    setData(prev => ({
      ...prev,
      selectedHabits: prev.selectedHabits.includes(habitId)
        ? prev.selectedHabits.filter(id => id !== habitId)
        : [...prev.selectedHabits, habitId]
    }))
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your 180-Day Momentum
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Transform your life with daily habits, unwavering discipline, and spiritual growth. 
              This journey will change everything.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="glass rounded-lg p-4">
                <div className="text-2xl mb-2">🕌</div>
                <h3 className="font-semibold text-white">Faith & Discipline</h3>
                <p className="text-gray-400 text-sm">Strengthen your connection with Allah</p>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-white">Unshakeable Will</h3>
                <p className="text-gray-400 text-sm">Build character through daily practice</p>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-white">Track Progress</h3>
                <p className="text-gray-400 text-sm">See your transformation unfold</p>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
              <p className="text-gray-400">We'll personalize your journey</p>
            </div>
            <div className="space-y-4">
              <label className="block text-gray-300 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">When did your recovery begin?</h2>
              <p className="text-gray-400">This marks the start of your transformation</p>
            </div>
            <div className="space-y-4">
              <label className="block text-gray-300 text-sm font-medium">
                Recovery Start Date
              </label>
              <input
                type="date"
                value={data.recoveryStartDate}
                onChange={(e) => updateData('recoveryStartDate', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-neon-turquoise focus:outline-none"
              />
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Timezone: {data.timezone}</span>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Habits</h2>
              <p className="text-gray-400">Select 3-7 habits to build your foundation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {habitPresets.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    data.selectedHabits.includes(habit.id)
                      ? 'border-neon-turquoise bg-neon-turquoise/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{habit.label}</div>
                      <div className="text-sm text-gray-400">{habit.category}</div>
                    </div>
                    {data.selectedHabits.includes(habit.id) && (
                      <CheckCircle className="w-5 h-5 text-neon-turquoise ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-400">
              {data.selectedHabits.length}/7 habits selected
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Motivation</h2>
              <p className="text-gray-400">What drives your transformation?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {motivationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateData('motivationType', type.id)}
                  className={`p-6 rounded-lg border transition-all text-left ${
                    data.motivationType === type.id
                      ? 'border-neon-turquoise bg-neon-turquoise/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div className="font-semibold text-white">{type.label}</div>
                  </div>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                  {data.motivationType === type.id && (
                    <CheckCircle className="w-5 h-5 text-neon-turquoise mt-3" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Emergency Contact (Optional)</h2>
              <p className="text-gray-400">Someone to reach out to in difficult moments</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={data.emergencyContact?.name || ''}
                  onChange={(e) => updateData('emergencyContact', { 
                    ...data.emergencyContact, 
                    name: e.target.value 
                  })}
                  placeholder="Full name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={data.emergencyContact?.phone || ''}
                  onChange={(e) => updateData('emergencyContact', { 
                    ...data.emergencyContact, 
                    phone: e.target.value 
                  })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  value={data.emergencyContact?.relationship || ''}
                  onChange={(e) => updateData('emergencyContact', { 
                    ...data.emergencyContact, 
                    relationship: e.target.value 
                  })}
                  placeholder="e.g., Spouse, Friend, Mentor"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-neon-green to-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              You're All Set!
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Welcome to your 180-day momentum journey, {data.name}. 
              Your transformation begins now.
            </p>
            <div className="glass rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-white mb-4">Your Setup Summary</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Recovery Start: {new Date(data.recoveryStartDate).toLocaleDateString()}</div>
                <div>• Habits Selected: {data.selectedHabits.length}</div>
                <div>• Motivation: {motivationTypes.find(t => t.id === data.motivationType)?.label}</div>
                {data.emergencyContact?.name && (
                  <div>• Emergency Contact: {data.emergencyContact.name}</div>
                )}
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id <= currentStep
                    ? 'bg-neon-turquoise text-black'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 2 && !data.name.trim()) ||
                (currentStep === 4 && data.selectedHabits.length < 3)
              }
              className="flex items-center px-6 py-2 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-neon-green to-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-green/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Setting up...
                </>
              ) : (
                <>
                  Start My Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
} 