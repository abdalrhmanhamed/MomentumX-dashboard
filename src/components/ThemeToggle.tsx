'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette, ChevronDown, Check, Sparkles, Moon, Sun, Waves, Sunset, Zap } from 'lucide-react'
import { useTheme } from '@/lib/themeContext'

const themeIcons = {
  dark: Moon,
  light: Sun,
  ocean: Waves,
  sunset: Sunset,
  neon: Zap,
}

export default function ThemeToggle() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId)
    setIsOpen(false)
  }

  const IconComponent = themeIcons[currentTheme.id as keyof typeof themeIcons] || Palette

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-glass border border-glass-border hover:bg-opacity-80 transition-all duration-200 group"
        aria-label="Toggle theme"
      >
        <IconComponent className="w-4 h-4 text-text-primary" />
        <span className="text-sm font-medium text-text-primary hidden sm:block">
          {currentTheme.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-glass border border-glass-border rounded-xl shadow-glass backdrop-blur-xl z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Choose Theme
            </div>
            {availableThemes.map((theme) => {
              const ThemeIcon = themeIcons[theme.id as keyof typeof themeIcons] || Palette
              const isActive = theme.id === currentTheme.id
              
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30' 
                      : 'hover:bg-glass-border/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                    <ThemeIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-text-muted">{theme.description}</div>
                  </div>
                  {isActive && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 