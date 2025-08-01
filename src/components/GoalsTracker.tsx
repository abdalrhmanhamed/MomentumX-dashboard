'use client'

import { useState, useEffect } from 'react'
import { 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Star,
  Award,
  Zap,
  Flame,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Goal {
  id: string
  title: string
  description: string
  category: 'faith' | 'work' | 'health' | 'sobriety' | 'learning' | 'custom'
  duration: 7 | 14 | 30 | 90 | 180
  startDate: string
  endDate: string
  progress: number // 0-100
  status: 'active' | 'completed' | 'failed'
  milestones: Milestone[]
  createdAt: string
}

interface Milestone {
  id: string
  title: string
  completed: boolean
  dueDate: string
}

interface GoalTemplate {
  id: string
  title: string
  description: string
  category: Goal['category']
  duration: Goal['duration']
  milestones: Omit<Milestone, 'id'>[]
}

const goalTemplates: GoalTemplate[] = [
  {
    id: 'faith-builder',
    title: 'Faith Builder',
    description: 'Strengthen your spiritual foundation',
    category: 'faith',
    duration: 30,
    milestones: [
      { title: 'Complete 7 days of daily prayer', completed: false, dueDate: '' },
      { title: 'Read Quran for 15 minutes daily', completed: false, dueDate: '' },
      { title: 'Attend Friday prayer consistently', completed: false, dueDate: '' },
      { title: 'Practice gratitude journaling', completed: false, dueDate: '' }
    ]
  },
  {
    id: 'deep-work',
    title: 'Deep Work Sprint',
    description: 'Master focused productivity',
    category: 'work',
    duration: 14,
    milestones: [
      { title: 'Set up distraction-free workspace', completed: false, dueDate: '' },
      { title: 'Complete 5 deep work sessions', completed: false, dueDate: '' },
      { title: 'Track productivity metrics', completed: false, dueDate: '' },
      { title: 'Review and optimize workflow', completed: false, dueDate: '' }
    ]
  },
  {
    id: 'sobriety-sprint',
    title: 'Sobriety Sprint',
    description: 'Build lasting recovery habits',
    category: 'sobriety',
    duration: 90,
    milestones: [
      { title: 'Complete 30 days clean', completed: false, dueDate: '' },
      { title: 'Attend support group meetings', completed: false, dueDate: '' },
      { title: 'Develop healthy coping mechanisms', completed: false, dueDate: '' },
      { title: 'Build sober social connections', completed: false, dueDate: '' }
    ]
  },
  {
    id: 'health-transformation',
    title: 'Health Transformation',
    description: 'Transform your physical well-being',
    category: 'health',
    duration: 180,
    milestones: [
      { title: 'Establish daily exercise routine', completed: false, dueDate: '' },
      { title: 'Improve sleep quality', completed: false, dueDate: '' },
      { title: 'Optimize nutrition habits', completed: false, dueDate: '' },
      { title: 'Reduce stress levels', completed: false, dueDate: '' }
    ]
  }
]

const badges = {
  'faith-builder': { name: 'Faith Warrior', icon: '🕌', color: 'text-green-400' },
  'deep-work': { name: 'Focus Master', icon: '🎯', color: 'text-blue-400' },
  'sobriety-sprint': { name: 'Recovery Champion', icon: '💪', color: 'text-purple-400' },
  'health-transformation': { name: 'Health Guardian', icon: '🏃', color: 'text-orange-400' }
}

interface GoalsTrackerProps {
  userId: string
}

export default function GoalsTracker({ userId }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [momentumScore, setMomentumScore] = useState(0)

  // Calculate momentum score based on goal progress and streaks
  useEffect(() => {
    const calculateMomentumScore = () => {
      const activeGoals = goals.filter(goal => goal.status === 'active')
      const completedGoals = goals.filter(goal => goal.status === 'completed')
      
      let score = 0
      
      // Active goals progress
      activeGoals.forEach(goal => {
        score += goal.progress * 0.5 // 50% weight for progress
      })
      
      // Completed goals bonus
      score += completedGoals.length * 25 // 25 points per completed goal
      
      // Streak bonus (if any)
      const currentStreak = calculateCurrentStreak()
      score += currentStreak * 5 // 5 points per day of streak
      
      setMomentumScore(Math.min(100, Math.max(0, score)))
    }
    
    calculateMomentumScore()
  }, [goals])

  const calculateCurrentStreak = () => {
    // TODO: Implement streak calculation based on daily habit completion
    return 7 // Placeholder
  }

  const createGoalFromTemplate = (template: GoalTemplate) => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + template.duration)
    
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: template.title,
      description: template.description,
      category: template.category,
      duration: template.duration,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      progress: 0,
      status: 'active',
      milestones: template.milestones.map((milestone, index) => ({
        id: `milestone-${Date.now()}-${index}`,
        title: milestone.title,
        completed: false,
        dueDate: new Date(startDate.getTime() + (index * template.duration * 24 * 60 * 60 * 1000 / template.milestones.length)).toISOString().split('T')[0]
      })),
      createdAt: new Date().toISOString()
    }
    
    setGoals(prev => [...prev, newGoal])
    setActiveGoal(newGoal)
    setShowTemplateSelector(false)
    toast.success(`Goal "${template.title}" created!`)
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: Math.min(100, Math.max(0, progress)) }
        : goal
    ))
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        )
        
        const completedMilestones = updatedMilestones.filter(m => m.completed).length
        const progress = (completedMilestones / updatedMilestones.length) * 100
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          status: progress >= 100 ? 'completed' : 'active'
        }
      }
      return goal
    }))
  }

  const getGoalStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-neon-turquoise'
      case 'completed': return 'text-neon-green'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getGoalStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Goals & Momentum</h2>
          <p className="text-gray-400">Track your progress and build momentum</p>
        </div>
        <button
          onClick={() => setShowTemplateSelector(true)}
          className="flex items-center px-4 py-2 bg-neon-turquoise text-black rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </button>
      </div>

      {/* Momentum Meter */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-neon-turquoise" />
          Momentum Meter
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Your Momentum Score</span>
            <span className="text-2xl font-bold text-neon-turquoise">{momentumScore}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-neon-turquoise to-neon-green h-3 rounded-full transition-all duration-500"
              style={{ width: `${momentumScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-neon-green" />
          Active Goals
        </h3>
        
        {goals.filter(goal => goal.status === 'active').length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Goals</h3>
            <p className="text-gray-400 mb-6">
              Start your journey by creating your first goal
            </p>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-6 py-3 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.filter(goal => goal.status === 'active').map((goal) => (
              <div key={goal.id} className="glass rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{goal.title}</h4>
                    <p className="text-gray-400 text-sm">{goal.description}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${getGoalStatusColor(goal.status)}`}>
                    {getGoalStatusIcon(goal.status)}
                    <span className="text-sm capitalize">{goal.status}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-neon-turquoise">{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-neon-turquoise to-neon-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Duration: {goal.duration} days</span>
                    <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-white text-sm">Milestones</h5>
                    {goal.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                          className={`w-4 h-4 rounded border transition-all ${
                            milestone.completed
                              ? 'bg-neon-green border-neon-green'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {milestone.completed && <CheckCircle className="w-3 h-3 text-black" />}
                        </button>
                        <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {goal.milestones.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{goal.milestones.length - 3} more milestones
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {goals.filter(goal => goal.status === 'completed').length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-neon-green" />
            Completed Goals
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.filter(goal => goal.status === 'completed').map((goal) => (
              <div key={goal.id} className="glass rounded-xl p-6 border border-neon-green/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{goal.title}</h4>
                    <p className="text-gray-400 text-sm">{goal.description}</p>
                  </div>
                  <div className="text-neon-green">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Completed on {new Date(goal.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Choose a Goal Template</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => createGoalFromTemplate(template)}
                  className="p-6 rounded-lg border border-gray-600 hover:border-neon-turquoise transition-all text-left"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{badges[template.id as keyof typeof badges]?.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{template.title}</h4>
                      <p className="text-sm text-gray-400">{template.duration} days</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  <div className="text-xs text-gray-400">
                    {template.milestones.length} milestones included
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 