<template>
  <div class="metrics-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Key Performance Metrics</h1>
        <p class="text-gray-600">Project performance indicators and analytics</p>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Score Metric -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Overall Score</p>
              <p class="text-3xl font-bold text-green-600">30</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>

        <!-- Completion Metric -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completion</p>
              <p class="text-3xl font-bold text-blue-600">85%</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-bold">85</span>
            </div>
          </div>
        </div>

        <!-- Issues Metric -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Issues</p>
              <p class="text-3xl font-bold text-orange-600">1</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-orange-600 font-bold">!</span>
            </div>
          </div>
        </div>

        <!-- Observations Metric -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Observations</p>
              <p class="text-3xl font-bold text-purple-600">1</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span class="text-purple-600 font-bold">👁</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Technical Metrics -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Technical Metrics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Technical Score:</span>
              <span class="font-medium text-green-600">8.5/10</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Risk Assessment:</span>
              <span class="font-medium text-yellow-600">Medium</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Compliance:</span>
              <span class="font-medium text-green-600">95%</span>
            </div>
          </div>
        </div>

        <!-- Commercial Metrics -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Commercial Metrics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Cost Score:</span>
              <span class="font-medium text-green-600">7.8/10</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">ROI Estimate:</span>
              <span class="font-medium text-green-600">15.2%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Budget Variance:</span>
              <span class="font-medium text-green-600">+2.3%</span>
            </div>
          </div>
        </div>

        <!-- HSE Metrics -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">HSE Metrics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Safety Score:</span>
              <span class="font-medium text-green-600">9.1/10</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Environmental Impact:</span>
              <span class="font-medium text-green-600">Low</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Compliance Rate:</span>
              <span class="font-medium text-green-600">98%</span>
            </div>
          </div>
        </div>

        <!-- Schedule Metrics -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Schedule Metrics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">On Schedule:</span>
              <span class="font-medium text-green-600">Yes</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Critical Path:</span>
              <span class="font-medium text-green-600">On Track</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Milestone Completion:</span>
              <span class="font-medium text-green-600">100%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Metrics
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Generate Report
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          View Trends
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.metrics-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style> 