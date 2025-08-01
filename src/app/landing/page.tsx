'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Target, 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Crown,
  ArrowRight,
  Star,
  Users,
  Shield,
  Clock,
  TrendingUp,
  Download,
  Sparkles,
  Rocket,
  Brain,
  Calendar,
  BarChart3
} from 'lucide-react'
import PricingTable from '@/components/PricingTable'
import TierCard from '@/components/TierCard'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: Calendar,
    title: 'Daily Counter',
    description: 'Track your journey with Islamic date and day counter',
    color: 'text-neon-turquoise'
  },
  {
    icon: Target,
    title: 'Habit Tracker',
    description: 'Build lasting habits with streak tracking and analytics',
    color: 'text-neon-green'
  },
  {
    icon: CheckCircle,
    title: 'Smart Tasks',
    description: 'Intelligent task management with priority and due dates',
    color: 'text-yellow-400'
  },
  {
    icon: Brain,
    title: 'Weekly Journal',
    description: 'Reflect and grow with CBT-style prompts and mood tracking',
    color: 'text-purple-400'
  },
  {
    icon: FileText,
    title: 'Progress PDF',
    description: 'Export beautiful reports of your progress and achievements',
    color: 'text-pink-400'
  },
  {
    icon: Crown,
    title: 'License Tiers',
    description: 'Premium features unlocked with Gumroad license validation',
    color: 'text-orange-400'
  }
]

const testimonials = [
  {
    name: 'Ahmed Hassan',
    role: 'Software Engineer',
    content: 'MomentumX has transformed my daily routine. The habit tracking is incredible!',
    rating: 5
  },
  {
    name: 'Sarah Johnson',
    role: 'Life Coach',
    content: 'Perfect for my clients. The journal prompts are so insightful.',
    rating: 5
  },
  {
    name: 'Mohammed Ali',
    role: 'Student',
    content: 'The daily counter keeps me motivated. Love the Islamic date feature!',
    rating: 5
  }
]

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Redirect if user is logged in
    if (user) {
      router.push('/app/dashboard')
      return
    }

    // Animate elements on mount
    setIsVisible(true)
  }, [user, router])

  const handleGetStarted = () => {
    router.push('/app/auth/signup')
  }

  const handlePricingClick = (gumroadUrl: string | null) => {
    if (gumroadUrl) {
      window.open(gumroadUrl, '_blank')
    } else {
      router.push('/app/auth/signup')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-neon-turquoise to-neon-green bg-clip-text text-transparent">
                  MomentumX
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-turquoise to-neon-green bg-clip-text text-transparent">
                MomentumX
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              Your Ultimate Recovery & Mastery Tracker
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Transform your life with intelligent habit tracking, smart task management, 
              and deep journaling. Built for those committed to personal mastery and recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-bold rounded-lg text-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-neon-turquoise text-neon-turquoise font-bold rounded-lg text-lg hover:bg-neon-turquoise hover:text-black transition-all"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for Your Growth
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to track, improve, and master your daily habits and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`glass rounded-xl p-6 hover:shadow-lg hover:shadow-neon-turquoise/20 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="glass rounded-xl p-6">
              <div className="text-3xl font-bold text-neon-turquoise mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="text-3xl font-bold text-neon-green mb-2">50K+</div>
              <div className="text-gray-400">Habits Tracked</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">100K+</div>
              <div className="text-gray-400">Tasks Completed</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">25K+</div>
              <div className="text-gray-400">Journal Entries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your Path to Mastery
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include lifetime access.
            </p>
          </div>
          
          <PricingTable onPricingClick={handlePricingClick} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of users transforming their lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`glass rounded-xl p-6 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who have already started their journey to mastery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-neon-turquoise to-neon-green text-black font-bold rounded-lg text-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all transform hover:scale-105"
              >
                Start Free Today
                <Rocket className="inline ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-neon-turquoise text-neon-turquoise font-bold rounded-lg text-lg hover:bg-neon-turquoise hover:text-black transition-all"
              >
                View Premium Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neon-turquoise to-neon-green bg-clip-text text-transparent">
                MomentumX
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MomentumX Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 