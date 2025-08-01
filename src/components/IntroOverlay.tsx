'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedLogo from './AnimatedLogo'

interface IntroOverlayProps {
  onFinish: () => void
}

export default function IntroOverlay({ onFinish }: IntroOverlayProps) {
  const [showText, setShowText] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const startupTexts = [
    'Initializing MomentumX Intelligence System...',
    'Loading neural networks...',
    'Calibrating habit tracking algorithms...',
    'Establishing secure connection...',
    'System ready.'
  ]

  useEffect(() => {
    // Initialize audio
    const startupAudio = new Audio('/jarvis.mp3')
    startupAudio.volume = 0.3
    setAudio(startupAudio)

    // Start the sequence
    const timer1 = setTimeout(() => {
      setShowText(true)
      startupAudio.play().catch(() => {
        // Audio failed to play, continue without it
      })
    }, 1000)

    const timer2 = setTimeout(() => {
      onFinish()
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      startupAudio.pause()
      startupAudio.currentTime = 0
    }
  }, [onFinish])

  useEffect(() => {
    if (!showText) return

    const textTimer = setInterval(() => {
      setTextIndex((prev) => {
        if (prev < startupTexts.length - 1) {
          return prev + 1
        } else {
          clearInterval(textTimer)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(textTimer)
  }, [showText])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
      >
        <div className="text-center">
          {/* Animated Logo */}
          <AnimatedLogo />

          {/* Startup Text */}
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-gray-300 font-mono tracking-wider"
                >
                  {startupTexts[textIndex]}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Dots */}
          {showText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              ))}
            </motion.div>
          )}

          {/* Background Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 