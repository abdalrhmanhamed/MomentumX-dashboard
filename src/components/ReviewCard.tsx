'use client'

import { useState } from 'react'
import { 
  Star, 
  Heart, 
  Target, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Trophy,
  Brain
} from 'lucide-react'
import { format } from 'date-fns'

interface Review {
  id: string
  week: string
  createdAt: Date
  moodScore: number
  habitsCompleted: number
  challenges: string
  wins: string
  lessons: string
  rating: number
}

interface ReviewCardProps {
  review: Review
}

const moodEmojis = {
  1: '😢', 2: '😞', 3: '😐', 4: '🙂', 5: '😊',
  6: '😄', 7: '🤩', 8: '🌟', 9: '💫', 10: '✨'
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-neon-green'
    if (rating >= 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-pink-400'
    if (mood >= 5) return 'text-blue-400'
    return 'text-gray-400'
  }

  const getBorderColor = (rating: number) => {
    if (rating >= 8) return 'border-l-neon-green'
    if (rating >= 5) return 'border-l-yellow-400'
    return 'border-l-red-400'
  }

  const getGlowColor = (rating: number) => {
    if (rating >= 8) return 'shadow-lg shadow-neon-green/20'
    if (rating >= 5) return 'shadow-lg shadow-yellow-400/20'
    return 'shadow-lg shadow-red-400/20'
  }

  const formatWeek = (week: string) => {
    const [year, weekNum] = week.split('-W')
    return `Week ${weekNum}, ${year}`
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className={`glass rounded-xl border-l-4 ${getBorderColor(review.rating)} ${getGlowColor(review.rating)} transition-all duration-300 hover:scale-105`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {formatWeek(review.week)}
            </h3>
            <p className="text-sm text-gray-400">
              {format(review.createdAt, 'MMM dd, yyyy')}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 mr-1" />
              <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                {review.rating}/10
              </span>
            </div>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-4 h-4 mr-1" />
              <span className={`text-sm font-semibold ${getMoodColor(review.moodScore)}`}>
                {moodEmojis[review.moodScore as keyof typeof moodEmojis]}
              </span>
            </div>
            <p className="text-xs text-gray-400">Mood</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold text-neon-turquoise">
                {review.habitsCompleted}
              </span>
            </div>
            <p className="text-xs text-gray-400">Habits</p>
          </div>
        </div>

        {/* Preview Content */}
        {!isExpanded && (
          <div className="space-y-3">
            {review.wins && (
              <div className="flex items-start space-x-2">
                <Trophy className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  {truncateText(review.wins, 80)}
                </p>
              </div>
            )}
            {review.challenges && (
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  {truncateText(review.challenges, 80)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            {/* Wins */}
            {review.wins && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-neon-green" />
                  <h4 className="text-sm font-semibold text-neon-green">Wins & Achievements</h4>
                </div>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                  {review.wins}
                </p>
              </div>
            )}

            {/* Challenges */}
            {review.challenges && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="text-sm font-semibold text-red-400">Challenges Faced</h4>
                </div>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                  {review.challenges}
                </p>
              </div>
            )}

            {/* Lessons */}
            {review.lessons && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-blue-400">Lessons Learned</h4>
                </div>
                <p className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                  {review.lessons}
                </p>
              </div>
            )}

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-turquoise mb-1">
                  {review.rating}
                </div>
                <div className="text-xs text-gray-400">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {moodEmojis[review.moodScore as keyof typeof moodEmojis]}
                </div>
                <div className="text-xs text-gray-400">Mood Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 