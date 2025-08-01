// Pricing tier definitions for MomentumX Dashboard
// Centralized pricing data for easy management

import { Zap, Crown, Star } from 'lucide-react'

export interface PricingTier {
  id: string
  title: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  gumroad: string | null
  popular?: boolean
  color: string
  icon: any
  limits: {
    habits: number
    tasks: number
    journalEntries: number
    canExport: boolean
    canUseAdmin: boolean
    canUseCoachMode: boolean
    canUseAnalytics: boolean
  }
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    title: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started with personal development',
    features: [
      'Daily counter with Islamic date',
      'Up to 5 habits',
      'Up to 10 tasks',
      'Basic journal entries',
      'Mobile responsive design',
      'Basic progress tracking'
    ],
    gumroad: null,
    color: 'from-gray-400 to-gray-600',
    icon: Zap,
    limits: {
      habits: 5,
      tasks: 10,
      journalEntries: 30,
      canExport: false,
      canUseAdmin: false,
      canUseCoachMode: false,
      canUseAnalytics: false
    }
  },
  {
    id: 'coach',
    title: 'Coach',
    price: '$29',
    originalPrice: '$49',
    description: 'For coaches and serious self-improvers',
    features: [
      'Everything in Starter',
      'Unlimited habits',
      'Unlimited tasks',
      'Advanced journal with CBT prompts',
      'PDF export capabilities',
      'Advanced analytics',
      'Coach mode features',
      'Weekly review system',
      'Priority support'
    ],
    gumroad: 'https://gumroad.com/l/momentumx-coach',
    popular: true,
    color: 'from-neon-turquoise to-neon-green',
    icon: Crown,
    limits: {
      habits: -1, // unlimited
      tasks: -1,
      journalEntries: -1,
      canExport: true,
      canUseAdmin: false,
      canUseCoachMode: true,
      canUseAnalytics: true
    }
  },
  {
    id: 'business',
    title: 'Business',
    price: '$99',
    originalPrice: '$199',
    description: 'For teams and organizations',
    features: [
      'Everything in Coach',
      'Admin panel access',
      'Team management',
      'Custom branding',
      'Advanced reporting',
      'API access',
      'White-label options',
      'Dedicated support',
      'Custom integrations'
    ],
    gumroad: 'https://gumroad.com/l/momentumx-business',
    color: 'from-purple-400 to-pink-400',
    icon: Star,
    limits: {
      habits: -1,
      tasks: -1,
      journalEntries: -1,
      canExport: true,
      canUseAdmin: true,
      canUseCoachMode: true,
      canUseAnalytics: true
    }
  }
]

// Helper functions
export function getTierById(id: string): PricingTier | undefined {
  return pricingTiers.find(tier => tier.id === id)
}

export function getTierByGumroadUrl(url: string): PricingTier | undefined {
  return pricingTiers.find(tier => tier.gumroad === url)
}

export function isUnlimited(tierId: string): boolean {
  const tier = getTierById(tierId)
  return tier ? tier.limits.habits === -1 : false
}

export function canUseFeature(tierId: string, feature: keyof PricingTier['limits']): boolean {
  const tier = getTierById(tierId)
  return tier ? tier.limits[feature] === true || tier.limits[feature] === -1 : false
}

export function getTierLimit(tierId: string, feature: keyof PricingTier['limits']): number {
  const tier = getTierById(tierId)
  return tier ? tier.limits[feature] as number : 0
}

// Gumroad product mapping
export const gumroadProducts = {
  coach: {
    url: 'https://gumroad.com/l/momentumx-coach',
    name: 'MomentumX Coach License',
    price: 29,
    description: 'Unlimited habits, tasks, journal, PDF export, and advanced analytics'
  },
  business: {
    url: 'https://gumroad.com/l/momentumx-business',
    name: 'MomentumX Business License',
    price: 99,
    description: 'Everything in Coach plus admin panel, team management, and custom branding'
  }
}

// Feature comparison matrix
export const featureComparison = {
  features: [
    'Daily Counter',
    'Habits',
    'Tasks',
    'Journal',
    'PDF Export',
    'Analytics',
    'Coach Mode',
    'Admin Panel',
    'Team Management',
    'Custom Branding'
  ],
  tiers: {
    starter: [true, '5 habits', '10 tasks', 'Basic', false, 'Basic', false, false, false, false],
    coach: [true, 'Unlimited', 'Unlimited', 'Advanced', true, 'Advanced', true, false, false, false],
    business: [true, 'Unlimited', 'Unlimited', 'Advanced', true, 'Advanced', true, true, true, true]
  }
}

// Upgrade paths
export const upgradePaths = {
  starter: ['coach', 'business'],
  coach: ['business'],
  business: []
}

// Pricing benefits
export const pricingBenefits = {
  starter: {
    title: 'Start Your Journey',
    subtitle: 'Perfect for beginners',
    benefits: [
      'No credit card required',
      'Instant access',
      'Basic features included',
      'Community support'
    ]
  },
  coach: {
    title: 'Unlock Your Potential',
    subtitle: 'Most popular choice',
    benefits: [
      'Unlimited everything',
      'PDF export capabilities',
      'Advanced analytics',
      'Priority support',
      'Lifetime updates'
    ]
  },
  business: {
    title: 'Scale Your Success',
    subtitle: 'For teams and organizations',
    benefits: [
      'Everything in Coach',
      'Admin panel access',
      'Team management',
      'Custom branding',
      'Dedicated support',
      'API access'
    ]
  }
} 