'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Users, 
  BarChart3, 
  FileText, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  Shield,
  Globe
} from 'lucide-react'
import { useLicense } from '@/hooks/useLicense'
import { toast } from 'react-hot-toast'

interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: {
    included: string[]
    excluded: string[]
  }
  gumroadUrl: string
  popular?: boolean
  icon: React.ComponentType<any>
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started with habit tracking',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: {
      included: [
        '5 habits tracking',
        '3 daily tasks',
        'Basic journal entries',
        'Daily counter',
        'Mobile responsive'
      ],
      excluded: [
        'PDF export',
        'AI Coach (Lily)',
        'Advanced analytics',
        'Coach sharing',
        'Priority support'
      ]
    },
    gumroadUrl: '',
    icon: Star
  },
  {
    id: 'coach',
    name: 'Coach',
    description: 'Advanced features for serious habit builders',
    price: {
      monthly: 9,
      yearly: 90
    },
    features: {
      included: [
        '10 habits tracking',
        'Unlimited tasks',
        'PDF export',
        'Basic analytics',
        'AI Coach (Lily)',
        'Email reminders',
        'Weekly reviews',
        'Mobile responsive'
      ],
      excluded: [
        'Coach sharing',
        'Advanced analytics',
        'Team management',
        'Priority support'
      ]
    },
    gumroadUrl: 'https://gumroad.com/l/momentumx-coach',
    popular: true,
    icon: Crown
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Complete solution for coaches and teams',
    price: {
      monthly: 19,
      yearly: 190
    },
    features: {
      included: [
        'Unlimited habits',
        'Unlimited tasks',
        'Advanced analytics',
        'AI Coach (Lily)',
        'Coach sharing portal',
        'Team management',
        'Priority support',
        'Custom branding',
        'API access'
      ],
      excluded: []
    },
    gumroadUrl: 'https://gumroad.com/l/momentumx-business',
    icon: Zap
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.id === 'starter') {
      // Free tier - go directly to onboarding
      router.push('/app/auth/signup')
      return
    }

    setIsProcessing(true)
    setSelectedTier(tier.id)

    try {
      // Open Gumroad checkout in new tab
      const checkoutUrl = `${tier.gumroadUrl}?wanted=true&locale=false`
      window.open(checkoutUrl, '_blank')

      // Show success message
      toast.success(`Redirecting to ${tier.name} checkout...`)
      
      // After a delay, redirect to onboarding
      setTimeout(() => {
        router.push('/app/auth/signup')
      }, 2000)

    } catch (error) {
      console.error('Error processing subscription:', error)
      toast.error('Failed to process subscription. Please try again.')
    } finally {
      setIsProcessing(false)
      setSelectedTier(null)
    }
  }

  const getPrice = (tier: PricingTier) => {
    const price = isYearly ? tier.price.yearly : tier.price.monthly
    return price === 0 ? 'Free' : `$${price}`
  }

  const getPeriod = () => {
    return isYearly ? '/year' : '/month'
  }

  return (
    <div className="min-h-screen bg-gradient-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Choose Your MomentumX Plan
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Transform your life with the right tools. Start free, upgrade when you are ready.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full p-1 transition-colors ${
                isYearly ? 'bg-primary-500' : 'bg-background-tertiary'
              }`}
            >
              <motion.div
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm ${isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
              Yearly
              <span className="ml-1 text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${
                  tier.popular ? 'md:scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="bg-glass border border-glass-border rounded-xl p-8 h-full relative overflow-hidden">
                  {/* Background Glow */}
                  {tier.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-xl" />
                  )}
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full ${
                          tier.id === 'starter' ? 'bg-gray-500/20' :
                          tier.id === 'coach' ? 'bg-primary-500/20' :
                          'bg-secondary-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            tier.id === 'starter' ? 'text-gray-400' :
                            tier.id === 'coach' ? 'text-primary-500' :
                            'text-secondary-500'
                          }`} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {tier.name}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4">
                        {tier.description}
                      </p>
                      
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-text-primary">
                          {getPrice(tier)}
                        </span>
                        {tier.price.monthly > 0 && (
                          <span className="text-text-muted">
                            {getPeriod()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {tier.features.included.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">{feature}</span>
                        </motion.div>
                      ))}
                      
                      {tier.features.excluded.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (tier.features.included.length + idx) * 0.05 }}
                          className="flex items-center space-x-3"
                        >
                          <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <span className="text-text-muted text-sm line-through">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubscribe(tier)}
                      disabled={isProcessing && selectedTier === tier.id}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        tier.id === 'starter'
                          ? 'bg-background-tertiary text-text-primary hover:bg-background-secondary'
                          : tier.popular
                          ? 'bg-gradient-primary text-white hover:shadow-glow'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      } ${isProcessing && selectedTier === tier.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing && selectedTier === tier.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {tier.id === 'starter' ? 'Get Started' : 'Subscribe Now'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-glass border border-glass-border rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left py-4 px-4 text-text-primary font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-text-primary font-medium">Starter</th>
                  <th className="text-center py-4 px-4 text-text-primary font-medium">Coach</th>
                  <th className="text-center py-4 px-4 text-text-primary font-medium">Business</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {[
                  { feature: 'Habits Tracking', starter: '5', coach: '10', business: 'Unlimited' },
                  { feature: 'Daily Tasks', starter: '3', coach: 'Unlimited', business: 'Unlimited' },
                  { feature: 'AI Coach (Lily)', starter: false, coach: true, business: true },
                  { feature: 'PDF Export', starter: false, coach: true, business: true },
                  { feature: 'Analytics', starter: 'Basic', coach: 'Advanced', business: 'Advanced' },
                  { feature: 'Coach Sharing', starter: false, coach: false, business: true },
                  { feature: 'Team Management', starter: false, coach: false, business: true },
                  { feature: 'Priority Support', starter: false, coach: false, business: true },
                  { feature: 'API Access', starter: false, coach: false, business: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-glass-border/50">
                    <td className="py-4 px-4 text-text-secondary">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.coach === 'boolean' ? (
                        row.coach ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{row.coach}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-text-secondary">{row.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "The Starter plan is completely free forever. Paid plans come with a 7-day money-back guarantee."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and Apple Pay through our secure Gumroad integration."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely. You can cancel your subscription at any time with no questions asked."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="bg-glass border border-glass-border rounded-lg p-6 text-left"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-text-secondary">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
