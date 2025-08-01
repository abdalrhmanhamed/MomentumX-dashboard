'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IntroOverlay from './IntroOverlay'

interface IntroWrapperProps {
  children: React.ReactNode
}

export default function IntroWrapper({ children }: IntroWrapperProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [hasShownIntro, setHasShownIntro] = useState(false)

  useEffect(() => {
    // Check if intro has been shown before
    const introShown = localStorage.getItem('momentumx-intro-shown')
    if (introShown) {
      setShowIntro(false)
      setHasShownIntro(true)
    }
  }, [])

  const handleIntroFinish = () => {
    setShowIntro(false)
    setHasShownIntro(true)
    localStorage.setItem('momentumx-intro-shown', 'true')
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroOverlay onFinish={handleIntroFinish} />}
      </AnimatePresence>

      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 