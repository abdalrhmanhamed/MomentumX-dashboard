'use client'

import { useState } from 'react'
import { Check, Shield } from 'lucide-react'
import TierCard from './TierCard'
import { pricingTiers, PricingTier } from '@/data/pricing'

interface PricingTableProps {
  onPricingClick: (gumroadUrl: string | null) => void
}

export default function PricingTable({ onPricingClick }: PricingTableProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleTierClick = (tier: PricingTier) => {
    setSelectedTier(tier.id)
    onPricingClick(tier.gumroad)
  }

  return (
    <div className="space-y-8">
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isSelected={selectedTier === tier.id}
            onClick={() => handleTierClick(tier)}
          />
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">
          Feature Comparison
        </h3>
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300">Feature</th>
                  <th className="text-center p-4 text-gray-300">Starter</th>
                  <th className="text-center p-4 text-neon-turquoise">Coach</th>
                  <th className="text-center p-4 text-purple-400">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Daily Counter</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Habits</td>
                  <td className="text-center p-4 text-gray-400">5 habits</td>
                  <td className="text-center p-4 text-neon-green">Unlimited</td>
                  <td className="text-center p-4 text-neon-green">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Tasks</td>
                  <td className="text-center p-4 text-gray-400">10 tasks</td>
                  <td className="text-center p-4 text-neon-green">Unlimited</td>
                  <td className="text-center p-4 text-neon-green">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Journal</td>
                  <td className="text-center p-4 text-gray-400">Basic</td>
                  <td className="text-center p-4 text-neon-green">Advanced + CBT</td>
                  <td className="text-center p-4 text-neon-green">Advanced + CBT</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">PDF Export</td>
                  <td className="text-center p-4 text-gray-400">-</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Analytics</td>
                  <td className="text-center p-4 text-gray-400">Basic</td>
                  <td className="text-center p-4 text-neon-green">Advanced</td>
                  <td className="text-center p-4 text-neon-green">Advanced</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Admin Panel</td>
                  <td className="text-center p-4 text-gray-400">-</td>
                  <td className="text-center p-4 text-gray-400">-</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Team Management</td>
                  <td className="text-center p-4 text-gray-400">-</td>
                  <td className="text-center p-4 text-gray-400">-</td>
                  <td className="text-center p-4"><Check className="w-5 h-5 text-neon-green mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300">Support</td>
                  <td className="text-center p-4 text-gray-400">Community</td>
                  <td className="text-center p-4 text-neon-green">Priority</td>
                  <td className="text-center p-4 text-neon-green">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Is MomentumX really free?</h4>
            <p className="text-gray-400">
              Yes! The Starter plan is completely free with no hidden fees. You can use all basic features without any cost.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Do I need a license key?</h4>
            <p className="text-gray-400">
              Only for Coach and Business plans. Free users don't need any license key to get started.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Can I upgrade later?</h4>
            <p className="text-gray-400">
              Absolutely! You can upgrade to any plan at any time. Your data will be preserved.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3">Is my data secure?</h4>
            <p className="text-gray-400">
              Yes! We use enterprise-grade security with Firebase. Your data is encrypted and private.
            </p>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-16 text-center">
        <div className="glass rounded-xl p-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-neon-green mr-3" />
            <h3 className="text-2xl font-bold">30-Day Money Back Guarantee</h3>
          </div>
          <p className="text-gray-400 text-lg">
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </p>
        </div>
      </div>
    </div>
  )
} 