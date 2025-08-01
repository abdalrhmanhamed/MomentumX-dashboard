import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-hot-toast'

interface UserRecord {
  uid: string
  email: string
  tier: 'starter' | 'coach' | 'business'
  createdAt: Date
  lastLogin?: Date
  habitsCount?: number
  tasksCount?: number
  journalEntriesCount?: number
}

interface UseAdminReturn {
  users: UserRecord[]
  loading: boolean
  error: string | null
  updateUserTier: (uid: string, tier: 'starter' | 'coach' | 'business') => Promise<void>
  deleteUser: (uid: string) => Promise<void>
  refreshUsers: () => Promise<void>
}

export function useAdmin(): UseAdminReturn {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all users with their data
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const usersRef = collection(db, 'users')
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'))
      const usersSnapshot = await getDocs(usersQuery)
      
      const usersData: UserRecord[] = []
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        
        // Get user's activity counts
        const habitsQuery = query(
          collection(db, 'habits'),
          where('userId', '==', userDoc.id)
        )
        const habitsSnapshot = await getDocs(habitsQuery)
        
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', userDoc.id)
        )
        const tasksSnapshot = await getDocs(tasksQuery)
        
        const journalQuery = query(
          collection(db, 'journal'),
          where('userId', '==', userDoc.id)
        )
        const journalSnapshot = await getDocs(journalQuery)
        
        usersData.push({
          uid: userDoc.id,
          email: userData.email || 'Unknown',
          tier: userData.tier || 'starter',
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLogin: userData.lastLogin?.toDate(),
          habitsCount: habitsSnapshot.size,
          tasksCount: tasksSnapshot.size,
          journalEntriesCount: journalSnapshot.size
        })
      }
      
      setUsers(usersData)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users. Please try again.')
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  // Update user tier
  const updateUserTier = useCallback(async (uid: string, tier: 'starter' | 'coach' | 'business') => {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        tier,
        updatedAt: new Date()
      })
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === uid 
            ? { ...user, tier }
            : user
        )
      )
      
      toast.success(`User tier updated to ${tier}`)
    } catch (err) {
      console.error('Error updating user tier:', err)
      toast.error('Failed to update user tier')
      throw err
    }
  }, [])

  // Delete user and all their data
  const deleteUser = useCallback(async (uid: string) => {
    try {
      // Delete user's habits
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', uid)
      )
      const habitsSnapshot = await getDocs(habitsQuery)
      const habitsDeletePromises = habitsSnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      // Delete user's tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', uid)
      )
      const tasksSnapshot = await getDocs(tasksQuery)
      const tasksDeletePromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      // Delete user's journal entries
      const journalQuery = query(
        collection(db, 'journal'),
        where('userId', '==', uid)
      )
      const journalSnapshot = await getDocs(journalQuery)
      const journalDeletePromises = journalSnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      // Delete user's reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', uid)
      )
      const reviewsSnapshot = await getDocs(reviewsQuery)
      const reviewsDeletePromises = reviewsSnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      // Delete user's license
      const licenseQuery = query(
        collection(db, 'licenses'),
        where('userId', '==', uid)
      )
      const licenseSnapshot = await getDocs(licenseQuery)
      const licenseDeletePromises = licenseSnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      // Delete user document
      const userRef = doc(db, 'users', uid)
      const userDeletePromise = deleteDoc(userRef)
      
      // Execute all deletions
      await Promise.all([
        ...habitsDeletePromises,
        ...tasksDeletePromises,
        ...journalDeletePromises,
        ...reviewsDeletePromises,
        ...licenseDeletePromises,
        userDeletePromise
      ])
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.uid !== uid))
      
      toast.success('User and all data deleted successfully')
    } catch (err) {
      console.error('Error deleting user:', err)
      toast.error('Failed to delete user')
      throw err
    }
  }, [])

  // Refresh users data
  const refreshUsers = useCallback(async () => {
    await fetchUsers()
  }, [fetchUsers])

  // Initial fetch
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    updateUserTier,
    deleteUser,
    refreshUsers
  }
} 