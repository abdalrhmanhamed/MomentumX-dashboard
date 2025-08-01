import { NextRequest, NextResponse } from 'next/server'

// Configuration
const AGENT_URL = process.env.AGENT_URL || 'https://your-render-agent-url.onrender.com'
const TIMEOUT_MS = 30000 // 30 seconds timeout

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AgentRequest {
  model: string
  messages: ChatMessage[]
  stream: boolean
}

interface AgentResponse {
  reply?: string
  content?: string
  message?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Prepare request for external agent
    const agentRequest: AgentRequest = {
      model: 'mistral',
      messages,
      stream: false
    }

    // Set up timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const response = await fetch(`${AGENT_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MomentumX-Dashboard/1.0'
        },
        body: JSON.stringify(agentRequest),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Agent responded with status: ${response.status}`)
      }

      const agentData: AgentResponse = await response.json()
      
      // Extract reply from various possible response formats
      const reply = agentData.reply || agentData.content || agentData.message || 'No response from agent'

      return NextResponse.json({ reply })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - agent took too long to respond' },
          { status: 408 }
        )
      }

      console.error('Error communicating with agent:', fetchError)
      return NextResponse.json(
        { error: 'Failed to communicate with AI agent' },
        { status: 502 }
      )
    }

  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 