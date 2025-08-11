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
        <div class="resize-icon">⋮</div>
      </div>

      <!-- Canvas Section (Right Half) -->
      <div class="canvas-section" :style="{ width: (100 - chatWidth) + '%' }">
        <div class="canvas-content">
          <div v-if="selectedSectionObjects.length === 0" class="canvas-placeholder">
            <h3>Select a Feasibility Study Section</h3>
          </div>

          <div v-else class="canvas-sections">
            <div v-for="section in selectedSectionObjects" :key="`${section.projectId}-${section.sectionId}`" class="section-content">
              <div class="section-header">
                <h3>{{ getSectionDisplayName(section) }}</h3>
                <div class="section-meta">
                  <span class="completion">{{ section.percentComplete || 0 }}% complete</span>
                  <span class="status" :class="getStatusClass(section.status)">
                    {{ formatStatus(section.status) }}
                  </span>
                </div>
              </div>

              <div v-if="section.entity" class="section-entity">
                <div class="entity-tabs">
                  <div
                    v-for="fieldName in Object.keys(section.entity)"
                    :key="fieldName"
                    class="tab-header"
                    :class="{ active: activeTab === fieldName }"
                    @click="setActiveTab(fieldName)"
                  >
                    {{ formatTabName(fieldName) }}
                  </div>
                </div>

                <div class="tab-content">
                  <div v-if="activeTab && section.entity && section.entity[activeTab]" class="tab-panel">
                    <div v-if="Array.isArray(section.entity[activeTab])" class="array-content">
                      <div v-for="(item, index) in section.entity[activeTab]" :key="index" class="array-item">
                        <div v-if="typeof item === 'object' && item !== null" class="object-item">
                          <div v-for="(propValue, propKey) in item" :key="String(propKey)" class="property">
                            <span class="property-key">{{ formatPropertyName(String(propKey)) }}:</span>
                            <span class="property-value">{{ formatPropertyValue(propValue) }}</span>
                          </div>
                        </div>
                        <div v-else class="simple-value">
                          {{ item }}
                        </div>
                      </div>
                    </div>

                    <div v-else-if="typeof section.entity[activeTab] === 'object' && section.entity[activeTab] !== null" class="object-content">
                      <div v-for="(propValue, propKey) in section.entity[activeTab]" :key="String(propKey)" class="property">
                        <span class="property-key">{{ formatPropertyName(String(propKey)) }}:</span>
                        <span class="property-value">{{ formatPropertyValue(propValue) }}</span>
                      </div>
                    </div>

                    <div v-else class="simple-content">
                      <!-- Check if this is content that should be rendered as markdown -->
                      <div v-if="activeTab === 'content'" class="content-tab-content">
                        <div class="content-section">
                          <h4 class="content-section-title">Executive Summary</h4>
                          <div
                            class="markdown-body"
                            v-html="renderMarkdown(String(section.entity.content || ''))"
                          ></div>
                        </div>
                        <div class="content-section">
                          <h4 class="content-section-title">Key Recommendations</h4>
                          <div
                            class="markdown-body"
                            v-html="renderMarkdown(String(section.entity.keyRecommendations || ''))"
                          ></div>
                        </div>
                      </div>
                      <!-- For non-content tabs, display as before -->
                      <div v-else>
                        {{ section.entity[activeTab] }}
                      </div>
                    </div>
                  </div>

                  <div v-else class="no-tab-selected">
                    <p>Select a tab to view content</p>
                  </div>
                </div>
              </div>

              <div v-else class="no-entity">
                <p>No content available for this section.</p>
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
import WorkbenchSidebar from '@/components/WorkbenchSidebar.vue'
import Conversation from '@/components/Conversation.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked options for v16+
marked.use({
  breaks: true,
  gfm: true
})

// Configure DOMPurify to allow more HTML elements
DOMPurify.setConfig({
  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
  ALLOWED_ATTR: []
})

// Use the store
const sectionStore = useFeasibilityStudySectionStore()

// State
const selectedSections = ref<string[]>([])
const selectedSectionObjects = ref<readonly any[]>([])
const activeTab = ref<string>('')
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

const handleContextSelected = (sections: readonly any[]) => {
  selectedSectionObjects.value = sections

  // Set the first available tab as active if sections are selected
  if (sections.length > 0 && sections[0].entity) {
    const firstKey = Object.keys(sections[0].entity)[0]
    activeTab.value = firstKey
  } else {
    activeTab.value = ''
  }
}

const handleSectionsSelected = (sections: readonly any[]) => {
  selectedSectionObjects.value = sections

  // Set the first available tab as active if sections are selected
  if (sections.length > 0 && sections[0].entity) {
    const firstKey = Object.keys(sections[0].entity)[0]
    activeTab.value = firstKey
  } else {
    activeTab.value = ''
  }
}

const getSectionDisplayName = (section: any): string => {
  // Get section name from parsed entity data
  if (section.entity && typeof section.entity === 'object' && 'sectionName' in section.entity) {
    return section.entity.sectionName as string
  }

  // Fallback to section ID if no name available
  return `Section ${section.sectionId}`
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'complete':
      return 'status-complete'
    case 'in_progress':
      return 'status-in-progress'
    case 'not_started':
      return 'status-not-started'
    default:
      return 'status-unknown'
  }
}

const formatStatus = (status: string): string => {
  switch (status) {
    case 'complete':
      return 'Complete'
    case 'in_progress':
      return 'In Progress'
    case 'not_started':
      return 'Not Started'
    default:
      return status
  }
}

const setActiveTab = (tabKey: string): void => {
  activeTab.value = tabKey
}

const formatTabName = (key: string): string => {
  // Convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

const formatPropertyName = (key: string): string => {
  // Convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

const formatPropertyValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

// Markdown rendering function
const renderMarkdown = (markdownText: string): string => {
  if (!markdownText) return ''

  try {
    // Convert PowerShell-style newlines to actual newlines
    const processedMarkdown = markdownText.replace(/`n/g, '\n')

    // Parse markdown to HTML using the correct marked v16 API
    const html = marked(processedMarkdown)

    // Ensure html is a string before sanitizing
    const htmlString = typeof html === 'string' ? html : String(html)

    // Sanitize HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(htmlString)

    // Return the sanitized HTML
    return sanitizedHtml
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return markdownText // Fallback to raw text if parsing fails
  }
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
}

/* Chat Section (Left Half) */
.chat-section {
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0;
  transition: width 0.1s ease;
  max-height: calc(100vh - 64px);
  overflow: hidden;
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
  padding: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 64px - 80px); /* Account for top nav + header */
}

.canvas-placeholder {
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
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
  margin: 0 0 16px 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Canvas Sections Styles */
.canvas-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Entity Tabs Styles */
.entity-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-header {
  padding: 12px 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
}

.tab-header:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-header.active {
  background: white;
  color: #008C8E;
  border-color: #008C8E;
  border-bottom-color: white;
  margin-bottom: -1px;
}

.tab-content {
  min-height: 120px;
}

.tab-panel {
  padding: 16px 0;
}

.array-content, .object-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.array-item, .object-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.property {
  display: flex;
  margin-bottom: 8px;
  align-items: flex-start;
}

.property:last-child {
  margin-bottom: 0;
}

.property-key {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  margin-right: 12px;
  flex-shrink: 0;
}

.property-value {
  color: #6b7280;
  flex: 1;
  word-break: break-word;
}

.simple-value, .simple-content {
  color: #6b7280;
  font-style: italic;
}

.no-tab-selected {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-style: italic;
}

.section-content {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.completion {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.status-complete {
  background: #dcfce7;
  color: #166534;
}

.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-not-started {
  background: #fef3c7;
  color: #92400e;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

.section-entity {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.entity-json {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-entity {
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-style: italic;
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
  background: #f9fafb;
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

/* Markdown Body Styles */
.markdown-body {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin: 16px 0 8px 0;
  font-weight: 600;
  line-height: 1.25;
  color: #1f2937;
}

.markdown-body h1 { font-size: 1.25rem; }
.markdown-body h2 { font-size: 1.125rem; }
.markdown-body h3 { font-size: 1rem; }
.markdown-body h4 { font-size: 0.875rem; }
.markdown-body h5 { font-size: 0.875rem; }
.markdown-body h6 { font-size: 0.875rem; }

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

.markdown-body em,
.markdown-body i {
  font-style: italic;
}

.markdown-body code {
  background: #f3f4f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8em;
}

.markdown-body pre {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-body pre code {
  background: none;
  padding: 0;
}

.markdown-body blockquote {
  border-left: 4px solid #008C8E;
  margin: 12px 0;
  padding-left: 16px;
  color: #6b7280;
  font-style: italic;
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
