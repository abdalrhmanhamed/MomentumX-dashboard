'use client'

import { useState } from 'react'
import { Plus, Target, CheckCircle, BookOpen, BarChart3 } from 'lucide-react'

export default function FloatingAction() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Target, label: 'Add Habit', color: 'bg-neon-turquoise', action: () => console.log('Add Habit') },
    { icon: CheckCircle, label: 'Add Task', color: 'bg-neon-green', action: () => console.log('Add Task') },
    { icon: BookOpen, label: 'New Journal', color: 'bg-neon-pink', action: () => console.log('New Journal') },
    { icon: BarChart3, label: 'New Review', color: 'bg-neon-purple', action: () => console.log('New Review') },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      {isOpen && (
        <div className="mb-4 space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-black p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 neon-glow`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Icon className="w-6 h-6" />
              </button>
            )
          })}
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 rotate-45' 
            : 'bg-gradient-to-r from-neon-turquoise to-neon-green'
        } neon-glow`}
      >
        <Plus className="w-6 h-6 text-black mx-auto" />
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Quick Actions
        </div>
      )}
    </div>
  )
} 