<template>
  <div class="talk-to-vsme-view">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Talk to a VSME</h1>
        <p class="text-gray-600">Connect with Value Stream Mapping Expert for project guidance</p>
      </div>

      <!-- VSME Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Available VSMEs</h3>
          <p class="text-3xl font-bold text-green-600">5</p>
          <p class="text-sm text-gray-600 mt-1">Online experts</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
          <p class="text-3xl font-bold text-blue-600">< 2 hours</p>
          <p class="text-sm text-gray-600 mt-1">Average response</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Expertise Areas</h3>
          <p class="text-3xl font-bold text-purple-600">12</p>
          <p class="text-sm text-gray-600 mt-1">Specialized domains</p>
        </div>
      </div>

      <!-- VSME Directory -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Available VSMEs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- VSME 1 -->
          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 font-bold text-lg">JD</span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">John Davis</h4>
                <p class="text-sm text-gray-600">Senior VSME</p>
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-600">Online</span>
              </div>
              <p class="text-sm text-gray-600">Technical & Commercial expertise</p>
            </div>
            <div class="flex gap-2">
              <button class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
              <button class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                Schedule
              </button>
            </div>
          </div>

          <!-- VSME 2 -->
          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-green-600 font-bold text-lg">SM</span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Sarah Mitchell</h4>
                <p class="text-sm text-gray-600">HSE Specialist</p>
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-600">Online</span>
              </div>
              <p class="text-sm text-gray-600">HSE & Risk Management</p>
            </div>
            <div class="flex gap-2">
              <button class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
              <button class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                Schedule
              </button>
            </div>
          </div>

          <!-- VSME 3 -->
          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-purple-600 font-bold text-lg">RK</span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Robert Kim</h4>
                <p class="text-sm text-gray-600">Technical Lead</p>
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <span class="text-sm text-gray-600">Busy</span>
              </div>
              <p class="text-sm text-gray-600">Technical & Engineering</p>
            </div>
            <div class="flex gap-2">
              <button class="flex-1 bg-gray-300 text-gray-600 px-3 py-2 rounded text-sm cursor-not-allowed">
                Start Chat
              </button>
              <button class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Interface -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chat Window -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-medium text-gray-900">Chat with John Davis</h3>
            <p class="text-sm text-gray-600">VSME - Technical & Commercial</p>
          </div>
          <div class="h-96 overflow-y-auto p-4 space-y-4">
            <!-- Message from VSME -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-sm font-bold">JD</span>
              </div>
              <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p class="text-sm text-gray-900">Hello! I'm John, your VSME for this project. How can I help you today?</p>
                <p class="text-xs text-gray-500 mt-1">2:30 PM</p>
              </div>
            </div>

            <!-- Message from User -->
            <div class="flex items-start gap-3 justify-end">
              <div class="bg-blue-600 rounded-lg p-3 max-w-xs">
                <p class="text-sm text-white">Hi John, I have questions about the technical specifications for our feasibility study.</p>
                <p class="text-xs text-blue-100 mt-1">2:32 PM</p>
              </div>
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm font-bold">You</span>
              </div>
            </div>

            <!-- Message from VSME -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-sm font-bold">JD</span>
              </div>
              <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p class="text-sm text-gray-900">I'd be happy to help! I can see from your project that you're working on equipment specifications. What specific aspects would you like to discuss?</p>
                <p class="text-xs text-gray-500 mt-1">2:33 PM</p>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-200">
            <div class="flex gap-2">
              <input type="text" placeholder="Type your message..." class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 class="font-medium text-gray-900">Request Technical Review</h4>
              <p class="text-sm text-gray-600">Get expert review of technical specifications</p>
            </button>
            <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 class="font-medium text-gray-900">Schedule Consultation</h4>
              <p class="text-sm text-gray-600">Book a detailed project consultation</p>
            </button>
            <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 class="font-medium text-gray-900">Request Documentation</h4>
              <p class="text-sm text-gray-600">Get templates and best practices</p>
            </button>
            <button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 class="font-medium text-gray-900">Risk Assessment</h4>
              <p class="text-sm text-gray-600">Discuss project risks and mitigation</p>
            </button>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="font-medium text-gray-900 mb-3">Recent Topics</h4>
            <div class="space-y-2">
              <div class="text-sm text-gray-600">• Equipment specifications</div>
              <div class="text-sm text-gray-600">• Risk assessment methodology</div>
              <div class="text-sm text-gray-600">• Commercial evaluation criteria</div>
              <div class="text-sm text-gray-600">• HSE compliance requirements</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Chat
        </button>
        <button class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Schedule Follow-up
        </button>
        <button class="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Rate Session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.talk-to-vsme-view {
  min-height: calc(100vh - 64px);
  background-color: #f8fafc;
}
</style>
