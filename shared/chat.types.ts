// ============================================================================
// CHAT STORE INTERFACES
// ============================================================================

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  type: 'user' | 'agent' | 'system'
  status: 'sending' | 'sent' | 'error' | 'streaming'
  metadata?: {
    rating?: 'up' | 'down' | null
    tokens?: number
    model?: string
    tools?: string[]
    context?: {
      projects?: string[]
      minerals?: string[]
      audience?: string[]
    }
  }
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  context: {
    projects: string[]
    minerals: string[]
    audience?: string[]
  }
}

// ============================================================================
// CHAT API INTERFACES
// ============================================================================

export interface ChatRequest<T = Record<string, unknown>, U = Record<string, unknown>> {
  message: string
  threadId?: string
  context?: {
    selectedEntity?: T
    matchingGuideline?: U
  }
  messages?: unknown[] // Conversation history from Pinia store
}

export interface ChatChunk {
  type: 'chunk'
  content: string
  threadId: string
}

export interface ChatResponse {
  chunks: ChatChunk[]
  success: boolean
  error?: string
}

// Alternative single response format for compatibility
export interface ChatSingleResponse {
  type: 'chunk' | 'error'
  content: string
  threadId: string
}
