<template>
  <div class="workbench-sidebar" :class="{ collapsed: sidebarStore.collapsed }">
    <div class="sidebar-header">
      <div class="header-row">
        <DocumentTextIcon class="header-icon" />
        <h2>Feasibility Study Sections</h2>
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
        >
          <label class="section-checkbox">
            <input
              type="radio"
              :value="`${section.projectId}-${section.sectionId}`"
              v-model="radioValue"
              @change="handleSectionToggle"
              class="checkbox-input"
              name="section-selection"
            />
            <div class="checkbox-custom"></div>
            <div class="section-number">{{ section.sectionId }}</div>
            <div class="section-info">
              <div class="section-name">{{ getSectionDisplayName(section).replace(/^\d+:\s*/, '') }}</div>
              <div class="section-meta">
                <span class="completion">{{ section.percentComplete || 0 }}% complete</span>
                <span class="status" :class="getStatusClass(section.status)">
                  {{ formatStatus(section.status) }}
                </span>
              </div>
            </div>
          </label>
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
import type { ParsedFeasibilityStudySection } from '@/types/feasibilityStudy'
import { useSidebarStore } from '@/stores/sidebarStore'
import { DocumentTextIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string[]
  projectId?: string // Optional: filter sections by project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'context-selected': [sections: typeof sections.value]
  'sections-selected': [sections: typeof sections.value]
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

// Track selected sections (using composite key format: "projectId-sectionId")
const selectedSections = ref<string[]>(props.modelValue || [])

// Sync with store's selected sections
const storeSelectedSections = computed(() => sectionStore.selectedSections)

// Reactive ref for radio button state
const radioValue = ref<string>('')

// Watch for changes in store selection and update radio button state
watch(storeSelectedSections, (newSelectedSections) => {
  if (newSelectedSections.length > 0) {
    radioValue.value = `${newSelectedSections[0].projectId}-${newSelectedSections[0].sectionId}`
  } else {
    radioValue.value = ''
  }
}, { immediate: true })

// Watch for external changes to the modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedSections.value = newValue
  }
})


// Methods
const handleSectionToggle = () => {
  // Get the selected section object based on radio button value
  const selectedSection = sections.value.find(section =>
    radioValue.value === `${section.projectId}-${section.sectionId}`
  )

  // Update the store's selected sections (single selection)
  if (selectedSection) {
    sectionStore.setSelectedSections([selectedSection])
    // Emit the selected section for the canvas
    emit('sections-selected', [selectedSection])
  } else {
    sectionStore.setSelectedSections([])
    // Emit empty selection for the canvas
    emit('sections-selected', [])
  }
}

const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
  return sectionStore.getSectionDisplayName(section)
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
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  position: relative;
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

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
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
}

.sidebar-header p {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
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
  overflow-y: auto;
}

.sections-list {
  padding: 16px 0;
}

.section-item {
  margin: 0;
}

.section-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.section-checkbox:hover {
  background: #f0f9fa;
}

.section-checkbox input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
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
}

.section-checkbox input[type="radio"]:checked + .checkbox-custom {
  background: #008C8E;
  border-color: #008C8E;
}

.section-checkbox input[type="radio"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

.section-info {
  flex: 1;
  min-width: 0;
}

.section-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 4px;
}

.section-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.completion {
  color: #6b7280;
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
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
