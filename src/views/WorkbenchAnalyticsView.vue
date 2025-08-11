<template>
  <div class="workbench-layout">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>Loading Feasibility Study Sections</h3>
        <p>Fetching data from the database...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3>Failed to Load Sections</h3>
        <p>There was an error loading the feasibility study sections from the database.</p>
        <button @click="retryLoad" class="retry-button">Try Again</button>
      </div>
    </div>

    <!-- Sidebar Navigation -->
    <WorkbenchSidebar
      v-model="selectedSections"
      @context-selected="handleContextSelected"
    />

    <!-- Main Content Area - Split between Canvas and Chat -->
    <div class="workbench-main">
      <!-- Chat Section (Left Half) -->
      <div class="chat-section" :style="{ width: chatWidth + '%' }">
        <Conversation :open="true" @close="() => {}" />
      </div>

      <!-- Resizable Divider -->
      <div
        class="resize-handle"
        @mousedown="startResize"
        @touchstart="startResize"
      >
        <div class="resize-icon">⋮</div>
      </div>

      <!-- Canvas Section (Right Half) -->
      <div class="canvas-section" :style="{ width: (100 - chatWidth) + '%' }">
        <div class="canvas-header">
          <h2>Collaborative Canvas</h2>
          <p>Work together with AI to create analysis, reports, and insights</p>
        </div>

        <div class="canvas-content">
          <div class="canvas-placeholder">
            <div class="canvas-icon">📝</div>
            <h3>Start Your Analysis</h3>
            <p>Use the chat on the left to begin creating content together. The AI will help you build reports, analyze data, and generate insights for your mining projects.</p>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFeasibilityStudySectionStore } from '@/stores/entityStore'
import type { FeasibilityStudySectionEntity } from '@/stores/entityStore'
import WorkbenchSidebar from '@/components/WorkbenchSidebar.vue'
import Conversation from '@/components/Conversation.vue'

// Use the store
const sectionStore = useFeasibilityStudySectionStore()

// State
const selectedSections = ref<string[]>([])
const selectedSectionObjects = ref<typeof sectionStore.sections>([])
const chatWidth = ref(50) // Default 50% split
const isResizing = ref(false)
const isLoading = ref(true)
const hasError = ref(false)

// Load all sections on component mount
const loadSections = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    console.log('Loading feasibility study sections for workbench...')
    await sectionStore.fetchSections()
    console.log('Sections loaded successfully:', sectionStore.sections.length)
  } catch (error) {
    console.error('Failed to load sections:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const retryLoad = () => {
  loadSections()
}

const handleContextSelected = (sections: typeof sectionStore.sections) => {
  selectedSectionObjects.value = sections
  console.log('Selected sections for chat context:', sections)
  // Here you would typically send these sections to your chat component
  // or store them in a global state for the chat to access
}

const startResize = (event: MouseEvent | TouchEvent) => {
  isResizing.value = true
  event.preventDefault()

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (isResizing.value) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const containerWidth = window.innerWidth
      const newChatWidth = (clientX / containerWidth) * 100

      // Constrain chat width between 20% and 80%
      chatWidth.value = Math.max(20, Math.min(80, newChatWidth))
    }
  }

  const handleMouseUp = () => {
    isResizing.value = false
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('touchmove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchend', handleMouseUp)
}

// Load sections when component mounts
onMounted(() => {
  loadSections()
})

onUnmounted(() => {
  // Clean up resize event listeners
  document.removeEventListener('mousemove', () => {})
  document.removeEventListener('touchmove', () => {})
  document.removeEventListener('mouseup', () => {})
  document.removeEventListener('touchend', () => {})
})
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
  position: relative;
}

/* Chat Section (Left Half) */
.chat-section {
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0;
  transition: width 0.1s ease;
}

/* Resize Handle */
.resize-handle {
  width: 8px;
  background: #f1f5f9;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.2s ease;
  user-select: none;
  touch-action: none;
}

.resize-handle:hover {
  background: #e2e8f0;
}

.resize-handle:active {
  background: #cbd5e1;
}

.resize-icon {
  font-size: 12px;
  color: #64748b;
  font-weight: bold;
  transform: rotate(90deg);
}

/* Canvas Section (Right Half) */
.canvas-section {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  min-width: 0;
  transition: width 0.1s ease;
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

/* Override Conversation component styles for the split layout */
.chat-section :deep(.conversation-panel) {
  position: relative;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
  border-right: 1px solid #e5e7eb;
}

.chat-section :deep(.conversation-content) {
  height: 100%;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #008C8E;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-content h3 {
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.loading-content p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Overlay */
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

.error-icon {
  font-size: 3rem;
  color: #ef4444; /* Red color for error */
  margin-bottom: 16px;
}

.error-content h3 {
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.error-content p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.retry-button {
  background-color: #008C8E;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #007779;
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

  .chat-section {
    width: 100% !important;
    height: 400px;
  }

  .canvas-section {
    width: 100% !important;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }

  .resize-handle {
    display: none;
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
