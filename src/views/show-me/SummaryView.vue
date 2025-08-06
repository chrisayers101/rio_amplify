<template>
  <div class="summary-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Project Summary</h1>
        <p class="text-gray-600">Product Group → Project → Report Type</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Project Overview Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Project Overview</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Project Name:</span>
              <span class="font-medium">Feasibility Study F</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Mostly Complete</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Completion:</span>
              <span class="font-medium">85%</span>
            </div>
          </div>
        </div>

        <!-- Key Metrics Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Issues:</span>
              <span class="font-medium text-orange-600">1</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Observations:</span>
              <span class="font-medium text-blue-600">1</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Score:</span>
              <span class="font-medium text-green-600">30</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Summary and Recommendations</h2>
        <div class="prose max-w-none">
          <p class="text-gray-700 mb-4">
            This feasibility study demonstrates strong potential for project success with comprehensive
            evaluation across technical, commercial, and HSE dimensions.
          </p>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 class="font-semibold text-blue-900 mb-2">Key Recommendations:</h3>
            <ul class="list-disc list-inside space-y-1 text-blue-800">
              <li>Proceed with detailed engineering design phase</li>
              <li>Address identified HSE compliance gaps</li>
              <li>Establish stakeholder communication plan</li>
              <li>Develop risk mitigation strategies</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Report
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Share Summary
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.summary-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
