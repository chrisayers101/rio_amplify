<template>
  <div class="workbench-sidebar">
    <div class="sidebar-header">
      <h2>Workbench Analytics</h2>
      <p>Advanced analysis tools</p>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="nav-section-title">Data Analysis</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'data-explorer' }" @click="selectSection('data-explorer')">
              <ChartBarIcon class="nav-icon" />
              Data Explorer
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'statistical-analysis' }" @click="selectSection('statistical-analysis')">
              <CalculatorIcon class="nav-icon" />
              Statistical Analysis
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'trend-analysis' }" @click="selectSection('trend-analysis')">
              <ArrowTrendingUpIcon class="nav-icon" />
              Trend Analysis
            </button>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="nav-section-title">Modeling</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'predictive-models' }" @click="selectSection('predictive-models')">
              <CpuChipIcon class="nav-icon" />
              Predictive Models
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'optimization' }" @click="selectSection('optimization')">
              <CogIcon class="nav-icon" />
              Optimization Tools
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'simulation' }" @click="selectSection('simulation')">
              <PlayIcon class="nav-icon" />
              Simulation
            </button>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="nav-section-title">Reporting</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'custom-reports' }" @click="selectSection('custom-reports')">
              <DocumentTextIcon class="nav-icon" />
              Custom Reports
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'dashboards' }" @click="selectSection('dashboards')">
              <PresentationChartLineIcon class="nav-icon" />
              Dashboards
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeSection === 'exports' }" @click="selectSection('exports')">
              <ArrowDownTrayIcon class="nav-icon" />
              Exports
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  ChartBarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
  CogIcon,
  PlayIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeSection = ref(props.modelValue)

const selectSection = (section: string) => {
  activeSection.value = section
  emit('update:modelValue', section)
}

// Watch for external changes to the modelValue
watch(() => props.modelValue, (newValue) => {
  activeSection.value = newValue
})
</script>

<style scoped>
/* Sidebar Styles */
.workbench-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.sidebar-header p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px 24px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-link:hover {
  background: #f0f9fa;
  color: #008C8E;
}

.nav-link.active {
  background: #e6f7f8;
  color: #008C8E;
  font-weight: 600;
  border-right: 3px solid #008C8E;
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .workbench-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
