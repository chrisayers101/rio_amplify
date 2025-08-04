<template>
  <div class="asset-evaluation-layout">
    <div class="asset-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Asset Management & Lifecycle Costs</h1>
          <p>Asset lifecycle analysis and cost management for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.asset_management" class="project-content">
        <!-- Mine Life Tab -->
        <div v-if="activeTab === 'mine-life'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Mine Life</h3>
            </div>
            <div class="card-content">
              <div class="mine-life-display">
                <div class="life-metric">
                  <span class="metric-value">{{ currentProject.evaluation.asset_management.mine_life_years }}</span>
                  <span class="metric-label">Years</span>
                </div>
                <div class="life-visualization">
                  <div class="life-bar">
                    <div
                      class="life-fill"
                      :style="{ width: getMineLifePercentage(currentProject.evaluation.asset_management.mine_life_years) }"
                    ></div>
                  </div>
                  <div class="life-scale">
                    <span>0 years</span>
                    <span>50+ years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rehabilitation Provision Tab -->
        <div v-if="activeTab === 'rehabilitation-provision'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Rehabilitation Provision</h3>
            </div>
            <div class="card-content">
              <div class="rehabilitation-display">
                <div class="provision-amount">
                  <span class="amount-value">{{ formatCurrency(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion) }}</span>
                  <span class="amount-label">USD Billion</span>
                </div>
                <div class="provision-breakdown">
                  <div class="breakdown-item">
                    <span class="breakdown-label">Provision Percentage</span>
                    <span class="breakdown-value">{{ getRehabilitationPercentage(currentProject.evaluation.asset_management.rehabilitation_provision_usd_billion) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sustaining Capex Tab -->
        <div v-if="activeTab === 'sustaining-capex'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Sustaining Capital Expenditure</h3>
            </div>
            <div class="card-content">
              <div class="capex-display">
                <div class="capex-amount">
                  <span class="amount-value">{{ formatCurrency(currentProject.evaluation.asset_management.sustaining_capex_usd_billion) }}</span>
                  <span class="amount-label">USD Billion</span>
                </div>
                <div class="capex-efficiency">
                  <div class="efficiency-item">
                    <span class="efficiency-label">Efficiency Ratio</span>
                    <span class="efficiency-value">{{ getEfficiencyPercentage(currentProject.evaluation.asset_management.sustaining_capex_usd_billion) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OPEX per Tonne Tab -->
        <div v-if="activeTab === 'opex-per-tonne'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Operating Expenditure per Tonne</h3>
            </div>
            <div class="card-content">
              <div class="opex-display">
                <div class="opex-amount">
                  <span class="amount-value">${{ currentProject.evaluation.asset_management.opex_usd_per_tonne }}</span>
                  <span class="amount-label">USD per Tonne</span>
                </div>
                <div class="opex-comparison">
                  <div class="comparison-item">
                    <span class="comparison-label">Industry Average</span>
                    <span class="comparison-value">$15-20</span>
                  </div>
                  <div class="comparison-item">
                    <span class="comparison-label">Cost Efficiency</span>
                    <span class="comparison-value">{{ getCostEfficiency(currentProject.evaluation.asset_management.opex_usd_per_tonne) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifecycle Overview Tab -->
        <div v-if="activeTab === 'lifecycle-overview'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Lifecycle Cost Overview</h3>
            </div>
            <div class="card-content">
              <div class="lifecycle-overview">
                <div class="overview-item">
                  <span class="overview-label">Total Lifecycle Cost</span>
                  <span class="overview-value">{{ formatCurrency(getTotalLifecycleCost()) }}</span>
                </div>
                <div class="overview-item">
                  <span class="overview-label">Cost per Year</span>
                  <span class="overview-value">{{ formatCurrency(getAnnualCost()) }}</span>
                </div>
                <div class="overview-item">
                  <span class="overview-label">Lifecycle Ratio</span>
                  <span class="overview-value">{{ getLifecycleRatio() }}</span>
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
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('mine-life')

const evaluationTabs = [
  { id: 'mine-life', label: 'Mine Life' },
  { id: 'rehabilitation-provision', label: 'Rehabilitation Provision' },
  { id: 'sustaining-capex', label: 'Sustaining Capex' },
  { id: 'opex-per-tonne', label: 'OPEX per Tonne' },
  { id: 'lifecycle-overview', label: 'Lifecycle Overview' }
]

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'TBD'
  return `$${value}B`
}

const getMineLifePercentage = (years: number): string => {
  // Normalize to a 50-year scale
  const maxYears = 50
  const percentage = Math.min((years / maxYears) * 100, 100)
  return `${percentage}%`
}

const getRehabilitationPercentage = (provision: number): string => {
  // Calculate as percentage of total lifecycle cost (estimated)
  const totalCost = getTotalLifecycleCost()
  if (totalCost === 0) return '0'
  return ((provision / totalCost) * 100).toFixed(1)
}

const getEfficiencyPercentage = (capex: number): string => {
  // Calculate efficiency based on capex relative to industry standards
  const industryStandard = 0.2 // 20% of total cost
  const efficiency = Math.max(0, (1 - (capex / industryStandard)) * 100)
  return Math.min(efficiency, 100).toFixed(1)
}

const getCostEfficiency = (opex: number): string => {
  const industryAverage = 17.5 // Average of $15-20
  if (opex <= industryAverage * 0.8) return 'Excellent'
  if (opex <= industryAverage) return 'Good'
  if (opex <= industryAverage * 1.2) return 'Average'
  return 'Below Average'
}

const getTotalLifecycleCost = (): number => {
  if (!currentProject.value?.evaluation?.asset_management) return 0
  const asset = currentProject.value.evaluation.asset_management
  return (asset.sustaining_capex_usd_billion || 0) + (asset.rehabilitation_provision_usd_billion || 0)
}

const getAnnualCost = (): number => {
  const totalCost = getTotalLifecycleCost()
  const mineLife = currentProject.value?.evaluation?.asset_management?.mine_life_years || 1
  return totalCost / mineLife
}

const getLifecycleRatio = (): string => {
  const asset = currentProject.value?.evaluation?.asset_management
  if (!asset) return 'N/A'

  const sustainingCapex = asset.sustaining_capex_usd_billion || 0
  const rehabilitation = asset.rehabilitation_provision_usd_billion || 0

  if (sustainingCapex === 0) return 'N/A'

  const ratio = rehabilitation / sustainingCapex
  return ratio.toFixed(2)
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

/* Mine Life Display */
.mine-life-display {
  text-align: center;
}

.life-metric {
  margin-bottom: 24px;
}

.metric-value {
  font-size: 3rem;
  font-weight: 700;
  color: #008C8E;
  display: block;
}

.metric-label {
  font-size: 16px;
  color: #666;
  display: block;
  margin-top: 8px;
}

.life-visualization {
  margin-top: 24px;
}

.life-bar {
  width: 100%;
  height: 16px;
  background-color: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.life-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.life-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

/* Rehabilitation Display */
.rehabilitation-display {
  text-align: center;
}

.provision-amount {
  margin-bottom: 24px;
}

.amount-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #008C8E;
  display: block;
}

.amount-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-top: 8px;
}

.provision-breakdown {
  display: grid;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.breakdown-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Capex Display */
.capex-display {
  text-align: center;
}

.capex-amount {
  margin-bottom: 24px;
}

.capex-efficiency {
  display: grid;
  gap: 16px;
}

.efficiency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.efficiency-item:last-child {
  border-bottom: none;
}

.efficiency-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.efficiency-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

/* OPEX Display */
.opex-display {
  text-align: center;
}

.opex-amount {
  margin-bottom: 24px;
}

.opex-comparison {
  display: grid;
  gap: 16px;
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comparison-item:last-child {
  border-bottom: none;
}

.comparison-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.comparison-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Lifecycle Overview */
.lifecycle-overview {
  display: grid;
  gap: 16px;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.overview-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.overview-value {
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

  .asset-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .metric-value {
    font-size: 2.5rem;
  }

  .amount-value {
    font-size: 2rem;
  }
}
</style>
