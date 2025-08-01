'use client'

import { Check, Sparkles } from 'lucide-react'
import { PricingTier } from '@/data/pricing'

interface TierCardProps {
  tier: PricingTier
  isSelected: boolean
  onClick: () => void
}

export default function TierCard({ tier, isSelected, onClick }: TierCardProps) {
  const IconComponent = tier.icon

  return (
    <div
      className={`relative glass rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-neon-turquoise shadow-lg shadow-neon-turquoise/30' 
          : 'hover:shadow-lg hover:shadow-neon-turquoise/20'
      } ${tier.popular ? 'border-2 border-neon-turquoise' : 'border border-gray-700'}`}
      onClick={onClick}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-neon-turquoise to-neon-green text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
        
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold">{tier.price}</span>
            {tier.originalPrice && (
              <span className="text-gray-500 line-through ml-2">{tier.originalPrice}</span>
            )}
          </div>
          {tier.price === 'Free' ? (
            <p className="text-gray-400 text-sm">Forever free</p>
          ) : (
            <p className="text-gray-400 text-sm">One-time payment</p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="w-5 h-5 text-neon-green mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
          tier.popular
            ? 'bg-gradient-to-r from-neon-turquoise to-neon-green text-black hover:shadow-lg hover:shadow-neon-turquoise/30'
            : tier.price === 'Free'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
        } transform hover:scale-105`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {tier.price === 'Free' ? 'Get Started Free' : 'Get License'}
      </button>

      {/* Additional Info */}
      {tier.price !== 'Free' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ✓ Instant access
          </p>
          <p className="text-xs text-gray-500">
            ✓ Lifetime updates
          </p>
          <p className="text-xs text-gray-500">
            ✓ 30-day guarantee
          </p>
        </div>
      )}
    </div>
  )
} 