import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

// Message types
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
    audience: string[]
  }
}

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const error = ref<string | null>(null)
  const context = ref({
    projects: [] as string[],
    minerals: [] as string[],
    audience: [] as string[]
  })

  // Computed
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 0)

  // Generate unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }

  // Actions
  const addMessage = (content: string, type: 'user' | 'agent' | 'system' = 'user', metadata?: ChatMessage['metadata']): string => {
    const messageId = generateId()
    const message: ChatMessage = {
      id: messageId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      status: type === 'user' ? 'sent' : 'sending',
      metadata
    }

    messages.value.push(message)
    return messageId
  }

  const updateMessageStatus = (messageId: string, status: ChatMessage['status']): void => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.status = status
    }
  }

  const updateMessageContent = (messageId: string, content: string): void => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.content = content
    }
  }

  const rateMessage = (messageId: string, rating: 'up' | 'down'): void => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      if (!message.metadata) message.metadata = {}
      message.metadata.rating = rating
    }
  }

  const clearMessages = (): void => {
    messages.value = []
  }

  const updateContext = (newContext: {
    projects?: string[]
    minerals?: string[]
    audience?: string[]
  }): void => {
    context.value = {
      ...context.value,
      ...newContext
    }
  }

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  const setStreaming = (streaming: boolean): void => {
    isStreaming.value = streaming
  }

  const setError = (errorMessage: string | null): void => {
    error.value = errorMessage
  }

  const clearError = (): void => {
    error.value = null
  }

  // Streaming support (LangGraph-inspired)
  const startStreamingMessage = (): string => {
    const messageId = addMessage('', 'agent')
    updateMessageStatus(messageId, 'streaming')
    setStreaming(true)
    return messageId
  }

  const appendToStreamingMessage = (messageId: string, content: string): void => {
    const message = messages.value.find(m => m.id === messageId)
    if (message && message.status === 'streaming') {
      message.content += content
    }
  }

  const finishStreamingMessage = (messageId: string): void => {
    updateMessageStatus(messageId, 'sent')
    setStreaming(false)
  }

  return {
    // State
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    isStreaming: readonly(isStreaming),
    error: readonly(error),
    context: readonly(context),

    // Computed
    messageCount,
    hasMessages,

    // Actions
    addMessage,
    updateMessageStatus,
    updateMessageContent,
    rateMessage,
    clearMessages,
    updateContext,
    setLoading,
    setStreaming,
    setError,
    clearError,
    startStreamingMessage,
    appendToStreamingMessage,
    finishStreamingMessage
  }
})
