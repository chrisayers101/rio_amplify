<template>
  <div class="project-risks">
    <div class="risks-header">
      <h2>Project Risks</h2>
      <p>Comprehensive risk assessment and mitigation strategies</p>
    </div>

    <!-- Risk Summary Cards -->
    <div class="risk-summary-grid">
      <div class="risk-summary-card high">
        <div class="card-icon">
          <ExclamationTriangleIcon />
        </div>
        <div class="card-content">
          <h3>High Risk</h3>
          <div class="risk-count">{{ highRiskCount }}</div>
          <div class="risk-label">items</div>
        </div>
      </div>

      <div class="risk-summary-card medium">
        <div class="card-icon">
          <ExclamationTriangleIcon />
        </div>
        <div class="card-content">
          <h3>Medium Risk</h3>
          <div class="risk-count">{{ mediumRiskCount }}</div>
          <div class="risk-label">items</div>
        </div>
      </div>

      <div class="risk-summary-card low">
        <div class="card-icon">
          <ExclamationTriangleIcon />
        </div>
        <div class="card-content">
          <h3>Low Risk</h3>
          <div class="risk-count">{{ lowRiskCount }}</div>
          <div class="risk-label">items</div>
        </div>
      </div>

      <div class="risk-summary-card mitigated">
        <div class="card-icon">
          <CheckCircleIcon />
        </div>
        <div class="card-content">
          <h3>Mitigated</h3>
          <div class="risk-count">{{ mitigatedRiskCount }}</div>
          <div class="risk-label">items</div>
        </div>
      </div>
    </div>

    <!-- Risk Matrix -->
    <div class="risk-matrix-section">
      <h3>Risk Matrix</h3>
      <div class="matrix-container">
        <div class="matrix-header">
          <div class="matrix-cell header">Probability</div>
          <div class="matrix-cell header">Low (1)</div>
          <div class="matrix-cell header">Medium (2)</div>
          <div class="matrix-cell header">High (3)</div>
        </div>
        <div class="matrix-row">
          <div class="matrix-cell header">High (3)</div>
          <div class="matrix-cell medium">M</div>
          <div class="matrix-cell high">H</div>
          <div class="matrix-cell critical">C</div>
        </div>
        <div class="matrix-row">
          <div class="matrix-cell header">Medium (2)</div>
          <div class="matrix-cell low">L</div>
          <div class="matrix-cell medium">M</div>
          <div class="matrix-cell high">H</div>
        </div>
        <div class="matrix-row">
          <div class="matrix-cell header">Low (1)</div>
          <div class="matrix-cell low">L</div>
          <div class="matrix-cell low">L</div>
          <div class="matrix-cell medium">M</div>
        </div>
      </div>
      <div class="matrix-legend">
        <div class="legend-item">
          <span class="legend-color critical"></span>
          <span>Critical (9)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color high"></span>
          <span>High (6-8)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color medium"></span>
          <span>Medium (4-5)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color low"></span>
          <span>Low (1-3)</span>
        </div>
      </div>
    </div>

    <!-- Risk Details -->
    <div class="risks-details-section">
      <h3>Risk Details</h3>
      <div class="risk-filters">
        <button
          v-for="filter in riskFilters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="['filter-btn', { active: activeFilter === filter.value }]"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="risks-list">
        <div
          v-for="risk in filteredRisks"
          :key="risk.id"
          class="risk-item"
          :class="getRiskClass(risk.severity)"
        >
          <div class="risk-header">
            <div class="risk-severity" :class="getRiskClass(risk.severity)">
              {{ risk.severity }}
            </div>
            <div class="risk-title">{{ risk.title }}</div>
            <div class="risk-score">{{ risk.score }}</div>
          </div>
          <div class="risk-description">{{ risk.description }}</div>
          <div class="risk-details">
            <div class="risk-detail">
              <span class="detail-label">Probability:</span>
              <span class="detail-value">{{ risk.probability }}</span>
            </div>
            <div class="risk-detail">
              <span class="detail-label">Impact:</span>
              <span class="detail-value">{{ risk.impact }}</span>
            </div>
            <div class="risk-detail">
              <span class="detail-label">Owner:</span>
              <span class="detail-value">{{ risk.owner }}</span>
            </div>
            <div class="risk-detail">
              <span class="detail-label">Due Date:</span>
              <span class="detail-value">{{ risk.dueDate }}</span>
            </div>
          </div>
          <div class="risk-mitigation">
            <h4>Mitigation Strategy</h4>
            <p>{{ risk.mitigation }}</p>
          </div>
          <div class="risk-status">
            <span class="status-badge" :class="getStatusClass(risk.status)">
              {{ risk.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Mock data - in a real app, this would come from props or store
const risks = ref([
  {
    id: 1,
    title: 'Environmental Permit Delays',
    description: 'Risk of delays in obtaining environmental permits from regulatory authorities.',
    severity: 'High',
    score: 8,
    probability: 'Medium',
    impact: 'High',
    owner: 'Environmental Team',
    dueDate: '2024-03-15',
    mitigation: 'Engage with regulators early, prepare comprehensive documentation, establish relationships with key stakeholders.',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Resource Shortages',
    description: 'Potential shortage of skilled labor and specialized equipment during peak construction phase.',
    severity: 'Medium',
    score: 6,
    probability: 'Medium',
    impact: 'Medium',
    owner: 'Construction Manager',
    dueDate: '2024-04-30',
    mitigation: 'Develop resource contingency plans, establish partnerships with suppliers, cross-train team members.',
    status: 'Planned'
  },
  {
    id: 3,
    title: 'Budget Overruns',
    description: 'Risk of exceeding budget due to scope creep and unforeseen technical challenges.',
    severity: 'High',
    score: 7,
    probability: 'High',
    impact: 'Medium',
    owner: 'Project Manager',
    dueDate: '2024-02-28',
    mitigation: 'Implement strict change control, regular budget reviews, contingency fund allocation.',
    status: 'In Progress'
  },
  {
    id: 4,
    title: 'Technical Design Issues',
    description: 'Complex technical requirements may lead to design revisions and construction delays.',
    severity: 'Medium',
    score: 5,
    probability: 'Low',
    impact: 'High',
    owner: 'Technical Lead',
    dueDate: '2024-03-31',
    mitigation: 'Early prototyping, peer reviews, stakeholder validation sessions.',
    status: 'Planned'
  }
])

const activeFilter = ref('all')

const riskFilters = [
  { label: 'All Risks', value: 'all' },
  { label: 'High Risk', value: 'high' },
  { label: 'Medium Risk', value: 'medium' },
  { label: 'Low Risk', value: 'low' },
  { label: 'Mitigated', value: 'mitigated' }
]

// Computed properties
const highRiskCount = computed(() => risks.value.filter(r => r.severity === 'High').length)
const mediumRiskCount = computed(() => risks.value.filter(r => r.severity === 'Medium').length)
const lowRiskCount = computed(() => risks.value.filter(r => r.severity === 'Low').length)
const mitigatedRiskCount = computed(() => risks.value.filter(r => r.status === 'Mitigated').length)

const filteredRisks = computed(() => {
  if (activeFilter.value === 'all') return risks.value
  return risks.value.filter(risk => {
    if (activeFilter.value === 'mitigated') return risk.status === 'Mitigated'
    return risk.severity.toLowerCase() === activeFilter.value
  })
})

// Helper functions
const getRiskClass = (severity: string) => {
  return severity.toLowerCase().replace(' ', '-')
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'status-in-progress'
    case 'planned':
      return 'status-planned'
    case 'mitigated':
      return 'status-mitigated'
    default:
      return 'status-unknown'
  }
}
</script>

<style scoped>
.project-risks {
  padding: 24px;
  background: #f8fafc;
  height: 100%;
  overflow-y: auto;
}

.risks-header {
  margin-bottom: 32px;
  text-align: center;
}

.risks-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.risks-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.risk-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.risk-summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.risk-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.risk-summary-card.high {
  border-left: 4px solid #ef4444;
}

.risk-summary-card.medium {
  border-left: 4px solid #f59e0b;
}

.risk-summary-card.low {
  border-left: 4px solid #10b981;
}

.risk-summary-card.mitigated {
  border-left: 4px solid #3b82f6;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.risk-summary-card.high .card-icon {
  background: #fee2e2;
  color: #dc2626;
}

.risk-summary-card.medium .card-icon {
  background: #fef3c7;
  color: #d97706;
}

.risk-summary-card.low .card-icon {
  background: #dcfce7;
  color: #059669;
}

.risk-summary-card.mitigated .card-icon {
  background: #dbeafe;
  color: #2563eb;
}

.card-icon svg {
  width: 20px;
  height: 20px;
}

.card-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.risk-label {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.risk-matrix-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.risk-matrix-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.matrix-container {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.matrix-header,
.matrix-row {
  display: contents;
}

.matrix-cell {
  background: white;
  padding: 16px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matrix-cell.header {
  background: #f9fafb;
  color: #374151;
  font-size: 14px;
}

.matrix-cell.low {
  background: #dcfce7;
  color: #166534;
}

.matrix-cell.medium {
  background: #fef3c7;
  color: #92400e;
}

.matrix-cell.high {
  background: #fee2e2;
  color: #991b1b;
}

.matrix-cell.critical {
  background: #fef2f2;
  color: #7f1d1d;
  font-weight: 700;
}

.matrix-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.critical {
  background: #fef2f2;
  border: 2px solid #dc2626;
}

.legend-color.high {
  background: #fee2e2;
  border: 2px solid #ef4444;
}

.legend-color.medium {
  background: #fef3c7;
  border: 2px solid #f59e0b;
}

.legend-color.low {
  background: #dcfce7;
  border: 2px solid #10b981;
}

.risks-details-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.risks-details-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.risk-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.filter-btn.active {
  background: #008C8E;
  border-color: #008C8E;
  color: white;
}

.risks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.risk-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
}

.risk-item.high {
  border-left: 4px solid #ef4444;
}

.risk-item.medium {
  border-left: 4px solid #f59e0b;
}

.risk-item.low {
  border-left: 4px solid #10b981;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.risk-severity {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-severity.high {
  background: #fee2e2;
  color: #991b1b;
}

.risk-severity.medium {
  background: #fef3c7;
  color: #92400e;
}

.risk-severity.low {
  background: #dcfce7;
  color: #166534;
}

.risk-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.risk-score {
  font-size: 24px;
  font-weight: 700;
  color: #008C8E;
}

.risk-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}

.risk-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.risk-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.risk-mitigation {
  margin-bottom: 16px;
}

.risk-mitigation h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-mitigation p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.risk-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.status-planned {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-mitigated {
  background: #dcfce7;
  color: #166534;
}

.status-badge.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .project-risks {
    padding: 16px;
  }

  .risk-summary-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .matrix-container {
    font-size: 12px;
  }

  .matrix-cell {
    padding: 12px 8px;
  }

  .risk-filters {
    justify-content: center;
  }

  .risk-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .risk-details {
    grid-template-columns: 1fr;
  }
}
</style>
