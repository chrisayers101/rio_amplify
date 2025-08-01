<template>
  <div class="navigation-aware-layout">
    <div class="flex-1 flex flex-col">
      <div class="flex-1 p-4">
        <h1 class="text-2xl font-bold text-theme-primary mb-4">Project Intelligence Workbench</h1>
        <p class="text-theme-secondary mb-6">
          AI-powered project management and analysis
        </p>

        <!-- Welcome Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">Start a Conversation with AI</h2>
          <p class="text-theme-secondary mb-4">
            Select projects and managers from the sidebar, then choose a conversation starter to begin your AI-powered analysis.
          </p>

          <button class="btn-primary">
            <span>Choose Conversation Starter</span>
          </button>
        </div>

        <!-- Conversation Starters -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Project Summary</h3>
              <DocumentIcon class="card-icon text-theme-red" />
            </div>
            <p class="text-theme-secondary text-sm mb-3">Get a comprehensive overview of selected projects</p>
            <button class="btn-primary text-sm py-1 px-3">Start Conversation</button>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Risk Analysis</h3>
              <ExclamationTriangleIcon class="card-icon text-theme-red" />
            </div>
            <p class="text-theme-secondary text-sm mb-3">Identify potential risks and mitigation strategies</p>
            <button class="btn-primary text-sm py-1 px-3">Start Conversation</button>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Performance Metrics</h3>
              <ChartBarIcon class="card-icon text-theme-red" />
            </div>
            <p class="text-theme-secondary text-sm mb-3">Analyze key performance indicators and trends</p>
            <button class="btn-primary text-sm py-1 px-3">Start Conversation</button>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Team Insights</h3>
              <ChatBubbleLeftRightIcon class="card-icon text-theme-red" />
            </div>
            <p class="text-theme-secondary text-sm mb-3">Get insights about team dynamics and collaboration</p>
            <button class="btn-primary text-sm py-1 px-3">Start Conversation</button>
          </div>
        </div>

        <!-- How it works -->
        <div class="card">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">How it works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="w-12 h-12 bg-theme-red rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-theme-white font-bold">1</span>
              </div>
              <h3 class="text-theme-primary font-medium mb-2">Select Projects</h3>
              <p class="text-theme-secondary text-sm">Choose the projects you want to analyze from the sidebar</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-theme-red rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-theme-white font-bold">2</span>
              </div>
              <h3 class="text-theme-primary font-medium mb-2">Choose Starter</h3>
              <p class="text-theme-secondary text-sm">Pick a conversation starter that matches your analysis needs</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-theme-red rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-theme-white font-bold">3</span>
              </div>
              <h3 class="text-theme-primary font-medium mb-2">Get Insights</h3>
              <p class="text-theme-secondary text-sm">Receive AI-powered insights and recommendations</p>
            </div>
          </div>
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
} from '@heroicons/vue/24/outline';
</script>
