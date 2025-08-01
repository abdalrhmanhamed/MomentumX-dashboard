import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export function useNotifications(userId: string | null): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!userId) return

    const stored = localStorage.getItem(`notifications_${userId}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })))
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }, [userId])

  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    if (!userId) return
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(newNotifications))
  }, [userId])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50)
      saveNotifications(updated)
      return updated
    })

    toast.success(notification.message)
  }, [saveNotifications])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      saveNotifications(updated)
      return updated
    })
  }, [saveNotifications])

  const clearAll = useCallback(() => {
    setNotifications([])
    saveNotifications([])
  }, [saveNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll
  }
}
