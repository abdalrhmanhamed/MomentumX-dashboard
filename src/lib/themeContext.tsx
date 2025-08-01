'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { themes, defaultTheme, type Theme } from './themes'

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  availableThemes: Theme[]
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('momentumx-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(themes[savedTheme])
      setIsDark(['dark', 'ocean', 'sunset', 'neon'].includes(savedTheme))
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    
    // Apply CSS custom properties
    Object.entries(currentTheme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value)
    })
    
    Object.entries(currentTheme.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--secondary-${key}`, value)
    })
    
    Object.entries(currentTheme.colors.accent).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value)
    })
    
    Object.entries(currentTheme.colors.background).forEach(([key, value]) => {
      root.style.setProperty(`--bg-${key}`, value)
    })
    
    Object.entries(currentTheme.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value)
    })
    
    Object.entries(currentTheme.colors.status).forEach(([key, value]) => {
      root.style.setProperty(`--status-${key}`, value)
    })
    
    // Apply gradients
    Object.entries(currentTheme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })
    
    // Apply shadows
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })
    
    // Set theme class
    root.className = root.className.replace(/theme-\w+/g, '')
    root.classList.add(`theme-${currentTheme.id}`)
    
    // Update dark mode state
    setIsDark(['dark', 'ocean', 'sunset', 'neon'].includes(currentTheme.id))
    
    // Save to localStorage
    localStorage.setItem('momentumx-theme', currentTheme.id)
  }, [currentTheme])

  const setTheme = (themeId: string) => {
    const theme = themes[themeId]
    if (theme) {
      setCurrentTheme(theme)
    }
  }

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 