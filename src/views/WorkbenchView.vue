<template>
  <div class="h-full bg-gray-50">


    <!-- Main Content Area -->
    <div class="flex h-full">
      <!-- Left Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto h-full">
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
          <p class="text-sm text-gray-600 mb-4">Select projects and managers to analyse</p>
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
                value="Hamersley"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Hamersley</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Brockman"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Brockman</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Yandicoogina"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Yandicoogina</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Gudai-Darri"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Gudai-Darri</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedProjects"
                value="Amrun"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Amrun</span>
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
                value="auxite"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">auxite</span>
            </label>
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
              <input
                type="checkbox"
                v-model="selectedAudience"
                value="Board"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Board</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedAudience"
                value="Technical"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Technical</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedAudience"
                value="Other types"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              >
              <span class="text-gray-700">Other types</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 bg-white flex flex-col h-full">
        <!-- Welcome View -->
        <div v-if="!showConversationStarters && !showSummaryAgent && !showConversation" class="flex items-center justify-center h-full p-8">
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

        <!-- Conversation Component -->
        <Conversation
          v-else-if="showConversation"
          ref="conversationRef"
          :selected-projects="selectedProjects"
          :selected-minerals="selectedMinerals"
          :selected-audience="selectedAudience"
          :initial-message="conversationConfig.initialMessage"
          @send-message="handleSendMessage"
        />

        <!-- Summary Agent Component -->
        <SummaryAgent
          v-else-if="showSummaryAgent"
          :selected-projects="selectedProjects"
          :selected-minerals="selectedMinerals"
          :selected-audience="selectedAudience"
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
import Conversation from '@/components/Conversation.vue' // Added Conversation component import
import {
  DocumentIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive state for different views
const showConversationStarters = ref(false)
const showSummaryAgent = ref(false)
const showConversation = ref(false)

// Conversation configuration
const conversationConfig = ref({
  initialMessage: ''
})

// Conversation ref
const conversationRef = ref<InstanceType<typeof Conversation> | null>(null)

// Track selected projects, minerals, and audience
const selectedProjects = ref<string[]>([])
const selectedMinerals = ref<string[]>([])
const selectedAudience = ref<string[]>([])

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

  // Configure conversation based on type
  switch (type) {
    case 'project-summary':
      conversationConfig.value.initialMessage = "Hello! I'm your summary agent. I'd like to create a detailed project summary. Please analyse the selected projects and provide a comprehensive overview."
      break
    case 'risk-assessment':
      conversationConfig.value.initialMessage = "Hello! I'm your risk assessment agent. I'll help you identify and analyse potential project risks and mitigation strategies."
      break
    case 'performance-insights':
      conversationConfig.value.initialMessage = "Hello! I'm your performance insights agent. I'll analyse project metrics and generate actionable insights for you."
      break
    case 'ai-recommendations':
      conversationConfig.value.initialMessage = "Hello! I'm your AI recommendations agent. I'll provide intelligent suggestions for project optimization."
      break
    default:
      conversationConfig.value.initialMessage = "Hello! I'm here to help you with your project analysis."
  }

  // Show conversation component
  showConversationStarters.value = false
  showConversation.value = true
}

const handleSendMessage = (message: string) => {
  console.log('User sent message:', message)

  // Here you can handle the message sending logic
  // For example, making API calls to your AI service

  // Simulate AI response for now
  setTimeout(() => {
    if (conversationRef.value) {
      conversationRef.value.addAgentMessage("I'm processing your request. This is where the AI response would appear.")
    }
  }, 1000)
}
</script>
