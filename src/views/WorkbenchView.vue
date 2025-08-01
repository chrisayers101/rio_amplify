<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Left Side - Navigation Buttons -->
          <div class="flex items-center space-x-1">
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

          <!-- Right Side - Breadcrumb Navigation -->
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <div class="flex items-center space-x-2 cursor-pointer hover:text-gray-800" @click="goHome">
              <HomeIcon class="w-4 h-4" />
              <span>Home</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <span class="font-bold text-gray-800">Workbench</span>
            <div class="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Summary Agent</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex h-[calc(100vh-80px)]">
      <!-- Left Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 p-6">
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
      <div class="flex-1 bg-white flex items-center justify-center">
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
          <button class="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200">
            Choose Conversation Starter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  ArrowRightIcon,
  DocumentIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  router.push('/home')
}

const goHome = () => {
  router.push('/home')
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>
