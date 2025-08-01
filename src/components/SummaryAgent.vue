<template>
  <div class="flex-1 flex flex-col">
    <!-- Agent Header -->


    <!-- Chat Messages Area -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Agent Message -->
      <div class="mb-6">
        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-3xl">
          <p class="text-gray-800 mb-3">
            Hello! I'm your summary agent. I'd like to create a detailed project summary. Please analyse the selected projects and provide a comprehensive overview.
          </p>

          <!-- Message Footer -->
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>10:19</span>
            <div class="flex items-center space-x-2">
              <button class="p-1 hover:bg-gray-100 rounded transition-colors duration-200" title="Copy">
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
              <button class="p-1 hover:bg-gray-100 rounded transition-colors duration-200" title="Thumbs up">
                <HandThumbUpIcon class="w-4 h-4" />
              </button>
              <button class="p-1 hover:bg-gray-100 rounded transition-colors duration-200" title="Thumbs down">
                <HandThumbDownIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-6 border-t border-gray-200">
      <!-- Input Field -->
      <div class="flex items-end space-x-3">
        <div class="flex-1">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            placeholder="Type your message..."
            class="w-full p-3 border border-red-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows="3"
          ></textarea>
        </div>

        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!userInput.trim()"
          class="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Context Bar -->
      <div class="mt-3 flex items-center space-x-2 text-sm text-gray-600">
        <InformationCircleIcon class="w-4 h-4" />
        <span>{{ contextText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Props for context data
interface Props {
  selectedProjects?: string[]
  selectedMinerals?: string[]
  selectedAudience?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedProjects: () => [],
  selectedMinerals: () => [],
  selectedAudience: () => []
})

// Reactive state
const userInput = ref('')

// Computed property for context text
const contextText = computed(() => {
  const projects = props.selectedProjects
  const minerals = props.selectedMinerals
  const audience = props.selectedAudience

  const parts = []

  if (projects.length > 0) {
    parts.push(`Projects: ${projects.join(', ')}`)
  }

  if (minerals.length > 0) {
    parts.push(`Minerals: ${minerals.join(', ')}`)
  }

  if (audience.length > 0) {
    parts.push(`Audience: ${audience.join(', ')}`)
  }

  if (parts.length === 0) {
    return 'Context: No selections'
  }

  return `Context: ${parts.join(' | ')}`
})

// Methods
const sendMessage = () => {
  if (!userInput.value.trim()) return

  // Emit the message to parent component
  emit('send-message', userInput.value)

  // Clear input
  userInput.value = ''
}

// Define emits for parent component communication
const emit = defineEmits<{
  'send-message': [message: string]
}>()
</script>
