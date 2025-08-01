'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { User, Habit, Task, JournalEntry } from '@/types'

interface AppContextType {
  user: User | null
  habits: Habit[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  isLoading: boolean
  setUser: (user: User | null) => void
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addJournalEntry: (entry: JournalEntry) => void
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void
  setLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit])
  }

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates, updatedAt: new Date() } : habit
    ))
  }

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev])
  }

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates, updatedAt: new Date() } : entry
    ))
  }

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const value: AppContextType = {
    user,
    habits,
    tasks,
    journalEntries,
    isLoading,
    setUser,
    addHabit,
    updateHabit,
    deleteHabit,
    addTask,
    updateTask,
    deleteTask,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    setLoading: setIsLoading,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 