'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Target, BookOpen, CheckCircle } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-turquoise rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-green rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full mb-6 neon-glow">
              <Sparkles className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon-turquoise via-neon-green to-neon-turquoise bg-clip-text text-transparent mb-4">
              MomentumX
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              Master Your Life, One Day at a Time
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-xl p-6 text-center hover:neon-glow transition-all duration-300">
              <Target className="w-12 h-12 text-neon-turquoise mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Habit Tracking</h3>
              <p className="text-gray-400">Build lasting habits with streak tracking and progress visualization</p>
            </div>
            <div className="glass rounded-xl p-6 text-center hover:neon-glow transition-all duration-300">
              <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400">Organize tasks with priorities, due dates, and completion tracking</p>
            </div>
            <div className="glass rounded-xl p-6 text-center hover:neon-glow transition-all duration-300">
              <BookOpen className="w-12 h-12 text-neon-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Daily Journaling</h3>
              <p className="text-gray-400">Reflect on your day with mood tracking and guided prompts</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/app/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-semibold rounded-lg hover:scale-105 transition-all duration-300 neon-glow"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/app/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 glass border border-neon-turquoise text-neon-turquoise font-semibold rounded-lg hover:neon-glow transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-neon-turquoise">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neon-green">500K+</div>
              <div className="text-gray-400">Habits Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neon-pink">1M+</div>
              <div className="text-gray-400">Tasks Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neon-purple">50K+</div>
              <div className="text-gray-400">Journal Entries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 glass border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400">
          <p>&copy; 2024 MomentumX. Transform your life, one habit at a time.</p>
        </div>
      </div>
    </div>
  )
} 