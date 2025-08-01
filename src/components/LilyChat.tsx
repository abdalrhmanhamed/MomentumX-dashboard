'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Sparkles, Loader2, Crown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLicense } from '@/hooks/useLicense'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatResponse {
  reply: string
  error?: string
}

export default function LilyChat() {
  const { user } = useAuth()
  const { license } = useLicense(user?.uid || null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Lily, your AI recovery coach. I\'m here to support you on your journey to self-mastery. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check if user has premium access
  const hasPremiumAccess = license?.tier === 'coach' || license?.tier === 'business'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !hasPremiumAccess) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are Lily, a supportive AI recovery coach for MomentumX. Be encouraging, empathetic, and provide practical advice for self-improvement and recovery. Keep responses concise but helpful.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!hasPremiumAccess) {
    return (
      <div className="bg-glass border border-glass-border rounded-xl p-6 text-center">
        <Crown className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text-primary mb-2">
          Premium Feature
        </h3>
        <p className="text-text-secondary mb-4">
          Chat with Lily is available for Coach and Business tier users.
        </p>
        <button className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-200">
          Upgrade to Premium
        </button>
      </div>
    )
  }

  return (
    <div className="bg-glass border border-glass-border rounded-xl overflow-hidden shadow-glass">
      {/* Header */}
      <div className="bg-gradient-primary p-4 border-b border-glass-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Chat with Lily
            </h3>
            <p className="text-white/80 text-sm">
              Your AI Recovery Coach
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-primary-500' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.role === 'user' ? (
                  <span className="text-white text-sm font-medium">U</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-background-secondary text-text-primary border border-glass-border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-text-muted'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-background-secondary text-text-primary border border-glass-border px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-text-muted">Lily is typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex space-x-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Lily about recovery, habits, goals, or anything else..."
            className="flex-1 bg-background-secondary border border-glass-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-glow disabled:bg-background-tertiary disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Premium Badge */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-3 py-1 rounded-full border border-primary-500/30">
            <Crown className="w-3 h-3 text-primary-500" />
            <span className="text-xs text-primary-500 font-medium">
              Premium Feature
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 