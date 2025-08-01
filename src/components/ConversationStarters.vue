<template>
  <div class="h-full flex flex-col items-center justify-center p-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-800">Choose a Conversation Starter</h2>
    </div>

    <!-- Conversation Starters Grid -->
    <div class="flex justify-center w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        <!-- Card 1: Create a detailed project summary -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-800 mb-2">Create a detailed project summary</h4>
              <p class="text-gray-600 text-sm mb-4">Generate comprehensive project overviews and status reports</p>
            </div>
            <DocumentIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
          </div>
          <button
            @click="$emit('select', 'project-summary')"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>

        <!-- Card 2: Risk Assessment -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-800 mb-2">Risk Assessment</h4>
              <p class="text-gray-600 text-sm mb-4">Identify and analyse potential project risks and mitigation strategies</p>
            </div>
            <ExclamationTriangleIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
          </div>
          <button
            @click="$emit('select', 'risk-assessment')"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>

        <!-- Card 3: Performance Insights -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-800 mb-2">Performance Insights</h4>
              <p class="text-gray-600 text-sm mb-4">Analyse project metrics and generate actionable insights</p>
            </div>
            <ChartBarIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
          </div>
          <button
            @click="$emit('select', 'performance-insights')"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>

        <!-- Card 4: AI Recommendations -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-800 mb-2">AI Recommendations</h4>
              <p class="text-gray-600 text-sm mb-4">Get intelligent suggestions for project optimization</p>
            </div>
            <ChatBubbleLeftRightIcon class="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
          </div>
          <button
            @click="$emit('select', 'ai-recommendations')"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

// Define emits for parent component communication
defineEmits<{
  back: []
  select: [type: string]
}>()
</script>
