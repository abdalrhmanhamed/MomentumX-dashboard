'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Download,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Crown,
  Zap,
  Star
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLicense } from '@/hooks/useLicense'
import { useAdmin } from '@/hooks/useAdmin'
import AdminTable from '@/components/AdminTable'
import { toast } from 'react-hot-toast'

interface UserRecord {
  uid: string
  email: string
  tier: 'starter' | 'coach' | 'business'
  createdAt: Date
  lastLogin?: Date
  habitsCount?: number
  tasksCount?: number
  journalEntriesCount?: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { tier, loading: licenseLoading } = useLicense(user?.uid || null)
  const { 
    users, 
    loading: usersLoading, 
    error: usersError,
    updateUserTier,
    deleteUser,
    refreshUsers
  } = useAdmin()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'starter' | 'coach' | 'business'>('all')
  const [isExporting, setIsExporting] = useState(false)

  // Access control
  useEffect(() => {
    if (!licenseLoading && tier !== 'business') {
      toast.error('Access denied. Business tier required.')
      router.push('/app/dashboard')
    }
  }, [tier, licenseLoading, router])

  // Loading states
  if (licenseLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-turquoise mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Access denied
  if (tier !== 'business') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-4">Business tier required to access admin panel.</p>
          <button
            onClick={() => router.push('/app/dashboard')}
            className="px-6 py-2 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === 'all' || user.tier === filterTier
    return matchesSearch && matchesTier
  })

  // Handle tier update
  const handleUpdateTier = async (uid: string, newTier: 'starter' | 'coach' | 'business') => {
    try {
      await updateUserTier(uid, newTier)
      toast.success(`User tier updated to ${newTier}`)
    } catch (error) {
      toast.error('Failed to update user tier')
      console.error('Update tier error:', error)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(uid)
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
        console.error('Delete user error:', error)
      }
    }
  }

  // Export users to CSV
  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const csvContent = generateCSV(filteredUsers)
      downloadCSV(csvContent, 'momentumx-users.csv')
      toast.success('Users exported successfully')
    } catch (error) {
      toast.error('Failed to export users')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Generate CSV content
  const generateCSV = (users: UserRecord[]) => {
    const headers = ['Email', 'Tier', 'Joined Date', 'Last Login', 'Habits', 'Tasks', 'Journal Entries']
    const rows = users.map(user => [
      user.email,
      user.tier,
      user.createdAt.toLocaleDateString(),
      user.lastLogin?.toLocaleDateString() || 'Never',
      user.habitsCount || 0,
      user.tasksCount || 0,
      user.journalEntriesCount || 0
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Download CSV file
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Get tier stats
  const tierStats = {
    starter: users.filter(u => u.tier === 'starter').length,
    coach: users.filter(u => u.tier === 'coach').length,
    business: users.filter(u => u.tier === 'business').length,
    total: users.length
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Shield className="w-8 h-8 text-neon-turquoise mr-3" />
                Admin Panel
              </h1>
              <p className="text-gray-400 mt-1">Manage users and access control</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={refreshUsers}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="px-4 py-2 bg-neon-green text-black rounded-lg hover:shadow-lg hover:shadow-neon-green/30 transition-all flex items-center disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-neon-turquoise mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-turquoise">{tierStats.total}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-400">{tierStats.starter}</div>
            <div className="text-gray-400 text-sm">Starter</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Crown className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-green">{tierStats.coach}</div>
            <div className="text-gray-400 text-sm">Coach</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{tierStats.business}</div>
            <div className="text-gray-400 text-sm">Business</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-neon-turquoise focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-neon-turquoise focus:outline-none"
                >
                  <option value="all">All Tiers</option>
                  <option value="starter">Starter</option>
                  <option value="coach">Coach</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="text-gray-400 text-sm">
                {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-xl overflow-hidden">
          {usersError ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Users</h3>
              <p className="text-gray-400 mb-4">{usersError}</p>
              <button
                onClick={refreshUsers}
                className="px-6 py-2 bg-neon-turquoise text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-turquoise/30 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AdminTable
              users={filteredUsers}
              onUpdateTier={handleUpdateTier}
              onDelete={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  )
} 