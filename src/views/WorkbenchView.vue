<template>
  <div class="min-h-screen bg-gray-50">


    <!-- Main Content Area -->
    <div class="flex h-screen">
      <!-- Left Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 p-6">
        <!-- Navigation Buttons -->
        <div class="mb-6">
          <div class="flex items-center space-x-1 mb-4">
            <button class="bg-red-600 text-white px-4 py-2 rounded-md font-medium">
              Workbench
            </button>
            <button
              @click="goToDashboard"
              class="bg-white text-gray-600 px-4 py-2 rounded-md font-medium border border-gray-200 hover:bg-gray-50"
            >
              Dashboard
            </button>
          </div>
        </div>

        <!-- Elements Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-1">Elements</h3>
          <p class="text-sm text-gray-600 mb-4">Select projects and managers to analyze</p>
        </div>

        <!-- Projects Section -->
        <div class="mb-6">
          <div class="flex items-center space-x-2 mb-3">
            <DocumentIcon class="w-4 h-4 text-gray-600" />
            <h4 class="font-medium text-gray-800">Projects</h4>
          </div>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Barlow</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Anderson</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Caldwell</span>
            </label>
          </div>
        </div>

        <!-- Managers Section -->
        <div class="mb-6">
          <div class="flex items-center space-x-2 mb-3">
            <UserGroupIcon class="w-4 h-4 text-gray-600" />
            <h4 class="font-medium text-gray-800">Managers</h4>
          </div>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Beatrix</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Dan</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Cindy</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Andrew</span>
            </label>
          </div>
        </div>

        <!-- Refinements Section -->
        <div class="mt-auto">
          <h4 class="font-medium text-gray-800 mb-2">Refinements:</h4>
          <div class="text-sm text-gray-600 space-y-1">
            <p>Audience - Board, Technical, Other types</p>
            <p>Hunter - Thesis + al, Employee</p>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 bg-white">
        <!-- Ready to Start View -->
        <div v-if="!showConversationStarters && !showSummaryAgent" class="flex items-center justify-center h-full">
          <div class="text-center max-w-md">
            <!-- Speech Bubble Icon -->
            <div class="flex justify-center mb-6">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon class="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <!-- Ready to Start Text -->
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Ready to Start</h2>
            <p class="text-gray-600 mb-8 leading-relaxed">
              Select projects and managers from the sidebar, then choose a conversation starter to begin your AI-powered analysis.
            </p>

            <!-- Choose Conversation Starter Button -->
            <button
              @click="showConversationStarters = true"
              class="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Choose Conversation Starter
            </button>
          </div>
        </div>

        <!-- Conversation Starters Component -->
        <ConversationStarters
          v-else-if="showConversationStarters"
          @back="showConversationStarters = false"
          @select="selectConversationStarter"
        />

        <!-- Summary Agent Component -->
        <SummaryAgent
          v-else-if="showSummaryAgent"
          @send-message="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ConversationStarters from '@/components/ConversationStarters.vue'
import SummaryAgent from '@/components/SummaryAgent.vue'
import {
  DocumentIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state for different views
const showConversationStarters = ref(false)
const showSummaryAgent = ref(false)

const goBack = () => {
  router.push('/dashboard')
}

const goHome = () => {
  router.push('/dashboard')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const selectConversationStarter = (type: string) => {
  // Handle the conversation starter selection
  console.log('Selected conversation starter:', type)

  // Show appropriate component based on selection
  if (type === 'project-summary') {
    showConversationStarters.value = false
    showSummaryAgent.value = true
  } else {
    // For other conversation starters, you can add more conditions here
    alert(`Starting conversation: ${type}`)
  }
}

const handleSendMessage = (message: string) => {
  console.log('User sent message:', message)
  // Here you can handle the message sending logic
  // For example, making API calls to your AI service
}
</script>
