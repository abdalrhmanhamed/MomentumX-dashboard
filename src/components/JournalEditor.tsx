'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Save, 
  Check, 
  Loader2, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Zap,
  Calendar,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface JournalEditorProps {
  date: string // e.g. 2025-07-29
  initialValue?: string
  onSave: (entry: string) => void
  prompt?: string
  direction?: 'ltr' | 'rtl'
  className?: string
}

// CBT-style prompts for different days
const prompts = [
  "What are you grateful for today?",
  "What challenged you today and how did you handle it?",
  "What's one thing you learned about yourself today?",
  "What would you like to improve tomorrow?",
  "What made you smile today?",
  "What's something you're looking forward to?",
  "What's a small win you had today?",
  "How are you feeling right now and why?",
  "What's something you're proud of today?",
  "What's one thing you'd like to let go of?"
]

// Mood options with emojis
const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: 'text-green-400' },
  { emoji: '😌', label: 'Calm', value: 'calm', color: 'text-blue-400' },
  { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'text-gray-400' },
  { emoji: '😔', label: 'Sad', value: 'sad', color: 'text-purple-400' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'text-red-400' },
  { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful', color: 'text-yellow-400' },
  { emoji: '💪', label: 'Motivated', value: 'motivated', color: 'text-neon-green' },
  { emoji: '😴', label: 'Tired', value: 'tired', color: 'text-gray-500' }
]

export default function JournalEditor({
  date,
  initialValue = '',
  onSave,
  prompt,
  direction = 'ltr',
  className = ''
}: JournalEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  // Get random prompt if none provided
  const currentPrompt = prompt || prompts[Math.floor(Math.random() * prompts.length)]

  // Character count
  const charCount = content.length
  const maxChars = 2000
  const isOverLimit = charCount > maxChars

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please write something before saving')
      return
    }

    if (isOverLimit) {
      toast.error('Entry is too long. Please shorten it.')
      return
    }

    setIsSaving(true)
    setIsSaved(false)

    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the onSave function
      onSave(content)
      
      setIsSaved(true)
      toast.success('Journal entry saved successfully! ✨')
      
      // Reset saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      toast.error('Failed to save journal entry')
    } finally {
      setIsSaving(false)
    }
  }

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    setShowMoodSelector(false)
    toast.success(`Mood set to ${moods.find(m => m.value === mood)?.label}`)
  }

  const selectedMoodData = moods.find(m => m.value === selectedMood)

  return (
    <div 
      className={`glass rounded-xl p-6 transition-all duration-300 ${className}`}
      dir={direction}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-neon-turquoise" />
          <h3 className="text-lg font-bold text-white">
            {formatDate(date)}
          </h3>
        </div>
        
        {/* Mood Selector */}
        <div className="relative">
          <button
            onClick={() => setShowMoodSelector(!showMoodSelector)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              selectedMood 
                ? 'bg-gray-700/50 text-white' 
                : 'bg-gray-700/30 text-gray-400 hover:text-white'
            }`}
          >
            {selectedMoodData ? (
              <>
                <span className="text-lg">{selectedMoodData.emoji}</span>
                <span className="text-sm">{selectedMoodData.label}</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span className="text-sm">Mood</span>
              </>
            )}
          </button>

          {/* Mood Dropdown */}
          {showMoodSelector && (
            <div className="absolute right-0 top-full mt-2 glass rounded-lg shadow-lg border border-gray-700 min-w-[200px] z-10">
              <div className="p-2">
                <div className="text-xs text-gray-400 mb-2 px-2">How are you feeling?</div>
                <div className="grid grid-cols-4 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs text-gray-300">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prompt */}
      <div className="mb-4 p-4 bg-neon-turquoise/10 border border-neon-turquoise/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-neon-turquoise mt-0.5" />
          <div>
            <p className="text-neon-turquoise font-medium mb-1">Today's Reflection</p>
            <p className="text-gray-300 text-sm">{currentPrompt}</p>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className={`w-full min-h-[200px] p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none focus:border-neon-turquoise focus:shadow-lg focus:shadow-neon-turquoise/20 ${
            isOverLimit ? 'border-red-500' : ''
          }`}
          style={{ 
            minHeight: '200px',
            fontFamily: direction === 'rtl' ? 'Noto Sans Arabic, sans-serif' : 'Inter, sans-serif'
          }}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs">
          <span className={isOverLimit ? 'text-red-400' : 'text-gray-400'}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Auto-save disabled</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Clear Button */}
          {content && (
            <button
              onClick={() => {
                setContent('')
                setSelectedMood(null)
                toast.success('Journal cleared')
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim() || isOverLimit}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isSaving
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : isSaved
                ? 'bg-neon-green text-black shadow-lg shadow-neon-green/30'
                : 'bg-neon-turquoise text-black hover:shadow-lg hover:shadow-neon-turquoise/30'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips */}
      {!content && (
        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
          <p className="text-sm text-gray-400">
            💡 <strong>Tip:</strong> Write freely without worrying about grammar or structure. 
            This is your personal space for reflection.
          </p>
        </div>
      )}

      {/* Over-limit warning */}
      {isOverLimit && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ Your entry is too long. Please shorten it to continue.
          </p>
        </div>
      )}
    </div>
  )
} 