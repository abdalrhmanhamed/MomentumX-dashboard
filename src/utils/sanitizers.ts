// Text sanitization utilities for PDF export and data display
export function sanitizeText(text: string, maxLength: number = 100): string {
  if (!text) return ''
  
  // Remove HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '')
  
  // Remove special characters that might break PDF generation
  const sanitized = withoutHtml
    .replace(/[^\w\s\-.,!?()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized
}

export function sanitizeTitle(title: string, maxLength: number = 50): string {
  if (!title) return ''
  
  // Remove HTML tags and special characters
  const sanitized = title
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-.,!?()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized
}

export function sanitizeDescription(description: string, maxLength: number = 200): string {
  if (!description) return ''
  
  // Remove HTML tags and special characters
  const sanitized = description
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-.,!?()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized
}

export function sanitizeJournalContent(content: string, maxLength: number = 1000): string {
  if (!content) return ''
  
  // Remove HTML tags but preserve line breaks
  const sanitized = content
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-.,!?()\n\r]/g, '')
    .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
    .trim()
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized
}

export function sanitizeTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) return []
  
  return tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim().toLowerCase())
    .filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates
    .slice(0, 10) // Limit to 10 tags
}

export function sanitizeDate(date: string | Date): Date | null {
  if (!date) return null
  
  try {
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? null : parsedDate
  } catch {
    return null
  }
}

export function sanitizeISODate(date: string | Date): string | null {
  const sanitizedDate = sanitizeDate(date)
  return sanitizedDate ? sanitizedDate.toISOString() : null
}

export function sanitizeMood(mood: string | number): number {
  if (typeof mood === 'number') {
    return Math.max(1, Math.min(10, Math.round(mood)))
  }
  
  if (typeof mood === 'string') {
    const parsed = parseInt(mood, 10)
    return isNaN(parsed) ? 5 : Math.max(1, Math.min(10, parsed))
  }
  
  return 5 // Default mood
}

export function sanitizePriority(priority: string): 'low' | 'medium' | 'high' {
  const normalized = priority.toLowerCase().trim()
  
  if (normalized === 'high' || normalized === 'urgent' || normalized === 'critical') {
    return 'high'
  }
  
  if (normalized === 'low' || normalized === 'minor' || normalized === 'optional') {
    return 'low'
  }
  
  return 'medium' // Default priority
}

export function sanitizeCategory(category: string): string {
  if (!category) return 'general'
  
  const normalized = category.toLowerCase().trim()
  const validCategories = [
    'health', 'fitness', 'work', 'personal', 'learning', 'finance',
    'relationships', 'hobbies', 'spiritual', 'general'
  ]
  
  return validCategories.includes(normalized) ? normalized : 'general'
}

export function sanitizeFrequency(frequency: string): 'daily' | 'weekly' | 'monthly' | 'custom' {
  const normalized = frequency.toLowerCase().trim()
  
  if (normalized === 'daily' || normalized === 'day') return 'daily'
  if (normalized === 'weekly' || normalized === 'week') return 'weekly'
  if (normalized === 'monthly' || normalized === 'month') return 'monthly'
  
  return 'daily' // Default frequency
}

export function sanitizeTarget(target: number): number {
  if (typeof target !== 'number' || isNaN(target)) return 1
  return Math.max(1, Math.min(100, Math.round(target)))
}

export function sanitizeStreak(streak: number): number {
  if (typeof streak !== 'number' || isNaN(streak)) return 0
  return Math.max(0, Math.round(streak))
}

export function sanitizeStatus(status: string): 'pending' | 'in-progress' | 'completed' | 'cancelled' {
  const normalized = status.toLowerCase().trim()
  
  if (normalized === 'completed' || normalized === 'done' || normalized === 'finished') {
    return 'completed'
  }
  
  if (normalized === 'in-progress' || normalized === 'progress' || normalized === 'working') {
    return 'in-progress'
  }
  
  if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'abandoned') {
    return 'cancelled'
  }
  
  return 'pending' // Default status
}

export function sanitizeEmail(email: string): string | null {
  if (!email) return null
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const sanitized = email.trim().toLowerCase()
  
  return emailRegex.test(sanitized) ? sanitized : null
}

export function sanitizeUserId(userId: string): string | null {
  if (!userId) return null
  
  // Allow alphanumeric characters, hyphens, and underscores
  const sanitized = userId.trim().replace(/[^a-zA-Z0-9\-_]/g, '')
  
  return sanitized.length > 0 ? sanitized : null
}

export function sanitizeLicenseKey(licenseKey: string): string | null {
  if (!licenseKey) return null
  
  // Allow alphanumeric characters and hyphens
  const sanitized = licenseKey.trim().replace(/[^a-zA-Z0-9\-]/g, '')
  
  return sanitized.length > 0 ? sanitized : null
}

export function sanitizeNumber(value: any): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

export function sanitizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }
  
  if (typeof value === 'number') {
    return value !== 0
  }
  
  return false
}

export function sanitizeArray<T>(array: any[], validator: (item: any) => T | null): T[] {
  if (!Array.isArray(array)) return []
  
  return array
    .map(validator)
    .filter((item): item is T => item !== null)
}

export function sanitizeObject<T>(obj: any, schema: Record<string, (value: any) => any>): Partial<T> {
  if (!obj || typeof obj !== 'object') return {}
  
  const sanitized: any = {}
  
  for (const [key, validator] of Object.entries(schema)) {
    if (obj.hasOwnProperty(key)) {
      const value = validator(obj[key])
      if (value !== null && value !== undefined) {
        sanitized[key] = value
      }
    }
  }
  
  return sanitized
}

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
}

export function escapeHtml(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function sanitizeHabitData(habit: any) {
  return {
    title: sanitizeTitle(habit.title),
    description: sanitizeDescription(habit.description),
    category: sanitizeCategory(habit.category),
    frequency: sanitizeFrequency(habit.frequency),
    target: sanitizeTarget(habit.target),
    currentStreak: sanitizeStreak(habit.currentStreak),
    longestStreak: sanitizeStreak(habit.longestStreak),
    isActive: sanitizeBoolean(habit.isActive),
    completedDates: Array.isArray(habit.completedDates) ? habit.completedDates.map(sanitizeISODate).filter(Boolean) : [],
    userId: sanitizeUserId(habit.userId),
    createdAt: sanitizeISODate(habit.createdAt),
    updatedAt: sanitizeISODate(habit.updatedAt),
  }
}

export function sanitizeTaskData(task: any) {
  return {
    title: sanitizeTitle(task.title),
    description: sanitizeDescription(task.description),
    dueDate: sanitizeISODate(task.dueDate),
    priority: sanitizePriority(task.priority),
    status: sanitizeStatus(task.status),
    userId: sanitizeUserId(task.userId),
    createdAt: sanitizeISODate(task.createdAt),
    updatedAt: sanitizeISODate(task.updatedAt),
    completedAt: sanitizeISODate(task.completedAt),
  }
}

export function sanitizeJournalData(entry: any) {
  return {
    title: sanitizeTitle(entry.title),
    content: sanitizeJournalContent(entry.content),
    mood: sanitizeMood(entry.mood),
    tags: sanitizeTags(entry.tags),
    type: entry.type,
    userId: sanitizeUserId(entry.userId),
    createdAt: sanitizeISODate(entry.createdAt),
    updatedAt: sanitizeISODate(entry.updatedAt),
  }
}

export function detectSuspiciousPatterns(text: string): string[] {
  if (!text) return [];
  const patterns: [RegExp, string][] = [
    [/<script/i, 'Possible XSS: <script> tag'],
    [/onerror\s*=/i, 'Possible XSS: onerror attribute'],
    [/onload\s*=/i, 'Possible XSS: onload attribute'],
    [/select\s+\*\s+from/i, 'Possible SQLi: SELECT * FROM'],
    [/union\s+select/i, 'Possible SQLi: UNION SELECT'],
    [/drop\s+table/i, 'Possible SQLi: DROP TABLE'],
    [/insert\s+into/i, 'Possible SQLi: INSERT INTO'],
    [/--/g, 'Possible SQLi: -- comment'],
    [/;/g, 'Possible SQLi: semicolon'],
  ];
  return patterns
    .filter(([re]) => re.test(text))
    .map(([, msg]) => msg);
}

// Simple in-memory rate limiter (for demonstration; not production safe)
export class RateLimiter {
  private timestamps: number[] = [];
  private limit: number;
  private interval: number;

  constructor(limit: number, intervalMs: number) {
    this.limit = limit;
    this.interval = intervalMs;
  }

  public try(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.interval);
    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now);
      return true;
    }
    return false;
  }

  public isAllowed(_key?: string): boolean {
    return this.try();
  }

  public clear(_key?: string): void {
    this.timestamps = [];
  }
}
