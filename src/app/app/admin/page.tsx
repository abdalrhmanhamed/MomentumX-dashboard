'use client'

import { useState } from 'react'
import { Users, Shield, Settings, Eye, Edit, Trash2, Plus } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([
    {
      id: '1',
      email: 'admin@momentumx.com',
      displayName: 'Admin User',
      tier: 'business',
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      isActive: true
    },
    {
      id: '2',
      email: 'user@example.com',
      displayName: 'John Doe',
      tier: 'coach',
      createdAt: new Date('2024-01-15'),
      lastLoginAt: new Date(),
      isActive: true
    },
    {
      id: '3',
      email: 'free@example.com',
      displayName: 'Jane Smith',
      tier: 'free',
      createdAt: new Date('2024-01-20'),
      lastLoginAt: new Date(),
      isActive: false
    }
  ])

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'business':
        return 'bg-neon-purple text-white'
      case 'coach':
        return 'bg-neon-turquoise text-black'
      case 'free':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button className="inline-flex items-center px-4 py-2 bg-neon-turquoise text-black rounded-lg hover:neon-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="glass rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-neon-turquoise to-neon-green flex items-center justify-center">
                                <span className="text-black font-semibold">
                                  {user.displayName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.displayName}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(user.tier)}`}>
                            {user.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-neon-green text-black' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.lastLoginAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-neon-turquoise hover:text-neon-green transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'roles':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Role Management</h2>
              <button className="inline-flex items-center px-4 py-2 bg-neon-purple text-black rounded-lg hover:neon-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Free Tier</h3>
                  <span className="text-sm text-gray-400">Basic</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Basic habit tracking</li>
                  <li>• Simple task management</li>
                  <li>• Daily journaling</li>
                  <li>• Basic reports</li>
                </ul>
              </div>

              <div className="glass rounded-lg p-6 border border-neon-turquoise">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Coach Tier</h3>
                  <span className="text-sm text-neon-turquoise">Premium</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Advanced analytics</li>
                  <li>• Weekly reviews</li>
                  <li>• PDF exports</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="glass rounded-lg p-6 border border-neon-purple">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Business Tier</h3>
                  <span className="text-sm text-neon-purple">Enterprise</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Team management</li>
                  <li>• Advanced reporting</li>
                  <li>• API access</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Settings</h2>
            
            <div className="glass rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    defaultValue="MomentumX Dashboard"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-turquoise"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maintenance Mode
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-400">Enable maintenance mode</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Analytics
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-400">Enable analytics tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="glass border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-neon-purple text-black font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  )
} 