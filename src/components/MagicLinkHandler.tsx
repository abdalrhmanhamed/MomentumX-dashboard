'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authMethods } from '@/lib/auth'
import { toast } from 'react-hot-toast'

export function MagicLinkHandler() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleMagicLink = async () => {
      // Only handle magic links if user is not already authenticated
      if (user || loading) {
        return
      }

      // Check if current URL is a magic link
      if (authMethods.isMagicLink()) {
        try {
          await authMethods.handleMagicLinkSignIn()
          toast.success('Successfully logged in!')
          
          // Redirect to dashboard after successful magic link authentication
          router.push('/app/dashboard')
        } catch (error: any) {
          console.error('Magic link authentication error:', error)
          toast.error(error.message || 'Failed to authenticate with magic link')
          
          // Redirect to login page on error
          router.push('/app/auth/login')
        }
      }
    }

    // Small delay to ensure auth state is properly initialized
    const timer = setTimeout(handleMagicLink, 100)
    
    return () => clearTimeout(timer)
  }, [user, loading, router])

  // This component doesn't render anything
  return null
} 