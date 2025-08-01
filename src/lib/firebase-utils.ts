import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import type { User, Habit, Task, JournalEntry, Review, License } from '@/types'

// User operations
export const createUser = async (userData: Omit<User, 'uid'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const getUser = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User
    }
    return null
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

export const updateUser = async (uid: string, updates: Partial<User>) => {
  try {
    const docRef = doc(db, 'users', uid)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Habit operations
export const getHabits = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Habit[]
  } catch (error) {
    console.error('Error getting habits:', error)
    throw error
  }
}

export const createHabit = async (habitData: Omit<Habit, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      ...habitData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating habit:', error)
    throw error
  }
}

export const updateHabit = async (id: string, updates: Partial<Habit>) => {
  try {
    const docRef = doc(db, 'habits', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating habit:', error)
    throw error
  }
}

export const deleteHabit = async (id: string) => {
  try {
    const docRef = doc(db, 'habits', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting habit:', error)
    throw error
  }
}

// Task operations
export const getTasks = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]
  } catch (error) {
    console.error('Error getting tasks:', error)
    throw error
  }
}

export const createTask = async (taskData: Omit<Task, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const docRef = doc(db, 'tasks', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (id: string) => {
  try {
    const docRef = doc(db, 'tasks', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

// Journal operations
export const getJournalEntries = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'journal'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[]
  } catch (error) {
    console.error('Error getting journal entries:', error)
    throw error
  }
}

export const createJournalEntry = async (entryData: Omit<JournalEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'journal'), {
      ...entryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating journal entry:', error)
    throw error
  }
}

export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
  try {
    const docRef = doc(db, 'journal', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating journal entry:', error)
    throw error
  }
}

export const deleteJournalEntry = async (id: string) => {
  try {
    const docRef = doc(db, 'journal', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    throw error
  }
}

// License validation
export const validateLicense = async (licenseKey: string) => {
  try {
    const q = query(
      collection(db, 'licenses'),
      where('licenseKey', '==', licenseKey),
      where('isValid', '==', true)
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const license = querySnapshot.docs[0].data() as License
      return license
    }
    return null
  } catch (error) {
    console.error('Error validating license:', error)
    throw error
  }
}

// Utility functions
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const isToday = (date: Date) => {
  const today = new Date()
  return formatDate(date) === formatDate(today)
}

export const isOverdue = (dueDate: Date) => {
  return new Date() > dueDate
} 