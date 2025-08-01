'use client'

import { useState } from 'react'
import { BookOpen, Calendar, FileText, Download, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useHabits, useTasks, useJournal } from '@/hooks/useFirestore'
import JournalEditor from '@/components/JournalEditor'
import PDFExport from '@/components/PDFExport'

const tabs = [
  { id: 'daily', label: 'Daily Journal', icon: Calendar },
  { id: 'weekly', label: 'Weekly Review', icon: FileText },
  { id: 'entries', label: 'All Entries', icon: BookOpen },
]

// Dummy journal entries
const dummyEntries = [
  {
    id: '1',
    date: '2024-01-17',
    title: 'Morning Reflection',
    content: 'Today I woke up feeling motivated and ready to tackle my goals. I completed my morning workout and felt energized throughout the day.',
    mood: 'motivated',
    type: 'daily'
  },
  {
    id: '2',
    date: '2024-01-16',
    title: 'Learning Day',
    content: 'Spent time learning new skills and felt accomplished. The challenges I faced today helped me grow stronger.',
    mood: 'thoughtful',
    type: 'daily'
  },
  {
    id: '3',
    date: '2024-01-15',
    title: 'Weekly Review',
    content: 'This week has been productive. I maintained my exercise routine and made progress on my projects. Areas for improvement: time management.',
    mood: 'calm',
    type: 'weekly'
  }
]

export default function JournalPage() {
  const { user } = useAuth()
  const { habits, loading: habitsLoading } = useHabits(user?.uid || null)
  const { tasks, loading: tasksLoading } = useTasks(user?.uid || null)
  const { entries: journalEntries, loading: journalLoading } = useJournal(user?.uid || null)
  
  const [activeTab, setActiveTab] = useState('daily')
  const [entries, setEntries] = useState(dummyEntries)
  const [currentDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD format

  // Create user object for PDFExport
  const userForExport = {
    uid: user?.uid || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    tier: 'coach' as const,
    licenseKey: '',
    createdAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {
      theme: 'dark' as const,
      language: 'en' as const,
      notifications: true
    }
  }

  const handleSaveEntry = (content: string) => {
    const newEntry = {
      id: Date.now().toString(),
      date: currentDate,
      title: `Journal Entry - ${new Date().toLocaleDateString()}`,
      content,
      mood: 'neutral',
      type: activeTab === 'weekly' ? 'weekly' : 'daily'
    }
    
    setEntries(prev => [newEntry, ...prev])
    console.log('Journal entry saved:', newEntry)
    // TODO: Save to Firebase
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Daily Journal</h2>
              <PDFExport 
                habits={habits}
                tasks={tasks}
                journalEntries={journalEntries}
                user={userForExport}
              />
            </div>
            
            <JournalEditor
              date={currentDate}
              onSave={handleSaveEntry}
              direction="ltr"
            />
          </div>
        )

      case 'weekly':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Weekly Review</h2>
              <PDFExport 
                habits={habits}
                tasks={tasks}
                journalEntries={journalEntries}
                user={userForExport}
              />
            </div>
            
            <JournalEditor
              date={currentDate}
              onSave={handleSaveEntry}
              prompt="What were your biggest wins and challenges this week? How did you grow?"
              direction="ltr"
            />
          </div>
        )

      case 'entries':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Entries</h2>
              <div className="flex items-center gap-2">
                <PDFExport 
                  habits={habits}
                  tasks={tasks}
                  journalEntries={journalEntries}
                  user={userForExport}
                />
                <button className="inline-flex items-center px-4 py-2 bg-neon-pink text-black rounded-lg hover:neon-glow transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </button>
              </div>
            </div>
            
            {entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div key={entry.id} className="glass rounded-lg p-4 hover:neon-glow transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-neon-turquoise" />
                        <span className="text-sm text-gray-400">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          entry.type === 'weekly' 
                            ? 'bg-neon-purple/20 text-neon-purple' 
                            : 'bg-neon-turquoise/20 text-neon-turquoise'
                        }`}>
                          {entry.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2">{entry.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {entry.content}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {entry.content.length} characters
                      </span>
                      <button className="text-neon-turquoise hover:text-white transition-colors text-sm">
                        Read more
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-lg p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No journal entries yet</h3>
                <p className="text-gray-400 mb-4">
                  Start writing to track your thoughts and progress over time.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-neon-turquoise text-black rounded-lg hover:neon-glow transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Entry
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      calm: '😌',
      neutral: '😐',
      sad: '😔',
      frustrated: '😤',
      thoughtful: '🤔',
      motivated: '💪',
      tired: '😴'
    }
    return moodEmojis[mood] || '😐'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="glass border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              Journal
            </h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                Settings
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Export All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-neon-pink text-black font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  )
} 