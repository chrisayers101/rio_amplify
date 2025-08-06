<template>
  <div class="assign-tasks-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Assign Tasks</h1>
        <p class="text-gray-600">Manage task assignments and team workload</p>
      </div>

      <!-- Task Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Tasks</h3>
          <p class="text-3xl font-bold text-blue-600">24</p>
          <p class="text-sm text-gray-600 mt-1">Active tasks</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Assigned</h3>
          <p class="text-3xl font-bold text-green-600">18</p>
          <p class="text-sm text-gray-600 mt-1">Tasks assigned</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p class="text-3xl font-bold text-purple-600">12</p>
          <p class="text-sm text-gray-600 mt-1">Tasks finished</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Overdue</h3>
          <p class="text-3xl font-bold text-red-600">2</p>
          <p class="text-sm text-gray-600 mt-1">Past due date</p>
        </div>
      </div>

      <!-- Team Members -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Team Members List -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">John Davis</h4>
                  <p class="text-sm text-gray-600">Project Manager</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">5 tasks</p>
                <p class="text-xs text-green-600">Available</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-green-600 font-bold">SM</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Sarah Mitchell</h4>
                  <p class="text-sm text-gray-600">HSE Specialist</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">3 tasks</p>
                <p class="text-xs text-yellow-600">Busy</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-purple-600 font-bold">RK</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Robert Kim</h4>
                  <p class="text-sm text-gray-600">Technical Lead</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">7 tasks</p>
                <p class="text-xs text-red-600">Overloaded</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-orange-600 font-bold">AL</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Anna Lee</h4>
                  <p class="text-sm text-gray-600">Commercial Analyst</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">2 tasks</p>
                <p class="text-xs text-green-600">Available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Assignment -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Task Assignment</h2>

          <!-- Filter Controls -->
          <div class="flex gap-4 mb-6">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Technical</option>
              <option>Commercial</option>
              <option>HSE</option>
              <option>Schedule</option>
            </select>
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Priorities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Unassigned</option>
              <option>Assigned</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <!-- Task List -->
          <div class="space-y-4">
            <!-- Task 1 -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">Equipment Specifications Review</h4>
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">Complete detailed review of equipment specifications for feasibility study</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">Due: Dec 15, 2024</span>
                  <span class="text-sm text-gray-500">Est: 3 days</span>
                </div>
                <div class="flex items-center gap-2">
                  <select class="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option>Unassigned</option>
                    <option>John Davis</option>
                    <option>Sarah Mitchell</option>
                    <option>Robert Kim</option>
                    <option>Anna Lee</option>
                  </select>
                  <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    Assign
                  </button>
                </div>
              </div>
            </div>

            <!-- Task 2 -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">Contract Terms Finalization</h4>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">High</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">Finalize all contract terms and payment milestones</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">Due: Dec 20, 2024</span>
                  <span class="text-sm text-gray-500">Est: 2 days</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-green-600">Assigned to: Anna Lee</span>
                  <button class="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors">
                    Reassign
                  </button>
                </div>
              </div>
            </div>

            <!-- Task 3 -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">HSE Compliance Documentation</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Medium</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">Ensure all HSE compliance documentation is complete</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">Due: Dec 18, 2024</span>
                  <span class="text-sm text-gray-500">Est: 1 day</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-green-600">Assigned to: Sarah Mitchell</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>
                </div>
              </div>
            </div>

            <!-- Task 4 -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">Risk Assessment Update</h4>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">High</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">Update risk assessment with latest project findings</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-sm text-red-500">Due: Dec 12, 2024 (Overdue)</span>
                  <span class="text-sm text-gray-500">Est: 2 days</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-green-600">Assigned to: Robert Kim</span>
                  <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Overdue</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add New Task -->
          <div class="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <button class="w-full text-center text-gray-600 hover:text-gray-800 transition-colors">
              <span class="text-lg">+</span>
              <span class="ml-2">Add New Task</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Workload Summary -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Workload Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center">
            <h4 class="font-medium text-gray-900 mb-2">John Davis</h4>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: 40%"></div>
            </div>
            <p class="text-sm text-gray-600">5/12 tasks (40%)</p>
          </div>
          <div class="text-center">
            <h4 class="font-medium text-gray-900 mb-2">Sarah Mitchell</h4>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div class="bg-yellow-600 h-2 rounded-full" style="width: 60%"></div>
            </div>
            <p class="text-sm text-gray-600">3/5 tasks (60%)</p>
          </div>
          <div class="text-center">
            <h4 class="font-medium text-gray-900 mb-2">Robert Kim</h4>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div class="bg-red-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
            <p class="text-sm text-gray-600">7/8 tasks (85%)</p>
          </div>
          <div class="text-center">
            <h4 class="font-medium text-gray-900 mb-2">Anna Lee</h4>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: 25%"></div>
            </div>
            <p class="text-sm text-gray-600">2/8 tasks (25%)</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Tasks
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Generate Report
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Send Notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.assign-tasks-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
