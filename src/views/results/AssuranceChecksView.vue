<template>
  <div class="assurance-checks-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Assurance Checks</h1>
        <p class="text-gray-600">Quality assurance verification and compliance validation</p>
      </div>

      <!-- Assurance Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Checks</h3>
          <p class="text-3xl font-bold text-blue-600">24</p>
          <p class="text-sm text-gray-600 mt-1">Quality checks</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Passed</h3>
          <p class="text-3xl font-bold text-green-600">20</p>
          <p class="text-sm text-gray-600 mt-1">Successful checks</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed</h3>
          <p class="text-3xl font-bold text-red-600">2</p>
          <p class="text-sm text-gray-600 mt-1">Failed checks</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p class="text-3xl font-bold text-yellow-600">2</p>
          <p class="text-sm text-gray-600 mt-1">Awaiting review</p>
        </div>
      </div>

      <!-- Assurance Categories -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Technical Assurance -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Technical Assurance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Equipment Specifications</h4>
                <p class="text-sm text-gray-600">Technical specifications validation</p>
              </div>
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Design Compliance</h4>
                <p class="text-sm text-gray-600">Design standards verification</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Risk Assessment</h4>
                <p class="text-sm text-gray-600">Risk analysis completeness</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Technical Documentation</h4>
                <p class="text-sm text-gray-600">Documentation completeness</p>
              </div>
              <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
            </div>
          </div>
        </div>

        <!-- Commercial Assurance -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Commercial Assurance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Cost Analysis</h4>
                <p class="text-sm text-gray-600">Cost estimation accuracy</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Contract Terms</h4>
                <p class="text-sm text-gray-600">Contract compliance verification</p>
              </div>
              <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">ROI Calculation</h4>
                <p class="text-sm text-gray-600">Return on investment analysis</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Budget Validation</h4>
                <p class="text-sm text-gray-600">Budget accuracy verification</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
          </div>
        </div>

        <!-- HSE Assurance -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">HSE Assurance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Safety Protocols</h4>
                <p class="text-sm text-gray-600">Safety compliance verification</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Environmental Impact</h4>
                <p class="text-sm text-gray-600">Environmental assessment</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Regulatory Compliance</h4>
                <p class="text-sm text-gray-600">Regulatory requirements check</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">HSE Documentation</h4>
                <p class="text-sm text-gray-600">Documentation completeness</p>
              </div>
              <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
            </div>
          </div>
        </div>

        <!-- Schedule Assurance -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Schedule Assurance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Timeline Validation</h4>
                <p class="text-sm text-gray-600">Schedule feasibility check</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Milestone Tracking</h4>
                <p class="text-sm text-gray-600">Milestone achievement verification</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Resource Allocation</h4>
                <p class="text-sm text-gray-600">Resource planning validation</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Critical Path</h4>
                <p class="text-sm text-gray-600">Critical path analysis</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Failed Checks Details -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Failed Checks - Action Required</h2>
        <div class="space-y-4">
          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-medium text-gray-900">Equipment Specifications</h4>
            <p class="text-sm text-gray-600 mt-1">Missing detailed specifications for critical equipment components</p>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Required Actions:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Complete equipment specifications documentation</li>
                <li>• Include technical parameters and performance criteria</li>
                <li>• Add supplier qualification requirements</li>
              </ul>
            </div>
            <div class="mt-3 flex gap-2">
              <button class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Mark as Critical
              </button>
              <button class="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                Assign Owner
              </button>
            </div>
          </div>

          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-medium text-gray-900">Contract Terms</h4>
            <p class="text-sm text-gray-600 mt-1">Unclear payment terms and milestone definitions</p>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Required Actions:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Define clear payment milestones</li>
                <li>• Specify payment terms and conditions</li>
                <li>• Include penalty clauses and incentives</li>
              </ul>
            </div>
            <div class="mt-3 flex gap-2">
              <button class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Mark as Critical
              </button>
              <button class="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                Assign Owner
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Assurance Summary -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Assurance Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Overall Compliance</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Technical Compliance:</span>
                <span class="text-sm font-medium text-green-600">75%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Commercial Compliance:</span>
                <span class="text-sm font-medium text-yellow-600">75%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">HSE Compliance:</span>
                <span class="text-sm font-medium text-green-600">100%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Schedule Compliance:</span>
                <span class="text-sm font-medium text-green-600">100%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Recommendations</h3>
            <div class="space-y-2">
              <div class="p-3 bg-yellow-50 rounded-lg">
                <h4 class="font-medium text-yellow-900">Immediate Actions Required</h4>
                <p class="text-sm text-yellow-700 mt-1">Address 2 failed checks before proceeding</p>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900">Review Pending Items</h4>
                <p class="text-sm text-blue-700 mt-1">Complete 2 pending assurance checks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Report
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Generate Action Plan
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Schedule Review
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.assurance-checks-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
