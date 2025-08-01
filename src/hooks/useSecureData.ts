import { useState, useCallback, useEffect } from 'react'
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { 
  signOut, 
  onIdTokenChanged, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import toast from 'react-hot-toast'
import {
  sanitizeText,
  sanitizeTitle,
  sanitizeDescription,
  sanitizeJournalContent,
  sanitizeTags,
  sanitizeDate,
  sanitizeISODate,
  sanitizeMood,
  sanitizePriority,
  sanitizeFrequency,
  sanitizeCategory,
  sanitizeEmail,
  sanitizeUserId,
  sanitizeLicenseKey,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeHabitData,
  sanitizeTaskData,
  sanitizeJournalData,
  detectSuspiciousPatterns,
  RateLimiter
} from '@/utils/sanitizers'
import { Habit, Task, JournalEntry, Review, User, License } from '@/types'

// Rate limiter instance
const rateLimiter = new RateLimiter(20, 60000) // 20 requests per minute

interface SecurityError {
  type: 'unauthorized' | 'invalid_input' | 'suspicious_pattern' | 'rate_limited' | 'network_error'
  message: string
  details?: any
}

interface UseSecureDataReturn {
  // State
  loading: boolean
  error: SecurityError | null
  isAuthenticated: boolean
  currentUser: FirebaseUser | null
  
  // Secure operations
  createHabit: (data: Partial<Habit>) => Promise<string | null>
  updateHabit: (habitId: string, data: Partial<Habit>) => Promise<boolean>
  deleteHabit: (habitId: string) => Promise<boolean>
  
  createTask: (data: Partial<Task>) => Promise<string | null>
  updateTask: (taskId: string, data: Partial<Task>) => Promise<boolean>
  deleteTask: (taskId: string) => Promise<boolean>
  
  createJournalEntry: (data: Partial<JournalEntry>) => Promise<string | null>
  updateJournalEntry: (entryId: string, data: Partial<JournalEntry>) => Promise<boolean>
  deleteJournalEntry: (entryId: string) => Promise<boolean>
  
  createReview: (data: Partial<Review>) => Promise<string | null>
  updateReview: (reviewId: string, data: Partial<Review>) => Promise<boolean>
  deleteReview: (reviewId: string) => Promise<boolean>
  
  // User management
  updateUserProfile: (data: Partial<User>) => Promise<boolean>
  deleteUserData: (userId: string) => Promise<boolean>
  
  // License management
  validateLicense: (licenseKey: string) => Promise<boolean>
  
  // Security utilities
  logout: () => Promise<void>
  clearError: () => void
}

export function useSecureData(): UseSecureDataReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<SecurityError | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)

  // Auth state monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setCurrentUser(user)
      
      if (!user) {
        // Clear any cached data when user logs out
        localStorage.removeItem('momentumx_license_cache')
        rateLimiter.clear('anonymous')
      }
    })

    return unsubscribe
  }, [])

  // Token monitoring for security
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        // Check if token is valid and not expired
        user.getIdTokenResult().then((tokenResult) => {
          if (tokenResult.claims.exp && Date.now() > Number(tokenResult.claims.exp) * 1000) {
            toast.error('Session expired. Please log in again.')
            logout()
          }
        }).catch(() => {
          toast.error('Authentication error. Please log in again.')
          logout()
        })
      }
    })

    return unsubscribe
  }, [])

  // Security validation helper
  const validateSecurity = useCallback((userId: string, operation: string): boolean => {
    // Check authentication
    if (!isAuthenticated || !currentUser) {
      setError({
        type: 'unauthorized',
        message: 'User not authenticated'
      })
      return false
    }

    // Check user ID match
    if (currentUser.uid !== userId) {
      setError({
        type: 'unauthorized',
        message: 'User ID mismatch'
      })
      return false
    }

    // Rate limiting
    if (!rateLimiter.isAllowed(userId)) {
      setError({
        type: 'rate_limited',
        message: 'Too many requests. Please wait a moment.'
      })
      return false
    }

    return true
  }, [isAuthenticated, currentUser])

  // Secure habit operations
  const createHabit = useCallback(async (data: Partial<Habit>): Promise<string | null> => {
    if (!currentUser) return null

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'createHabit')) {
        return null
      }

      // Sanitize and validate data
      const sanitizedData = sanitizeHabitData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid habit data provided'
        })
        return null
      }

      // Check for suspicious patterns
      const warnings = detectSuspiciousPatterns(sanitizedData.title)
      if (warnings.length > 0) {
        setError({
          type: 'suspicious_pattern',
          message: warnings.join(', ')
        })
        return null
      }

      // Create habit with secure data
      const habitRef = doc(collection(db, 'habits'))
      const habitData = {
        ...sanitizedData,
        id: habitRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        completedDates: [],
        currentStreak: 0,
        longestStreak: 0,
        isActive: true
      }

      await setDoc(habitRef, habitData)
      toast.success('Habit created successfully!')
      
      return habitRef.id

    } catch (error) {
      console.error('Error creating habit:', error)
      setError({
        type: 'network_error',
        message: 'Failed to create habit. Please try again.'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const updateHabit = useCallback(async (habitId: string, data: Partial<Habit>): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'updateHabit')) {
        return false
      }

      // Get existing habit to validate ownership
      const habitRef = doc(db, 'habits', habitId)
      const habitDoc = await getDoc(habitRef)
      
      if (!habitDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Habit not found'
        })
        return false
      }

      const existingHabit = habitDoc.data() as Habit
      if (existingHabit.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to habit'
        })
        return false
      }

      // Sanitize update data
      const sanitizedData = sanitizeHabitData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid habit data provided'
        })
        return false
      }

      // Update habit
      await updateDoc(habitRef, {
        ...sanitizedData,
        updatedAt: serverTimestamp()
      })

      toast.success('Habit updated successfully!')
      return true

    } catch (error) {
      console.error('Error updating habit:', error)
      setError({
        type: 'network_error',
        message: 'Failed to update habit. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const deleteHabit = useCallback(async (habitId: string): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'deleteHabit')) {
        return false
      }

      // Get existing habit to validate ownership
      const habitRef = doc(db, 'habits', habitId)
      const habitDoc = await getDoc(habitRef)
      
      if (!habitDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Habit not found'
        })
        return false
      }

      const existingHabit = habitDoc.data() as Habit
      if (existingHabit.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to habit'
        })
        return false
      }

      // Delete habit
      await deleteDoc(habitRef)
      toast.success('Habit deleted successfully!')
      return true

    } catch (error) {
      console.error('Error deleting habit:', error)
      setError({
        type: 'network_error',
        message: 'Failed to delete habit. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // Secure task operations
  const createTask = useCallback(async (data: Partial<Task>): Promise<string | null> => {
    if (!currentUser) return null

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'createTask')) {
        return null
      }

      // Sanitize and validate data
      const sanitizedData = sanitizeTaskData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid task data provided'
        })
        return null
      }

      // Validate due date is not in the past
      if (sanitizedData.dueDate) {
        const dueDate = new Date(sanitizedData.dueDate)
        if (dueDate < new Date()) {
          setError({
            type: 'invalid_input',
            message: 'Due date cannot be in the past'
          })
          return null
        }
      }

      // Create task with secure data
      const taskRef = doc(collection(db, 'tasks'))
      const taskData = {
        ...sanitizedData,
        id: taskRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        completed: false
      }

      await setDoc(taskRef, taskData)
      toast.success('Task created successfully!')
      
      return taskRef.id

    } catch (error) {
      console.error('Error creating task:', error)
      setError({
        type: 'network_error',
        message: 'Failed to create task. Please try again.'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const updateTask = useCallback(async (taskId: string, data: Partial<Task>): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'updateTask')) {
        return false
      }

      // Get existing task to validate ownership
      const taskRef = doc(db, 'tasks', taskId)
      const taskDoc = await getDoc(taskRef)
      
      if (!taskDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Task not found'
        })
        return false
      }

      const existingTask = taskDoc.data() as Task
      if (existingTask.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to task'
        })
        return false
      }

      // Sanitize update data
      const sanitizedData = sanitizeTaskData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid task data provided'
        })
        return false
      }

      // Update task
      await updateDoc(taskRef, {
        ...sanitizedData,
        updatedAt: serverTimestamp()
      })

      toast.success('Task updated successfully!')
      return true

    } catch (error) {
      console.error('Error updating task:', error)
      setError({
        type: 'network_error',
        message: 'Failed to update task. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'deleteTask')) {
        return false
      }

      // Get existing task to validate ownership
      const taskRef = doc(db, 'tasks', taskId)
      const taskDoc = await getDoc(taskRef)
      
      if (!taskDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Task not found'
        })
        return false
      }

      const existingTask = taskDoc.data() as Task
      if (existingTask.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to task'
        })
        return false
      }

      // Delete task
      await deleteDoc(taskRef)
      toast.success('Task deleted successfully!')
      return true

    } catch (error) {
      console.error('Error deleting task:', error)
      setError({
        type: 'network_error',
        message: 'Failed to delete task. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // Secure journal operations
  const createJournalEntry = useCallback(async (data: Partial<JournalEntry>): Promise<string | null> => {
    if (!currentUser) return null

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'createJournalEntry')) {
        return null
      }

      // Sanitize and validate data
      const sanitizedData = sanitizeJournalData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid journal data provided'
        })
        return null
      }

      // Check content length
      if (sanitizedData.content && sanitizedData.content.length > 2000) {
        setError({
          type: 'invalid_input',
          message: 'Journal content too long (max 2000 characters)'
        })
        return null
      }

      // Create journal entry with secure data
      const entryRef = doc(collection(db, 'journal'))
      const entryData = {
        ...sanitizedData,
        id: entryRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(entryRef, entryData)
      toast.success('Journal entry saved!')
      
      return entryRef.id

    } catch (error) {
      console.error('Error creating journal entry:', error)
      setError({
        type: 'network_error',
        message: 'Failed to save journal entry. Please try again.'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const updateJournalEntry = useCallback(async (entryId: string, data: Partial<JournalEntry>): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'updateJournalEntry')) {
        return false
      }

      // Get existing entry to validate ownership
      const entryRef = doc(db, 'journal', entryId)
      const entryDoc = await getDoc(entryRef)
      
      if (!entryDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Journal entry not found'
        })
        return false
      }

      const existingEntry = entryDoc.data() as JournalEntry
      if (existingEntry.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to journal entry'
        })
        return false
      }

      // Sanitize update data
      const sanitizedData = sanitizeJournalData({
        ...data,
        userId: currentUser.uid
      })

      if (!sanitizedData) {
        setError({
          type: 'invalid_input',
          message: 'Invalid journal data provided'
        })
        return false
      }

      // Update entry
      await updateDoc(entryRef, {
        ...sanitizedData,
        updatedAt: serverTimestamp()
      })

      toast.success('Journal entry updated!')
      return true

    } catch (error) {
      console.error('Error updating journal entry:', error)
      setError({
        type: 'network_error',
        message: 'Failed to update journal entry. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const deleteJournalEntry = useCallback(async (entryId: string): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      // Validate security
      if (!validateSecurity(currentUser.uid, 'deleteJournalEntry')) {
        return false
      }

      // Get existing entry to validate ownership
      const entryRef = doc(db, 'journal', entryId)
      const entryDoc = await getDoc(entryRef)
      
      if (!entryDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Journal entry not found'
        })
        return false
      }

      const existingEntry = entryDoc.data() as JournalEntry
      if (existingEntry.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to journal entry'
        })
        return false
      }

      // Delete entry
      await deleteDoc(entryRef)
      toast.success('Journal entry deleted!')
      return true

    } catch (error) {
      console.error('Error deleting journal entry:', error)
      setError({
        type: 'network_error',
        message: 'Failed to delete journal entry. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // Review operations (similar pattern)
  const createReview = useCallback(async (data: Partial<Review>): Promise<string | null> => {
    if (!currentUser) return null

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(currentUser.uid, 'createReview')) {
        return null
      }

      const sanitizedData = {
        userId: currentUser.uid,
        content: sanitizeJournalContent(data.content || '', 5000),
        weekStart: sanitizeDate(data.weekStart || new Date().toISOString()),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      if (!sanitizedData.content || !sanitizedData.weekStart) {
        setError({
          type: 'invalid_input',
          message: 'Invalid review data provided'
        })
        return null
      }

      const reviewRef = doc(collection(db, 'reviews'))
      const reviewData = {
        ...sanitizedData,
        id: reviewRef.id
      }

      await setDoc(reviewRef, reviewData)
      toast.success('Weekly review saved!')
      
      return reviewRef.id

    } catch (error) {
      console.error('Error creating review:', error)
      setError({
        type: 'network_error',
        message: 'Failed to save review. Please try again.'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const updateReview = useCallback(async (reviewId: string, data: Partial<Review>): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(currentUser.uid, 'updateReview')) {
        return false
      }

      const reviewRef = doc(db, 'reviews', reviewId)
      const reviewDoc = await getDoc(reviewRef)
      
      if (!reviewDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Review not found'
        })
        return false
      }

      const existingReview = reviewDoc.data() as Review
      if (existingReview.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to review'
        })
        return false
      }

      const sanitizedData = {
        content: sanitizeJournalContent(data.content || '', 5000),
        updatedAt: serverTimestamp()
      }

      await updateDoc(reviewRef, sanitizedData)
      toast.success('Review updated!')
      return true

    } catch (error) {
      console.error('Error updating review:', error)
      setError({
        type: 'network_error',
        message: 'Failed to update review. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(currentUser.uid, 'deleteReview')) {
        return false
      }

      const reviewRef = doc(db, 'reviews', reviewId)
      const reviewDoc = await getDoc(reviewRef)
      
      if (!reviewDoc.exists()) {
        setError({
          type: 'unauthorized',
          message: 'Review not found'
        })
        return false
      }

      const existingReview = reviewDoc.data() as Review
      if (existingReview.userId !== currentUser.uid) {
        setError({
          type: 'unauthorized',
          message: 'Unauthorized access to review'
        })
        return false
      }

      await deleteDoc(reviewRef)
      toast.success('Review deleted!')
      return true

    } catch (error) {
      console.error('Error deleting review:', error)
      setError({
        type: 'network_error',
        message: 'Failed to delete review. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // User profile operations
  const updateUserProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(currentUser.uid, 'updateUserProfile')) {
        return false
      }

      const sanitizedData = {
        displayName: sanitizeTitle(data.displayName || '', 50),
        email: sanitizeEmail(data.email || ''),
        photoURL: data.photoURL || '',
        updatedAt: serverTimestamp()
      }

      const userRef = doc(db, 'users', currentUser.uid)
      await setDoc(userRef, {
        id: currentUser.uid,
        ...sanitizedData,
        createdAt: serverTimestamp()
      }, { merge: true })

      toast.success('Profile updated!')
      return true

    } catch (error) {
      console.error('Error updating profile:', error)
      setError({
        type: 'network_error',
        message: 'Failed to update profile. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // GDPR-compliant data deletion
  const deleteUserData = useCallback(async (userId: string): Promise<boolean> => {
    if (!currentUser || currentUser.uid !== userId) return false

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(userId, 'deleteUserData')) {
        return false
      }

      const batch = writeBatch(db)

      // Delete all user's habits
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', userId)
      )
      const habitsSnapshot = await getDocs(habitsQuery)
      habitsSnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete all user's tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      )
      const tasksSnapshot = await getDocs(tasksQuery)
      tasksSnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete all user's journal entries
      const journalQuery = query(
        collection(db, 'journal'),
        where('userId', '==', userId)
      )
      const journalSnapshot = await getDocs(journalQuery)
      journalSnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete all user's reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId)
      )
      const reviewsSnapshot = await getDocs(reviewsQuery)
      reviewsSnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete user profile
      const userRef = doc(db, 'users', userId)
      batch.delete(userRef)

      // Delete license
      const licenseRef = doc(db, 'licenses', userId)
      batch.delete(licenseRef)

      await batch.commit()

      // Clear local storage
      localStorage.removeItem('momentumx_license_cache')
      rateLimiter.clear(userId)

      toast.success('All data deleted successfully')
      return true

    } catch (error) {
      console.error('Error deleting user data:', error)
      setError({
        type: 'network_error',
        message: 'Failed to delete user data. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // License validation
  const validateLicense = useCallback(async (licenseKey: string): Promise<boolean> => {
    if (!currentUser) return false

    setLoading(true)
    setError(null)

    try {
      if (!validateSecurity(currentUser.uid, 'validateLicense')) {
        return false
      }

      const sanitizedKey = sanitizeLicenseKey(licenseKey)
      if (!sanitizedKey) {
        setError({
          type: 'invalid_input',
          message: 'Invalid license key format'
        })
        return false
      }

      // Call Gumroad API (implementation would go here)
      // For now, return true as placeholder
      return true

    } catch (error) {
      console.error('Error validating license:', error)
      setError({
        type: 'network_error',
        message: 'Failed to validate license. Please try again.'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [currentUser, validateSecurity])

  // Secure logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth)
      localStorage.removeItem('momentumx_license_cache')
      rateLimiter.clear('anonymous')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Error logging out')
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    loading,
    error,
    isAuthenticated,
    currentUser,
    
    // Secure operations
    createHabit,
    updateHabit,
    deleteHabit,
    
    createTask,
    updateTask,
    deleteTask,
    
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    
    createReview,
    updateReview,
    deleteReview,
    
    // User management
    updateUserProfile,
    deleteUserData,
    
    // License management
    validateLicense,
    
    // Security utilities
    logout,
    clearError
  }
} 