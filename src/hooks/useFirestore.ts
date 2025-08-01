import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Habit, Task, JournalEntry, Review, User } from '@/types'

// Error messages in English and Arabic
const errorMessages = {
  en: {
    networkError: 'Network error. Please check your connection.',
    permissionDenied: 'Permission denied. Please log in again.',
    notFound: 'Item not found.',
    invalidData: 'Invalid data provided.',
    saveError: 'Failed to save. Please try again.',
    deleteError: 'Failed to delete. Please try again.',
    loadError: 'Failed to load data. Please refresh.',
    offlineError: 'You are offline. Changes will sync when connected.'
  },
  ar: {
    networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    permissionDenied: 'تم رفض الإذن. يرجى تسجيل الدخول مرة أخرى.',
    notFound: 'العنصر غير موجود.',
    invalidData: 'بيانات غير صالحة.',
    saveError: 'فشل في الحفظ. يرجى المحاولة مرة أخرى.',
    deleteError: 'فشل في الحذف. يرجى المحاولة مرة أخرى.',
    loadError: 'فشل في تحميل البيانات. يرجى تحديث الصفحة.',
    offlineError: 'أنت غير متصل بالإنترنت. ستتم المزامنة عند الاتصال.'
  }
}

// Utility function to get error message
const getErrorMessage = (error: any, language: 'en' | 'ar' = 'en'): string => {
  const messages = errorMessages[language]
  
  if (error?.code === 'permission-denied') return messages.permissionDenied
  if (error?.code === 'not-found') return messages.notFound
  if (error?.code === 'unavailable') return messages.networkError
  if (error?.code === 'failed-precondition') return messages.invalidData
  
  return messages.saveError
}

// Generic hook for real-time collection listening
function useCollection<T>(
  collectionName: string,
  userId: string | null,
  options: {
    orderByField?: string
    orderDirection?: 'asc' | 'desc'
    whereField?: string
    whereValue?: any
  } = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const collectionRef = collection(db, collectionName)
      let q = query(
        collectionRef,
        where('userId', '==', userId)
      )

      // Add optional where clause
      if (options.whereField && options.whereValue !== undefined) {
        q = query(q, where(options.whereField, '==', options.whereValue))
      }

      // Add ordering
      if (options.orderByField) {
        q = query(q, orderBy(options.orderByField, options.orderDirection || 'desc'))
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: T[] = []
          snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data()
            } as T)
          })
          setData(items)
          setLoading(false)
        },
        (error) => {
          console.error(`Error listening to ${collectionName}:`, error)
          setError(getErrorMessage(error))
          setLoading(false)
        }
      )

      return unsubscribe
    } catch (error) {
      console.error(`Error setting up ${collectionName} listener:`, error)
      setError(getErrorMessage(error))
      setLoading(false)
    }
  }, [userId, collectionName, options.orderByField, options.orderDirection, options.whereField, options.whereValue])

  return { data, loading, error }
}

// Habits Hook
function useHabits(userId: string | null) {
  const { data: habits, loading, error } = useCollection<Habit>('habits', userId, {
    orderByField: 'createdAt',
    orderDirection: 'desc'
  })

  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const docRef = await addDoc(collection(db, 'habits'), {
        ...habitData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding habit:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const habitRef = doc(db, 'habits', habitId)
      await updateDoc(habitRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating habit:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const toggleHabit = useCallback(async (habitId: string, date: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const habitRef = doc(db, 'habits', habitId)
      const habit = habits.find(h => h.id === habitId)
      
      if (!habit) throw new Error('Habit not found')

      const completedDates = habit.completedDates || []
      const isCompleted = completedDates.includes(date)
      
      const newCompletedDates = isCompleted
        ? completedDates.filter(d => d !== date)
        : [...completedDates, date]

      const currentStreak = calculateStreak(newCompletedDates)
      const longestStreak = Math.max(habit.longestStreak || 0, currentStreak)

      await updateDoc(habitRef, {
        completedDates: newCompletedDates,
        currentStreak,
        longestStreak,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error toggling habit:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId, habits])

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await deleteDoc(doc(db, 'habits', habitId))
    } catch (error) {
      console.error('Error deleting habit:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    toggleHabit,
    deleteHabit
  }
}

// Tasks Hook
function useTasks(userId: string | null) {
  const { data: tasks, loading, error } = useCollection<Task>('tasks', userId, {
    orderByField: 'createdAt',
    orderDirection: 'desc'
  })

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding task:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const taskRef = doc(db, 'tasks', taskId)
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const toggleTask = useCallback(async (taskId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const taskRef = doc(db, 'tasks', taskId)
      const task = tasks.find(t => t.id === taskId)
      
      if (!task) throw new Error('Task not found')

      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      const completedAt = newStatus === 'completed' ? serverTimestamp() : null

      await updateDoc(taskRef, {
        status: newStatus,
        completedAt,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error toggling task:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId, tasks])

  const deleteTask = useCallback(async (taskId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await deleteDoc(doc(db, 'tasks', taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask
  }
}

// Journal Hook
function useJournal(userId: string | null) {
  const { data: entries, loading, error } = useCollection<JournalEntry>('journal', userId, {
    orderByField: 'createdAt',
    orderDirection: 'desc'
  })

  const saveJournal = useCallback(async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const docRef = await addDoc(collection(db, 'journal'), {
        ...entryData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error saving journal entry:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const updateJournal = useCallback(async (entryId: string, updates: Partial<JournalEntry>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const entryRef = doc(db, 'journal', entryId)
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating journal entry:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const deleteJournal = useCallback(async (entryId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await deleteDoc(doc(db, 'journal', entryId))
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  return {
    entries,
    loading,
    error,
    saveJournal,
    updateJournal,
    deleteJournal
  }
}

// Reviews Hook
function useReviews(userId: string | null) {
  const { data: reviews, loading, error } = useCollection<Review>('reviews', userId, {
    orderByField: 'createdAt',
    orderDirection: 'desc'
  })

  const saveReview = useCallback(async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        userId,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error saving review:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const updateReview = useCallback(async (reviewId: string, updates: Partial<Review>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const reviewRef = doc(db, 'reviews', reviewId)
      await updateDoc(reviewRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating review:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await deleteDoc(doc(db, 'reviews', reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [userId])

  return {
    reviews,
    loading,
    error,
    addReview: saveReview,
    updateReview,
    deleteReview
  }
}

// Batch operations for multiple updates
function useBatchOperations() {
  const batchUpdate = useCallback(async (operations: Array<{
    type: 'update' | 'delete'
    collection: string
    id: string
    data?: any
  }>) => {
    try {
      const batch = writeBatch(db)
      
      operations.forEach(({ type, collection: collectionName, id, data }) => {
        const docRef = doc(db, collectionName, id)
        
        if (type === 'update' && data) {
          batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp()
          })
        } else if (type === 'delete') {
          batch.delete(docRef)
        }
      })
      
      await batch.commit()
    } catch (error) {
      console.error('Error in batch operation:', error)
      throw new Error(getErrorMessage(error))
    }
  }, [])

  return { batchUpdate }
}

// Network status hook
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const enableOffline = useCallback(async () => {
    try {
      await disableNetwork(db)
    } catch (error) {
      console.error('Error enabling offline mode:', error)
    }
  }, [])

  const enableOnline = useCallback(async () => {
    try {
      await enableNetwork(db)
    } catch (error) {
      console.error('Error enabling online mode:', error)
    }
  }, [])

  return { isOnline, enableOffline, enableOnline }
}

// Utility function to calculate streak
function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0
  
  const sortedDates = completedDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime())
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = today
  
  for (const date of sortedDates) {
    const diffTime = currentDate.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) {
      streak++
      currentDate = date
    } else {
      break
    }
  }
  
  return streak
}

// Export all hooks
export {
  useHabits,
  useTasks,
  useJournal,
  useReviews,
  useBatchOperations,
  useNetworkStatus
} 