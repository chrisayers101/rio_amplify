<template>
  <div class="compare-projects-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Project Comparison</h1>
        <p class="text-gray-600">Compare multiple projects across key evaluation criteria</p>
      </div>

      <!-- Project Selection -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Select Projects to Compare</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3">
            <input type="checkbox" id="project-a" class="rounded" checked>
            <label for="project-a" class="text-sm font-medium text-gray-900">Feasibility Study F</label>
          </div>
          <div class="flex items-center space-x-3">
            <input type="checkbox" id="project-b" class="rounded">
            <label for="project-b" class="text-sm font-medium text-gray-900">Project Alpha</label>
          </div>
          <div class="flex items-center space-x-3">
            <input type="checkbox" id="project-c" class="rounded">
            <label for="project-c" class="text-sm font-medium text-gray-900">Project Beta</label>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Comparison Results</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feasibility Study F</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Alpha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Beta</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Overall Score</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">30</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">25</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">18</span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Score</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.5/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7.2/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">6.8/10</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Commercial Score</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7.8/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.1/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">6.5/10</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">HSE Score</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">9.1/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.7/10</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7.9/10</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Completion %</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">85%</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">72%</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">65%</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Level</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Key Insights -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 class="font-medium text-gray-900">Feasibility Study F leads in overall performance</h4>
                <p class="text-sm text-gray-600 mt-1">Strong technical and HSE scores with moderate commercial performance</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 class="font-medium text-gray-900">Project Alpha shows commercial strength</h4>
                <p class="text-sm text-gray-600 mt-1">Highest commercial score but needs technical improvements</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 class="font-medium text-gray-900">Project Beta requires attention</h4>
                <p class="text-sm text-gray-600 mt-1">Lowest scores across all categories, high risk level</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div class="space-y-4">
            <div class="p-4 bg-green-50 rounded-lg">
              <h4 class="font-medium text-green-900">Proceed with Feasibility Study F</h4>
              <p class="text-sm text-green-700 mt-1">Strong overall performance with manageable risks</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <h4 class="font-medium text-yellow-900">Review Project Alpha</h4>
              <p class="text-sm text-yellow-700 mt-1">Address technical gaps before proceeding</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <h4 class="font-medium text-red-900">Reconsider Project Beta</h4>
              <p class="text-sm text-red-700 mt-1">Significant improvements needed across all areas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Comparison
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Generate Report
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Share Results
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.compare-projects-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style> 