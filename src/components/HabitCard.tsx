'use client'

import { useState } from 'react'
import { Target, Flame, Calendar, MoreVertical, CheckCircle, XCircle } from 'lucide-react'
import type { Habit } from '@/types'

interface HabitCardProps {
  habit: Habit
  onToggle?: (habitId: string, isCompleted: boolean) => void
  onEdit?: (habit: Habit) => void
  onDelete?: (habitId: string) => void
  showActions?: boolean
  className?: string
  direction?: 'ltr' | 'rtl'
}

export default function HabitCard({ 
  habit, 
  onToggle, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '',
  direction = 'ltr'
}: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)
    
    // Call the onToggle callback if provided
    if (onToggle) {
      onToggle(habit.id, newCompletedState)
    }
    
    // TODO: Update habit completion in Firebase
    console.log('Toggling habit:', habit.id, newCompletedState ? 'completed' : 'incomplete')
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  const getPriorityColor = (streak: number) => {
    if (streak >= 10) return 'text-neon-green'
    if (streak >= 5) return 'text-neon-turquoise'
    if (streak >= 3) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return <Calendar className="w-4 h-4" />
      case 'weekly':
        return <Calendar className="w-4 h-4" />
      case 'monthly':
        return <Calendar className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily'
      case 'weekly':
        return 'Weekly'
      case 'monthly':
        return 'Monthly'
      default:
        return frequency
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Health': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Learning': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Productivity': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Mindfulness': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Fitness': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  return (
    <div 
      className={`glass rounded-xl p-4 hover:neon-glow transition-all duration-300 ${
        isAnimating ? 'scale-105' : ''
      } ${className}`}
      dir={direction}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {/* Status Indicator */}
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              isCompleted 
                ? 'bg-neon-green border-neon-green shadow-lg shadow-neon-green/50' 
                : 'bg-transparent border-gray-500'
            }`}>
              {isCompleted && (
                <CheckCircle className="w-3 h-3 text-black" />
              )}
            </div>
            
            {/* Title */}
            <h3 className={`font-bold text-white flex-1 ${
              isCompleted ? 'line-through text-gray-400' : ''
            }`}>
              {habit.title}
            </h3>
            
            {/* Frequency Badge */}
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
              {getFrequencyIcon(habit.frequency)}
              <span className="capitalize">{getFrequencyLabel(habit.frequency)}</span>
            </div>
          </div>
          
          {/* Description */}
          {habit.description && (
            <p className={`text-gray-400 text-sm mb-3 ${
              isCompleted ? 'line-through' : ''
            }`}>
              {habit.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Streak with Animation */}
              <div className="flex items-center gap-2">
                <div className={`transition-all duration-300 ${
                  isAnimating ? 'animate-pulse' : ''
                }`}>
                  <Flame className={`w-5 h-5 ${getPriorityColor(habit.currentStreak)}`} />
                </div>
                <span className={`text-sm font-bold ${getPriorityColor(habit.currentStreak)}`}>
                  {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Category Badge */}
              <div className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(habit.category)}`}>
                {habit.category}
              </div>
            </div>

            {/* Toggle Button */}
            {showActions && (
              <button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-neon-green text-black shadow-lg shadow-neon-green/30 hover:shadow-neon-green/50'
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg'
                }`}
              >
                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>Mark Done</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Menu Button */}
        {showActions && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 glass rounded-lg shadow-lg border border-gray-700 min-w-[140px] z-10">
                <button 
                  onClick={() => {
                    setShowMenu(false)
                    onEdit?.(habit)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg transition-colors"
                >
                  Edit Habit
                </button>
                <button 
                  onClick={() => {
                    setShowMenu(false)
                    // TODO: Implement view history
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                >
                  View History
                </button>
                <button 
                  onClick={() => {
                    setShowMenu(false)
                    onDelete?.(habit.id)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-b-lg text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progress</span>
          <span className="font-medium">{habit.currentStreak}/{habit.target}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-neon-turquoise to-neon-green h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min((habit.currentStreak / habit.target) * 100, 100)}%`,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Longest Streak Info */}
      {habit.longestStreak > habit.currentStreak && (
        <div className="mt-2 text-xs text-gray-500">
          Longest streak: {habit.longestStreak} days
        </div>
      )}
    </div>
  )
} 