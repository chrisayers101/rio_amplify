<template>
  <div class="commercial-evaluation-layout">
    <div class="commercial-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Commercial Evaluation</h1>
          <p>Contract structure, costs, and financial analysis for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.commercial" class="project-content">
        <!-- Contract Structure Tab -->
        <div v-if="activeTab === 'contract-structure'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Contract Structure</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.commercial.contracts_structure }}</p>
            </div>
          </div>
        </div>

        <!-- Status Tab -->
        <div v-if="activeTab === 'status'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Status</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.commercial.status }}</p>
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
              <p>{{ currentProject.evaluation.commercial.key_issues }}</p>
            </div>
          </div>
        </div>

        <!-- Financial Metrics Tab -->
        <div v-if="activeTab === 'financial-metrics'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Financial Metrics</h3>
            </div>
            <div class="card-content">
              <div class="metrics-grid">
                <div class="metric-item">
                  <span class="metric-label">Capital Cost</span>
                  <span class="metric-value">{{ formatCurrency(currentProject.evaluation.commercial.capital_cost_usd_billion) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">NPV</span>
                  <span class="metric-value">{{ currentProject.evaluation.commercial.npv_usd_billion ? formatCurrency(currentProject.evaluation.commercial.npv_usd_billion) : 'TBD' }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">IRR</span>
                  <span class="metric-value">{{ currentProject.evaluation.commercial.irr_percent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Risk Analysis Tab -->
        <div v-if="activeTab === 'cost-risk-analysis'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Cost Risk Analysis</h3>
            </div>
            <div class="card-content">
              <div class="risk-analysis">
                <div class="risk-item">
                  <span class="risk-label">Contingency</span>
                  <span class="risk-value">{{ currentProject.evaluation.commercial.cost_risk_analysis.contingency_percent }}%</span>
                </div>
                <div class="risk-item">
                  <span class="risk-label">Escalation Allowance</span>
                  <span class="risk-value">{{ currentProject.evaluation.commercial.cost_risk_analysis.escalation_allowance_percent }}%</span>
                </div>
                <div class="risk-item">
                  <span class="risk-label">Confidence Class</span>
                  <span class="risk-value">{{ currentProject.evaluation.commercial.cost_risk_analysis.confidence_class }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contract Type Tab -->
        <div v-if="activeTab === 'contract-type'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Contract Type</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.commercial.contract_type }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <DocumentTextIcon />
        </div>
        <h4>No Commercial Data Available</h4>
        <p>Commercial evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('contract-structure')

const evaluationTabs = [
  { id: 'contract-structure', label: 'Contract Structure' },
  { id: 'status', label: 'Status' },
  { id: 'key-issues', label: 'Key Issues' },
  { id: 'financial-metrics', label: 'Financial Metrics' },
  { id: 'cost-risk-analysis', label: 'Cost Risk Analysis' },
  { id: 'contract-type', label: 'Contract Type' }
]

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'TBD'
  return `$${value}B`
}
</script>

<style scoped>
.commercial-evaluation-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.commercial-evaluation-content {
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

/* Financial Metrics */
.metrics-grid {
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

/* Risk Analysis */
.risk-analysis {
  display: grid;
  gap: 16px;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.risk-item:last-child {
  border-bottom: none;
}

.risk-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.risk-value {
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

  .commercial-evaluation-content {
    padding: 0 16px 16px 16px;
  }
}
</style>
