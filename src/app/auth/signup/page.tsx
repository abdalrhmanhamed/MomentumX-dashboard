'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Key, 
  User, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Send,
  Zap,
  Shield
} from 'lucide-react'
import { authMethods } from '@/lib/auth'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseKey: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [licenseValid, setLicenseValid] = useState(false)
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateLicense = async (licenseKey: string) => {
    if (!licenseKey.trim()) {
      setLicenseValid(false)
      return
    }

    try {
      // Simulate license validation - replace with actual Gumroad API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLicenseValid(true)
      toast.success('License key validated!')
    } catch (error) {
      setLicenseValid(false)
      toast.error('Invalid license key')
    }
  }

  const handleLicenseChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, licenseKey: value }))
    
    if (value.length >= 10) {
      await validateLicense(value)
    } else {
      setLicenseValid(false)
    }
  }

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      await authMethods.signUpWithEmail(formData.email, formData.password, formData.name)
      toast.success('Account created successfully!')
      router.push('/app/dashboard')
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await authMethods.sendMagicLink(formData.email)
      setMagicLinkSent(true)
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')

    try {
      await authMethods.signInWithGoogle()
      toast.success('Account created successfully!')
      router.push('/app/dashboard')
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="glass rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a secure signup link to <span className="text-neon-turquoise">{formData.email}</span>
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-white font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Click the link in your email</li>
                    <li>• Your account will be created automatically</li>
                    <li>• You'll be logged in immediately</li>
                    <li>• The link expires in 15 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setMagicLinkSent(false)}
                className="w-full py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Try a different email
              </button>
              <button
                onClick={() => setAuthMode('password')}
                className="w-full py-3 px-6 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-all"
              >
                Use password instead
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="glass rounded-xl p-8 max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join your self-mastery journey</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-gray-800/50 rounded-lg p-1 mb-6">
          <button
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'password'
                ? 'bg-neon-turquoise text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </button>
          <button
            onClick={() => setAuthMode('magic-link')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'magic-link'
                ? 'bg-neon-turquoise text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Magic Link
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Fields (only for password mode) */}
        {authMode === 'password' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none transition-colors"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* License Key Field */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            License Key (Optional)
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="licenseKey"
              value={formData.licenseKey}
              onChange={handleLicenseChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none transition-colors"
              placeholder="Enter your Gumroad license key"
            />
            {licenseValid && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-green w-5 h-5" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter your Gumroad license key to unlock premium features
          </p>
        </div>

        {/* Magic Link Info */}
        {authMode === 'magic-link' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Secure Passwordless Signup</p>
                <p>We'll send you a secure link to create your account. No password needed!</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={authMode === 'password' ? handlePasswordSignup : handleMagicLinkSignup}
          disabled={isLoading || !formData.email || !formData.name || (authMode === 'password' && (!formData.password || !formData.confirmPassword))}
          className="w-full py-3 px-6 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : authMode === 'password' ? (
            'Create Account'
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Signup Link
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/app/auth/login" 
              className="text-neon-turquoise hover:text-neon-green transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 