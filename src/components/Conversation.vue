<template>
  <transition name="slide-panel">
    <div v-if="open" class="conversation-panel" :class="{ 'embedded': embedded }">
      <button v-if="!embedded" class="close-btn" @click="$emit('close')">×</button>
      <div class="conversation-content">


        <!-- Messages Container -->
        <div class="messages-container" ref="messagesContainer">
          <div v-for="(message, index) in uiMessages" :key="index" class="message-wrapper" :class="message.type">
            <div class="message-bubble">
              <!-- Use VueMarkdown for AI messages to render markdown properly -->
              <div v-if="message.type === 'ai-message'" class="message-content">
                <VueMarkdown :source="message.content" />
              </div>
              <!-- Regular text for user messages -->
              <div v-else class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="message-wrapper ai-message">
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-container">
          <div class="input-wrapper">
                        <textarea
              v-model="newMessage"
              @keydown.enter.prevent="sendMessage"
              placeholder="Ask me about mining projects, geological analysis, financial evaluations, or technical assessments..."
              class="message-input"
              rows="3"
            ></textarea>
            <button @click="sendMessage" class="send-button" :disabled="!newMessage.trim()">
              <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, nextTick, watch, onMounted, computed } from 'vue'
import { chatApi, prepareChatContext } from '@/utils/chatApi'
import { useFeasibilityStudySectionStore } from '@/stores/entityStore'
import { useGuidelinesStore } from '@/stores/guidelinesStore'
import { useChatStore } from '@/stores/chatStore'
import VueMarkdown from 'vue-markdown-render'

// Define component name for linting
defineOptions({
  name: 'ConversationPanel'
})

defineProps({
  open: { type: Boolean, default: false },
  embedded: { type: Boolean, default: false }
})
defineEmits(['close'])

// Use stores directly
const entityStore = useFeasibilityStudySectionStore()
const guidelinesStore = useGuidelinesStore()

// Reactive data
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
const chatStore = useChatStore()

// Derive UI messages from chat store
const uiMessages = computed(() =>
  chatStore.messages.map(m => ({
    type: m.type === 'user' ? 'user-message' : 'ai-message',
    content: m.content,
    time: m.timestamp
  }))
)

// Seed a greeting if store is empty
onMounted(() => {
  if (chatStore.messages.length === 0) {
    chatStore.addMessage(
      'Hello! I\'m your Rio AI Assistant, specialized in mining research and analytics. I can help you with project analysis, geological assessments, financial evaluations, and technical insights for your mining operations. What would you like to know about your projects today?',
      'agent'
    )
  }
})

// Methods
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  // Add user message to store
  chatStore.addMessage(newMessage.value, 'user')

  const userMessage = newMessage.value
  newMessage.value = ''

  // Show typing indicator
  isTyping.value = true

    try {
    // Convert store messages to the format expected by the API
    const apiMessages = chatStore.messages.map(msg => ({
      type: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    // Start a streaming agent message in the store
    const streamingId = chatStore.startStreamingMessage()

          // Prepare context with selected entity and matching guideline
      const selectedSection = entityStore.selectedSections[0]
      const context = selectedSection ? prepareChatContext(
        selectedSection.entity,
        selectedSection.sectionId,
        guidelinesStore.sections
      ) : undefined

    // Use streaming API
    await chatApi.streamChat(
      {
        message: userMessage,
        threadId: 'default',
        context,
        messages: apiMessages
      },
      (chunk) => {
        // Update the streaming message in the store
        if (chunk.type === 'chunk') {
          chatStore.appendToStreamingMessage(streamingId, chunk.content)
        }
      },
      (error) => {
        // Handle streaming error by finalizing message content
        chatStore.updateMessageContent(streamingId, `Error: ${error}`)
        console.error('Streaming error:', error)
      },
      () => {
        // Streaming complete
        isTyping.value = false
        chatStore.finishStreamingMessage(streamingId)
      }
    )

  } catch (error) {
    // Hide typing indicator
    isTyping.value = false

    // Add error message
    chatStore.addMessage(`Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`, 'agent')

    console.error('Chat API error:', error)
  }
}

// Auto-scroll to bottom when new messages arrive
watch(uiMessages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>

<style scoped>
.conversation-panel {
  position: fixed;
  top: 64px;
  right: 0;
  width: 420px;
  height: calc(100vh - 64px);
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.08);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  z-index: 10;
}
.conversation-content {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Conversation Header */
.conversation-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #008C8E, #00a8aa);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 20px;
  color: white;
}

.ai-info {
  flex: 1;
}

.ai-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.ai-status {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 8px;
}

.message-wrapper.user-message {
  justify-content: flex-end;
}

.message-wrapper.ai-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.user-message .message-bubble {
  background: #008C8E;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .message-bubble {
  background: #f3f4f6;
  color: #111827;
  border-bottom-left-radius: 4px;
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.user-message .message-time {
  text-align: right;
}

.ai-message .message-time {
  text-align: left;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator span:nth-child(3) { animation-delay: 0s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* Input Container */
.input-container {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #008C8E;
  box-shadow: 0 0 0 3px rgba(0, 140, 142, 0.1);
}

.send-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #008C8E;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: #007a7c;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.send-icon {
  width: 18px;
  height: 18px;
}
.slide-panel-enter-active, .slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-panel-enter-from, .slide-panel-leave-to {
  transform: translateX(100%);
}
.slide-panel-enter-to, .slide-panel-leave-from {
  transform: translateX(0);
}

/* Embedded mode styles - highest specificity */
.conversation-panel.embedded {
  position: relative !important;
  top: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 100% !important;
  box-shadow: none !important;
  border-right: 1px solid #e5e7eb !important;
  z-index: auto !important;
  transform: none !important;
}

.conversation-panel.embedded .close-btn {
  display: none !important;
}

/* Ensure embedded mode overrides all other styles */
.conversation-panel.embedded,
.conversation-panel.embedded * {
  position: relative !important;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .conversation-panel:not(.embedded) {
    width: 100%;
    top: 64px;
    height: calc(100vh - 64px);
  }

  .close-btn {
    top: 12px;
    right: 12px;
    font-size: 1.5rem;
  }

  .conversation-header {
    padding: 16px 20px;
  }

  .messages-container {
    padding: 16px 20px;
  }

  .input-container {
    padding: 16px 20px;
  }

  .message-bubble {
    max-width: 90%;
  }
}

/* Style markdown tables */
.message-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  font-size: 0.9em;
}

.message-content :deep(th),
.message-content :deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  vertical-align: top;
}

.message-content :deep(th) {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.message-content :deep(tr:nth-child(even)) {
  background-color: #f9f9f9;
}

.message-content :deep(tr:hover) {
  background-color: #f5f5f5;
}

/* Style markdown content */
.message-content :deep(p) {
  margin: 8px 0;
  line-height: 1.5;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-content :deep(li) {
  margin: 4px 0;
}

.message-content :deep(strong) {
  font-weight: 600;
  color: #333;
}

.message-content :deep(em) {
  font-style: italic;
  color: #666;
}
</style>
