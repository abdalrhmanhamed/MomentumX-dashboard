'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

export default function DailyCounter() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [islamicDate, setIslamicDate] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    // Calculate Islamic date (simplified)
    const calculateIslamicDate = () => {
      const gregorianYear = currentDate.getFullYear()
      const gregorianMonth = currentDate.getMonth() + 1
      const gregorianDay = currentDate.getDate()
      
      // Simplified conversion (not 100% accurate but good for demo)
      const islamicYear = gregorianYear - 622
      const islamicMonth = gregorianMonth
      const islamicDay = gregorianDay
      
      const islamicMonths = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
      ]
      
      return `${islamicDay} ${islamicMonths[islamicMonth - 1]} ${islamicYear} AH`
    }
    
    setIslamicDate(calculateIslamicDate())

    return () => clearInterval(timer)
  }, [currentDate])

  // Calculate days since start (assuming start date is 2024-01-01)
  const startDate = new Date('2024-01-01')
  const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="glass rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Day Counter */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-neon-turquoise mr-2" />
            <span className="text-sm text-gray-400">Day</span>
          </div>
          <div className="text-4xl font-bold text-neon-turquoise neon-glow">
            {daysSinceStart}
          </div>
          <div className="text-xs text-gray-500 mt-1">since journey began</div>
        </div>

        {/* Current Date */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-neon-green mr-2" />
            <span className="text-sm text-gray-400">Today</span>
          </div>
          <div className="text-2xl font-semibold text-neon-green">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {currentDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>

        {/* Islamic Date */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-6 h-6 bg-neon-pink rounded-full mr-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm text-gray-400">Islamic</span>
          </div>
          <div className="text-lg font-semibold text-neon-pink leading-tight">
            {islamicDate}
          </div>
          <div className="text-xs text-gray-500 mt-1">Hijri Calendar</div>
        </div>
      </div>
    </div>
  )
} 