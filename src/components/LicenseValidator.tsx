'use client'

import { useState } from 'react'
import { Key, CheckCircle, XCircle, Loader2, Crown, Zap } from 'lucide-react'
import { useLicenseValidation } from '@/hooks/useLicense'
import { TIERS, getTierFeatures } from '@/data/tiers'

interface LicenseValidatorProps {
  userId: string | null
  onSuccess?: () => void
  className?: string
}

export default function LicenseValidator({
  userId,
  onSuccess,
  className = ''
}: LicenseValidatorProps) {
  const [licenseKey, setLicenseKey] = useState('')
  const { validateLicense, loading, error, license, isValid } = useLicenseValidation(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!licenseKey.trim()) {
      return
    }

    try {
      await validateLicense(licenseKey)
      setLicenseKey('')
      onSuccess?.()
    } catch (error) {
      console.error('License validation failed:', error)
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'coach':
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 'business':
        return <Zap className="w-5 h-5 text-purple-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getTierName = (tier: string) => {
    return TIERS[tier as keyof typeof TIERS]?.name || 'Unknown'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* License Status */}
      {license && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">License Status</h3>
            {getTierIcon(license.tier)}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? 'Valid' : 'Invalid'} License
              </span>
            </div>
            
            <div className="text-sm text-text-secondary">
              <p><strong>Tier:</strong> {getTierName(license.tier)}</p>
              <p><strong>Message:</strong> {license.message}</p>
              {license.expiresAt && (
                <p><strong>Expires:</strong> {license.expiresAt.toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* License Input */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Enter License Key</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="licenseKey" className="block text-sm font-medium text-text-secondary mb-2">
              License Key
            </label>
            <input
              id="licenseKey"
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Enter your Gumroad license key..."
              className="w-full px-4 py-3 bg-background-secondary border border-glass-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Key className="w-5 h-5 mr-2" />
                Validate License
              </>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Features List */}
      {license && isValid && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getTierFeatures(license.tier).map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
