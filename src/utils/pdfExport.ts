import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format, differenceInDays, startOfWeek, endOfWeek } from 'date-fns'
import type { Habit, Task, JournalEntry, Review, User } from '@/types'

interface PDFExportOptions {
  includeHabits: boolean
  includeTasks: boolean
  includeJournal: boolean
  includeReviews: boolean
  includeAnalytics: boolean
  dateRange: 'all' | '30d' | '90d' | '180d'
  format: 'detailed' | 'summary' | 'coach-report'
}

interface PDFData {
  user: User
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  reviews: Review[]
  analytics: {
    totalDays: number
    perfectDays: number
    averageCompletion: number
    currentStreak: number
    longestStreak: number
    totalHabitsCompleted: number
  }
}

export class PDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageWidth: number = 210
  private margin: number = 20
  private lineHeight: number = 7

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.setupDocument()
  }

  private setupDocument() {
    // Set document properties
    this.doc.setProperties({
      title: 'MomentumX Progress Report',
      subject: 'Self-Mastery Journey Progress',
      author: 'MomentumX Dashboard',
      creator: 'MomentumX Dashboard'
    })

    // Set font
    this.doc.setFont('helvetica')
  }

  private addHeader(title: string, subtitle?: string) {
    // Logo/Title
    this.doc.setFontSize(24)
    this.doc.setTextColor(0, 255, 255) // Neon turquoise
    this.doc.text('MomentumX', this.margin, this.currentY)
    
    this.currentY += 8
    this.doc.setFontSize(16)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text(title, this.margin, this.currentY)
    
    if (subtitle) {
      this.currentY += 6
      this.doc.setFontSize(12)
      this.doc.setTextColor(128, 128, 128)
      this.doc.text(subtitle, this.margin, this.currentY)
    }
    
    this.currentY += 15
  }

  private addSection(title: string, content: string[]) {
    // Section title
    this.doc.setFontSize(14)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 8

    // Section content
    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    
    content.forEach(line => {
      if (this.currentY > 270) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += this.lineHeight
    })
    
    this.currentY += 10
  }

  private addProgressBar(label: string, value: number, max: number, width: number = 150) {
    const percentage = (value / max) * 100
    const barWidth = (percentage / 100) * width
    
    // Label
    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text(label, this.margin, this.currentY)
    
    // Percentage
    this.doc.text(`${Math.round(percentage)}%`, this.margin + width + 5, this.currentY)
    
    this.currentY += 4
    
    // Progress bar background
    this.doc.setFillColor(64, 64, 64)
    this.doc.rect(this.margin, this.currentY, width, 4, 'F')
    
    // Progress bar fill
    this.doc.setFillColor(0, 255, 255)
    this.doc.rect(this.margin, this.currentY, barWidth, 4, 'F')
    
    this.currentY += 8
  }

  private addHabitTable(habits: Habit[]) {
    if (habits.length === 0) return

    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text('Habits & Streaks', this.margin, this.currentY)
    this.currentY += 8

    // Table headers
    const headers = ['Habit', 'Category', 'Current Streak', 'Longest Streak', 'Status']
    const colWidths = [60, 30, 30, 30, 25]
    let x = this.margin

    this.doc.setFontSize(8)
    this.doc.setTextColor(255, 255, 255)
    headers.forEach((header, i) => {
      this.doc.text(header, x, this.currentY)
      x += colWidths[i]
    })
    this.currentY += 5

    // Table content
    habits.forEach(habit => {
      if (this.currentY > 250) {
        this.doc.addPage()
        this.currentY = 20
      }

      x = this.margin
      this.doc.text(habit.title.substring(0, 25), x, this.currentY)
      x += colWidths[0]
      
      this.doc.text(habit.category, x, this.currentY)
      x += colWidths[1]
      
      this.doc.text(habit.currentStreak.toString(), x, this.currentY)
      x += colWidths[2]
      
      this.doc.text(habit.longestStreak.toString(), x, this.currentY)
      x += colWidths[3]
      
      this.doc.text(habit.isActive ? 'Active' : 'Inactive', x, this.currentY)
      
      this.currentY += 5
    })

    this.currentY += 10
  }

  private addTaskSummary(tasks: Task[]) {
    if (tasks.length === 0) return

    const completed = tasks.filter(t => t.status === 'completed').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length

    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text('Task Summary', this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text(`Total Tasks: ${tasks.length}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Completed: ${completed}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Pending: ${pending}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`In Progress: ${inProgress}`, this.margin, this.currentY)
    this.currentY += 10
  }

  private addJournalEntries(entries: JournalEntry[]) {
    if (entries.length === 0) return

    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text('Journal Entries', this.margin, this.currentY)
    this.currentY += 8

    entries.slice(0, 5).forEach(entry => {
      if (this.currentY > 250) {
        this.doc.addPage()
        this.currentY = 20
      }

      this.doc.setFontSize(10)
      this.doc.setTextColor(255, 255, 255)
      this.doc.text(format(new Date(entry.createdAt), 'MMM dd, yyyy'), this.margin, this.currentY)
      this.currentY += 5

      this.doc.setFontSize(8)
      this.doc.setTextColor(200, 200, 200)
      const content = entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '')
      this.doc.text(content, this.margin, this.currentY)
      this.currentY += 8
    })

    this.currentY += 10
  }

  private addWeeklyReviews(reviews: Review[]) {
    if (reviews.length === 0) return

    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text('Weekly Reviews', this.margin, this.currentY)
    this.currentY += 8

    reviews.slice(0, 3).forEach(review => {
      if (this.currentY > 250) {
        this.doc.addPage()
        this.currentY = 20
      }

      this.doc.setFontSize(10)
      this.doc.setTextColor(255, 255, 255)
      this.doc.text(`Week ${review.week}`, this.margin, this.currentY)
      this.currentY += 5

      this.doc.setFontSize(8)
      this.doc.setTextColor(200, 200, 200)
      this.doc.text(`Rating: ${review.rating}/10`, this.margin, this.currentY)
      this.currentY += 4
      this.doc.text(`Mood: ${review.moodScore}/10`, this.margin, this.currentY)
      this.currentY += 4
      this.doc.text(`Habits Completed: ${review.habitsCompleted}`, this.margin, this.currentY)
      this.currentY += 8
    })

    this.currentY += 10
  }

  private addAnalytics(analytics: PDFData['analytics']) {
    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 255, 255)
    this.doc.text('Progress Analytics', this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    
    this.doc.text(`Total Days Tracked: ${analytics.totalDays}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Perfect Days: ${analytics.perfectDays}`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Average Completion: ${analytics.averageCompletion.toFixed(1)}%`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Current Streak: ${analytics.currentStreak} days`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Longest Streak: ${analytics.longestStreak} days`, this.margin, this.currentY)
    this.currentY += 5
    this.doc.text(`Total Habits Completed: ${analytics.totalHabitsCompleted}`, this.margin, this.currentY)
    this.currentY += 10
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      
      // Footer line
      this.doc.setDrawColor(64, 64, 64)
      this.doc.line(this.margin, 280, this.pageWidth - this.margin, 280)
      
      // Footer text
      this.doc.setFontSize(8)
      this.doc.setTextColor(128, 128, 128)
      this.doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy')}`, this.margin, 285)
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 30, 285, { align: 'right' })
    }
  }

  public async generatePDF(data: PDFData, options: PDFExportOptions): Promise<Blob> {
    const { user, habits, tasks, journalEntries, reviews, analytics } = data

    // Add header
    this.addHeader(
      'Progress Report',
      `Generated for ${user.displayName || user.email}`
    )

    // Add user info
    this.addSection('User Information', [
      `Name: ${user.displayName || 'Not provided'}`,
      `Email: ${user.email || 'Not provided'}`,
      `Tier: ${user.tier}`,
      `Report Generated: ${format(new Date(), 'MMMM dd, yyyy')}`
    ])

    // Add analytics
    if (options.includeAnalytics) {
      this.addAnalytics(analytics)
    }

    // Add habits
    if (options.includeHabits) {
      this.addHabitTable(habits)
    }

    // Add tasks
    if (options.includeTasks) {
      this.addTaskSummary(tasks)
    }

    // Add journal entries
    if (options.includeJournal) {
      this.addJournalEntries(journalEntries)
    }

    // Add weekly reviews
    if (options.includeReviews) {
      this.addWeeklyReviews(reviews)
    }

    // Add footer
    this.addFooter()

    // Return as blob
    return this.doc.output('blob')
  }

  public async generateCoachReport(data: PDFData): Promise<Blob> {
    const { user, habits, tasks, journalEntries, reviews, analytics } = data

    this.addHeader('Coach Report', `Client: ${user.displayName || user.email}`)

    // Executive Summary
    this.addSection('Executive Summary', [
      `This report covers ${analytics.totalDays} days of progress tracking.`,
      `The client has achieved ${analytics.perfectDays} perfect days with an average completion rate of ${analytics.averageCompletion.toFixed(1)}%.`,
      `Current streak: ${analytics.currentStreak} days, Longest streak: ${analytics.longestStreak} days.`
    ])

    // Progress Analysis
    this.addSection('Progress Analysis', [
      `Habit Completion Rate: ${analytics.averageCompletion.toFixed(1)}%`,
      `Perfect Days Ratio: ${((analytics.perfectDays / analytics.totalDays) * 100).toFixed(1)}%`,
      `Total Habits Tracked: ${habits.length}`,
      `Active Habits: ${habits.filter(h => h.isActive).length}`,
      `Tasks Completed: ${tasks.filter(t => t.status === 'completed').length}`
    ])

    // Recommendations
    this.addSection('Recommendations', [
      'Based on the data analysis, consider the following:',
      '',
      '1. Focus on consistency over perfection',
      '2. Celebrate small wins and progress',
      '3. Adjust habit difficulty if needed',
      '4. Review and update goals regularly',
      '5. Maintain accountability through regular check-ins'
    ])

    this.addFooter()
    return this.doc.output('blob')
  }
}

// Helper function to calculate analytics
export const calculateAnalytics = (data: {
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  reviews: Review[]
}): PDFData['analytics'] => {
  const { habits, tasks, journalEntries, reviews } = data
  
  const totalDays = Math.max(
    habits.length > 0 ? Math.max(...habits.map(h => h.completedDates.length)) : 0,
    reviews.length * 7,
    30 // Default minimum
  )

  const perfectDays = reviews.reduce((sum, review) => 
    sum + (review.habitsCompleted === habits.length ? 1 : 0), 0
  )

  const averageCompletion = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length * 10
    : 0

  const currentStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.currentStreak))
    : 0

  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.longestStreak))
    : 0

  const totalHabitsCompleted = reviews.reduce((sum, review) => 
    sum + review.habitsCompleted, 0
  )

  return {
    totalDays,
    perfectDays,
    averageCompletion,
    currentStreak,
    longestStreak,
    totalHabitsCompleted
  }
} 