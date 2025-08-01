export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  tier: 'free' | 'coach' | 'business'
  licenseKey?: string
  createdAt: Date
  lastLoginAt: Date
  preferences: {
    theme: 'dark' | 'light'
    language: 'en' | 'ar'
    notifications: boolean
  }
}

export interface Habit {
  id: string
  userId: string
  title: string
  description?: string
  category: string
  frequency: 'daily' | 'weekly' | 'monthly'
  target: number
  currentStreak: number
  longestStreak: number
  completedDates: string[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface JournalEntry {
  id: string
  userId: string
  type: 'daily' | 'weekly' | 'monthly'
  title: string
  content: string
  mood?: number // 1-10 scale
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  week: string // e.g., "2024-W30"
  weekStart?: Date
  moodScore: number // 1-10 scale
  habitsCompleted: number
  challenges: string
  wins: string
  lessons: string
  content?: string // Weekly review content
  rating: number // 1-10 scale
  createdAt: Date
  updatedAt?: Date
}

export interface License {
  id: string
  userId: string
  licenseKey: string
  productId: string
  tier: 'coach' | 'business'
  isValid: boolean
  expiresAt?: Date
  createdAt: Date
}

export interface DashboardStats {
  totalHabits: number
  activeHabits: number
  completedHabitsToday: number
  totalTasks: number
  completedTasksToday: number
  pendingTasks: number
  currentStreak: number
  averageMood: number
  journalEntriesThisWeek: number
} 