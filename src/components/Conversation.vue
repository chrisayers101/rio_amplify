<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div class="flex items-center space-x-3">
        <h2 class="text-lg font-semibold text-gray-900">Chat</h2>
        <span v-if="chatStore.messageCount > 0" class="text-sm text-gray-500">
          {{ chatStore.messageCount }} message{{ chatStore.messageCount !== 1 ? 's' : '' }}
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Clear Chat Button -->
        <button
          v-if="chatStore.hasMessages"
          @click="clearChat"
          class="px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          title="Clear chat"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 p-6 overflow-y-auto bg-gray-50"
      @scroll="handleScroll"
    >
      <!-- Welcome Message -->
      <div v-if="!chatStore.hasMessages" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
          <p class="text-gray-500 mb-6">Ask me anything about your projects, minerals, or business needs.</p>
        </div>
      </div>

      <!-- Messages -->
              <div v-else class="space-y-4">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="flex"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
          >
          <div
            class="max-w-3xl rounded-lg p-4 shadow-sm"
            :class="getMessageClasses(message)"
          >
            <!-- Message Content -->
            <div class="flex items-start space-x-3">
              <!-- Avatar -->
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                :class="message.type === 'user' ? 'bg-red-600' : 'bg-gray-600'"
              >
                {{ message.type === 'user' ? 'U' : 'A' }}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Streaming indicator -->
                <div v-if="message.status === 'streaming'" class="flex items-center space-x-2 mb-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                  <span class="text-sm text-gray-500">AI is thinking...</span>
                </div>

                <!-- Error indicator -->
                <div v-if="message.status === 'error'" class="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon class="w-4 h-4 text-red-500" />
                  <span class="text-sm text-red-600">Message failed to send</span>
                </div>

                <!-- Message text -->
                <div class="prose prose-sm max-w-none">
                  <p class="text-gray-800 whitespace-pre-wrap">{{ message.content }}</p>
                </div>

                <!-- Message metadata -->
                <div v-if="message.metadata?.tokens || message.metadata?.model" class="mt-2 text-xs text-gray-500">
                  <span v-if="message.metadata?.tokens">{{ message.metadata.tokens }} tokens</span>
                  <span v-if="message.metadata?.model" class="ml-2">{{ message.metadata.model }}</span>
                </div>
              </div>
            </div>

            <!-- Message Footer -->
            <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span class="text-xs text-gray-500">{{ message.timestamp }}</span>

              <div class="flex items-center space-x-1">
                <!-- Copy Button -->
                <button
                  @click="copyMessage(message.content)"
                  class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Copy message"
                >
                  <DocumentDuplicateIcon class="w-3 h-3" />
                </button>

                <!-- Rating Buttons (only for agent messages) -->
                <template v-if="message.type === 'agent'">
                  <button
                    @click="rateMessage(message.id, 'up')"
                    class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                    :class="message.metadata?.rating === 'up' ? 'text-green-600' : 'text-gray-400'"
                    title="Thumbs up"
                  >
                    <HandThumbUpIcon class="w-3 h-3" />
                  </button>
                  <button
                    @click="rateMessage(message.id, 'down')"
                    class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                    :class="message.metadata?.rating === 'down' ? 'text-red-600' : 'text-gray-400'"
                    title="Thumbs down"
                  >
                    <HandThumbDownIcon class="w-3 h-3" />
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="chatStore.isLoading" class="flex justify-center py-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm text-gray-600">Processing...</span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-6 border-t border-gray-200 bg-white">
      <!-- Error Display -->
      <div v-if="chatStore.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center space-x-2">
          <ExclamationTriangleIcon class="w-4 h-4 text-red-500" />
          <span class="text-sm text-red-700">{{ chatStore.error }}</span>
          <button @click="chatStore.clearError()" class="ml-auto text-red-500 hover:text-red-700">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Input Field -->
      <div class="flex items-end space-x-3">
        <div class="flex-1">
          <textarea
            ref="messageInput"
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            @keydown.ctrl.enter="sendMessage"
            placeholder="Type your message... (Enter to send, Ctrl+Enter for new line)"
            class="w-full p-3 border border-red-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows="3"
            :disabled="chatStore.isLoading || chatStore.isStreaming"
          ></textarea>
        </div>

        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!userInput.trim() || chatStore.isLoading || chatStore.isStreaming"
          class="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          title="Send message"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Context Bar -->
      <div v-if="hasContext()" class="mt-3 flex items-center space-x-2 text-sm text-gray-600">
        <InformationCircleIcon class="w-4 h-4" />
        <span>{{ getContextText() }}</span>
      </div>

      <!-- Character count -->
      <div class="mt-2 text-xs text-gray-500 text-right">
        {{ userInput.length }} characters
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { chatApi } from '@/utils/chatApi'
import {
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Props for context data
interface Props {
  selectedProjects?: string[]
  selectedMinerals?: string[]
  selectedAudience?: string[]
  initialMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedProjects: () => [],
  selectedMinerals: () => [],
  selectedAudience: () => [],
  initialMessage: ''
})

// Store
const chatStore = useChatStore()

// Reactive state
const userInput = ref('')
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()

// Initialize with context if provided
onMounted(() => {
  if (props.selectedProjects.length > 0 || props.selectedMinerals.length > 0 || props.selectedAudience.length > 0) {
    chatStore.updateContext({
      projects: props.selectedProjects,
      minerals: props.selectedMinerals,
      audience: props.selectedAudience
    })
  }

  if (props.initialMessage && !chatStore.hasMessages) {
    chatStore.addMessage(props.initialMessage, 'agent')
  }
})

// Watch for changes in selected projects, minerals, and audience to update context
watch(
  () => [props.selectedProjects, props.selectedMinerals, props.selectedAudience],
  ([projects, minerals, audience]) => {
    chatStore.updateContext({
      projects: projects || [],
      minerals: minerals || [],
      audience: audience || []
    })
  },
  { deep: true }
)

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Methods
const sendMessage = async () => {
  if (!userInput.value.trim() || chatStore.isLoading || chatStore.isStreaming) return

  const message = userInput.value.trim()
  userInput.value = ''

  // Add user message
  chatStore.addMessage(message, 'user')

  // Start streaming response
  const messageId = chatStore.startStreamingMessage()
  chatStore.setLoading(true)

  try {
    // Call streaming API
    await chatApi.streamChat(
      {
        message,
        threadId: 'default',
        context: {
          projects: [...chatStore.context.projects],
          minerals: [...chatStore.context.minerals],
          audience: [...chatStore.context.audience]
        },
        messages: [...chatStore.messages] // Pass conversation history
      },
      (chunk) => {
        if (chunk.type === 'chunk') {
          chatStore.appendToStreamingMessage(messageId, chunk.content)
        } else if (chunk.type === 'error') {
          chatStore.setError(chunk.content)
        }
      },
      (error) => {
        chatStore.setError(error)
      },
      () => {
        chatStore.finishStreamingMessage(messageId)
        chatStore.setLoading(false)
      }
    )
  } catch (error) {
    chatStore.setError(error instanceof Error ? error.message : 'Failed to send message')
    chatStore.setLoading(false)
  }

  // Focus input for next message
  nextTick(() => {
    messageInput.value?.focus()
  })
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    // Could add toast notification here
  } catch (err) {
    console.error('Failed to copy message:', err)
  }
}

const rateMessage = (messageId: string, rating: 'up' | 'down') => {
  chatStore.rateMessage(messageId, rating)
  // Could emit rating to parent for analytics
  emit('rate-message', { messageId, rating })
}

const clearChat = () => {
  if (confirm('Are you sure you want to clear this chat?')) {
    chatStore.clearMessages()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleScroll = () => {
  // Could implement infinite scroll or other scroll-based features
}

const getMessageClasses = (message: any) => {
  const baseClasses = 'border'

  if (message.type === 'user') {
    return `${baseClasses} bg-red-50 border-red-200 ml-12`
  } else {
    return `${baseClasses} bg-white border-gray-200 mr-12`
  }
}

const hasContext = (): boolean => {
  const context = chatStore.context
  return (
    context.projects.length > 0 ||
    context.minerals.length > 0 ||
    context.audience.length > 0
  )
}

const getContextText = () => {
  const context = chatStore.context

  const parts = []

  if (context.projects.length > 0) {
    parts.push(`Projects: ${context.projects.join(', ')}`)
  }

  if (context.minerals.length > 0) {
    parts.push(`Minerals: ${context.minerals.join(', ')}`)
  }

  if (context.audience.length > 0) {
    parts.push(`Audience: ${context.audience.join(', ')}`)
  }

  return parts.length > 0 ? parts.join(' | ') : 'No context'
}

// Define emits for parent component communication
const emit = defineEmits<{
  'send-message': [message: string]
  'rate-message': [data: { messageId: string; rating: 'up' | 'down' }]
}>()

// Expose methods for parent component
const addAgentMessage = (content: string, metadata?: any) => {
  return chatStore.addMessage(content, 'agent', metadata)
}

const startStreaming = () => {
  return chatStore.startStreamingMessage()
}

const appendToStream = (messageId: string, content: string) => {
  chatStore.appendToStreamingMessage(messageId, content)
}

const finishStreaming = (messageId: string) => {
  chatStore.finishStreamingMessage(messageId)
}

const setLoading = (loading: boolean) => {
  chatStore.setLoading(loading)
}

const setError = (error: string | null) => {
  chatStore.setError(error)
}

// Expose methods to parent component
defineExpose({
  addAgentMessage,
  startStreaming,
  appendToStream,
  finishStreaming,
  setLoading,
  setError
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
