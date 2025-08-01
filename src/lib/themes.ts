export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    secondary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    accent: {
      blue: string
      purple: string
      green: string
      orange: string
      red: string
      teal: string
      cyan: string
    }
    background: {
      primary: string
      secondary: string
      tertiary: string
      glass: string
      glassBorder: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    status: {
      success: string
      warning: string
      error: string
      info: string
    }
  }
  gradients: {
    primary: string
    secondary: string
    background: string
    glass: string
    success: string
    warning: string
    error: string
    info: string
  }
  shadows: {
    glass: string
    glow: string
    glowStrong: string
  }
}

export const themes: Record<string, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sophisticated dark theme with deep blues and purples',
    colors: {
      primary: {
        50: '#f0f4ff',
        100: '#e0e9ff',
        200: '#c7d6ff',
        300: '#a4b8ff',
        400: '#8191ff',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b',
      },
      secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      accent: {
        blue: '#3b82f6',
        purple: '#8b5cf6',
        green: '#10b981',
        orange: '#f59e0b',
        red: '#ef4444',
        teal: '#14b8a6',
        cyan: '#06b6d4',
      },
      background: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
        tertiary: '#2a2a2a',
        glass: 'rgba(26, 26, 26, 0.8)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        muted: '#9ca3af',
        inverse: '#0a0a0a',
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
      glass: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    shadows: {
      glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(102, 126, 234, 0.3)',
      glowStrong: '0 0 40px rgba(102, 126, 234, 0.5)',
    },
  },
  light: {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean light theme with subtle shadows',
    colors: {
      primary: {
        50: '#f0f4ff',
        100: '#e0e9ff',
        200: '#c7d6ff',
        300: '#a4b8ff',
        400: '#8191ff',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b',
      },
      secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      accent: {
        blue: '#3b82f6',
        purple: '#8b5cf6',
        green: '#10b981',
        orange: '#f59e0b',
        red: '#ef4444',
        teal: '#14b8a6',
        cyan: '#06b6d4',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        glass: 'rgba(255, 255, 255, 0.8)',
        glassBorder: 'rgba(0, 0, 0, 0.1)',
      },
      text: {
        primary: '#0f172a',
        secondary: '#334155',
        muted: '#64748b',
        inverse: '#ffffff',
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    shadows: {
      glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(102, 126, 234, 0.2)',
      glowStrong: '0 0 40px rgba(102, 126, 234, 0.3)',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Deep',
    description: 'Deep ocean theme with teals and blues',
    colors: {
      primary: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
      },
      secondary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      accent: {
        blue: '#0ea5e9',
        purple: '#8b5cf6',
        green: '#10b981',
        orange: '#f59e0b',
        red: '#ef4444',
        teal: '#14b8a6',
        cyan: '#06b6d4',
      },
      background: {
        primary: '#0a0f1c',
        secondary: '#1a2332',
        tertiary: '#2a3748',
        glass: 'rgba(26, 35, 50, 0.8)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        muted: '#9ca3af',
        inverse: '#0a0f1c',
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
      },
    },
    gradients: {
      primary: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      background: 'linear-gradient(135deg, #0a0f1c 0%, #1a2332 50%, #2a3748 100%)',
      glass: 'linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(26, 35, 50, 0.6) 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    },
    shadows: {
      glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(20, 184, 166, 0.3)',
      glowStrong: '0 0 40px rgba(20, 184, 166, 0.5)',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm sunset theme with oranges and purples',
    colors: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      accent: {
        blue: '#3b82f6',
        purple: '#8b5cf6',
        green: '#10b981',
        orange: '#f97316',
        red: '#ef4444',
        teal: '#14b8a6',
        cyan: '#06b6d4',
      },
      background: {
        primary: '#1a0f0a',
        secondary: '#2a1f1a',
        tertiary: '#3a2f2a',
        glass: 'rgba(42, 31, 26, 0.8)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        muted: '#9ca3af',
        inverse: '#1a0f0a',
      },
      status: {
        success: '#10b981',
        warning: '#f97316',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #fb923c 0%, #e879f9 100%)',
      background: 'linear-gradient(135deg, #1a0f0a 0%, #2a1f1a 50%, #3a2f2a 100%)',
      glass: 'linear-gradient(135deg, rgba(42, 31, 26, 0.8) 0%, rgba(42, 31, 26, 0.6) 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    shadows: {
      glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(249, 115, 22, 0.3)',
      glowStrong: '0 0 40px rgba(249, 115, 22, 0.5)',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyber',
    description: 'Cyberpunk neon theme with bright accents',
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      accent: {
        blue: '#00d4ff',
        purple: '#a855f7',
        green: '#00ff88',
        orange: '#ff6b35',
        red: '#ff4757',
        teal: '#00d4ff',
        cyan: '#00d4ff',
      },
      background: {
        primary: '#000000',
        secondary: '#0a0a0a',
        tertiary: '#1a1a1a',
        glass: 'rgba(10, 10, 10, 0.8)',
        glassBorder: 'rgba(0, 212, 255, 0.2)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        muted: '#9ca3af',
        inverse: '#000000',
      },
      status: {
        success: '#00ff88',
        warning: '#ff6b35',
        error: '#ff4757',
        info: '#00d4ff',
      },
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
      secondary: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
      glass: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0.6) 100%)',
      success: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      warning: 'linear-gradient(135deg, #ff6b35 0%, #ff4757 100%)',
      error: 'linear-gradient(135deg, #ff4757 0%, #ff6b35 100%)',
      info: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
    },
    shadows: {
      glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(0, 212, 255, 0.3)',
      glowStrong: '0 0 40px rgba(0, 212, 255, 0.5)',
    },
  },
}

export const defaultTheme = themes.dark

export function getTheme(id: string): Theme {
  return themes[id] || defaultTheme
}

export function getAllThemes(): Theme[] {
  return Object.values(themes)
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  // Apply CSS custom properties
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value)
  })
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    root.style.setProperty(`--secondary-${key}`, value)
  })
  
  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    root.style.setProperty(`--accent-${key}`, value)
  })
  
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--bg-${key}`, value)
  })
  
  Object.entries(theme.colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value)
  })
  
  Object.entries(theme.colors.status).forEach(([key, value]) => {
    root.style.setProperty(`--status-${key}`, value)
  })
  
  // Apply gradients
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value)
  })
  
  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value)
  })
  
  // Set theme class
  root.className = root.className.replace(/theme-\w+/g, '')
  root.classList.add(`theme-${theme.id}`)
} 