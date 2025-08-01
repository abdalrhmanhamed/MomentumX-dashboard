'use client'

import { useState, useCallback } from 'react'
import { Download, FileText, Loader2, Calendar, Target, CheckCircle, BookOpen } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format, parseISO, isToday, isThisWeek, startOfWeek, endOfWeek } from 'date-fns'
import { Habit, Task, JournalEntry, User } from '@/types'
import { sanitizeText } from '@/utils/sanitizers'

interface PDFExportProps {
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  user: User
  className?: string
}

interface ExportData {
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  user: User
  dateRange: {
    start: Date
    end: Date
  }
}

export default function PDFExport({ 
  habits, 
  tasks, 
  journalEntries, 
  user, 
  className = '' 
}: PDFExportProps) {
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  // Calculate day count since journey began
  const calculateDayCount = useCallback(() => {
    const startDate = new Date('2024-01-01') // Default start date
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [])

  // Filter data based on export type
  const getFilteredData = useCallback((type: 'daily' | 'weekly' | 'monthly'): ExportData => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (type) {
      case 'daily':
        startDate = now
        endDate = now
        break
      case 'weekly':
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        endDate = endOfWeek(now, { weekStartsOn: 1 })
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
    }

    const filteredHabits = habits.filter(habit => 
      habit.completedDates.some(date => {
        const habitDate = parseISO(date)
        return habitDate >= startDate && habitDate <= endDate
      })
    )

    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = task.dueDate
      return taskDate >= startDate && taskDate <= endDate
    })

    const filteredJournal = journalEntries.filter(entry => {
      const entryDate = entry.createdAt
      return entryDate >= startDate && entryDate <= endDate
    })

    return {
      habits: filteredHabits,
      tasks: filteredTasks,
      journalEntries: filteredJournal,
      user,
      dateRange: { start: startDate, end: endDate }
    }
  }, [habits, tasks, journalEntries, user])

  // Generate PDF content
  const generatePDFContent = useCallback((data: ExportData) => {
    const dayCount = calculateDayCount()
    const { habits, tasks, journalEntries, user, dateRange } = data

    return `
      <div style="font-family: 'Arial', sans-serif; background: #1a1a1a; color: white; padding: 40px; max-width: 800px; margin: 0 auto;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #00d4ff; padding-bottom: 20px;">
          <h1 style="color: #00d4ff; font-size: 32px; margin: 0;">MomentumX Dashboard</h1>
          <p style="color: #888; font-size: 16px; margin: 10px 0;">Personal Mastery Report</p>
          <p style="color: #00ff88; font-size: 18px; margin: 5px 0;">Day ${dayCount} of Your Journey</p>
          <p style="color: #888; font-size: 14px; margin: 5px 0;">
            ${format(dateRange.start, 'MMM dd, yyyy')} - ${format(dateRange.end, 'MMM dd, yyyy')}
          </p>
        </div>

        <!-- User Info -->
        <div style="margin-bottom: 30px; padding: 20px; background: rgba(0, 212, 255, 0.1); border-radius: 10px;">
          <h2 style="color: #00d4ff; margin: 0 0 10px 0;">User Information</h2>
          <p style="margin: 5px 0; color: #ccc;">
            <strong>Name:</strong> ${sanitizeText(user.displayName || 'Anonymous', 50)}
          </p>
          <p style="margin: 5px 0; color: #ccc;">
            <strong>Email:</strong> ${sanitizeText(user.email || 'Not provided', 100)}
          </p>
          <p style="margin: 5px 0; color: #ccc;">
            <strong>Report Generated:</strong> ${format(new Date(), 'MMM dd, yyyy at HH:mm')}
          </p>
        </div>

        <!-- Habits Summary -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #00d4ff; border-bottom: 1px solid #00d4ff; padding-bottom: 10px;">
             Habits Summary
          </h2>
          ${habits.length > 0 ? `
            <div style="background: rgba(0, 255, 136, 0.1); padding: 20px; border-radius: 10px; margin-top: 15px;">
              <h3 style="color: #00ff88; margin: 0 0 15px 0;">Completed Habits (${habits.length})</h3>
              ${habits.map(habit => `
                <div style="margin-bottom: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                  <h4 style="color: #00ff88; margin: 0 0 8px 0;">${sanitizeText(habit.title, 100)}</h4>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Category:</strong> ${sanitizeText(habit.category, 20)}
                  </p>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Current Streak:</strong> ${habit.currentStreak} days
                  </p>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Longest Streak:</strong> ${habit.longestStreak} days
                  </p>
                  ${habit.description ? `
                    <p style="color: #999; margin: 8px 0; font-size: 13px; font-style: italic;">
                      "${sanitizeText(habit.description, 200)}"
                    </p>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="color: #888; font-style: italic;">No habits completed in this period.</p>
          `}
        </div>

        <!-- Tasks Summary -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #00d4ff; border-bottom: 1px solid #00d4ff; padding-bottom: 10px;">
             Tasks Summary
          </h2>
          ${tasks.length > 0 ? `
            <div style="background: rgba(255, 193, 7, 0.1); padding: 20px; border-radius: 10px; margin-top: 15px;">
              <h3 style="color: #ffc107; margin: 0 0 15px 0;">Tasks (${tasks.length})</h3>
              ${tasks.map(task => `
                <div style="margin-bottom: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                  <h4 style="color: ${task.status === 'completed' ? '#00ff88' : '#ffc107'}; margin: 0 0 8px 0;">
                    ${task.status === 'completed' ? ' ' : ' '}${sanitizeText(task.title, 100)}
                  </h4>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Priority:</strong> ${task.priority}
                  </p>
                  ${task.dueDate ? `
                    <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                      <strong>Due:</strong> ${format(task.dueDate, 'MMM dd, yyyy')}
                    </p>
                  ` : ''}
                  ${task.status === 'completed' && task.completedAt ? `
                    <p style="color: #00ff88; margin: 5px 0; font-size: 14px;">
                      <strong>Completed:</strong> ${format(task.completedAt, 'MMM dd, yyyy')}
                    </p>
                  ` : ''}
                  ${task.description ? `
                    <p style="color: #999; margin: 8px 0; font-size: 13px; font-style: italic;">
                      "${sanitizeText(task.description, 200)}"
                    </p>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="color: #888; font-style: italic;">No tasks in this period.</p>
          `}
        </div>

        <!-- Journal Summary -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #00d4ff; border-bottom: 1px solid #00d4ff; padding-bottom: 10px;">
             Journal Summary
          </h2>
          ${journalEntries.length > 0 ? `
            <div style="background: rgba(138, 43, 226, 0.1); padding: 20px; border-radius: 10px; margin-top: 15px;">
              <h3 style="color: #8a2be2; margin: 0 0 15px 0;">Journal Entries (${journalEntries.length})</h3>
              ${journalEntries.map(entry => `
                <div style="margin-bottom: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                  <h4 style="color: #8a2be2; margin: 0 0 8px 0;">${sanitizeText(entry.title, 100)}</h4>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Type:</strong> ${entry.type}
                  </p>
                  <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                    <strong>Date:</strong> ${format(entry.createdAt, 'MMM dd, yyyy')}
                  </p>
                  ${entry.mood ? `
                    <p style="color: #ccc; margin: 5px 0; font-size: 14px;">
                      <strong>Mood:</strong> ${entry.mood}/10
                    </p>
                  ` : ''}
                  <p style="color: #999; margin: 8px 0; font-size: 13px; font-style: italic;">
                    "${sanitizeText(entry.content, 300)}"
                  </p>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="color: #888; font-style: italic;">No journal entries in this period.</p>
          `}
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #00d4ff; color: #888;">
          <p style="margin: 5px 0;">Generated by MomentumX Dashboard</p>
          <p style="margin: 5px 0; font-size: 12px;">Your journey to self-mastery continues...</p>
        </div>
      </div>
    `
  }, [])

  // Export to PDF
  const exportToPDF = useCallback(async () => {
    setLoading(true)
    
    try {
      const data = getFilteredData(exportType)
      const content = generatePDFContent(data)
      
      // Create temporary element
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      document.body.appendChild(tempDiv)
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Remove temporary element
      document.body.removeChild(tempDiv)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download PDF
      const fileName = `momentumx-report-${exportType}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [exportType, getFilteredData, generatePDFContent])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <select
        value={exportType}
        onChange={(e) => setExportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
        className="bg-background-secondary text-text-primary border border-glass-border rounded-lg px-3 py-1 text-sm"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      
      <button
        onClick={exportToPDF}
        disabled={loading}
        className="inline-flex items-center px-3 py-1 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </>
        )}
      </button>
    </div>
  )
}
