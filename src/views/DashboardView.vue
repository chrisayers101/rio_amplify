<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Left Side - Navigation Buttons -->
          <div class="flex items-center space-x-1">
            <button
              @click="goToWorkbench"
              class="bg-white text-gray-600 px-4 py-2 rounded-md font-medium border border-gray-200 hover:bg-gray-50"
            >
              Workbench
            </button>
            <button class="bg-red-600 text-white px-4 py-2 rounded-md font-medium">
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
        <!-- Top Section with Gear Icon -->
        <div class="flex flex-col items-center justify-center mb-6">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Cog6ToothIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-sm text-gray-600 text-center">Dashboard view coming soon</p>
        </div>

        <!-- Refinements Section -->
        <div class="mt-auto">
          <h4 class="font-medium text-gray-800 mb-2">Refinements:</h4>
          <div class="text-sm text-gray-600 space-y-1">
            <p>Audience - Board, Technical, Other types</p>
            <p>Hunter - Thesis - gal, Employee</p>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 bg-white">
        <!-- Empty white space for future dashboard content -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => {
  router.push('/home')
}

const goToWorkbench = () => {
  router.push('/workbench')
}
</script>
