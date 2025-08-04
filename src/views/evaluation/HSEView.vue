<template>
  <div class="hse-evaluation-layout">
    <div class="hse-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Health, Safety & Environment Evaluation</h1>
          <p>HSE standards, compliance, and workforce safety for {{ currentProject?.name }}</p>
        </div>
      </div>

      <!-- Project Selection Tabs -->
      <div class="tab-navigation">
        <button
          v-for="project in availableProjects"
          :key="project.id"
          @click="setSelectedProject(project.id)"
          :class="['tab-button', { active: currentProject?.id === project.id }]"
        >
          {{ project.name }}
        </button>
      </div>

      <!-- Project Content -->
      <div v-if="currentProject?.evaluation?.hse" class="project-content">
        <div class="evaluation-grid">
          <!-- EIS Status -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>EIS Status</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.hse.eis_status }}</p>
            </div>
          </div>

          <!-- Rio Tinto Standards Alignment -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Rio Tinto Standards Alignment</h3>
            </div>
            <div class="card-content">
              <div class="alignment-status" :class="{ aligned: currentProject.evaluation.hse.rio_tinto_standards_aligned }">
                <span class="status-indicator"></span>
                <span class="status-text">
                  {{ currentProject.evaluation.hse.rio_tinto_standards_aligned ? 'Aligned' : 'Not Aligned' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Key HSE Issues -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Key HSE Issues</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.hse.key_issues }}</p>
            </div>
          </div>

          <!-- Workforce HSE Statistics -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Workforce HSE Statistics</h3>
            </div>
            <div class="card-content">
              <div class="hse-stats">
                <div class="stat-item">
                  <span class="stat-label">LTIFR</span>
                  <span class="stat-value">{{ formatLTIFR(currentProject.evaluation.hse.workforce_hse_statistics.ltifr) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Fatalities</span>
                  <span class="stat-value" :class="{ 'zero': currentProject.evaluation.hse.workforce_hse_statistics.fatalities === 0 }">
                    {{ currentProject.evaluation.hse.workforce_hse_statistics.fatalities }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- LTIF Trend -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>LTIF Trend (3 Years)</h3>
            </div>
            <div class="card-content">
              <div class="trend-chart">
                <div v-for="(value, index) in currentProject.evaluation.hse.ltif_trend_3yr" :key="index" class="trend-bar">
                  <div class="bar-label">Year {{ index + 1 }}</div>
                  <div class="bar-container">
                    <div class="bar" :style="{ height: getBarHeight(value) }"></div>
                  </div>
                  <div class="bar-value">{{ formatLTIFR(value) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fatality Prevention Controls -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Fatality Prevention Controls</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.hse.fatality_prevention_controls }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <ShieldCheckIcon />
        </div>
        <h4>No HSE Data Available</h4>
        <p>Health, Safety & Environment evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const availableProjects = computed(() => projectStore.getAllProjects())

const setSelectedProject = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
}

const formatLTIFR = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A'
  return value.toFixed(2)
}

const getBarHeight = (value: number | null): string => {
  if (value === null || value === undefined) return '0%'
  // Normalize to a reasonable height (assuming max LTIFR of 5.0)
  const maxValue = 5.0
  const height = Math.min((value / maxValue) * 100, 100)
  return `${height}%`
}
</script>

<style scoped>
.hse-evaluation-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.hse-evaluation-content {
  background: #fff;
  padding: 0 32px 32px 32px;
  margin-top: 0;
}

.project-header {
  margin-bottom: 32px;
  margin-top: 0;
  padding-top: 24px;
}

.header-text h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.header-text p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Tab Navigation Styles */
.tab-navigation {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 32px;
  gap: 0;
  overflow-x: auto;
}

.tab-button {
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  position: relative;
  white-space: nowrap;
}

.tab-button:hover {
  color: #008C8E;
  background-color: #f0f9fa;
}

.tab-button.active {
  color: #008C8E;
  border-bottom-color: #008C8E;
  font-weight: 600;
}

/* Project Content */
.project-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Evaluation Grid */
.evaluation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.evaluation-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.evaluation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
}

.card-header {
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
  padding: 20px 24px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.card-content {
  padding: 24px;
}

.card-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Alignment Status */
.alignment-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc2626;
}

.alignment-status.aligned .status-indicator {
  background: #16a34a;
}

.status-text {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

/* HSE Statistics */
.hse-stats {
  display: grid;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-value.zero {
  color: #16a34a;
}

/* Trend Chart */
.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 120px;
  gap: 16px;
}

.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.bar-container {
  width: 100%;
  height: 80px;
  background: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 4px;
  transition: height 0.3s ease;
}

.bar-value {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  background: #f7f9fc;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  margin-top: 32px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #008C8E, #009688);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .tab-navigation {
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 14px;
  }

  .evaluation-grid {
    grid-template-columns: 1fr;
  }

  .hse-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .trend-chart {
    height: 100px;
  }

  .bar-container {
    height: 60px;
  }
}
</style> 