'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  Star,
  Award,
  Zap,
  Flame,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Habit, Task } from '@/types'

interface ProgressDashboardProps {
  habits: Habit[]
  tasks: Task[]
  userId: string
}

interface DayData {
  date: string
  habitsCompleted: number
  tasksCompleted: number
  totalHabits: number
  totalTasks: number
  clarityScore: number
}

interface HeatmapData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export default function ProgressDashboard({ habits, tasks, userId }: ProgressDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '180d'>('30d')
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [weeklyData, setWeeklyData] = useState<DayData[]>([])
  const [stats, setStats] = useState({
    perfectDays: 0,
    missedTasks: 0,
    journalsLogged: 0,
    clarityScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageCompletion: 0
  })

  // Generate heatmap data for the last 365 days
  useEffect(() => {
    const generateHeatmapData = () => {
      const data: HeatmapData[] = []
      const today = new Date()
      
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Calculate completion for this date
        const habitsCompleted = habits.filter(habit => 
          habit.completedDates.includes(dateStr)
        ).length
        
        const totalHabits = habits.length
        const completionRate = totalHabits > 0 ? habitsCompleted / totalHabits : 0
        
        // Determine level based on completion rate
        let level: 0 | 1 | 2 | 3 | 4 = 0
        if (completionRate >= 0.8) level = 4
        else if (completionRate >= 0.6) level = 3
        else if (completionRate >= 0.4) level = 2
        else if (completionRate >= 0.2) level = 1
        
        data.push({
          date: dateStr,
          count: habitsCompleted,
          level
        })
      }
      
      setHeatmapData(data)
    }
    
    generateHeatmapData()
  }, [habits])

  // Generate weekly progress data
  useEffect(() => {
    const generateWeeklyData = () => {
      const data: DayData[] = []
      const today = new Date()
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 180
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const habitsCompleted = habits.filter(habit => 
          habit.completedDates.includes(dateStr)
        ).length
        
        const tasksCompleted = tasks.filter(task => 
          task.status === 'completed' && 
          task.completedAt && 
          new Date(task.completedAt).toISOString().split('T')[0] === dateStr
        ).length
        
        const totalHabits = habits.length
        const totalTasks = tasks.length
        const clarityScore = totalHabits > 0 ? (habitsCompleted / totalHabits) * 100 : 0
        
        data.push({
          date: dateStr,
          habitsCompleted,
          tasksCompleted,
          totalHabits,
          totalTasks,
          clarityScore
        })
      }
      
      setWeeklyData(data)
    }
    
    generateWeeklyData()
  }, [habits, tasks, selectedPeriod])

  // Calculate stats
  useEffect(() => {
    const calculateStats = () => {
      const perfectDays = weeklyData.filter(day => 
        day.habitsCompleted === day.totalHabits && day.totalHabits > 0
      ).length
      
      const missedTasks = tasks.filter(task => 
        task.status === 'pending' && 
        task.dueDate && 
        new Date(task.dueDate) < new Date()
      ).length
      
      const averageCompletion = weeklyData.length > 0 
        ? weeklyData.reduce((sum, day) => sum + day.clarityScore, 0) / weeklyData.length 
        : 0
      
      // Calculate current streak
      let currentStreak = 0
      for (let i = weeklyData.length - 1; i >= 0; i--) {
        if (weeklyData[i].habitsCompleted > 0) {
          currentStreak++
        } else {
          break
        }
      }
      
      // Calculate longest streak
      let longestStreak = 0
      let tempStreak = 0
      for (const day of weeklyData) {
        if (day.habitsCompleted > 0) {
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      }
      
      setStats({
        perfectDays,
        missedTasks,
        journalsLogged: 0, // TODO: Connect to journal data
        clarityScore: Math.round(averageCompletion),
        currentStreak,
        longestStreak,
        averageCompletion: Math.round(averageCompletion)
      })
    }
    
    calculateStats()
  }, [weeklyData, tasks])

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800'
      case 1: return 'bg-green-900'
      case 2: return 'bg-green-700'
      case 3: return 'bg-green-500'
      case 4: return 'bg-green-300'
      default: return 'bg-gray-800'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Progress Analytics</h2>
          <p className="text-gray-400">Track your momentum and growth</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-neon-turquoise" />
            <span className="text-2xl font-bold text-neon-turquoise">{stats.perfectDays}</span>
          </div>
          <h3 className="text-gray-300 font-medium">Perfect Days</h3>
          <p className="text-gray-400 text-sm">All habits completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-neon-green" />
            <span className="text-2xl font-bold text-neon-green">{stats.currentStreak}</span>
          </div>
          <h3 className="text-gray-300 font-medium">Current Streak</h3>
          <p className="text-gray-400 text-sm">Days in a row</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-orange-400">{stats.longestStreak}</span>
          </div>
          <h3 className="text-gray-300 font-medium">Longest Streak</h3>
          <p className="text-gray-400 text-sm">Best run so far</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">{stats.clarityScore}%</span>
          </div>
          <h3 className="text-gray-300 font-medium">Clarity Score</h3>
          <p className="text-gray-400 text-sm">Consistency rating</p>
        </motion.div>
      </div>

      {/* Heatmap Calendar */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-neon-turquoise" />
          Activity Heatmap
        </h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {heatmapData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.001 }}
                className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.level)}`}
                title={`${formatDate(day.date)}: ${day.count} habits completed`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-neon-green" />
          Weekly Progress
        </h3>
        <div className="space-y-4">
          {weeklyData.slice(-7).map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-20 text-sm text-gray-400">
                {formatDate(day.date)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-neon-turquoise" />
                  <span className="text-sm text-gray-300">
                    {day.habitsCompleted}/{day.totalHabits} habits
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-turquoise to-neon-green h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${day.totalHabits > 0 ? (day.habitsCompleted / day.totalHabits) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-neon-green">
                  {Math.round(day.clarityScore)}%
                </div>
                <div className="text-xs text-gray-400">clarity</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-400" />
          Habit Streaks
        </h3>
        <div className="space-y-4">
          {habits.slice(0, 5).map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{habit.title}</h4>
                  <p className="text-sm text-gray-400">{habit.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  {habit.currentStreak}
                </div>
                <div className="text-xs text-gray-400">days</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 