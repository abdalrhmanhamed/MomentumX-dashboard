import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authMethods } from '@/lib/auth'
import { toast } from 'react-hot-toast'

interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  isMagicLink: boolean
  handleMagicLink: () => Promise<boolean>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Auth state change error:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully')
    } catch (error: any) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const handleMagicLink = async (): Promise<boolean> => {
    if (!authMethods.isMagicLink()) {
      return false
    }

    try {
      await authMethods.handleMagicLinkSignIn()
      toast.success('Successfully logged in!')
      return true
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
      return false
    }
  }

  return {
    user,
    loading,
    error,
    signOut: handleSignOut,
    isMagicLink: authMethods.isMagicLink(),
    handleMagicLink
  }
} 