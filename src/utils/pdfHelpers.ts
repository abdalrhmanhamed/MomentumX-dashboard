// PDF generation utilities for MomentumX Dashboard
// Handles text wrapping, emoji processing, RTL support, and formatting

import { format, parseISO } from 'date-fns'

// Emoji patterns for detection and replacement
const EMOJI_PATTERNS = {
  // Common emojis used in the app
  mood: {
    '😊': 'Happy',
    '😌': 'Calm', 
    '😐': 'Neutral',
    '😔': 'Sad',
    '😤': 'Frustrated',
    '🤔': 'Thoughtful',
    '💪': 'Motivated',
    '😴': 'Tired',
    '😄': 'Excited',
    '😰': 'Anxious'
  },
  // Status emojis
  status: {
    '✅': 'Completed',
    '⏳': 'Pending',
    '❌': 'Failed',
    '🔥': 'On Fire',
    '📈': 'Improving',
    '📉': 'Declining'
  },
  // Category emojis
  category: {
    '💪': 'Fitness',
    '🧠': 'Learning',
    '💼': 'Work',
    '❤️': 'Relationships',
    '💰': 'Finance',
    '🧘': 'Spirituality',
    '🎨': 'Creativity',
    '🏠': 'Personal'
  }
}

/**
 * Remove or replace emojis in text for PDF compatibility
 */
export function processEmojis(text: string, mode: 'remove' | 'replace' | 'keep' = 'replace'): string {
  if (!text) return ''

  if (mode === 'remove') {
    // Remove all emoji characters
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
  }

  if (mode === 'replace') {
    let processed = text

    // Replace mood emojis
    Object.entries(EMOJI_PATTERNS.mood).forEach(([emoji, replacement]) => {
      processed = processed.replace(new RegExp(emoji, 'g'), `[${replacement}]`)
    })

    // Replace status emojis
    Object.entries(EMOJI_PATTERNS.status).forEach(([emoji, replacement]) => {
      processed = processed.replace(new RegExp(emoji, 'g'), `[${replacement}]`)
    })

    // Replace category emojis
    Object.entries(EMOJI_PATTERNS.category).forEach(([emoji, replacement]) => {
      processed = processed.replace(new RegExp(emoji, 'g'), `[${replacement}]`)
    })

    return processed
  }

  // Keep emojis as-is
  return text
}

/**
 * Wrap text to fit within a specified width
 */
export function wrapText(text: string, maxWidth: number, fontSize: number = 12): string[] {
  if (!text) return []

  const avgCharWidth = fontSize * 0.6 // Approximate character width
  const charsPerLine = Math.floor(maxWidth / avgCharWidth)
  
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    
    if (testLine.length <= charsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
      }
      currentLine = word
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

/**
 * Format date for PDF display
 */
export function formatDateForPDF(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  switch (format) {
    case 'short':
      return format(dateObj, 'MMM dd')
    case 'long':
      return format(dateObj, 'MMMM dd, yyyy')
    case 'relative':
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - dateObj.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return format(dateObj, 'MMM dd')
    default:
      return format(dateObj, 'MMM dd, yyyy')
  }
}

/**
 * Generate progress bar HTML for PDF
 */
export function generateProgressBar(percentage: number, width: number = 200, height: number = 8): string {
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  const filledWidth = (clampedPercentage / 100) * width

  return `
    <div style="
      width: ${width}px; 
      height: ${height}px; 
      background: rgba(255, 255, 255, 0.1); 
      border-radius: ${height / 2}px; 
      overflow: hidden;
      margin: 5px 0;
    ">
      <div style="
        width: ${filledWidth}px; 
        height: 100%; 
        background: linear-gradient(90deg, #00ff88, #00d4ff); 
        border-radius: ${height / 2}px;
        transition: width 0.3s ease;
      "></div>
    </div>
  `
}

/**
 * Generate streak indicator HTML for PDF
 */
export function generateStreakIndicator(streak: number, maxStreak: number): string {
  const percentage = maxStreak > 0 ? (streak / maxStreak) * 100 : 0
  const color = streak > 0 ? '#00ff88' : '#666'
  
  return `
    <div style="
      display: inline-flex; 
      align-items: center; 
      background: rgba(0, 255, 136, 0.1); 
      padding: 4px 8px; 
      border-radius: 12px; 
      border: 1px solid ${color};
      margin: 2px;
    ">
      <span style="color: ${color}; font-size: 12px; font-weight: bold;">
        🔥 ${streak} days
      </span>
    </div>
  `
}

/**
 * Generate priority badge HTML for PDF
 */
export function generatePriorityBadge(priority: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: '#00ff88',
    medium: '#ffc107', 
    high: '#ff4757'
  }
  
  const color = colors[priority] || colors.medium
  
  return `
    <span style="
      background: ${color}20; 
      color: ${color}; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-size: 10px; 
      font-weight: bold;
      border: 1px solid ${color}40;
    ">
      ${priority.toUpperCase()}
    </span>
  `
}

/**
 * Generate mood indicator HTML for PDF
 */
export function generateMoodIndicator(mood: string): string {
  const moodColors = {
    happy: '#00ff88',
    calm: '#00d4ff',
    neutral: '#888',
    sad: '#9c27b0',
    frustrated: '#ff4757',
    thoughtful: '#ffc107',
    motivated: '#00ff88',
    tired: '#666',
    excited: '#ff6b35',
    anxious: '#ff4757'
  }
  
  const color = moodColors[mood as keyof typeof moodColors] || moodColors.neutral
  
  return `
    <span style="
      background: ${color}20; 
      color: ${color}; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-size: 10px; 
      font-weight: bold;
      border: 1px solid ${color}40;
    ">
      ${mood.toUpperCase()}
    </span>
  `
}

/**
 * Generate statistics card HTML for PDF
 */
export function generateStatsCard(title: string, value: number, color: string, icon?: string): string {
  return `
    <div style="
      background: ${color}10; 
      border: 1px solid ${color}30; 
      border-radius: 8px; 
      padding: 15px; 
      text-align: center;
      margin: 5px;
    ">
      ${icon ? `<div style="font-size: 24px; margin-bottom: 5px;">${icon}</div>` : ''}
      <div style="
        color: ${color}; 
        font-size: 24px; 
        font-weight: bold; 
        margin: 5px 0;
      ">${value}</div>
      <div style="
        color: #ccc; 
        font-size: 12px; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
      ">${title}</div>
    </div>
  `
}

/**
 * Generate section header HTML for PDF
 */
export function generateSectionHeader(title: string, icon?: string, color: string = '#00d4ff'): string {
  return `
    <div style="
      border-bottom: 2px solid ${color}; 
      padding-bottom: 10px; 
      margin: 30px 0 20px 0;
    ">
      <h2 style="
        color: ${color}; 
        font-size: 20px; 
        margin: 0; 
        display: flex; 
        align-items: center;
      ">
        ${icon ? `<span style="margin-right: 8px;">${icon}</span>` : ''}
        ${title}
      </h2>
    </div>
  `
}

/**
 * Generate card container HTML for PDF
 */
export function generateCardContainer(content: string, backgroundColor: string = 'rgba(255, 255, 255, 0.05)'): string {
  return `
    <div style="
      background: ${backgroundColor}; 
      border-radius: 8px; 
      padding: 15px; 
      margin: 10px 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    ">
      ${content}
    </div>
  `
}

/**
 * Truncate text for PDF display
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Generate table HTML for PDF
 */
export function generateTable(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(header => `<th style="padding: 8px; text-align: left; border-bottom: 1px solid #00d4ff; color: #00d4ff;">${header}</th>`).join('')
  const dataRows = rows.map(row => 
    `<tr>${row.map(cell => `<td style="padding: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #ccc;">${cell}</td>`).join('')}</tr>`
  ).join('')

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>${dataRows}</tbody>
    </table>
  `
}

/**
 * Generate footer HTML for PDF
 */
export function generateFooter(timestamp: Date = new Date()): string {
  return `
    <div style="
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 2px solid #00d4ff; 
      text-align: center;
    ">
      <p style="color: #888; font-size: 12px; margin: 5px 0;">
        Generated by MomentumX Dashboard
      </p>
      <p style="color: #666; font-size: 11px; margin: 5px 0;">
        ${format(timestamp, 'yyyy-MM-dd HH:mm:ss')} UTC
      </p>
      <p style="color: #666; font-size: 11px; margin: 5px 0;">
        This report contains your personal data. Keep it secure.
      </p>
    </div>
  `
}

/**
 * Calculate optimal font size for text wrapping
 */
export function calculateOptimalFontSize(text: string, containerWidth: number, containerHeight: number): number {
  const baseFontSize = 12
  const avgCharWidth = baseFontSize * 0.6
  const charsPerLine = Math.floor(containerWidth / avgCharWidth)
  const lines = wrapText(text, containerWidth, baseFontSize)
  const lineHeight = baseFontSize * 1.2
  const totalHeight = lines.length * lineHeight

  if (totalHeight <= containerHeight) {
    return baseFontSize
  }

  // Reduce font size proportionally
  const scaleFactor = containerHeight / totalHeight
  return Math.max(8, baseFontSize * scaleFactor)
}

/**
 * Generate RTL-aware text for Arabic content
 */
export function generateRTLText(text: string, isRTL: boolean = false): string {
  if (!isRTL) return text
  
  return `
    <div style="direction: rtl; text-align: right; font-family: 'Noto Sans Arabic', Arial, sans-serif;">
      ${text}
    </div>
  `
}

/**
 * Sanitize HTML for PDF generation
 */
export function sanitizeHTMLForPDF(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
}

/**
 * Generate filename for PDF export
 */
export function generatePDFFilename(type: string, date: Date = new Date()): string {
  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(date, 'HH-mm')
  return `MomentumX-${type}-Report-${dateStr}-${timeStr}.pdf`
} 