'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Filter,
  Download,
  Plus,
  Star,
  Heart,
  Brain,
  Target,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useReviews } from '@/hooks/useFirestore'
import WeeklyReviewForm from '@/components/WeeklyReviewForm'
import ReviewCard from '@/components/ReviewCard'
import { toast } from 'react-hot-toast'

import type { Review } from '@/types'

export default function ReviewsPage() {
  const { user } = useAuth()
  const { reviews, loading, error, addReview } = useReviews(user?.uid || null)
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form')
  const [filterRating, setFilterRating] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Get current week key
  const getCurrentWeekKey = () => {
    const now = new Date()
    const year = now.getFullYear()
    const week = Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  const currentWeek = getCurrentWeekKey()
  const hasReviewedThisWeek = reviews.some(review => review.week === currentWeek)

  // Filter reviews based on search and rating
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.wins.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.challenges.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.lessons.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === 'all' || 
      (filterRating === 'high' && review.rating >= 8) ||
      (filterRating === 'medium' && review.rating >= 5 && review.rating < 8) ||
      (filterRating === 'low' && review.rating < 5)
    
    return matchesSearch && matchesRating
  })

  // Calculate stats
  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    averageMood: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.moodScore, 0) / reviews.length : 0,
    totalHabitsCompleted: reviews.reduce((sum, r) => sum + r.habitsCompleted, 0),
    highRatingCount: reviews.filter(r => r.rating >= 8).length,
    lowRatingCount: reviews.filter(r => r.rating < 5).length
  }

  const handleSubmitReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userId'>) => {
    try {
      await addReview({
        week: reviewData.week,
        moodScore: reviewData.moodScore,
        habitsCompleted: reviewData.habitsCompleted,
        challenges: reviewData.challenges,
        wins: reviewData.wins,
        lessons: reviewData.lessons,
        rating: reviewData.rating
      })
      toast.success('Weekly review saved successfully!')
      setActiveTab('history')
    } catch (error: any) {
      toast.error('Failed to save review: ' + error.message)
    }
  }

  const handleExportReviews = () => {
    // TODO: Implement PDF export functionality
    toast.success('Export feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-turquoise mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <BarChart3 className="w-8 h-8 text-neon-turquoise mr-3" />
                Weekly Reviews
              </h1>
              <p className="text-gray-400 mt-1">Reflect on your progress and growth</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleExportReviews}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="glass rounded-xl p-6 text-center">
            <Calendar className="w-8 h-8 text-neon-turquoise mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-turquoise">{stats.totalReviews}</div>
            <div className="text-gray-400 text-sm">Total Reviews</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-green">{stats.averageRating.toFixed(1)}</div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-400">{stats.averageMood.toFixed(1)}</div>
            <div className="text-gray-400 text-sm">Avg Mood</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{stats.totalHabitsCompleted}</div>
            <div className="text-gray-400 text-sm">Habits Completed</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{stats.highRatingCount}</div>
            <div className="text-gray-400 text-sm">High Weeks</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Brain className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400">{stats.lowRatingCount}</div>
            <div className="text-gray-400 text-sm">Challenging Weeks</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800/50 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all ${
              activeTab === 'form'
                ? 'bg-neon-turquoise text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            New Review
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-neon-turquoise text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Review History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'form' ? (
          <div className="glass rounded-xl p-8">
            {hasReviewedThisWeek ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-neon-turquoise rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Review Already Submitted</h2>
                <p className="text-gray-400 mb-6">
                  You've already submitted a review for this week ({currentWeek}). 
                  Come back next week for your next reflection!
                </p>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-6 py-3 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
                >
                  View Past Reviews
                </button>
              </div>
            ) : (
              <WeeklyReviewForm
                currentWeek={currentWeek}
                onSubmit={handleSubmitReview}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="glass rounded-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                    />
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value as any)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-neon-turquoise focus:outline-none"
                    >
                      <option value="all">All Ratings</option>
                      <option value="high">High (8-10)</option>
                      <option value="medium">Medium (5-7)</option>
                      <option value="low">Low (1-4)</option>
                    </select>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {filteredReviews.length} of {reviews.length} reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
                <p className="text-gray-400 mb-6">
                  {reviews.length === 0 
                    ? "Start your weekly reflection journey by submitting your first review!"
                    : "No reviews match your current filters."
                  }
                </p>
                {reviews.length === 0 && (
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-6 py-3 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
                  >
                    Write Your First Review
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 