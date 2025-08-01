'use client'

import { useState } from 'react'
import { 
  Sun, 
  Moon, 
  Globe, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  theme?: 'dark' | 'light'
  language?: 'en' | 'ar'
  onThemeChange?: (theme: 'dark' | 'light') => void
  onLanguageChange?: (language: 'en' | 'ar') => void
  user?: {
    displayName?: string
    email?: string
    photoURL?: string
  }
  onLogout?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard' },
  { name: 'Journal', href: '/app/journal' },
  { name: 'Admin', href: '/app/admin' },
]

export default function Navbar({
  theme = 'dark',
  language = 'en',
  onThemeChange,
  onLanguageChange,
  user,
  onLogout
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const pathname = usePathname()

  const isRTL = language === 'ar'

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    onThemeChange?.(newTheme)
  }

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en'
    onLanguageChange?.(newLanguage)
    setIsLanguageMenuOpen(false)
  }

  return (
    <nav className="glass border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              href="/app/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-neon-turquoise to-neon-green bg-clip-text text-transparent"
            >
              MomentumX
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-neon-turquoise'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full"></span>
            </button>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 glass rounded-lg shadow-lg border border-gray-700 min-w-[120px] z-10">
                  <button
                    onClick={handleLanguageToggle}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-neon-turquoise rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium">
                  {user?.displayName || 'User'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 glass rounded-lg shadow-lg border border-gray-700 min-w-[200px] z-10">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      onClick={() => {
                        onLogout?.()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2 text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-neon-turquoise bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 