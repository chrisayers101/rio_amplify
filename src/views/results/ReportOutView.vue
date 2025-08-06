<template>
  <div class="report-out-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Report Out</h1>
        <p class="text-gray-600">Final reporting and delivery management</p>
      </div>

      <!-- Report Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Reports</h3>
          <p class="text-3xl font-bold text-blue-600">6</p>
          <p class="text-sm text-gray-600 mt-1">Generated reports</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Delivered</h3>
          <p class="text-3xl font-bold text-green-600">4</p>
          <p class="text-sm text-gray-600 mt-1">Reports delivered</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p class="text-3xl font-bold text-yellow-600">2</p>
          <p class="text-sm text-gray-600 mt-1">Awaiting delivery</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Approval Rate</h3>
          <p class="text-3xl font-bold text-purple-600">100%</p>
          <p class="text-sm text-gray-600 mt-1">Stakeholder approval</p>
        </div>
      </div>

      <!-- Report Types -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Executive Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Feasibility Study Report</h4>
                <p class="text-sm text-gray-600">Executive summary for stakeholders</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 10, 2024</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Project Recommendations</h4>
                <p class="text-sm text-gray-600">Key recommendations summary</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 12, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Reports -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Technical Reports</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Technical Assessment</h4>
                <p class="text-sm text-gray-600">Detailed technical evaluation</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 8, 2024</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Risk Assessment</h4>
                <p class="text-sm text-gray-600">Comprehensive risk analysis</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                <p class="text-xs text-gray-500 mt-1">Due: Dec 15, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Commercial Reports -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Commercial Reports</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Cost Analysis</h4>
                <p class="text-sm text-gray-600">Detailed cost breakdown</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 9, 2024</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">ROI Analysis</h4>
                <p class="text-sm text-gray-600">Return on investment study</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                <p class="text-xs text-gray-500 mt-1">Due: Dec 16, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <!-- HSE Reports -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">HSE Reports</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Safety Assessment</h4>
                <p class="text-sm text-gray-600">Safety compliance report</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 7, 2024</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Environmental Impact</h4>
                <p class="text-sm text-gray-600">Environmental assessment</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                <p class="text-xs text-gray-500 mt-1">Dec 6, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Status -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Delivery Status</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 class="font-medium text-gray-900">Executive Summary</h4>
                <p class="text-sm text-gray-600">Delivered to senior management</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Dec 10, 2024</p>
              <p class="text-xs text-green-600">Approved</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 class="font-medium text-gray-900">Technical Assessment</h4>
                <p class="text-sm text-gray-600">Delivered to technical team</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Dec 8, 2024</p>
              <p class="text-xs text-green-600">Approved</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h4 class="font-medium text-gray-900">Risk Assessment</h4>
                <p class="text-sm text-gray-600">Under review by risk team</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Due: Dec 15, 2024</p>
              <p class="text-xs text-yellow-600">In Progress</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h4 class="font-medium text-gray-900">ROI Analysis</h4>
                <p class="text-sm text-gray-600">Awaiting final calculations</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Due: Dec 16, 2024</p>
              <p class="text-xs text-yellow-600">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stakeholder Feedback -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Stakeholder Feedback</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Positive Feedback</h3>
            <div class="space-y-3">
              <div class="p-3 bg-green-50 rounded-lg">
                <p class="text-sm text-green-800">"Excellent technical analysis and clear recommendations"</p>
                <p class="text-xs text-green-600 mt-1">- Technical Director</p>
              </div>
              <div class="p-3 bg-green-50 rounded-lg">
                <p class="text-sm text-green-800">"Comprehensive cost analysis with realistic projections"</p>
                <p class="text-xs text-green-600 mt-1">- Finance Manager</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Areas for Improvement</h3>
            <div class="space-y-3">
              <div class="p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-yellow-800">"Need more detail on risk mitigation strategies"</p>
                <p class="text-xs text-yellow-600 mt-1">- Risk Manager</p>
              </div>
              <div class="p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-yellow-800">"ROI calculations could be more conservative"</p>
                <p class="text-xs text-yellow-600 mt-1">- CFO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Final Recommendations -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Final Recommendations</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-gray-900">Proceed with Project</h4>
              <p class="text-sm text-gray-600 mt-1">Strong technical and commercial foundation with manageable risks</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-gray-900">Address Risk Mitigation</h4>
              <p class="text-sm text-gray-600 mt-1">Implement additional risk mitigation strategies before full implementation</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 class="font-medium text-gray-900">Stakeholder Communication</h4>
              <p class="text-sm text-gray-600 mt-1">Maintain regular communication with all stakeholders throughout implementation</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export All Reports
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Schedule Presentation
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Share with Stakeholders
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.report-out-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
