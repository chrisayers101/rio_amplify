<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content Area -->
    <div class="flex h-screen">
      <!-- Left Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 p-6">
        <!-- Navigation Buttons -->
        <div class="mb-6">
          <div class="flex items-center space-x-1 mb-4">
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
        </div>

        <!-- Dashboard Content -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-1">Dashboard</h3>
          <p class="text-sm text-gray-600 mb-4">Overview and analytics</p>
        </div>

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
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const goToWorkbench = () => {
  router.push('/workbench')
}
</script>
