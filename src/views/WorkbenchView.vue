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
            <h4 class="font-bold text-gray-800 text-base">Projects</h4>
          </div>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Barlow"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Barlow</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Anderson"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Anderson</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Caldwell"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Caldwell</span>
            </label>
          </div>
        </div>

        <!-- Minerals Section -->
        <div class="mb-6">
          <div class="flex items-center space-x-2 mb-3">
            <CubeIcon class="w-4 h-4 text-gray-600" />
            <h4 class="font-bold text-gray-800 text-base">Minerals</h4>
          </div>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedMinerals"
                value="Iron Ore"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Iron Ore</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedMinerals"
                value="Copper"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Copper</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedMinerals"
                value="Aluminum"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Aluminum</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedMinerals"
                value="Gold"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Gold</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedMinerals"
                value="Coal"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Coal</span>
            </label>
          </div>
        </div>

        <!-- Audience Section -->
        <div class="mb-6">
          <div class="flex items-center space-x-2 mb-3">
            <UserGroupIcon class="w-4 h-4 text-gray-600" />
            <h4 class="font-bold text-gray-800 text-base">Audience</h4>
          </div>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Board</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Technical</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
              <span class="text-gray-700">Other types</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 bg-white">
        <!-- Welcome View -->
        <div v-if="!showConversationStarters && !showSummaryAgent" class="flex items-center justify-center h-full p-8">
          <div class="text-center max-w-2xl">
            <!-- Welcome Header -->
            <div class="mb-8">
              <!-- Welcome Icon and Text -->
              <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h2 class="text-5xl font-bold text-gray-800">Welcome</h2>
              </div>
              <p class="text-gray-700 text-xl leading-relaxed mb-6">
                Rio Amplify is an AI-powered analysis tool that helps you generate insights from your project and mineral data.
              </p>
              <p class="text-gray-700 text-xl leading-relaxed">
                Please select a project and other settings from the sidebar to begin your analysis.
              </p>
            </div>

            <!-- Get Started Button - Only show if projects are selected -->
            <div v-if="hasSelectedProjects" class="mt-8">
              <button
                @click="showConversationStarters = true"
                class="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 text-lg"
              >
                Get Started
              </button>
            </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConversationStarters from '@/components/ConversationStarters.vue'
import SummaryAgent from '@/components/SummaryAgent.vue'
import {
  DocumentIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive state for different views
const showConversationStarters = ref(false)
const showSummaryAgent = ref(false)

// Track selected projects and minerals
const selectedProjects = ref<string[]>([])
const selectedMinerals = ref<string[]>([])

// Computed property to check if any projects are selected
const hasSelectedProjects = computed(() => {
  return selectedProjects.value.length > 0 || selectedMinerals.value.length > 0
})

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
