<template>
  <div class="asset-evaluation-layout">
    <div class="asset-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Asset Management & Lifecycle Costs</h1>
          <p>Mine life, rehabilitation, and operational costs for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.asset_management" class="project-content">
        <div class="evaluation-grid">
          <!-- Mine Life -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Mine Life</h3>
            </div>
            <div class="card-content">
              <div class="lifecycle-section">
                <div class="lifecycle-header">
                  <span class="lifecycle-label">Mine Life</span>
                  <span class="lifecycle-value">{{ currentProject.evaluation.asset_management.mine_life_years }} years</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getMineLifePercentage(currentProject.evaluation.asset_management.mine_life_years) }"></div>
                </div>
                <div class="lifecycle-description">
                  Expected operational lifespan of the mine
                </div>
              </div>
            </div>
          </div>

          <!-- Rehabilitation Provision -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Rehabilitation Provision</h3>
            </div>
            <div class="card-content">
              <div class="cost-section">
                <div class="cost-value">{{ formatCurrency(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion) }}</div>
                <div class="cost-description">
                  Total provision for mine rehabilitation and closure
                </div>
              </div>
            </div>
          </div>

          <!-- Sustaining Capex -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Sustaining Capex</h3>
            </div>
            <div class="card-content">
              <div class="cost-section">
                <div class="cost-value">{{ formatCurrency(currentProject.evaluation.asset_management.sustaining_capex_usd_billion) }}</div>
                <div class="cost-description">
                  Ongoing capital expenditure for asset maintenance
                </div>
              </div>
            </div>
          </div>

          <!-- Operating Cost -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Operating Cost</h3>
            </div>
            <div class="card-content">
              <div class="cost-section">
                <div class="cost-value">${{ currentProject.evaluation.asset_management.opex_usd_per_tonne }}/tonne</div>
                <div class="cost-description">
                  Operating cost per tonne of production
                </div>
              </div>
            </div>
          </div>

          <!-- Lifecycle Cost Breakdown -->
          <div class="evaluation-card lifecycle-breakdown">
            <div class="card-header">
              <h3>Lifecycle Cost Breakdown</h3>
            </div>
            <div class="card-content">
              <div class="breakdown-chart">
                <div class="breakdown-item">
                  <div class="breakdown-label">Initial Capex</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill initial" :style="{ width: getEfficiencyPercentage(currentProject.evaluation.asset_management.sustaining_capex_usd_billion, currentProject.evaluation.commercial?.capital_cost_usd_billion) }"></div>
                  </div>
                  <div class="breakdown-value">{{ formatCurrency(currentProject.evaluation.commercial?.capital_cost_usd_billion) }}</div>
                </div>
                <div class="breakdown-item">
                  <div class="breakdown-label">Sustaining Capex</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill sustaining" :style="{ width: getEfficiencyPercentage(currentProject.evaluation.asset_management.sustaining_capex_usd_billion, currentProject.evaluation.commercial?.capital_cost_usd_billion) }"></div>
                  </div>
                  <div class="breakdown-value">{{ formatCurrency(currentProject.evaluation.asset_management.sustaining_capex_usd_billion) }}</div>
                </div>
                <div class="breakdown-item">
                  <div class="breakdown-label">Rehabilitation</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill rehabilitation" :style="{ width: getEfficiencyPercentage(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion, currentProject.evaluation.commercial?.capital_cost_usd_billion) }"></div>
                  </div>
                  <div class="breakdown-value">{{ formatCurrency(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Asset Efficiency Metrics -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Asset Efficiency Metrics</h3>
            </div>
            <div class="card-content">
              <div class="efficiency-metrics">
                <div class="metric-item">
                  <span class="metric-label">Cost per Tonne</span>
                  <span class="metric-value">${{ currentProject.evaluation.asset_management.opex_usd_per_tonne }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Lifecycle Ratio</span>
                  <span class="metric-value">{{ getLifecycleRatio(currentProject.evaluation.asset_management.sustaining_capex_usd_billion, currentProject.evaluation.commercial?.capital_cost_usd_billion) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Rehabilitation %</span>
                  <span class="metric-value">{{ getRehabilitationPercentage(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion, currentProject.evaluation.commercial?.capital_cost_usd_billion) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <BuildingOfficeIcon />
        </div>
        <h4>No Asset Management Data Available</h4>
        <p>Asset management and lifecycle cost data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const availableProjects = computed(() => projectStore.getAllProjects())

const setSelectedProject = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
}

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'TBD'
  return `$${value}B`
}

const getMineLifePercentage = (years: number): string => {
  // Normalize to a reasonable scale (assuming max mine life of 50 years)
  const maxYears = 50
  const percentage = Math.min((years / maxYears) * 100, 100)
  return `${percentage}%`
}

const getEfficiencyPercentage = (value: number, total: number | null | undefined): string => {
  if (!total || total === 0) return '0%'
  const percentage = Math.min((value / total) * 100, 100)
  return `${percentage}%`
}

const getLifecycleRatio = (sustaining: number, initial: number | null | undefined): string => {
  if (!initial || initial === 0) return 'N/A'
  const ratio = (sustaining / initial).toFixed(2)
  return ratio
}

const getRehabilitationPercentage = (rehab: number, initial: number | null | undefined): string => {
  if (!initial || initial === 0) return 'N/A'
  const percentage = ((rehab / initial) * 100).toFixed(1)
  return percentage
}
</script>

<style scoped>
.asset-evaluation-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.asset-evaluation-content {
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

/* Lifecycle Section */
.lifecycle-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lifecycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lifecycle-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.lifecycle-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.lifecycle-description {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

/* Cost Section */
.cost-section {
  text-align: center;
}

.cost-value {
  font-size: 32px;
  font-weight: 700;
  color: #008C8E;
  margin-bottom: 12px;
}

.cost-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* Lifecycle Breakdown */
.lifecycle-breakdown .card-content {
  padding: 24px;
}

.breakdown-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breakdown-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 120px;
}

.breakdown-bar {
  flex: 1;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.breakdown-fill.initial {
  background: linear-gradient(135deg, #008C8E, #009688);
}

.breakdown-fill.sustaining {
  background: linear-gradient(135deg, #d97706, #f59e0b);
}

.breakdown-fill.rehabilitation {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.breakdown-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  min-width: 80px;
  text-align: right;
}

/* Efficiency Metrics */
.efficiency-metrics {
  display: grid;
  gap: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
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

  .asset-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .cost-value {
    font-size: 24px;
  }

  .breakdown-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .breakdown-label {
    min-width: auto;
  }

  .breakdown-value {
    min-width: auto;
    text-align: left;
  }
}
</style> 