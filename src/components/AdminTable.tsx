'use client'

import { useState } from 'react'
import { 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Crown, 
  Zap, 
  Star,
  MoreVertical,
  User,
  Calendar,
  Activity
} from 'lucide-react'
import { format } from 'date-fns'

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

interface AdminTableProps {
  users: UserRecord[]
  onUpdateTier: (uid: string, tier: 'starter' | 'coach' | 'business') => Promise<void>
  onDelete: (uid: string) => Promise<void>
}

export default function AdminTable({ users, onUpdateTier, onDelete }: AdminTableProps) {
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [updatingTier, setUpdatingTier] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)

  const handleTierUpdate = async (uid: string, newTier: 'starter' | 'coach' | 'business') => {
    setUpdatingTier(uid)
    try {
      await onUpdateTier(uid, newTier)
      setEditingUser(null)
    } finally {
      setUpdatingTier(null)
    }
  }

  const handleUserDelete = async (uid: string) => {
    setDeletingUser(uid)
    try {
      await onDelete(uid)
    } finally {
      setDeletingUser(null)
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'starter':
        return <Zap className="w-4 h-4 text-gray-400" />
      case 'coach':
        return <Crown className="w-4 h-4 text-neon-green" />
      case 'business':
        return <Star className="w-4 h-4 text-purple-400" />
      default:
        return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'text-gray-400'
      case 'coach':
        return 'text-neon-green'
      case 'business':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  const getTierBadge = (tier: string) => {
    const colors = {
      starter: 'bg-gray-700 text-gray-300',
      coach: 'bg-neon-green/20 text-neon-green border border-neon-green/30',
      business: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${colors[tier as keyof typeof colors]}`}>
        {getTierIcon(tier)}
        <span className="capitalize">{tier}</span>
      </span>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
        <p className="text-gray-400">No users match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800/50">
            <th className="text-left p-4 text-gray-300 font-semibold">User</th>
            <th className="text-left p-4 text-gray-300 font-semibold">Tier</th>
            <th className="text-left p-4 text-gray-300 font-semibold">Joined</th>
            <th className="text-left p-4 text-gray-300 font-semibold">Last Login</th>
            <th className="text-left p-4 text-gray-300 font-semibold">Activity</th>
            <th className="text-right p-4 text-gray-300 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              {/* User Email */}
              <td className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-turquoise to-neon-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-black text-sm font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.email}</div>
                    <div className="text-xs text-gray-400">ID: {user.uid.slice(0, 8)}...</div>
                  </div>
                </div>
              </td>

              {/* Tier */}
              <td className="p-4">
                {editingUser === user.uid ? (
                  <div className="flex items-center space-x-2">
                    <select
                      defaultValue={user.tier}
                      onChange={(e) => handleTierUpdate(user.uid, e.target.value as any)}
                      disabled={updatingTier === user.uid}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-neon-turquoise focus:outline-none"
                    >
                      <option value="starter">Starter</option>
                      <option value="coach">Coach</option>
                      <option value="business">Business</option>
                    </select>
                    {updatingTier === user.uid ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-turquoise"></div>
                    ) : (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingUser(null)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {getTierBadge(user.tier)}
                    <button
                      onClick={() => setEditingUser(user.uid)}
                      className="p-1 text-gray-400 hover:text-neon-turquoise transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </td>

              {/* Joined Date */}
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-white">
                      {format(user.createdAt, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(user.createdAt, 'HH:mm')}
                    </div>
                  </div>
                </div>
              </td>

              {/* Last Login */}
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <div>
                    {user.lastLogin ? (
                      <>
                        <div className="text-sm text-white">
                          {format(user.lastLogin, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(user.lastLogin, 'HH:mm')}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-400">Never</div>
                    )}
                  </div>
                </div>
              </td>

              {/* Activity Stats */}
              <td className="p-4">
                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-center">
                    <div className="text-white font-semibold">{user.habitsCount || 0}</div>
                    <div className="text-gray-400">Habits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{user.tasksCount || 0}</div>
                    <div className="text-gray-400">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{user.journalEntriesCount || 0}</div>
                    <div className="text-gray-400">Journal</div>
                  </div>
                </div>
              </td>

              {/* Actions */}
              <td className="p-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  {editingUser !== user.uid && (
                    <button
                      onClick={() => setEditingUser(user.uid)}
                      className="p-2 text-gray-400 hover:text-neon-turquoise transition-colors"
                      title="Edit tier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
                        handleUserDelete(user.uid)
                      }
                    }}
                    disabled={deletingUser === user.uid}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete user"
                  >
                    {deletingUser === user.uid ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 