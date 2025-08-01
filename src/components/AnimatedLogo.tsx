'use client'

import { motion } from 'framer-motion'

export default function AnimatedLogo() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative"
    >
      {/* Glow Ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{
          duration: 1.5,
          delay: 0.3,
          ease: "easeOut"
        }}
        className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-400/20 to-cyan-400/20 blur-xl"
      />

      {/* Main Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: "easeOut"
        }}
        className="relative z-10"
      >
        <h1 className="text-6xl font-bold neon-text tracking-wider">
          MomentumX
        </h1>
      </motion.div>

      {/* Pulse Ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-2 border-green-400/30"
        style={{ top: '-20px', left: '-20px' }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.8
        }}
        className="text-sm text-gray-400 font-mono tracking-widest mt-2"
      >
        INTELLIGENCE SYSTEM
      </motion.p>

      {/* Scanning Line Effect */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 100, opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          delay: 1,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
      />
    </motion.div>
  )
} 