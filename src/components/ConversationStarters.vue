<template>
  <div class="h-full p-8">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('back')"
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          <span>Back</span>
        </button>
        <div class="w-px h-6 bg-gray-300"></div>
        <h2 class="text-2xl font-bold text-gray-800">Choose a Conversation Starter</h2>
      </div>
    </div>

    <!-- Conversation Starters Grid -->
    <div class="flex justify-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
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
              <p class="text-gray-600 text-sm mb-4">Identify and analyze potential project risks and mitigation strategies</p>
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
              <p class="text-gray-600 text-sm mb-4">Analyze project metrics and generate actionable insights</p>
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
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// Define emits for parent component communication
defineEmits<{
  back: []
  select: [type: string]
}>()
</script> 