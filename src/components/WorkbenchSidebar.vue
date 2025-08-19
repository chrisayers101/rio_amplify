<template>
  <div class="workbench-sidebar" :class="{ collapsed: sidebarStore.collapsed }">
    <div class="sidebar-header">
      <div class="header-row">
        <DocumentTextIcon class="header-icon" />
        <h2>Project Summary</h2>
      </div>
    </div>
    <div class="sections-list">
      <div class="section-item" @click="selectSummaryItem('summary')" :class="{ 'selected': selectedSummaryItem === 'summary' }">
        <div class="section-content">
          <div class="section-icon">
            <DocumentTextIcon class="icon" />
          </div>
          <div class="section-info">
            <div class="section-name">Summary</div>
          </div>
        </div>
      </div>
      <div class="section-item" @click="selectSummaryItem('risks')" :class="{ 'selected': selectedSummaryItem === 'risks' }">
        <div class="section-content">
          <div class="section-icon">
            <ExclamationTriangleIcon class="icon" />
          </div>
          <div class="section-info">
            <div class="section-name">Risks</div>
          </div>
        </div>
      </div>
      <div class="section-item" @click="selectSummaryItem('issues')" :class="{ 'selected': selectedSummaryItem === 'issues' }">
        <div class="section-content">
          <div class="section-icon">
            <ExclamationCircleIcon class="icon" />
          </div>
          <div class="section-info">
            <div class="section-name">Issues</div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-header">
      <div class="header-row">
        <DocumentTextIcon class="header-icon" />
        <h2>Feasibility Study</h2>
      </div>
    </div>


    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading sections...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">Retry</button>
    </div>

    <div v-else class="sections-container">
      <div class="sections-list">
        <div
          v-for="section in sections"
          :key="`${section.projectId}-${section.sectionId}`"
          class="section-item"
          :class="{ 'selected': isSectionSelected(section) }"
          @click="selectSection(section)"
        >
          <div class="section-content">
            <div class="section-number">{{ section.sectionId }}</div>
            <div class="section-info">
              <div class="section-name">{{ getSectionDisplayName(section).replace(/^\d+:\s*/, '') }}</div>
              <div class="section-meta">
                <div class="completion-container">
                  <div class="completion-bar">
                    <div
                      class="completion-fill"
                      :style="{ width: `${section.percentComplete || 0}%` }"
                      :class="getCompletionClass(section.percentComplete || 0)"
                    ></div>
                  </div>
                  <span class="completion-text">{{ section.percentComplete || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <button class="sidebar-toggle" @click="sidebarStore.toggleSidebar()">
      <ChevronLeftIcon v-if="sidebarStore.collapsed" class="toggle-icon" />
      <ChevronRightIcon v-else class="toggle-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFeasibilityStudySectionStore } from '@/stores/entityStore'
import type { ParsedFeasibilityStudySection } from '../../shared'
import { useSidebarStore } from '@/stores/sidebarStore'
import { DocumentTextIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string[]
  projectId?: string // Optional: filter sections by project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'context-selected': [sections: typeof sections.value]
  'sections-selected': [sections: typeof sections.value]
  'summary-item-selected': [item: string]
}>()

// Use the store
const sectionStore = useFeasibilityStudySectionStore()
const sidebarStore = useSidebarStore()

// Computed properties from store
const sections = computed(() => {
  return [...sectionStore.sections].sort((a, b) => {
    const aNum = parseInt(a.sectionId.toString())
    const bNum = parseInt(b.sectionId.toString())
    return aNum - bNum
  })
})
const isLoading = computed(() => sectionStore.isLoading)
const error = computed(() => sectionStore.error)

// Sync with store's selected sections
const storeSelectedSections = computed(() => sectionStore.selectedSections)

// Track selected summary item
const selectedSummaryItem = ref<string>('')


// Methods
const isSectionSelected = (section: ParsedFeasibilityStudySection): boolean => {
  return storeSelectedSections.value.some(selected =>
    selected.projectId === section.projectId && selected.sectionId === section.sectionId
  )
}

const selectSection = (section: ParsedFeasibilityStudySection) => {
  // Clear any selected summary item when selecting a section
  selectedSummaryItem.value = ''
  // Update the store's selected sections (single selection)
  sectionStore.setSelectedSections([section])
  // Emit the selected section for the canvas
  emit('sections-selected', [section])
}

const selectSummaryItem = (item: string) => {
  // Clear any selected sections when selecting a summary item
  sectionStore.setSelectedSections([])
  selectedSummaryItem.value = item
  // Emit the selected summary item for the canvas
  emit('summary-item-selected', item)
}

const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
  return sectionStore.getSectionDisplayName(section)
}

const getCompletionClass = (percentComplete: number): string => {
  if (percentComplete === 100) return 'completion-complete'
  if (percentComplete >= 75) return 'completion-high'
  if (percentComplete >= 50) return 'completion-medium'
  if (percentComplete >= 25) return 'completion-low'
  return 'completion-minimal'
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



const retryLoad = async () => {
  if (props.projectId) {
    await sectionStore.fetchSectionsByProject(props.projectId)
  } else {
    await sectionStore.fetchSections()
  }
}

// Load sections on mount
onMounted(async () => {
  if (props.projectId) {
    await sectionStore.fetchSectionsByProject(props.projectId)
  } else {
    await sectionStore.fetchSections()
  }
})
</script>

<style scoped>
/* Sidebar Styles */
.workbench-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  position: relative;
}

.workbench-sidebar * {
  box-sizing: border-box;
  max-width: 100%;
}

/* Sidebar Styles */
.workbench-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  position: relative;
}

.workbench-sidebar * {
  box-sizing: border-box;
  max-width: 100%;
}

.workbench-sidebar.collapsed {
  width: 100px;
}

.workbench-sidebar.collapsed .sidebar-header h2,
.workbench-sidebar.collapsed .sidebar-header p,
.workbench-sidebar.collapsed .section-controls {
  display: none;
}
.workbench-sidebar.collapsed .sections-container .section-info,
.workbench-sidebar.collapsed .sections-container .section-meta {
  display: none;
}
.workbench-sidebar.collapsed .sections-container .section-number {
  display: block;
}

.workbench-sidebar.collapsed .section-info {
  display: none;
}



.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
  max-width: 100%;
  box-sizing: border-box;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  overflow: hidden;
}

.header-icon {
  width: 36px;
  height: 36px;
  color: white;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar-header p {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
}

.project-summary-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
}

.project-summary-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.summary-items .section-item {
  border: none !important;
  outline: none !important;
}

.project-summary-header .section-item {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.project-summary-header .section-item * {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.summary-item {
  margin: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: white;
  border: none;
}

.summary-item:hover {
  background: #f0f9fa;
}

.summary-item.selected {
  background: #e6f7f8;
  border-right: 3px solid #008C8E;
}

.summary-item .section-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 4px;
}

.section-controls {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.selected-count {
  font-weight: 600;
  color: #008C8E;
}

.sections-container {
  flex: 1;
  margin-right: -8px; /* Extend content under scrollbar */
  padding-right: 8px; /* Compensate for negative margin */
}

.sections-list {
  padding: 16px 0;
  flex: 1;
  width: 100%;
  padding-right: 8px; /* Add padding to prevent content from being cut off */
}

.section-item {
  margin: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.section-item:hover {
  background: #f0f9fa;
}

.section-item.selected {
  background: #e6f7f8;
  border-right: 3px solid #008C8E;
}

.section-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 24px;
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
}

.section-number {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0;
  flex-shrink: 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0;
  flex-shrink: 0;
}

.section-icon .icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.section-info {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.section-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 4px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.section-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.completion-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.completion-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  min-width: 0;
}

.completion-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease, background-color 0.3s ease;
  position: relative;
}

.completion-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.completion-complete {
  background: linear-gradient(90deg, #10b981, #059669);
}

.completion-high {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.completion-medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.completion-low {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.completion-minimal {
  background: linear-gradient(90deg, #6b7280, #4b5563);
}

.completion-text {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  min-width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.status {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
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



.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.context-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.context-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #007a7c, #008577);
  transform: translateY(-1px);
}

.context-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #008C8E;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.error-message {
  color: #991b1b;
  margin-bottom: 15px;
}

.retry-btn {
  padding: 8px 16px;
  background: #008C8E;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #007a7c;
  transform: translateY(-1px);
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .workbench-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .sections-container {
    max-height: 400px;
  }

  .completion-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .completion-bar {
    width: 100%;
  }

  .completion-text {
    font-size: 10px;
    min-width: auto;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.toggle-icon {
  width: 12px;
  height: 12px;
  color: #888;
}
</style>
