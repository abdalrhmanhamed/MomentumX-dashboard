'use client'

import { useState } from 'react'
import { 
  Star, 
  Heart, 
  Target, 
  AlertTriangle, 
  Trophy, 
  Brain,
  Save,
  Loader2,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ReviewData {
  week: string
  moodScore: number
  habitsCompleted: number
  challenges: string
  wins: string
  lessons: string
  rating: number
}

interface WeeklyReviewFormProps {
  currentWeek: string
  onSubmit: (data: ReviewData) => Promise<void>
}

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😞', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
  { value: 6, emoji: '😄', label: 'Excellent' },
  { value: 7, emoji: '🤩', label: 'Amazing' },
  { value: 8, emoji: '🌟', label: 'Incredible' },
  { value: 9, emoji: '💫', label: 'Outstanding' },
  { value: 10, emoji: '✨', label: 'Perfect' }
]

const reflectionPrompts = {
  challenges: [
    "What was the biggest challenge you faced this week?",
    "What obstacle did you struggle with the most?",
    "What made this week difficult for you?"
  ],
  wins: [
    "What's your biggest win this week?",
    "What are you most proud of accomplishing?",
    "What went really well for you?"
  ],
  lessons: [
    "What did you learn about yourself this week?",
    "What insight will you carry forward?",
    "What would you do differently next time?"
  ]
}

export default function WeeklyReviewForm({ currentWeek, onSubmit }: WeeklyReviewFormProps) {
  const [formData, setFormData] = useState<ReviewData>({
    week: currentWeek,
    moodScore: 5,
    habitsCompleted: 0,
    challenges: '',
    wins: '',
    lessons: '',
    rating: 5
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<'challenges' | 'wins' | 'lessons'>('challenges')

  const handleInputChange = (field: keyof ReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.challenges.trim().length < 10) {
      toast.error('Please provide more detail about your challenges (at least 10 characters)')
      return
    }
    if (formData.wins.trim().length < 10) {
      toast.error('Please provide more detail about your wins (at least 10 characters)')
      return
    }
    if (formData.lessons.trim().length < 10) {
      toast.error('Please provide more detail about your lessons (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-neon-turquoise mr-3" />
          <h2 className="text-2xl font-bold text-white">Week {currentWeek}</h2>
        </div>
        <p className="text-gray-400">Take a moment to reflect on your week</p>
      </div>

      {/* Overall Rating */}
      <div className="space-y-4">
        <label className="block text-gray-300 text-sm font-medium">
          <Star className="w-4 h-4 inline mr-2" />
          Overall Week Rating (1-10)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="10"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className={`text-2xl font-bold ${getRatingColor(formData.rating)}`}>
            {formData.rating}/10
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Terrible</span>
          <span>Perfect</span>
        </div>
      </div>

      {/* Mood Score */}
      <div className="space-y-4">
        <label className="block text-gray-300 text-sm font-medium">
          <Heart className="w-4 h-4 inline mr-2" />
          Average Mood This Week
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleInputChange('moodScore', mood.value)}
              className={`p-3 rounded-lg border transition-all ${
                formData.moodScore === mood.value
                  ? 'border-neon-turquoise bg-neon-turquoise/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-400">{mood.label}</div>
            </button>
          ))}
        </div>
        <div className="text-center">
          <span className={`text-lg font-semibold ${getMoodColor(formData.moodScore)}`}>
            {moodOptions.find(m => m.value === formData.moodScore)?.label}
          </span>
        </div>
      </div>

      {/* Habits Completed */}
      <div className="space-y-4">
        <label className="block text-gray-300 text-sm font-medium">
          <Target className="w-4 h-4 inline mr-2" />
          Habits Completed This Week
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0"
            value={formData.habitsCompleted}
            onChange={(e) => handleInputChange('habitsCompleted', parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-neon-turquoise focus:outline-none"
          />
          <span className="text-gray-400">habits completed</span>
        </div>
      </div>

      {/* Reflection Sections */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSelectedPrompt('challenges')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedPrompt === 'challenges'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Challenges
          </button>
          <button
            type="button"
            onClick={() => setSelectedPrompt('wins')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedPrompt === 'wins'
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Wins
          </button>
          <button
            type="button"
            onClick={() => setSelectedPrompt('lessons')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedPrompt === 'lessons'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Lessons
          </button>
        </div>

        {/* Dynamic Prompt */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <p className="text-neon-turquoise font-medium mb-2">
            💡 {reflectionPrompts[selectedPrompt][Math.floor(Math.random() * reflectionPrompts[selectedPrompt].length)]}
          </p>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 inline mr-2 text-red-400" />
              Challenges Faced
            </label>
            <textarea
              value={formData.challenges}
              onChange={(e) => handleInputChange('challenges', e.target.value)}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:outline-none resize-none"
              placeholder="What challenges did you face this week?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              <Trophy className="w-4 h-4 inline mr-2 text-neon-green" />
              Wins & Achievements
            </label>
            <textarea
              value={formData.wins}
              onChange={(e) => handleInputChange('wins', e.target.value)}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none resize-none"
              placeholder="What went well this week?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              <Brain className="w-4 h-4 inline mr-2 text-blue-400" />
              Lessons Learned
            </label>
            <textarea
              value={formData.lessons}
              onChange={(e) => handleInputChange('lessons', e.target.value)}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none resize-none"
              placeholder="What did you learn this week?"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving Review...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Weekly Review
            </>
          )}
        </button>
      </div>
    </form>
  )
} 