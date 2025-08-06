<template>
  <div class="gap-assessment-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gap Assessment</h1>
        <p class="text-gray-600">Identify and analyze project gaps across all evaluation areas</p>
      </div>

      <!-- Gap Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Gaps</h3>
          <p class="text-3xl font-bold text-orange-600">3</p>
          <p class="text-sm text-gray-600 mt-1">Identified gaps</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Critical Gaps</h3>
          <p class="text-3xl font-bold text-red-600">1</p>
          <p class="text-sm text-gray-600 mt-1">High priority</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Resolution Rate</h3>
          <p class="text-3xl font-bold text-green-600">67%</p>
          <p class="text-sm text-gray-600 mt-1">Gaps addressed</p>
        </div>
      </div>

      <!-- Gap Categories -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Technical Gaps -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Technical Gaps</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="font-medium text-gray-900">Equipment Specifications</h4>
              <p class="text-sm text-gray-600 mt-1">Missing detailed specifications for critical equipment</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Technical</span>
              </div>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h4 class="font-medium text-gray-900">Risk Assessment</h4>
              <p class="text-sm text-gray-600 mt-1">Incomplete risk mitigation strategies</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Technical</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Commercial Gaps -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Commercial Gaps</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-yellow-500 pl-4">
              <h4 class="font-medium text-gray-900">Contract Terms</h4>
              <p class="text-sm text-gray-600 mt-1">Unclear payment terms and milestones</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Commercial</span>
              </div>
            </div>
          </div>
        </div>

        <!-- HSE Gaps -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">HSE Gaps</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-medium text-gray-900">Safety Protocols</h4>
              <p class="text-sm text-gray-600 mt-1">Safety protocols are well documented</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Resolved</span>
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">HSE</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Gaps -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Schedule Gaps</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-medium text-gray-900">Timeline Alignment</h4>
              <p class="text-sm text-gray-600 mt-1">Project timeline is on track</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Resolved</span>
                <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Schedule</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Plan -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recommended Action Plan</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-gray-900">Immediate Actions (Critical)</h4>
              <p class="text-sm text-gray-600 mt-1">Complete equipment specifications documentation within 2 weeks</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-gray-900">Short-term Actions (Medium Priority)</h4>
              <p class="text-sm text-gray-600 mt-1">Clarify contract terms and complete risk assessment by end of month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Assessment
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Create Action Plan
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Track Progress
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.gap-assessment-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style> 