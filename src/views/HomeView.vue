<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-1">Project Intelligence Workbench</h1>
          <p class="text-gray-600">AI-powered project management and analysis</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="openWorkbench"
            class="bg-red-600 text-white px-4 py-2 rounded-md border border-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            Open Workbench
          </button>
          <button
            @click="signOut"
            class="text-gray-600 hover:text-gray-800 p-2 rounded-md transition-colors duration-200"
            title="Sign Out"
          >
            <ArrowLeftStartOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Introduction -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Start a Conversation with AI</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our specialized AI agents to get insights, summaries, and recommendations for your projects. Each agent is designed to help you with specific aspects of project management.
        </p>
      </div>

      <!-- Conversation Starters -->
      <div class="mb-12">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Conversation Starters</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card 1: Create a detailed project summary -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800 mb-2">Create a detailed project summary</h4>
                <p class="text-gray-600 text-sm mb-4">Generate comprehensive project overviews and status reports</p>
              </div>
              <DocumentIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
            </div>
            <button
              @click="openWorkbench"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Start Conversation
            </button>
          </div>

          <!-- Card 2: Risk Assessment -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800 mb-2">Risk Assessment</h4>
                <p class="text-gray-600 text-sm mb-4">Identify and analyze potential project risks and mitigation strategies</p>
              </div>
              <ExclamationTriangleIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
            </div>
            <button
              @click="openWorkbench"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Start Conversation
            </button>
          </div>

          <!-- Card 3: Performance Insights -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800 mb-2">Performance Insights</h4>
                <p class="text-gray-600 text-sm mb-4">Analyze project metrics and generate actionable insights</p>
              </div>
              <ChartBarIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
            </div>
            <button
              @click="openWorkbench"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Start Conversation
            </button>
          </div>

          <!-- Card 4: AI Recommendations -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800 mb-2">AI Recommendations</h4>
                <p class="text-gray-600 text-sm mb-4">Get intelligent suggestions for project optimization</p>
              </div>
              <ChatBubbleLeftRightIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
            </div>
            <button
              @click="openWorkbench"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Start Conversation
            </button>
          </div>
        </div>
      </div>

      <!-- How it works -->
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800 mb-2">How it works</h3>
            <p class="text-gray-600">
              Select a conversation starter to launch the workbench with a specialized AI agent. You can then choose specific projects and managers to focus your analysis. The AI will provide targeted insights and recommendations based on your selections.
            </p>
          </div>
          <ChatBubbleLeftRightIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import {
  DocumentIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const signOut = async () => {
  try {
    await authStore.signOut()
    // Redirect to landing page after successful sign out
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

const openWorkbench = () => {
  router.push('/workbench')
}
</script>
