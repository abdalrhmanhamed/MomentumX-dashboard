'use client'

import { useState, useEffect } from 'react'
import { 
  Share2, 
  Eye, 
  MessageSquare, 
  Download, 
  Lock, 
  Unlock,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Send,
  Copy,
  QrCode
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Habit, Task, JournalEntry, Review, User } from '@/types'

interface CoachSharingProps {
  user: User
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  reviews: Review[]
  isCoach?: boolean
}

interface ShareLink {
  id: string
  type: 'read-only' | 'coach-access' | 'temporary'
  expiresAt?: Date
  accessCode: string
  permissions: {
    viewHabits: boolean
    viewTasks: boolean
    viewJournal: boolean
    viewReviews: boolean
    viewAnalytics: boolean
    sendMessages: boolean
  }
  createdAt: Date
  lastAccessed?: Date
}

interface CoachMessage {
  id: string
  from: string
  to: string
  message: string
  timestamp: Date
  read: boolean
}

export default function CoachSharing({ 
  user, 
  habits, 
  tasks, 
  journalEntries, 
  reviews, 
  isCoach = false 
}: CoachSharingProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [selectedLink, setSelectedLink] = useState<ShareLink | null>(null)
  const [showCreateLink, setShowCreateLink] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  // Generate access code
  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Create new share link
  const createShareLink = (type: ShareLink['type'], permissions: ShareLink['permissions']) => {
    const newLink: ShareLink = {
      id: `link-${Date.now()}`,
      type,
      accessCode: generateAccessCode(),
      permissions,
      createdAt: new Date(),
      expiresAt: type === 'temporary' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined // 7 days for temporary
    }

    setShareLinks(prev => [...prev, newLink])
    toast.success('Share link created successfully!')
  }

  // Copy link to clipboard
  const copyLink = (link: ShareLink) => {
    const shareUrl = `${window.location.origin}/app/share/${link.accessCode}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  // Delete share link
  const deleteShareLink = (linkId: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== linkId))
    toast.success('Share link deleted!')
  }

  // Send message to coach/client
  const sendMessage = (message: string, toUserId: string) => {
    const newMessage: CoachMessage = {
      id: `msg-${Date.now()}`,
      from: user.uid,
      to: toUserId,
      message,
      timestamp: new Date(),
      read: false
    }

    setMessages(prev => [...prev, newMessage])
    setNewMessage('')
    toast.success('Message sent!')
  }

  // Mark message as read
  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ))
  }

  // Get progress summary for sharing
  const getProgressSummary = () => {
    const totalHabits = habits.length
    const activeHabits = habits.filter(h => h.isActive).length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    return {
      totalHabits,
      activeHabits,
      completedTasks,
      totalTasks,
      averageRating,
      totalReviews: reviews.length
    }
  }

  const progressSummary = getProgressSummary()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isCoach ? 'Client Sharing' : 'Share with Coach'}
          </h2>
          <p className="text-gray-400">
            {isCoach 
              ? 'View and support your client\'s progress'
              : 'Share your progress with coaches and therapists'
            }
          </p>
        </div>
        <button
          onClick={() => setShowCreateLink(true)}
          className="flex items-center px-4 py-2 bg-neon-turquoise text-black rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all mt-4 sm:mt-0"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Create Share Link
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-neon-turquoise" />
          Progress Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-turquoise">{progressSummary.activeHabits}</div>
            <div className="text-sm text-gray-400">Active Habits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">{progressSummary.completedTasks}</div>
            <div className="text-sm text-gray-400">Completed Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{progressSummary.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{progressSummary.totalReviews}</div>
            <div className="text-sm text-gray-400">Weekly Reviews</div>
          </div>
        </div>
      </div>

      {/* Share Links */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-neon-green" />
          Active Share Links
        </h3>
        
        {shareLinks.length === 0 ? (
          <div className="text-center py-8">
            <Share2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Share Links</h3>
            <p className="text-gray-400 mb-6">
              Create a share link to allow coaches or therapists to view your progress
            </p>
            <button
              onClick={() => setShowCreateLink(true)}
              className="px-6 py-3 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
            >
              Create First Link
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {shareLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {link.type === 'read-only' && <Eye className="w-5 h-5 text-blue-400" />}
                    {link.type === 'coach-access' && <Users className="w-5 h-5 text-green-400" />}
                    {link.type === 'temporary' && <Clock className="w-5 h-5 text-orange-400" />}
                    <span className="font-medium text-white">{link.accessCode}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                    {link.expiresAt && ` • Expires ${new Date(link.expiresAt).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyLink(link)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedLink(link)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteShareLink(link.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete link"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
          Messages
        </h3>
        
        <div className="space-y-4 mb-6">
          {messages.slice(0, 5).map((message) => (
            <div key={message.id} className={`p-4 rounded-lg ${message.read ? 'bg-gray-800/30' : 'bg-neon-turquoise/10'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-white">
                      {message.from === user.uid ? 'You' : 'Coach'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                    {!message.read && <div className="w-2 h-2 bg-neon-turquoise rounded-full"></div>}
                  </div>
                  <p className="text-gray-300">{message.message}</p>
                </div>
                {!message.read && (
                  <button
                    onClick={() => markMessageAsRead(message.id)}
                    className="text-xs text-neon-turquoise hover:text-neon-green transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Send Message */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message to your coach..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
          />
          <button
            onClick={() => sendMessage(newMessage, 'coach-id')}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-neon-turquoise text-black rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
          <Download className="w-5 h-5 text-neon-turquoise" />
          <span>Export Report</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
          <QrCode className="w-5 h-5 text-neon-green" />
          <span>Generate QR Code</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Create Share Link Modal */}
      {showCreateLink && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Create Share Link</h3>
              <button
                onClick={() => setShowCreateLink(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-white mb-3">Link Type</h4>
                <div className="space-y-2">
                  {[
                    { id: 'read-only', label: 'Read Only', description: 'View progress only' },
                    { id: 'coach-access', label: 'Coach Access', description: 'Full access with messaging' },
                    { id: 'temporary', label: 'Temporary', description: '7-day access' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        const permissions = {
                          viewHabits: true,
                          viewTasks: true,
                          viewJournal: type.id === 'coach-access',
                          viewReviews: true,
                          viewAnalytics: true,
                          sendMessages: type.id === 'coach-access'
                        }
                        createShareLink(type.id as ShareLink['type'], permissions)
                        setShowCreateLink(false)
                      }}
                      className="w-full p-4 text-left border border-gray-600 rounded-lg hover:border-neon-turquoise transition-all"
                    >
                      <div className="font-medium text-white">{type.label}</div>
                      <div className="text-sm text-gray-400">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Details Modal */}
      {selectedLink && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Link Details</h3>
              <button
                onClick={() => setSelectedLink(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Access Code</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={selectedLink.accessCode}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono"
                  />
                  <button
                    onClick={() => copyLink(selectedLink)}
                    className="px-3 py-2 bg-neon-turquoise text-black rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
                <div className="space-y-2">
                  {Object.entries(selectedLink.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {value ? <CheckCircle className="w-4 h-4 text-neon-green" /> : <Clock className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => deleteShareLink(selectedLink.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Delete Link
                </button>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 