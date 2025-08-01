'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Zap,
  Eye,
  Download
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays } from 'date-fns'
import type { Habit, Task, JournalEntry, Review } from '@/types'

interface AnalyticsDashboardProps {
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  reviews: Review[]
  userId: string
}

interface TrendData {
  date: string
  habitsCompleted: number
  tasksCompleted: number
  moodScore: number
  clarityScore: number
}

interface HabitAnalytics {
  id: string
  title: string
  completionRate: number
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  averagePerWeek: number
}

interface TaskAnalytics {
  id: string
  title: string
  status: string
  priority: string
  daysOverdue: number
  completionTime: number
}

export default function AnalyticsDashboard({ 
  habits, 
  tasks, 
  journalEntries, 
  reviews, 
  userId 
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '180d'>('30d')
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [habitAnalytics, setHabitAnalytics] = useState<HabitAnalytics[]>([])
  const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalytics[]>([])
  const [insights, setInsights] = useState<string[]>([])

  // Generate trend data for the selected period
  useEffect(() => {
    const generateTrendData = () => {
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 180
      const endDate = new Date()
      const startDate = subDays(endDate, days)
      
      const data: TrendData[] = []
      
      for (let i = 0; i < days; i++) {
        const date = subDays(endDate, days - i - 1)
        const dateStr = format(date, 'yyyy-MM-dd')
        
        // Calculate habits completed for this date
        const habitsCompleted = habits.filter(habit => 
          habit.completedDates.includes(dateStr)
        ).length
        
        // Calculate tasks completed for this date
        const tasksCompleted = tasks.filter(task => 
          task.status === 'completed' && 
          task.completedAt && 
          format(new Date(task.completedAt), 'yyyy-MM-dd') === dateStr
        ).length
        
        // Get mood score from reviews (closest to this date)
        const relevantReview = reviews.find(review => {
          const reviewDate = new Date(review.createdAt)
          const daysDiff = Math.abs(differenceInDays(date, reviewDate))
          return daysDiff <= 7 // Within a week
        })
        
        const moodScore = relevantReview?.moodScore || 5
        
        // Calculate clarity score (habit completion rate)
        const clarityScore = habits.length > 0 ? (habitsCompleted / habits.length) * 100 : 0
        
        data.push({
          date: dateStr,
          habitsCompleted,
          tasksCompleted,
          moodScore,
          clarityScore
        })
      }
      
      setTrendData(data)
    }
    
    generateTrendData()
  }, [habits, tasks, reviews, selectedPeriod])

  // Calculate habit analytics
  useEffect(() => {
    const calculateHabitAnalytics = () => {
      const analytics: HabitAnalytics[] = habits.map(habit => {
        const completionRate = habit.completedDates.length / Math.max(1, differenceInDays(new Date(), new Date(habit.createdAt)))
        const averagePerWeek = habit.completedDates.length / Math.max(1, Math.floor(differenceInDays(new Date(), new Date(habit.createdAt)) / 7))
        
        return {
          id: habit.id,
          title: habit.title,
          completionRate: completionRate * 100,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          totalCompletions: habit.completedDates.length,
          averagePerWeek
        }
      })
      
      setHabitAnalytics(analytics)
    }
    
    calculateHabitAnalytics()
  }, [habits])

  // Calculate task analytics
  useEffect(() => {
    const calculateTaskAnalytics = () => {
      const analytics: TaskAnalytics[] = tasks.map(task => {
        const daysOverdue = task.dueDate && task.status !== 'completed' 
          ? Math.max(0, differenceInDays(new Date(), new Date(task.dueDate)))
          : 0
        
        const completionTime = task.completedAt && task.createdAt
          ? differenceInDays(new Date(task.completedAt), new Date(task.createdAt))
          : 0
        
        return {
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          daysOverdue,
          completionTime
        }
      })
      
      setTaskAnalytics(analytics)
    }
    
    calculateTaskAnalytics()
  }, [tasks])

  // Generate insights
  useEffect(() => {
    const generateInsights = () => {
      const newInsights: string[] = []
      
      // Habit insights
      const bestHabit = habitAnalytics.reduce((best, current) => 
        current.completionRate > best.completionRate ? current : best
      )
      
      if (bestHabit.completionRate > 80) {
        newInsights.push(`🎯 "${bestHabit.title}" is your strongest habit with ${bestHabit.completionRate.toFixed(1)}% completion rate`)
      }
      
      const worstHabit = habitAnalytics.reduce((worst, current) => 
        current.completionRate < worst.completionRate ? current : worst
      )
      
      if (worstHabit.completionRate < 30) {
        newInsights.push(`⚠️ "${worstHabit.title}" needs attention - only ${worstHabit.completionRate.toFixed(1)}% completion rate`)
      }
      
      // Streak insights
      const longestStreak = Math.max(...habitAnalytics.map(h => h.longestStreak))
      if (longestStreak > 7) {
        newInsights.push(`🔥 Your longest streak is ${longestStreak} days - amazing consistency!`)
      }
      
      // Task insights
      const overdueTasks = taskAnalytics.filter(t => t.daysOverdue > 0).length
      if (overdueTasks > 0) {
        newInsights.push(`⏰ You have ${overdueTasks} overdue tasks - consider reprioritizing`)
      }
      
      // Mood insights
      const averageMood = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.moodScore, 0) / reviews.length 
        : 0
      
      if (averageMood > 7) {
        newInsights.push(`😊 Your average mood score is ${averageMood.toFixed(1)}/10 - great mental state!`)
      } else if (averageMood < 5) {
        newInsights.push(`😔 Your average mood score is ${averageMood.toFixed(1)}/10 - consider self-care activities`)
      }
      
      setInsights(newInsights)
    }
    
    generateInsights()
  }, [habitAnalytics, taskAnalytics, reviews])

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-neon-green'
    if (rate >= 60) return 'text-yellow-400'
    if (rate >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-neon-green'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics & Trends</h2>
          <p className="text-gray-400">Deep insights into your progress patterns</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {(['7d', '30d', '90d', '180d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-neon-turquoise text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-neon-turquoise" />
            <span className="text-2xl font-bold text-neon-turquoise">
              {habitAnalytics.length}
            </span>
          </div>
          <h3 className="text-gray-300 font-medium">Active Habits</h3>
          <p className="text-gray-400 text-sm">Currently tracking</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-neon-green" />
            <span className="text-2xl font-bold text-neon-green">
              {habitAnalytics.reduce((sum, h) => sum + h.totalCompletions, 0)}
            </span>
          </div>
          <h3 className="text-gray-300 font-medium">Total Completions</h3>
          <p className="text-gray-400 text-sm">All time</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-orange-400">
              {Math.max(...habitAnalytics.map(h => h.longestStreak), 0)}
            </span>
          </div>
          <h3 className="text-gray-300 font-medium">Longest Streak</h3>
          <p className="text-gray-400 text-sm">Best run</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0'
              }
            </span>
          </div>
          <h3 className="text-gray-300 font-medium">Avg Rating</h3>
          <p className="text-gray-400 text-sm">Weekly reviews</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-neon-turquoise" />
          Progress Trends
        </h3>
        <div className="space-y-4">
          {trendData.slice(-7).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-400">
                {format(new Date(day.date), 'MMM dd')}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-neon-turquoise" />
                  <span className="text-sm text-gray-300">
                    {day.habitsCompleted}/{habits.length} habits
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-turquoise to-neon-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${day.clarityScore}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-neon-green">
                  {Math.round(day.clarityScore)}%
                </div>
                <div className="text-xs text-gray-400">clarity</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Performance */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-neon-green" />
          Habit Performance
        </h3>
        <div className="space-y-4">
          {habitAnalytics
            .sort((a, b) => b.completionRate - a.completionRate)
            .slice(0, 5)
            .map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{habit.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Streak: {habit.currentStreak} days</span>
                    <span>Best: {habit.longestStreak} days</span>
                    <span>Total: {habit.totalCompletions}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getCompletionRateColor(habit.completionRate)}`}>
                    {habit.completionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">completion</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Task Analytics */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-400" />
          Task Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-neon-green">
              {taskAnalytics.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {taskAnalytics.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {taskAnalytics.filter(t => t.daysOverdue > 0).length}
            </div>
            <div className="text-sm text-gray-400">Overdue</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {taskAnalytics
            .filter(t => t.status === 'pending' || t.daysOverdue > 0)
            .slice(0, 5)
            .map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{task.title}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.daysOverdue > 0 && (
                      <span className="text-red-400 text-xs">
                        {task.daysOverdue} days overdue
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    task.daysOverdue > 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {task.status}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-neon-turquoise" />
          AI Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="text-lg">{insight.split(' ')[0]}</div>
              <p className="text-gray-300 text-sm">{insight.substring(insight.indexOf(' ') + 1)}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              Generate more data to receive personalized insights
            </p>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2 text-neon-green" />
          Export Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
            <Download className="w-5 h-5 text-neon-turquoise" />
            <span>Export as PDF</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
            <BarChart3 className="w-5 h-5 text-neon-green" />
            <span>Share with Coach</span>
          </button>
        </div>
      </div>
    </div>
  )
} 