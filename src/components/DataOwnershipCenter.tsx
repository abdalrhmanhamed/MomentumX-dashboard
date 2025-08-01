'use client'

import { useState } from 'react'
import { 
  Download, 
  Shield, 
  Database, 
  FileText, 
  Mail, 
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Lock,
  User,
  Code
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import type { Habit, Task, JournalEntry, Review } from '@/types'

interface DataOwnershipCenterProps {
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  reviews: Review[]
  user: {
    uid: string
    email: string | null
    displayName: string | null
  }
}

interface ExportOptions {
  format: 'pdf' | 'csv' | 'json'
  includeHabits: boolean
  includeTasks: boolean
  includeJournal: boolean
  includeReviews: boolean
  dateRange: 'all' | '30d' | '90d' | '180d'
  autoEmail: boolean
}

export default function DataOwnershipCenter({ 
  habits, 
  tasks, 
  journalEntries, 
  reviews, 
  user 
}: DataOwnershipCenterProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeHabits: true,
    includeTasks: true,
    includeJournal: true,
    includeReviews: true,
    dateRange: 'all',
    autoEmail: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Filter data based on date range
      const filterByDate = (items: any[], dateField: string) => {
        if (exportOptions.dateRange === 'all') return items
        
        const days = exportOptions.dateRange === '30d' ? 30 : 
                    exportOptions.dateRange === '90d' ? 90 : 180
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        return items.filter(item => {
          const itemDate = new Date(item[dateField])
          return itemDate >= cutoffDate
        })
      }

      const filteredData = {
        habits: exportOptions.includeHabits ? filterByDate(habits, 'createdAt') : [],
        tasks: exportOptions.includeTasks ? filterByDate(tasks, 'createdAt') : [],
        journalEntries: exportOptions.includeJournal ? filterByDate(journalEntries, 'createdAt') : [],
        reviews: exportOptions.includeReviews ? filterByDate(reviews, 'createdAt') : []
      }

      // Generate export based on format
      switch (exportOptions.format) {
        case 'pdf':
          await exportToPDF(filteredData)
          break
        case 'csv':
          await exportToCSV(filteredData)
          break
        case 'json':
          await exportToJSON(filteredData)
          break
      }

      toast.success('Data exported successfully!')
    } catch (error: any) {
      toast.error('Export failed: ' + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async (data: any) => {
    // TODO: Implement PDF export using jsPDF
    console.log('PDF export:', data)
    toast.success('PDF export coming soon!')
  }

  const exportToCSV = async (data: any) => {
    const csvContent = generateCSV(data)
    downloadFile(csvContent, 'momentumx-data.csv', 'text/csv')
  }

  const exportToJSON = async (data: any) => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(jsonContent, 'momentumx-data.json', 'application/json')
  }

  const generateCSV = (data: any) => {
    let csv = 'Type,Title,Description,Status,Created Date\n'
    
    // Add habits
    data.habits.forEach((habit: Habit) => {
      csv += `Habit,"${habit.title}","${habit.description || ''}","${habit.isActive ? 'Active' : 'Inactive'}","${new Date(habit.createdAt).toLocaleDateString()}"\n`
    })
    
    // Add tasks
    data.tasks.forEach((task: Task) => {
      csv += `Task,"${task.title}","${task.description || ''}","${task.status}","${new Date(task.createdAt).toLocaleDateString()}"\n`
    })
    
    return csv
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return
    }

    try {
      // TODO: Implement data deletion
      toast.success('Data deletion coming soon!')
    } catch (error: any) {
      toast.error('Failed to delete data: ' + error.message)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Data Ownership Center</h2>
          <p className="text-gray-400">Your data, your journey. We only process, never own.</p>
        </div>
        <button
          onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
        >
          {showPrivacyInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Privacy Info</span>
        </button>
      </div>

      {/* Privacy Information */}
      {showPrivacyInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <Shield className="w-8 h-8 text-neon-turquoise mt-1" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Your Data Privacy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>Your data is encrypted and secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>We never share your personal information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>You can export or delete your data anytime</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>GDPR compliant data handling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>No third-party data mining</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>Local processing when possible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Options */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Download className="w-5 h-5 mr-2 text-neon-turquoise" />
          Export Your Data
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Format Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Export Format</h4>
            <div className="space-y-3">
              {[
                { id: 'pdf', label: 'PDF Report', icon: FileText, description: 'Beautiful formatted report' },
                { id: 'csv', label: 'CSV Spreadsheet', icon: Database, description: 'Excel-compatible data' },
                { id: 'json', label: 'JSON Raw Data', icon: Code, description: 'Complete data structure' }
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: format.id as any }))}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    exportOptions.format === format.id
                      ? 'border-neon-turquoise bg-neon-turquoise/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <format.icon className="w-5 h-5 text-neon-turquoise" />
                    <div>
                      <div className="font-semibold text-white">{format.label}</div>
                      <div className="text-sm text-gray-400">{format.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Data Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Include Data</h4>
            <div className="space-y-3">
              {[
                { id: 'includeHabits', label: 'Habits & Streaks', count: habits.length },
                { id: 'includeTasks', label: 'Tasks & Progress', count: tasks.length },
                { id: 'includeJournal', label: 'Journal Entries', count: journalEntries.length },
                { id: 'includeReviews', label: 'Weekly Reviews', count: reviews.length }
              ].map((item) => (
                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions[item.id as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      [item.id]: e.target.checked 
                    }))}
                    className="w-4 h-4 text-neon-turquoise bg-gray-800 border-gray-600 rounded focus:ring-neon-turquoise"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.count} items</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-6">
          <h4 className="font-semibold text-white mb-3">Date Range</h4>
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Time' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Last 90 Days' },
              { id: '180d', label: 'Last 180 Days' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setExportOptions(prev => ({ ...prev, dateRange: range.id as any }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  exportOptions.dateRange === range.id
                    ? 'bg-neon-turquoise text-black'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Email Toggle */}
        <div className="mt-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={exportOptions.autoEmail}
              onChange={(e) => setExportOptions(prev => ({ ...prev, autoEmail: e.target.checked }))}
              className="w-4 h-4 text-neon-turquoise bg-gray-800 border-gray-600 rounded focus:ring-neon-turquoise"
            />
            <div>
              <div className="font-medium text-white">Weekly Auto-Export</div>
              <div className="text-sm text-gray-400">Receive weekly data summaries via email</div>
            </div>
          </label>
        </div>

        {/* Export Button */}
        <div className="mt-8">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full px-6 py-3 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-red-400" />
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Account Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-white font-mono">{user.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{user.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{user.displayName || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Data Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Habits:</span>
                <span className="text-white">{habits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tasks:</span>
                <span className="text-white">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Journal Entries:</span>
                <span className="text-white">{journalEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weekly Reviews:</span>
                <span className="text-white">{reviews.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h4 className="font-semibold text-red-400 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Danger Zone
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            These actions are irreversible. Please export your data before proceeding.
          </p>
          <button
            onClick={handleDeleteData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  )
} 