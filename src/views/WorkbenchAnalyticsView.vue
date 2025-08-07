<template>
  <div class="workbench-layout">
    <!-- Sidebar Navigation -->
    <WorkbenchSidebar
      v-model="selectedSections"
      @context-selected="handleContextSelected"
    />

    <!-- Main Content Area - Split between Canvas and Chat -->
    <div class="workbench-main">
      <!-- Canvas Section (Left Half) -->
      <div class="canvas-section">
        <div class="canvas-header">
          <h2>Collaborative Canvas</h2>
          <p>Work together with AI to create analysis, reports, and insights</p>
        </div>

        <div class="canvas-content">
          <div class="canvas-placeholder">
            <div class="canvas-icon">📝</div>
            <h3>Start Your Analysis</h3>
            <p>Use the chat on the right to begin creating content together. The AI will help you build reports, analyze data, and generate insights for your mining projects.</p>

            <div class="canvas-features">
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Data Analysis</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📄</span>
                <span>Report Generation</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Insights & Recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Section (Right Half) -->
      <div class="chat-section">
        <Conversation :open="true" @close="() => {}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WorkbenchSidebar from '@/components/WorkbenchSidebar.vue'
import Conversation from '@/components/Conversation.vue'

interface Section {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  issues: Array<{
    id: string
    description: string
    status: string
    source: string
  }>
  observations: Array<{
    id: string
    text: string
    source: string
    changeOccurred: boolean
  }>
}

const selectedSections = ref<string[]>([])
const selectedSectionObjects = ref<Section[]>([])

const handleContextSelected = (sections: Section[]) => {
  selectedSectionObjects.value = sections
  console.log('Selected sections for chat context:', sections)
  // Here you would typically send these sections to your chat component
  // or store them in a global state for the chat to access
}
</script>

<style scoped>
.workbench-layout {
  display: flex;
  height: calc(100vh - 64px);
  background: #f8fafc;
}

/* Main Content Styles */
.workbench-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Canvas Section (Left Half) */
.canvas-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
}

.canvas-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.canvas-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.canvas-header p {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.canvas-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.canvas-placeholder {
  background: white;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  transition: all 0.3s ease;
}

.canvas-placeholder:hover {
  border-color: #008C8E;
  background: #f0f9fa;
}

.canvas-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.canvas-placeholder h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.canvas-placeholder p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 32px 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.canvas-features {
  display: grid;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.feature-item:hover {
  background: #f0f9fa;
  border-color: #008C8E;
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-item span:last-child {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
}

/* Chat Section (Right Half) */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

/* Override Conversation component styles for the split layout */
.chat-section :deep(.conversation-panel) {
  position: relative;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
  border-left: 1px solid #e5e7eb;
}

.chat-section :deep(.conversation-content) {
  height: 100%;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .workbench-layout {
    flex-direction: column;
    height: auto;
  }

  .workbench-main {
    flex-direction: column;
  }

  .canvas-section {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .canvas-content {
    padding: 16px;
  }

  .canvas-placeholder {
    padding: 24px;
  }

  .canvas-header {
    padding: 16px 20px;
  }
}
</style>
