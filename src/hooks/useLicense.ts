import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import { LicenseValidation, GumroadLicenseResponse } from '@/types/license'

// License tier configurations
const LICENSE_TIERS = {
  starter: {
    name: 'Starter',
    features: ['basic_habits', 'basic_tasks', 'daily_journal'] as const,
    maxHabits: 5,
    maxTasks: 3,
    maxJournalEntries: 10,
    canExport: false,
    canUseAdmin: false,
    canUseCoachMode: false,
    canUseAnalytics: false,
    canUseTeamManagement: false,
    canUseCustomBranding: false
  },
  coach: {
    name: 'Coach',
    features: ['unlimited_habits', 'unlimited_tasks', 'unlimited_journal', 'pdf_export', 'analytics', 'coach_mode'] as const,
    maxHabits: -1, // unlimited
    maxTasks: -1, // unlimited
    maxJournalEntries: -1, // unlimited
    canExport: true,
    canUseAdmin: false,
    canUseCoachMode: true,
    canUseAnalytics: true,
    canUseTeamManagement: false,
    canUseCustomBranding: false
  },
  business: {
    name: 'Business',
    features: ['unlimited_habits', 'unlimited_tasks', 'unlimited_journal', 'pdf_export', 'analytics', 'coach_mode', 'admin_panel', 'team_management', 'custom_branding'] as const,
    maxHabits: -1, // unlimited
    maxTasks: -1, // unlimited
    maxJournalEntries: -1, // unlimited
    canExport: true,
    canUseAdmin: true,
    canUseCoachMode: true,
    canUseAnalytics: true,
    canUseTeamManagement: true,
    canUseCustomBranding: true
  }
} as const

export type LicenseTier = keyof typeof LICENSE_TIERS

interface UseLicenseReturn {
  // License state
  license: LicenseValidation | null
  loading: boolean
  error: string | null
  
  // Actions
  validateLicense: (licenseKey: string) => Promise<LicenseValidation>
  clearLicense: () => void
  
  // Feature checks
  hasFeature: (feature: string) => boolean
  canUseFeature: (feature: keyof typeof LICENSE_TIERS.starter) => boolean
  getTierLimits: () => typeof LICENSE_TIERS[keyof typeof LICENSE_TIERS]
  
  // Utility
  isPremium: boolean
  tier: LicenseTier | null
}

const GUMROAD_API_URL = 'https://api.gumroad.com/v2/licenses/verify'
const LICENSE_CACHE_KEY = 'momentumx_license_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function useLicense(userId: string | null): UseLicenseReturn {
  const [license, setLicense] = useState<LicenseValidation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cached license on mount
  useEffect(() => {
    if (!userId) return

    const loadCachedLicense = async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(LICENSE_CACHE_KEY)
        if (cached) {
          const { license: cachedLicense, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            setLicense(cachedLicense)
            return
          }
        }

        // Load from Firestore
        const licenseDoc = await getDoc(doc(db, 'licenses', userId))
        if (licenseDoc.exists()) {
          const firestoreLicense = licenseDoc.data()
          setLicense(firestoreLicense as LicenseValidation)
          
          // Update cache
          localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify({
            license: firestoreLicense,
            timestamp: Date.now()
          }))
        }
      } catch (error) {
        console.error('Error loading cached license:', error)
      }
    }

    loadCachedLicense()
  }, [userId])

  // Detect tier from Gumroad response
  const detectTier = (gumroadResponse: GumroadLicenseResponse): LicenseTier => {
    const license = gumroadResponse.license
    if (!license) return 'starter'

    // Check custom fields first
    const customTier = license.custom_fields?.tier
    if (customTier && LICENSE_TIERS[customTier as LicenseTier]) {
      return customTier as LicenseTier
    }

    // Check metadata
    const metadataTier = license.metadata?.tier
    if (metadataTier && LICENSE_TIERS[metadataTier as LicenseTier]) {
      return metadataTier as LicenseTier
    }

    // Detect by product name/ID
    const productName = license.product_name.toLowerCase()
    if (productName.includes('coach')) return 'coach'
    if (productName.includes('business')) return 'business'
    
    return 'starter'
  }

  // Validate license with Gumroad
  const validateLicense = useCallback(async (licenseKey: string): Promise<LicenseValidation> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    setLoading(true)
    setError(null)

    const cacheKey = `license_${licenseKey}`
    
    try {
      // Check cache first
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { result, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setLicense(result)
          return result
        }
      }

      // Validate with Gumroad
      const response = await fetch(GUMROAD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          product_permalink: 'momentumx',
          license_key: licenseKey,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const gumroadResponse: GumroadLicenseResponse = await response.json()

      if (!gumroadResponse.success) {
        const errorMessage = gumroadResponse.message || 'Invalid license key'
        setError(errorMessage)
        toast.error(errorMessage)
        
        return {
          valid: false,
          tier: 'starter',
          message: errorMessage,
          features: LICENSE_TIERS.starter.features
        }
      }

      // Detect tier and features
      const tier = detectTier(gumroadResponse)
      const tierConfig = LICENSE_TIERS[tier]

      const licenseData: LicenseValidation = {
        valid: true,
        tier,
        message: `Valid ${tierConfig.name} license`,
        features: tierConfig.features,
        expiresAt: gumroadResponse.license ? new Date(gumroadResponse.license.created_at) : undefined,
        productId: gumroadResponse.license?.product_id,
        licenseId: gumroadResponse.license?.id
      }

      // Save to Firestore
      await setDoc(doc(db, 'licenses', userId), {
        ...licenseData,
        licenseKey: licenseKey,
        validatedAt: serverTimestamp(),
        userId
      })

      // Update cache
      localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify({
        license: licenseData,
        timestamp: Date.now()
      }))

      localStorage.setItem(cacheKey, JSON.stringify({
        result: licenseData,
        timestamp: Date.now()
      }))

      setLicense(licenseData)
      toast.success(`Welcome to ${tierConfig.name}! `)
      
      return licenseData

    } catch (error) {
      console.error('License validation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate license'
      setError(errorMessage)
      toast.error(errorMessage)
      
      return {
        valid: false,
        tier: 'starter',
        message: errorMessage,
        features: LICENSE_TIERS.starter.features
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Clear license data
  const clearLicense = useCallback(() => {
    setLicense(null)
    setError(null)
    localStorage.removeItem(LICENSE_CACHE_KEY)
  }, [])

  // Check if user has a specific feature
  const hasFeature = useCallback((feature: string): boolean => {
    if (!license?.valid) return false
    return license.features.includes(feature)
  }, [license])

  // Check if user can use a specific feature (type-safe)
  const canUseFeature = useCallback((feature: keyof typeof LICENSE_TIERS.starter): boolean => {
    if (!license?.valid) return false
    const tierConfig = LICENSE_TIERS[license.tier]
    return tierConfig[feature] === true
  }, [license])

  // Get tier limits
  const getTierLimits = useCallback(() => {
    if (!license?.valid) return LICENSE_TIERS.starter
    return LICENSE_TIERS[license.tier]
  }, [license])

  return {
    // State
    license,
    loading,
    error,
    
    // Actions
    validateLicense,
    clearLicense,
    
    // Feature checks
    hasFeature,
    canUseFeature,
    getTierLimits,
    
    // Utility
    isPremium: Boolean(license?.valid && license.tier !== 'starter'),
    tier: license?.tier || null
  }
}

export function useLicenseValidation(userId: string | null) {
  const { license, loading, error, validateLicense, clearLicense } = useLicense(userId)
  
  return {
    license,
    loading,
    error,
    validateLicense,
    clearLicense,
    isValid: license?.valid || false,
    tier: license?.tier || 'starter'
  }
}

export function useFeatureCheck(userId: string | null) {
  const { license, hasFeature, canUseFeature, getTierLimits } = useLicense(userId)
  
  return {
    hasFeature,
    canUseFeature,
    getTierLimits,
    isPremium: Boolean(license?.valid && license.tier !== 'starter'),
    tier: license?.tier || 'starter'
  }
}
