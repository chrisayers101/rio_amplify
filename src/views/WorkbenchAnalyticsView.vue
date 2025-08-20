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
      @sections-selected="handleSectionsSelected"
      @summary-item-selected="handleSummaryItemSelected"
    />

    <!-- Main Content Area - Split between Canvas and Chat -->
    <div class="workbench-main">
      <!-- Chat Section (Left Half) -->
      <div class="chat-section" :style="{ width: chatWidth + '%' }">
        <Conversation :open="true" :embedded="true" @close="() => {}" />

      </div>

      <!-- Resizable Divider -->
      <div
        class="resize-handle"
        @mousedown="startResize"
        @touchstart="startResize"
      >
        <div class="resize-icon"></div>
      </div>

      <!-- Canvas Section (Right Half) -->
      <div v-if="selectedSummaryItem" class="summary-content">
        <ProjectSummary v-if="selectedSummaryItem === 'summary'" />
        <ProjectRisks v-if="selectedSummaryItem === 'risks'" />
        <ProjectIssues v-if="selectedSummaryItem === 'issues'" />
      </div>
      <WorkbenchCanvas
        v-else
        :selected-section-objects="selectedSectionObjects"
        :chat-width="chatWidth"
        @update:selected-section-objects="handleCanvasUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useFeasibilityStudySectionStore } from '@/stores/entityStore'
import type { ParsedFeasibilityStudySection } from '../../shared'
import WorkbenchSidebar from '@/components/WorkbenchSidebar.vue'
import WorkbenchCanvas from '@/components/WorkbenchCanvas.vue'
import Conversation from '@/components/Conversation.vue'
import ProjectSummary from '@/components/ProjectSummary.vue'
import ProjectRisks from '@/components/ProjectRisks.vue'
import ProjectIssues from '@/components/ProjectIssues.vue'
import { useSidebarStore } from '@/stores/sidebarStore'

// Canvas update handler
const handleCanvasUpdate = (updatedSections: readonly ParsedFeasibilityStudySection[]) => {
  selectedSectionObjects.value = updatedSections
}

// Use the store
const sectionStore = useFeasibilityStudySectionStore()
const sidebarStore = useSidebarStore()

// State
const selectedSections = ref<string[]>([])
const selectedSectionObjects = ref<readonly ParsedFeasibilityStudySection[]>([])
const selectedSummaryItem = ref<string>('')
const chatWidth = ref(50) // Default 50% split
const isResizing = ref(false)
const isLoading = ref(true)
const hasError = ref(false)

// Load all sections on component mount
const loadSections = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    await sectionStore.fetchSections()
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

const handleContextSelected = (sections: readonly ParsedFeasibilityStudySection[]) => {
  selectedSectionObjects.value = sections
}

const handleSectionsSelected = (sections: readonly ParsedFeasibilityStudySection[]) => {
  selectedSectionObjects.value = sections
  selectedSummaryItem.value = '' // Clear summary item when sections are selected
}

const handleSummaryItemSelected = (item: string) => {
  selectedSummaryItem.value = item
  selectedSectionObjects.value = [] // Clear sections when summary item is selected
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
  overflow: hidden;
}

/* Main Content Styles */
.workbench-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  height: 100%;
}

/* Chat Section (Left Half) */
.chat-section {
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0;
  transition: width 0.1s ease;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Resize Handle */
.resize-handle {
  width: 4px;
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
  font-size: 10px;
  color: #64748b;
  font-weight: bold;
  transform: rotate(90deg);
}

/* Chat section styling */
.chat-section {
  border-right: 1px solid #e5e7eb;
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

/* Content Tab Styles */
.content-tab-content {
  padding: 0;
}

.content-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.content-section:last-child {
  margin-bottom: 0;
}

.content-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Markdown Content Styles */
.markdown-content {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
}

.markdown-content :deep(.mermaid svg) {
  max-width: 100%;
}

.markdown-inline {
  display: inline;
}

.markdown-inline .markdown-body {
  display: inline;
  background: none;
  padding: 0;
  margin: 0;
}

/* Markdown Body Styles - defer most typography to GitHub CSS */
.markdown-body {
  color: #24292f;
}

.markdown-body p {
  margin: 0 0 12px 0;
}

.markdown-body p:last-child {
  margin-bottom: 0;
}

.markdown-body ul,
.markdown-body ol {
  margin: 8px 0 12px 20px;
  padding: 0;
}

.markdown-body li {
  margin-bottom: 4px;
}

.markdown-body strong,
.markdown-body b {
  font-weight: 600;
  color: #1f2937;
}



/* Summary Content Styles */
.summary-content {
  background: #f8fafc;
  overflow-y: auto;
  height: calc(100vh - 84px);
  width: 100%;
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

  .resize-handle {
    display: none;
  }
}
</style>
