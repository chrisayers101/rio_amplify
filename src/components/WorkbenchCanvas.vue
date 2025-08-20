<template>
  <div class="canvas-section" :style="{ width: (100 - chatWidth) + '%' }">
    <div class="canvas-content">
      <div v-if="selectedSectionObjects.length === 0" class="canvas-placeholder">
        <h3>Select Project Section</h3>
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
                v-for="fieldName in getVisibleTabs(section)"
                :key="fieldName"
                class="tab-header"
                :class="{ active: activeTab === fieldName }"
                @click="setActiveTab(fieldName)"
              >
                {{ formatTabName(fieldName) }}
                <button
                  @click.stop="toggleEditMode(fieldName)"
                  class="edit-button"
                  :class="{ 'is-hidden': !(activeTab === fieldName && !isEditing(fieldName)) }"
                  :disabled="!(activeTab === fieldName && !isEditing(fieldName))"
                  aria-label="Edit"
                  title="Edit"
                >
                  <PencilSquareIcon class="edit-icon" />
                </button>
              </div>
            </div>

            <div class="tab-content">
              <div v-if="activeTab && section.entity && section.entity[activeTab]" class="tab-panel fill-parent">
                <!-- Edit Mode -->
                <div v-if="isEditing(activeTab)" class="edit-mode fill-parent">
                  <div class="edit-controls fill-parent">
                    <textarea
                      v-model="editValues[activeTab]"
                      class="edit-textarea fill-parent"
                      :placeholder="`Edit ${formatTabName(activeTab)}...`"
                    ></textarea>
                    <div class="edit-actions">
                      <button
                        @click="saveEdit(section.projectId, section.sectionId, activeTab)"
                        class="save-button"
                        :disabled="isSaving"
                      >
                        <span v-if="isSaving" class="loading-spinner-small"></span>
                        {{ isSaving ? 'Saving...' : 'Save' }}
                      </button>
                      <button
                        @click="cancelEdit(activeTab)"
                        class="cancel-button"
                        :disabled="isSaving"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <!-- View Mode -->
                <div v-else class="view-mode">
                  <div v-if="Array.isArray(section.entity[activeTab])" class="array-content">
                    <div v-for="(item, index) in section.entity[activeTab]" :key="index" class="array-item">
                      <div v-if="typeof item === 'object' && item !== null" class="object-item">
                        <div v-for="(propValue, propKey) in item" :key="String(propKey)" class="property">
                          <span class="property-key">{{ formatPropertyName(String(propKey)) }}:</span>
                          <span class="property-value">
                          <span class="markdown-inline">
                            <VueMarkdown class="markdown-body" :source="formatMarkdownSource(String(propValue))" :md="md" />
                          </span>
                          </span>
                        </div>
                      </div>
                      <div v-else class="simple-value">
                        <span class="markdown-inline">
                          <VueMarkdown class="markdown-body" :source="formatMarkdownSource(String(item))" :md="md" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="typeof section.entity[activeTab] === 'object' && section.entity[activeTab] !== null" class="object-content">
                    <div v-for="(propValue, propKey) in section.entity[activeTab]" :key="String(propKey)" class="property">
                      <span class="property-key">{{ formatPropertyName(String(propKey)) }}:</span>
                      <span class="property-value">
                        <span class="markdown-inline">
                          <VueMarkdown class="markdown-body" :source="formatMarkdownSource(String(propValue))" :md="md" />
                        </span>
                      </span>
                    </div>
                  </div>

                  <div v-else class="simple-content">
                    <!-- Show loading spinner when quality assessment is running -->
                    <div v-if="activeTab === 'qualityAssessment' && sectionStore.isAssessmentRunning" class="loading-container">
                      <div class="loading-spinner-large"></div>
                      <p class="loading-text">Running quality assessment...</p>
                    </div>
                    <!-- Render all content as markdown when not loading -->
                    <div v-else class="markdown-content scrollable">
                      <VueMarkdown
                        class="markdown-body"
                        :source="formatMarkdownSource(section.entity[activeTab] || '')"
                        :md="md"
                      />
                    </div>
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
</template>

<script setup lang="ts">
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ref, watch, nextTick, onMounted } from 'vue'
import { useFeasibilityStudySectionStore } from '@/stores/entityStore'
import type { ParsedFeasibilityStudySection } from '../../shared'
import VueMarkdown from 'vue-markdown-render'
import MarkdownIt from 'markdown-it'
import mdTaskLists from 'markdown-it-task-lists'
import mermaid from 'mermaid'

// Initialize Mermaid once
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

// Configure a shared MarkdownIt instance with GFM + Mermaid
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
})
  // Tables and strikethrough are built-in to markdown-it
  .use(mdTaskLists)

// Render ```mermaid``` code fences as placeholders to be processed by Mermaid after mount
const originalFence = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const info = (token.info || '').trim().toLowerCase()
  if (info === 'mermaid') {
    const code = token.content || ''
    const escaped = md.utils.escapeHtml(code)
    return `<pre class="mermaid-block"><code class="language-mermaid">${escaped}</code></pre>`
  }
  return originalFence
    ? originalFence(tokens, idx, options, env, self)
    : `<pre><code>${md.utils.escapeHtml(token.content || '')}</code></pre>`
}

// Props
interface Props {
  selectedSectionObjects: readonly ParsedFeasibilityStudySection[]
  chatWidth: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:selectedSectionObjects': [sections: readonly ParsedFeasibilityStudySection[]]
}>()

// Use the store
const sectionStore = useFeasibilityStudySectionStore()

// State
const activeTab = ref<string>('')

// Edit mode state
const editMode = ref<Record<string, boolean>>({})
const editValues = ref<Record<string, string>>({})
const isSaving = ref(false)
const originalValues = ref<Record<string, string>>({})

// Set the first available tab as active if sections are selected
const initializeActiveTab = () => {
  if (props.selectedSectionObjects.length > 0 && props.selectedSectionObjects[0].entity) {
    const entity = props.selectedSectionObjects[0].entity
    const preferredOrder = ['content', 'qualityAssessment']
    const firstKey = preferredOrder.find(k => typeof entity[k] === 'string' && String(entity[k]).trim().length > 0) || preferredOrder[0]
    activeTab.value = firstKey
  } else {
    activeTab.value = ''
  }
}

// Watch for changes in selected sections
watch(() => props.selectedSectionObjects, () => {
  initializeActiveTab()
}, { immediate: true })

const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
  return sectionStore.getSectionDisplayName(section)
}

const getStatusClass = (status: string): string => {
  return sectionStore.getStatusClass(status)
}

const formatStatus = (status: string): string => {
  return sectionStore.formatStatus(status)
}

const setActiveTab = (tabKey: string): void => {
  activeTab.value = tabKey
}

const formatTabName = (key: string): string => {
  return sectionStore.formatTabName(key)
}

const formatPropertyName = (key: string): string => {
  return sectionStore.formatPropertyName(key)
}

// Compute the visible tabs for a given section, restricted to Content and Quality Assessment in order
const getVisibleTabs = (section: ParsedFeasibilityStudySection): string[] => {
  const allowed = ['content', 'qualityAssessment']
  const entity = section.entity || {}
  return allowed.filter(key => entity[key] !== undefined && String(entity[key]).trim().length > 0)
}

// Helper function to update local section data immediately
const updateLocalSectionData = (projectId: string, sectionId: string, fieldName: string, newValue: string): void => {
  // Update the selected sections immediately for instant UI feedback
  const updatedSections = props.selectedSectionObjects.map(section => {
    if (section.projectId === projectId && section.sectionId === sectionId) {
      // Create a new section object with updated entity
      const updatedEntity = {
        ...section.entity,
        [fieldName]: newValue
      }
      return {
        ...section,
        entity: updatedEntity
      }
    }
    return section
  })

  // Emit the updated sections
  emit('update:selectedSectionObjects', updatedSections)
}

// Edit mode methods
const toggleEditMode = (fieldName: string): void => {
  if (editMode.value[fieldName]) {
    // Cancel edit mode
    cancelEdit(fieldName)
  } else {
    // Enter edit mode
    const currentValue = props.selectedSectionObjects[0]?.entity?.[fieldName]
    if (currentValue !== undefined) {
      editMode.value[fieldName] = true
      editValues.value[fieldName] = String(currentValue)
      originalValues.value[fieldName] = String(currentValue)
    }
  }
}

const isEditing = (fieldName: string): boolean => {
  return editMode.value[fieldName] || false
}

const saveEdit = async (projectId: string, sectionId: string, fieldName: string): Promise<void> => {
  if (!editValues.value[fieldName]) return

  try {
    isSaving.value = true
    const success = await sectionStore.updateSectionEntity(
      projectId,
      sectionId,
      fieldName,
      editValues.value[fieldName]
    )

    if (success) {
      // Exit edit mode
      editMode.value[fieldName] = false
      const savedValue = editValues.value[fieldName]
      delete editValues.value[fieldName]
      delete originalValues.value[fieldName]

      // Update local state immediately for instant UI feedback
      updateLocalSectionData(projectId, sectionId, fieldName, savedValue)

      // Ensure the active tab is still set and content is visible
      if (activeTab.value === fieldName) {
        // Force a reactive update by temporarily clearing and restoring the active tab
        const currentTab = activeTab.value
        activeTab.value = ''
        setTimeout(() => {
          activeTab.value = currentTab
        }, 10)
      }

      // Refresh the store data in the background
      sectionStore.fetchSections().catch(console.error)
    } else {
      console.error('Failed to save edit')
    }
  } catch (error) {
    console.error('Error saving edit:', error)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = (fieldName: string): void => {
  editMode.value[fieldName] = false
  delete editValues.value[fieldName]
  delete originalValues.value[fieldName]
}

// Markdown is rendered via <VueMarkdown :source="..." />

// Normalize plain text to render better as Markdown
const formatMarkdownSource = (raw: unknown): string => {
  const source = raw == null ? '' : String(raw)
  // Normalize newlines
  let normalized = source.replace(/\r\n/g, '\n')
  // Ensure a space after heading markers, e.g., "##Heading" -> "## Heading"
  normalized = normalized.replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
  // Ensure a space after list bullets and ordered list numerals
  normalized = normalized
    .replace(/^([*-])([^*\-\s])/gm, '$1 $2')
    .replace(/^(\d+\.)(\S)/gm, '$1 $2')
  return normalized
}

// Helper to render any mermaid code blocks currently in the canvas
const renderMermaidBlocks = (): void => {
  nextTick(() => {
    try {
      const container = document.querySelector('.canvas-content') as HTMLElement | null
      if (!container) return
      const mermaidBlocks = container.querySelectorAll('.mermaid-block')
      mermaidBlocks.forEach((el, i) => {
        const codeEl = el.querySelector('code')
        const code = codeEl ? codeEl.textContent || '' : ''
        const id = `mermaid-${Date.now()}-${i}`
        const out = document.createElement('div')
        out.id = id
        el.replaceWith(out)
        mermaid.render(id, code).then(({ svg }) => {
          out.innerHTML = svg
        }).catch((e) => {
          console.warn('Mermaid render error:', e)
        })
      })
    } catch (e) {
      console.warn('Mermaid render failed:', e)
    }
  })
}

// Re-render diagrams when content/tab changes
watch([activeTab, () => props.selectedSectionObjects], () => {
  renderMermaidBlocks()
})

onMounted(() => {
  renderMermaidBlocks()
})
</script>

<style scoped>
/* Canvas Section Styles */
.canvas-section {
  background: #f8fafc;
  overflow-y: auto;
  height: 100%;
}

.canvas-content {
  padding: 24px;
  height: 100%;
}

.canvas-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
}

.canvas-placeholder h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.canvas-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  min-height: 100%;
}

.section-content {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 0;
}

.section-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.section-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.completion {
  font-size: 0.875rem;
  color: #6b7280;
}

.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  padding: 0;
}

.entity-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.tab-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.tab-header:hover {
  background: #f3f4f6;
}

.tab-header.active {
  border-bottom-color: #008C8E;
  background: white;
  color: #008C8E;
  font-weight: 600;
}

.edit-button {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  opacity: 0;
}

.tab-header:hover .edit-button,
.tab-header.active .edit-button {
  opacity: 1;
}

.edit-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.edit-button.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.edit-icon {
  width: 16px;
  height: 16px;
}

.tab-content {
  padding: 24px;
  min-height: 200px;
}

.tab-panel {
  height: 100%;
}

.no-tab-selected {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

/* Edit Mode Styles */
.edit-mode {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.edit-controls {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.edit-textarea {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
}

.edit-textarea:focus {
  border-color: #008C8E;
  box-shadow: 0 0 0 3px rgba(0, 140, 142, 0.1);
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button {
  background: #008C8E;
  color: white;
}

.save-button:hover:not(:disabled) {
  background: #007a7c;
  transform: translateY(-1px);
}

.save-button:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  background: #f3f4f6;
  color: #374151;
}

.cancel-button:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.cancel-button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 40px;
}

.loading-spinner-large {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* View Mode Styles */
.view-mode {
  height: 100%;
}

.array-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.array-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.object-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.property-key {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  flex-shrink: 0;
}

.property-value {
  flex: 1;
  color: #111827;
}

.simple-value {
  color: #111827;
}

.object-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.simple-content {
  height: 100%;
}

.markdown-content {
  height: 100%;
  overflow-y: auto;
}

.markdown-inline {
  display: inline;
}

.markdown-body {
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h1) { font-size: 2em; }
.markdown-body :deep(h2) { font-size: 1.5em; }
.markdown-body :deep(h3) { font-size: 1.25em; }
.markdown-body :deep(h4) { font-size: 1em; }
.markdown-body :deep(h5) { font-size: 0.875em; }
.markdown-body :deep(h6) { font-size: 0.85em; }

.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-body :deep(li) {
  margin-top: 0.25em;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-body :deep(table) {
  border-spacing: 0;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body :deep(table th) {
  font-weight: 600;
  background-color: #f6f8fa;
}

.no-entity {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

/* Utility Classes */
.fill-parent {
  height: 100%;
  width: 100%;
}

.scrollable {
  overflow-y: auto;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .canvas-content {
    padding: 16px;
  }

  .section-header {
    padding: 16px 20px;
  }

  .tab-content {
    padding: 16px 20px;
  }

  .entity-tabs {
    flex-wrap: wrap;
  }

  .tab-header {
    padding: 10px 16px;
    font-size: 14px;
  }

  .edit-actions {
    flex-direction: column;
  }

  .save-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
