<template>
  <div class="h-full flex flex-col">
    <!-- Agent Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <DocumentIcon class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Summary Agent</h2>
          <p class="text-sm text-gray-600">AI-powered analysis and insights</p>
        </div>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Agent Message -->
      <div class="mb-6">
        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-3xl">
          <p class="text-gray-800 mb-3">
            Hello! I'm your summary agent. I'd like to create a detailed project summary. Please analyze the selected projects and provide a comprehensive overview.
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
        <span>Context: 1 project(s) 1 manager(s)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DocumentIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Reactive state
const userInput = ref('')

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