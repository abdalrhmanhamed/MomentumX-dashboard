'use client'

import { useState, useEffect } from 'react'
import { 
  Download, 
  Smartphone, 
  Monitor, 
  X,
  CheckCircle,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PWAInstallPromptProps {
  onClose: () => void
}

export default function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      onClose()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Show prompt after 30 seconds if not already shown
    const timer = setTimeout(() => {
      if (!isInstalled && !showPrompt) {
        setShowPrompt(true)
      }
    }, 30000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timer)
    }
  }, [isInstalled, showPrompt, onClose])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      window.open(window.location.href, '_blank')
      return
    }

    setIsInstalling(true)
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowPrompt(false)
        onClose()
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    onClose()
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
      >
        <div className="glass rounded-xl p-6 shadow-2xl border border-neon-turquoise/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Install MomentumX</h3>
                <p className="text-sm text-gray-400">Use it like a native app</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Smartphone className="w-4 h-4 text-neon-turquoise" />
                <span>Mobile App</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Monitor className="w-4 h-4 text-neon-green" />
                <span>Desktop App</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Offline access to your habits</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Push notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Native app experience</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Install App</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>

            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
              <Star className="w-3 h-3" />
              <span>Free to install • No app store required</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 