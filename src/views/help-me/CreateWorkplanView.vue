<template>
  <div class="create-workplan-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Workplan</h1>
        <p class="text-gray-600">Generate comprehensive workplan based on project assessment</p>
      </div>

      <!-- Workplan Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Tasks</h3>
          <p class="text-3xl font-bold text-blue-600">24</p>
          <p class="text-sm text-gray-600 mt-1">Identified tasks</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Duration</h3>
          <p class="text-3xl font-bold text-green-600">12 weeks</p>
          <p class="text-sm text-gray-600 mt-1">Estimated timeline</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Resources</h3>
          <p class="text-3xl font-bold text-purple-600">8</p>
          <p class="text-sm text-gray-600 mt-1">Team members</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Budget</h3>
          <p class="text-3xl font-bold text-orange-600">$2.4M</p>
          <p class="text-sm text-gray-600 mt-1">Estimated cost</p>
        </div>
      </div>

      <!-- Workplan Phases -->
      <div class="space-y-6">
        <!-- Phase 1: Planning -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Phase 1: Planning & Setup</h2>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">3 weeks</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Project Kickoff</h4>
                <p class="text-sm text-gray-600">Establish project team and objectives</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Week 1</span>
                <span class="text-sm text-gray-500">2 days</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Stakeholder Analysis</h4>
                <p class="text-sm text-gray-600">Identify and engage key stakeholders</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Week 2</span>
                <span class="text-sm text-gray-500">3 days</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Risk Assessment</h4>
                <p class="text-sm text-gray-600">Complete comprehensive risk analysis</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Week 3</span>
                <span class="text-sm text-gray-500">4 days</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase 2: Technical Development -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Phase 2: Technical Development</h2>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">5 weeks</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Equipment Specifications</h4>
                <p class="text-sm text-gray-600">Finalize detailed equipment specifications</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>
                <span class="text-sm text-gray-500">2 weeks</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Technical Design</h4>
                <p class="text-sm text-gray-600">Complete technical design documentation</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                <span class="text-sm text-gray-500">3 weeks</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase 3: Commercial & HSE -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Phase 3: Commercial & HSE</h2>
            <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">3 weeks</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Contract Finalization</h4>
                <p class="text-sm text-gray-600">Finalize all contract terms and conditions</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                <span class="text-sm text-gray-500">2 weeks</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">HSE Compliance</h4>
                <p class="text-sm text-gray-600">Ensure full HSE compliance and documentation</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                <span class="text-sm text-gray-500">1 week</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase 4: Implementation -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Phase 4: Implementation & Review</h2>
            <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">1 week</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Final Review</h4>
                <p class="text-sm text-gray-600">Complete project review and stakeholder approval</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                <span class="text-sm text-gray-500">3 days</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Project Handover</h4>
                <p class="text-sm text-gray-600">Handover to implementation team</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                <span class="text-sm text-gray-500">2 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resource Allocation -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Resource Allocation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Team Members</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Project Manager</span>
                <span class="text-sm font-medium">Full-time</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Technical Lead</span>
                <span class="text-sm font-medium">Full-time</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Commercial Analyst</span>
                <span class="text-sm font-medium">Part-time</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">HSE Specialist</span>
                <span class="text-sm font-medium">Part-time</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Budget Breakdown</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Personnel</span>
                <span class="text-sm font-medium">$1.2M (50%)</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Equipment</span>
                <span class="text-sm font-medium">$600K (25%)</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Materials</span>
                <span class="text-sm font-medium">$360K (15%)</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Contingency</span>
                <span class="text-sm font-medium">$240K (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Workplan
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Share with Team
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Create Tasks
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.create-workplan-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style> 