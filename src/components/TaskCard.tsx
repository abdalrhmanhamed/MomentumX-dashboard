'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Edit3, 
  Trash2, 
  Calendar, 
  AlertTriangle,
  Clock,
  Check
} from 'lucide-react'
import { formatDistanceToNow, isAfter, isBefore, isToday, parseISO } from 'date-fns'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  dueDate: string // ISO string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  onToggleComplete: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  direction?: 'ltr' | 'rtl'
  className?: string
}

export default function TaskCard({
  id,
  title,
  description,
  dueDate,
  completed,
  priority = 'medium',
  tags = [],
  onToggleComplete,
  onEdit,
  onDelete,
  direction = 'ltr',
  className = ''
}: TaskCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Parse the due date
  const dueDateObj = parseISO(dueDate)
  const now = new Date()

  // Smart status detection
  const isOverdue = !completed && isBefore(dueDateObj, now)
  const isDueToday = isToday(dueDateObj)
  const isDueSoon = !completed && !isOverdue && isAfter(dueDateObj, now) && 
    isBefore(dueDateObj, new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)) // 3 days

  // Get relative time string
  const getRelativeTime = () => {
    if (completed) return 'Completed'
    if (isOverdue) return `Overdue by ${formatDistanceToNow(dueDateObj)}`
    if (isDueToday) return 'Due today'
    return `Due ${formatDistanceToNow(dueDateObj)}`
  }

  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10'
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/10'
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10'
    }
  }

  // Get status color and glow
  const getStatusStyles = () => {
    if (completed) {
      return {
        border: 'border-neon-green/50',
        glow: 'shadow-lg shadow-neon-green/30',
        bg: 'bg-neon-green/10'
      }
    }
    if (isOverdue) {
      return {
        border: 'border-red-500/50',
        glow: 'shadow-lg shadow-red-500/30',
        bg: 'bg-red-500/10'
      }
    }
    if (isDueToday) {
      return {
        border: 'border-neon-pink/50',
        glow: 'shadow-lg shadow-neon-pink/30',
        bg: 'bg-neon-pink/10'
      }
    }
    if (isDueSoon) {
      return {
        border: 'border-yellow-500/50',
        glow: 'shadow-lg shadow-yellow-500/30',
        bg: 'bg-yellow-500/10'
      }
    }
    return {
      border: 'border-gray-600/50',
      glow: '',
      bg: ''
    }
  }

  const statusStyles = getStatusStyles()

  const handleToggleComplete = () => {
    setIsAnimating(true)
    onToggleComplete(id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleEdit = () => {
    onEdit(id)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(id)
    }
  }

  return (
    <div
      className={`glass rounded-xl p-4 transition-all duration-300 ${
        isAnimating ? 'scale-105' : ''
      } ${statusStyles.border} ${statusStyles.glow} ${statusStyles.bg} ${className}`}
      dir={direction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with status and priority */}
          <div className="flex items-center gap-3 mb-3">
            {/* Completion Toggle */}
            <button
              onClick={handleToggleComplete}
              className={`p-1 rounded-full transition-all duration-300 ${
                completed 
                  ? 'text-neon-green bg-neon-green/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {/* Title with gradient */}
            <h3 className={`font-bold flex-1 ${
              completed 
                ? 'line-through text-gray-400' 
                : 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
            }`}>
              {title}
            </h3>

            {/* Priority Badge */}
            <div className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor()}`}>
              {priority.toUpperCase()}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className={`text-gray-400 text-sm mb-3 ${
              completed ? 'line-through' : ''
            }`}>
              {description}
            </p>
          )}

          {/* Due Date and Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Due Date */}
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : isDueToday ? (
                  <Clock className="w-4 h-4 text-neon-pink" />
                ) : (
                  <Calendar className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${
                  isOverdue ? 'text-red-400' : 
                  isDueToday ? 'text-neon-pink' : 
                  isDueSoon ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {getRelativeTime()}
                </span>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex gap-1">
                  {tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-neon-turquoise hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator for Overdue Tasks */}
      {isOverdue && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="w-3 h-3" />
            <span>This task is overdue</span>
          </div>
        </div>
      )}

      {/* Completion Animation */}
      {completed && (
        <div className="mt-3 flex items-center gap-2 text-xs text-neon-green">
          <Check className="w-3 h-3" />
          <span>Task completed</span>
        </div>
      )}
    </div>
  )
} 