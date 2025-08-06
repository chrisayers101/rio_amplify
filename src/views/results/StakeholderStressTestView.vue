<template>
  <div class="stakeholder-stress-test-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Stakeholder Stress Test</h1>
        <p class="text-gray-600">Analyze project resilience under stakeholder pressure scenarios</p>
      </div>

      <!-- Stress Test Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Test Scenarios</h3>
          <p class="text-3xl font-bold text-blue-600">8</p>
          <p class="text-sm text-gray-600 mt-1">Total scenarios</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Passed</h3>
          <p class="text-3xl font-bold text-green-600">6</p>
          <p class="text-sm text-gray-600 mt-1">Successful tests</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed</h3>
          <p class="text-3xl font-bold text-red-600">2</p>
          <p class="text-sm text-gray-600 mt-1">Failed tests</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Risk Score</h3>
          <p class="text-3xl font-bold text-yellow-600">Medium</p>
          <p class="text-sm text-gray-600 mt-1">Overall risk level</p>
        </div>
      </div>

      <!-- Stress Test Scenarios -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Technical Stress Tests -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Technical Stress Tests</h2>
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Equipment Failure Scenario</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Critical equipment failure during operation</p>
              <div class="text-xs text-gray-500">Impact: Low | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Technical Specification Changes</h4>
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Major specification changes mid-project</p>
              <div class="text-xs text-gray-500">Impact: High | Mitigation: Weak</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Resource Shortage</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Key resource unavailability</p>
              <div class="text-xs text-gray-500">Impact: Medium | Mitigation: Strong</div>
            </div>
          </div>
        </div>

        <!-- Commercial Stress Tests -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Commercial Stress Tests</h2>
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Budget Cuts</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">20% budget reduction scenario</p>
              <div class="text-xs text-gray-500">Impact: Medium | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Contract Disputes</h4>
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Major contract disagreement</p>
              <div class="text-xs text-gray-500">Impact: High | Mitigation: Weak</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Market Changes</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Significant market volatility</p>
              <div class="text-xs text-gray-500">Impact: Low | Mitigation: Strong</div>
            </div>
          </div>
        </div>

        <!-- HSE Stress Tests -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">HSE Stress Tests</h2>
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Safety Incident</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Major safety incident scenario</p>
              <div class="text-xs text-gray-500">Impact: Medium | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Regulatory Changes</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">New regulatory requirements</p>
              <div class="text-xs text-gray-500">Impact: Low | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Environmental Impact</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Environmental compliance issues</p>
              <div class="text-xs text-gray-500">Impact: Low | Mitigation: Strong</div>
            </div>
          </div>
        </div>

        <!-- Schedule Stress Tests -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Schedule Stress Tests</h2>
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Timeline Compression</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">30% schedule compression</p>
              <div class="text-xs text-gray-500">Impact: Medium | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Resource Delays</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Key resource delivery delays</p>
              <div class="text-xs text-gray-500">Impact: Low | Mitigation: Strong</div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Scope Changes</h4>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">Major scope modifications</p>
              <div class="text-xs text-gray-500">Impact: Medium | Mitigation: Strong</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Failed Tests Analysis -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Failed Stress Tests - Analysis</h2>
        <div class="space-y-6">
          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-medium text-gray-900">Technical Specification Changes</h4>
            <p class="text-sm text-gray-600 mt-1">Project shows high vulnerability to major specification changes</p>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Impact Analysis:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• 40% cost increase potential</li>
                <li>• 6-month schedule delay</li>
                <li>• Resource reallocation required</li>
              </ul>
            </div>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Mitigation Strategies:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Establish change control procedures</li>
                <li>• Implement flexible design approach</li>
                <li>• Build contingency into timeline</li>
              </ul>
            </div>
          </div>

          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-medium text-gray-900">Contract Disputes</h4>
            <p class="text-sm text-gray-600 mt-1">Project vulnerable to commercial disagreements</p>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Impact Analysis:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Project suspension risk</li>
                <li>• Legal costs escalation</li>
                <li>• Stakeholder confidence loss</li>
              </ul>
            </div>
            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-900">Mitigation Strategies:</h5>
              <ul class="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Clear contract terms definition</li>
                <li>• Regular stakeholder communication</li>
                <li>• Dispute resolution procedures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Mitigation Plan -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Risk Mitigation Plan</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Immediate Actions (Next 2 weeks)</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 class="font-medium text-gray-900">Establish Change Control</h4>
                  <p class="text-sm text-gray-600">Implement formal change control procedures</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 class="font-medium text-gray-900">Contract Review</h4>
                  <p class="text-sm text-gray-600">Review and clarify all contract terms</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-3">Medium-term Actions (Next month)</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 class="font-medium text-gray-900">Flexible Design</h4>
                  <p class="text-sm text-gray-600">Implement modular design approach</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 class="font-medium text-gray-900">Stakeholder Communication</h4>
                  <p class="text-sm text-gray-600">Establish regular communication protocols</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Analysis
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Generate Mitigation Plan
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
.stakeholder-stress-test-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
