<template>
  <div class="hse-evaluation-layout">
    <div class="hse-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Health, Safety & Environment Evaluation</h1>
          <p>HSE compliance, standards, and workforce safety for {{ currentProject?.name }}</p>
        </div>
      </div>

      <!-- Evaluation Category Tabs -->
      <div class="tab-navigation">
        <button
          v-for="tab in evaluationTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="currentProject?.evaluation?.hse" class="project-content">
        <!-- EIS Status Tab -->
        <div v-if="activeTab === 'eis-status'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>EIS Status</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.hse.eis_status }}</p>
            </div>
          </div>
        </div>

        <!-- HSE Standards Tab -->
        <div v-if="activeTab === 'hse-standards'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Rio Tinto Standards Alignment</h3>
            </div>
            <div class="card-content">
              <div class="standards-status">
                <span class="status-label">Standards Aligned:</span>
                <span :class="['status-value', currentProject.evaluation.hse.rio_tinto_standards_aligned ? 'aligned' : 'not-aligned']">
                  {{ currentProject.evaluation.hse.rio_tinto_standards_aligned ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Issues Tab -->
        <div v-if="activeTab === 'key-issues'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Key Issues</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.hse.key_issues }}</p>
            </div>
          </div>
        </div>

        <!-- Workforce Statistics Tab -->
        <div v-if="activeTab === 'workforce-statistics'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Workforce HSE Statistics</h3>
            </div>
            <div class="card-content">
              <div class="statistics-grid">
                <div class="stat-item">
                  <span class="stat-label">LTIFR</span>
                  <span class="stat-value">{{ currentProject.evaluation.hse.workforce_hse_statistics.ltifr || 'N/A' }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Fatalities</span>
                  <span class="stat-value">{{ currentProject.evaluation.hse.workforce_hse_statistics.fatalities }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LTIF Trend Tab -->
        <div v-if="activeTab === 'ltif-trend'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>LTIF Trend (3 Years)</h3>
            </div>
            <div class="card-content">
              <div class="trend-chart">
                <div class="trend-bars">
                  <div
                    v-for="(value, index) in currentProject.evaluation.hse.ltif_trend_3yr"
                    :key="index"
                    class="trend-bar"
                  >
                    <div class="bar-label">Year {{ index + 1 }}</div>
                    <div class="bar-container">
                      <div
                        class="bar-fill"
                        :style="{ height: getBarHeight(value) }"
                      ></div>
                    </div>
                    <div class="bar-value">{{ value || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fatality Prevention Tab -->
        <div v-if="activeTab === 'fatality-prevention'" class="tab-panel">
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
        <p>HSE evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('eis-status')

const evaluationTabs = [
  { id: 'eis-status', label: 'EIS Status' },
  { id: 'hse-standards', label: 'HSE Standards' },
  { id: 'key-issues', label: 'Key Issues' },
  { id: 'workforce-statistics', label: 'Workforce Statistics' },
  { id: 'ltif-trend', label: 'LTIF Trend' },
  { id: 'fatality-prevention', label: 'Fatality Prevention' }
]

const getBarHeight = (value: number | null): string => {
  if (value === null) return '0%'
  // Normalize to a reasonable height (assuming max LTIFR around 3.0)
  const maxValue = 3.0
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

/* Tab Panel */
.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

/* Evaluation Card */
.evaluation-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
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

/* Standards Status */
.standards-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.status-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.status-value {
  font-size: 16px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
}

.status-value.aligned {
  color: #059669;
  background-color: #ecfdf5;
}

.status-value.not-aligned {
  color: #dc2626;
  background-color: #fef2f2;
}

/* Statistics Grid */
.statistics-grid {
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

/* Trend Chart */
.trend-chart {
  padding: 16px 0;
}

.trend-bars {
  display: flex;
  gap: 24px;
  align-items: end;
  height: 120px;
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
  width: 40px;
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
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

  .hse-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .trend-bars {
    gap: 16px;
  }

  .bar-container {
    width: 30px;
  }
}
</style>
