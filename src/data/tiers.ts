// License tier definitions and feature management
export const TIERS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Perfect for getting started with personal development',
    features: [
      'Up to 5 habits',
      'Up to 10 tasks',
      'Daily journal entries',
      'Basic progress tracking',
      'Mobile responsive'
    ],
    limitations: [
      'No PDF export',
      'No analytics',
      'No coach mode',
      'No admin panel'
    ],
    maxHabits: 5,
    maxTasks: 10,
    maxJournalEntries: 30,
    canExport: false,
    canUseAdmin: false,
    canUseCoachMode: false,
    canUseAnalytics: false,
    canUseTeamManagement: false,
    canUseCustomBranding: false
  },
  coach: {
    id: 'coach',
    name: 'Coach',
    price: 29,
    description: 'For coaches and serious self-improvers',
    features: [
      'Unlimited habits',
      'Unlimited tasks',
      'Unlimited journal entries',
      'PDF export',
      'Advanced analytics',
      'Coach mode',
      'Weekly reviews',
      'Progress insights'
    ],
    limitations: [
      'No admin panel',
      'No team management',
      'No custom branding'
    ],
    maxHabits: -1, // unlimited
    maxTasks: -1,
    maxJournalEntries: -1,
    canExport: true,
    canUseAdmin: false,
    canUseCoachMode: true,
    canUseAnalytics: true,
    canUseTeamManagement: false,
    canUseCustomBranding: false
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 99,
    description: 'For teams and organizations',
    features: [
      'Everything in Coach',
      'Admin panel',
      'Team management',
      'Custom branding',
      'Advanced reporting',
      'API access',
      'Priority support',
      'White-label options'
    ],
    limitations: [],
    maxHabits: -1,
    maxTasks: -1,
    maxJournalEntries: -1,
    canExport: true,
    canUseAdmin: true,
    canUseCoachMode: true,
    canUseAnalytics: true,
    canUseTeamManagement: true,
    canUseCustomBranding: true
  }
} as const

export type TierId = keyof typeof TIERS

// Feature definitions
export const FEATURES = {
  // Basic features
  basic_habits: {
    id: 'basic_habits',
    name: 'Basic Habits',
    description: 'Create and track basic habits',
    availableIn: ['starter', 'coach', 'business']
  },
  basic_tasks: {
    id: 'basic_tasks',
    name: 'Basic Tasks',
    description: 'Create and manage tasks',
    availableIn: ['starter', 'coach', 'business']
  },
  daily_journal: {
    id: 'daily_journal',
    name: 'Daily Journal',
    description: 'Write daily journal entries',
    availableIn: ['starter', 'coach', 'business']
  },

  // Premium features
  unlimited_habits: {
    id: 'unlimited_habits',
    name: 'Unlimited Habits',
    description: 'Create unlimited habits',
    availableIn: ['coach', 'business']
  },
  unlimited_tasks: {
    id: 'unlimited_tasks',
    name: 'Unlimited Tasks',
    description: 'Create unlimited tasks',
    availableIn: ['coach', 'business']
  },
  unlimited_journal: {
    id: 'unlimited_journal',
    name: 'Unlimited Journal',
    description: 'Unlimited journal entries',
    availableIn: ['coach', 'business']
  },
  pdf_export: {
    id: 'pdf_export',
    name: 'PDF Export',
    description: 'Export reports and data to PDF',
    availableIn: ['coach', 'business']
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Advanced progress analytics',
    availableIn: ['coach', 'business']
  },
  coach_mode: {
    id: 'coach_mode',
    name: 'Coach Mode',
    description: 'Advanced coaching features',
    availableIn: ['coach', 'business']
  },
  admin_panel: {
    id: 'admin_panel',
    name: 'Admin Panel',
    description: 'Administrative dashboard',
    availableIn: ['business']
  },
  team_management: {
    id: 'team_management',
    name: 'Team Management',
    description: 'Manage team members and roles',
    availableIn: ['business']
  },
  custom_branding: {
    id: 'custom_branding',
    name: 'Custom Branding',
    description: 'Customize branding and appearance',
    availableIn: ['business']
  }
} as const

export type FeatureId = keyof typeof FEATURES

// Utility functions
export function getTierFeatures(tierId: TierId): FeatureId[] {
  const tier = TIERS[tierId]
  return Object.values(FEATURES)
    .filter(feature => (feature.availableIn as readonly string[]).includes(tierId))
    .map(feature => feature.id)
}

export function hasFeature(tierId: TierId, featureId: FeatureId): boolean {
  const feature = FEATURES[featureId]
  return (feature.availableIn as readonly string[]).includes(tierId)
}

export function getUpgradePath(currentTier: TierId): TierId[] {
  const tiers: TierId[] = ['starter', 'coach', 'business']
  const currentIndex = tiers.indexOf(currentTier)
  return tiers.slice(currentIndex + 1)
}

export function getTierLimits(tierId: TierId) {
  const tier = TIERS[tierId]
  return {
    maxHabits: tier.maxHabits,
    maxTasks: tier.maxTasks,
    maxJournalEntries: tier.maxJournalEntries,
    canExport: tier.canExport,
    canUseAdmin: tier.canUseAdmin,
    canUseCoachMode: tier.canUseCoachMode,
    canUseAnalytics: tier.canUseAnalytics,
    canUseTeamManagement: tier.canUseTeamManagement,
    canUseCustomBranding: tier.canUseCustomBranding
  }
}

export function isUnlimited(tierId: TierId): boolean {
  return tierId !== 'starter'
}

export function getTierName(tierId: TierId): string {
  return TIERS[tierId].name
}

export function getTierPrice(tierId: TierId): number {
  return TIERS[tierId].price
}

// Gumroad product mapping
export const GUMROAD_PRODUCTS = {
  starter: {
    permalink: 'momentumx-starter',
    name: 'MomentumX Starter',
    price: 0
  },
  coach: {
    permalink: 'momentumx-coach',
    name: 'MomentumX Coach',
    price: 29
  },
  business: {
    permalink: 'momentumx-business',
    name: 'MomentumX Business',
    price: 99
  }
} as const

// Feature comparison matrix
export const FEATURE_COMPARISON = {
  features: [
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
    starter: [true, true, true, false, false, false, false, false, false],
    coach: [true, true, true, true, true, true, false, false, false],
    business: [true, true, true, true, true, true, true, true, true]
  }
} as const

// Upgrade benefits
export const UPGRADE_BENEFITS = {
  coach: {
    title: 'Upgrade to Coach',
    benefits: [
      'Unlimited habits and tasks',
      'PDF export capabilities',
      'Advanced analytics',
      'Coach mode features',
      'Weekly review system'
    ],
    price: 29,
    cta: 'Upgrade Now'
  },
  business: {
    title: 'Upgrade to Business',
    benefits: [
      'Everything in Coach',
      'Admin panel access',
      'Team management',
      'Custom branding',
      'Priority support'
    ],
    price: 99,
    cta: 'Upgrade Now'
  }
} as const 