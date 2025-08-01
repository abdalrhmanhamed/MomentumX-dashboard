'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  Star,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Globe,
  Lock
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'

interface AdminAnalyticsProps {
  isAdmin: boolean
}

interface UserMetrics {
  totalUsers: number
  activeUsers: {
    daily: number
    weekly: number
    monthly: number
  }
  newUsers: {
    today: number
    thisWeek: number
    thisMonth: number
  }
  userRetention: {
    day7: number
    day30: number
    day90: number
  }
}

interface EngagementMetrics {
  averageSessionDuration: number
  pagesPerSession: number
  bounceRate: number
  habitCompletions: number
  journalEntries: number
  weeklyReviews: number
}

interface RevenueMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  averageRevenuePerUser: number
  conversionRate: number
  churnRate: number
}

interface FeatureUsage {
  feature: string
  usageCount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export default function AdminAnalytics({ isAdmin }: AdminAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 0,
    activeUsers: { daily: 0, weekly: 0, monthly: 0 },
    newUsers: { today: 0, thisWeek: 0, thisMonth: 0 },
    userRetention: { day7: 0, day30: 0, day90: 0 }
  })
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics>({
    averageSessionDuration: 0,
    pagesPerSession: 0,
    bounceRate: 0,
    habitCompletions: 0,
    journalEntries: 0,
    weeklyReviews: 0
  })
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    averageRevenuePerUser: 0,
    conversionRate: 0,
    churnRate: 0
  })
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([])

  // Mock data - replace with real analytics
  useEffect(() => {
    // Simulate loading analytics data
    setUserMetrics({
      totalUsers: 1247,
      activeUsers: { daily: 342, weekly: 892, monthly: 1247 },
      newUsers: { today: 23, thisWeek: 156, thisMonth: 423 },
      userRetention: { day7: 68, day30: 45, day90: 32 }
    })

    setEngagementMetrics({
      averageSessionDuration: 8.5,
      pagesPerSession: 4.2,
      bounceRate: 23,
      habitCompletions: 15420,
      journalEntries: 3240,
      weeklyReviews: 890
    })

    setRevenueMetrics({
      totalRevenue: 18450,
      monthlyRecurringRevenue: 3450,
      averageRevenuePerUser: 14.8,
      conversionRate: 12.5,
      churnRate: 3.2
    })

    setFeatureUsage([
      { feature: 'Habit Tracking', usageCount: 1247, percentage: 100, trend: 'up' },
      { feature: 'Analytics Dashboard', usageCount: 892, percentage: 71, trend: 'up' },
      { feature: 'PDF Export', usageCount: 456, percentage: 37, trend: 'up' },
      { feature: 'Coach Sharing', usageCount: 234, percentage: 19, trend: 'up' },
      { feature: 'Weekly Reviews', usageCount: 890, percentage: 71, trend: 'stable' },
      { feature: 'Notifications', usageCount: 1023, percentage: 82, trend: 'up' }
    ])
  }, [selectedPeriod])

  if (!isAdmin) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
        <p className="text-gray-400">You need admin privileges to view analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Analytics</h2>
          <p className="text-gray-400">Track user engagement and business metrics</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-neon-turquoise text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-neon-turquoise" />
            <span className="text-2xl font-bold text-neon-turquoise">{userMetrics.totalUsers}</span>
          </div>
          <h3 className="text-gray-300 font-medium">Total Users</h3>
          <p className="text-gray-400 text-sm">All time</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-neon-green" />
            <span className="text-2xl font-bold text-neon-green">{userMetrics.activeUsers.daily}</span>
          </div>
          <h3 className="text-gray-300 font-medium">Daily Active</h3>
          <p className="text-gray-400 text-sm">Last 24 hours</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">{userMetrics.newUsers.today}</span>
          </div>
          <h3 className="text-gray-300 font-medium">New Users</h3>
          <p className="text-gray-400 text-sm">Today</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-orange-400">${revenueMetrics.monthlyRecurringRevenue}</span>
          </div>
          <h3 className="text-gray-300 font-medium">MRR</h3>
          <p className="text-gray-400 text-sm">Monthly recurring</p>
        </div>
      </div>

      {/* User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-neon-turquoise" />
            User Growth
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily Active Users</span>
              <span className="text-white font-semibold">{userMetrics.activeUsers.daily}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Weekly Active Users</span>
              <span className="text-white font-semibold">{userMetrics.activeUsers.weekly}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Active Users</span>
              <span className="text-white font-semibold">{userMetrics.activeUsers.monthly}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">7-Day Retention</span>
              <span className="text-white font-semibold">{userMetrics.userRetention.day7}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">30-Day Retention</span>
              <span className="text-white font-semibold">{userMetrics.userRetention.day30}%</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-neon-green" />
            Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Avg Session Duration</span>
              <span className="text-white font-semibold">{engagementMetrics.averageSessionDuration} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pages per Session</span>
              <span className="text-white font-semibold">{engagementMetrics.pagesPerSession}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Bounce Rate</span>
              <span className="text-white font-semibold">{engagementMetrics.bounceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Habit Completions</span>
              <span className="text-white font-semibold">{engagementMetrics.habitCompletions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Journal Entries</span>
              <span className="text-white font-semibold">{engagementMetrics.journalEntries.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-orange-400" />
          Revenue Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">${revenueMetrics.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">${revenueMetrics.monthlyRecurringRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Monthly Recurring</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">${revenueMetrics.averageRevenuePerUser}</div>
            <div className="text-sm text-gray-400">ARPU</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{revenueMetrics.conversionRate}%</div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
          Feature Usage
        </h3>
        <div className="space-y-4">
          {featureUsage.map((feature) => (
            <div key={feature.feature} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-neon-turquoise"></div>
                <div>
                  <div className="font-medium text-white">{feature.feature}</div>
                  <div className="text-sm text-gray-400">{feature.usageCount.toLocaleString()} users</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-white font-semibold">{feature.percentage}%</div>
                  <div className="text-xs text-gray-400">adoption</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  feature.trend === 'up' ? 'bg-green-400' : 
                  feature.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2 text-neon-green" />
          Export Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
            <Download className="w-5 h-5 text-neon-turquoise" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
            <BarChart3 className="w-5 h-5 text-neon-green" />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
            <Eye className="w-5 h-5 text-purple-400" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  )
} 