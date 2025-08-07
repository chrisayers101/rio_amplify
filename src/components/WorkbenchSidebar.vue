<template>
  <div class="workbench-sidebar">
    <div class="sidebar-header">
      <h2>Feasibility Study Sections</h2>
      <p>Select sections for chat context</p>
    </div>

    <div class="section-controls">
      <div class="control-buttons">
        <button @click="selectAll" class="control-btn select-all">
          Select All
        </button>
        <button @click="clearAll" class="control-btn clear-all">
          Clear All
        </button>
      </div>
      <div class="selection-info">
        <span class="selected-count">{{ selectedSections.length }}</span>
        <span class="total-count">/ {{ sections.length }} selected</span>
      </div>
    </div>

    <div class="sections-container">
      <div class="sections-list">
        <div
          v-for="section in sections"
          :key="section.sectionId"
          class="section-item"
        >
          <label class="section-checkbox">
            <input
              type="checkbox"
              :value="section.sectionId"
              v-model="selectedSections"
              @change="handleSectionToggle"
              class="checkbox-input"
            />
            <div class="checkbox-custom"></div>
            <div class="section-info">
              <div class="section-name">{{ section.sectionName }}</div>
              <div class="section-meta">
                <span class="completion">{{ section.percentComplete }}% complete</span>
                <span class="quality" :class="getQualityClass(section.qualityRating)">
                  {{ section.qualityRating }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <button
        @click="useSelectedAsContext"
        class="context-btn"
        :disabled="selectedSections.length === 0"
      >
        Use Selected as Chat Context
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import feasibilityData from '@/data/feasibility_scaffold_full.json'

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

interface Props {
  modelValue?: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'context-selected': [sections: Section[]]
}>()

// Extract sections from feasibility data
const sections = feasibilityData.feasibilityStudyView.sections as Section[]

// Track selected sections
const selectedSections = ref<string[]>(props.modelValue || [])

// Methods
const selectAll = () => {
  selectedSections.value = sections.map(section => section.sectionId)
  emit('update:modelValue', selectedSections.value)
}

const clearAll = () => {
  selectedSections.value = []
  emit('update:modelValue', selectedSections.value)
}

const handleSectionToggle = () => {
  emit('update:modelValue', selectedSections.value)
}

const getQualityClass = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'high':
      return 'quality-high'
    case 'good':
      return 'quality-good'
    case 'moderate':
      return 'quality-moderate'
    case 'low':
      return 'quality-low'
    default:
      return 'quality-unknown'
  }
}

const useSelectedAsContext = () => {
  const selectedSectionObjects = sections.filter(section =>
    selectedSections.value.includes(section.sectionId)
  )
  emit('context-selected', selectedSectionObjects)
}

// Watch for external changes to the modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedSections.value = newValue
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
  height: 100vh;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #008C8E, #009688);
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

.control-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.control-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.control-btn.select-all {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.control-btn.clear-all {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
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

.section-checkbox input[type="checkbox"] {
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
  border-radius: 4px;
  background: white;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.section-checkbox input[type="checkbox"]:checked + .checkbox-custom {
  background: #008C8E;
  border-color: #008C8E;
}

.section-checkbox input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
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

.quality {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
}

.quality-high {
  background: #dcfce7;
  color: #166534;
}

.quality-good {
  background: #dbeafe;
  color: #1e40af;
}

.quality-moderate {
  background: #fef3c7;
  color: #92400e;
}

.quality-low {
  background: #fee2e2;
  color: #991b1b;
}

.quality-unknown {
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
</style>
