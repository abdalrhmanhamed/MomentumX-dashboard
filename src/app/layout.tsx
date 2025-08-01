import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/context'
import { ThemeProvider } from '@/lib/themeContext'
import { MagicLinkHandler } from '@/components/MagicLinkHandler'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import IntroWrapper from '@/components/IntroWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MomentumX Dashboard - Self-Mastery Journey',
  description: 'Transform your life with daily habits, unwavering discipline, and spiritual growth. Your personal self-mastery dashboard.',
  keywords: 'habit tracking, self-mastery, productivity, recovery, faith-based, goal setting, analytics',
  authors: [{ name: 'MomentumX Team' }],
  creator: 'MomentumX Dashboard',
  publisher: 'MomentumX Dashboard',
  robots: 'index, follow',
  openGraph: {
    title: 'MomentumX Dashboard - Self-Mastery Journey',
    description: 'Transform your life with daily habits, unwavering discipline, and spiritual growth.',
    type: 'website',
    url: 'https://momentumx-dashboard.vercel.app',
    siteName: 'MomentumX Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MomentumX Dashboard - Self-Mastery Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomentumX Dashboard - Self-Mastery Journey',
    description: 'Transform your life with daily habits, unwavering discipline, and spiritual growth.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MomentumX" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AppProvider>
            <IntroWrapper>
              <div className="min-h-screen">
                <MagicLinkHandler />
                {children}
                <PWAInstallPrompt onClose={() => {}} />
              </div>
            </IntroWrapper>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 