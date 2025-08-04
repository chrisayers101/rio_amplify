<template>
  <div class="schedule-evaluation-layout">
    <div class="schedule-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Schedule Evaluation</h1>
          <p>Project timeline, milestones, and schedule risks for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.schedule" class="project-content">
        <div class="evaluation-grid">
          <!-- Expected First Production -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Expected First Production</h3>
            </div>
            <div class="card-content">
              <div class="production-section">
                <div class="production-year">{{ formatYear(currentProject.evaluation.schedule.expected_first_production_year) }}</div>
                <div class="production-description">
                  Target year for first commercial production
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Risk Index -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Schedule Risk Index</h3>
            </div>
            <div class="card-content">
              <div class="risk-section">
                <div class="risk-index" :class="getRiskClass(currentProject.evaluation.schedule.schedule_risk_index)">
                  {{ currentProject.evaluation.schedule.schedule_risk_index }}
                </div>
                <div class="risk-level">{{ getRiskLevel(currentProject.evaluation.schedule.schedule_risk_index) }}</div>
                <div class="risk-description">
                  Schedule risk assessment (1=Low, 5=High)
                </div>
              </div>
            </div>
          </div>

          <!-- Critical Path Issues -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Critical Path Issues</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.schedule.critical_path_issues }}</p>
            </div>
          </div>

          <!-- Major Milestones -->
          <div class="evaluation-card milestones">
            <div class="card-header">
              <h3>Major Milestones</h3>
            </div>
            <div class="card-content">
              <div v-if="currentProject.evaluation.schedule.major_milestones && currentProject.evaluation.schedule.major_milestones.length > 0" class="milestones-list">
                <div v-for="(milestone, index) in currentProject.evaluation.schedule.major_milestones" :key="index" class="milestone-item">
                  <div class="milestone-header">
                    <div class="milestone-progress">
                      <div class="progress-circle" :class="getMilestoneStatus(milestone.date)">
                        <span class="progress-number">{{ index + 1 }}</span>
                      </div>
                    </div>
                    <div class="milestone-content">
                      <h4 class="milestone-name">{{ milestone.name }}</h4>
                      <div class="milestone-date">{{ formatDate(milestone.date) }}</div>
                    </div>
                    <div class="milestone-status">
                      <span class="status-badge" :class="getMilestoneStatus(milestone.date)">
                        {{ getMilestoneProgress(milestone.date) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-milestones">
                <p>No major milestones defined</p>
              </div>
            </div>
          </div>

          <!-- Timeline Overview -->
          <div class="evaluation-card timeline-overview">
            <div class="card-header">
              <h3>Timeline Overview</h3>
            </div>
            <div class="card-content">
              <div class="timeline-container">
                <div class="timeline-line"></div>
                <div v-for="(milestone, index) in currentProject.evaluation.schedule.major_milestones" :key="index" class="timeline-marker" :class="getMilestoneStatus(milestone.date)">
                  <div class="marker-dot"></div>
                  <div class="marker-label">{{ milestone.name }}</div>
                  <div class="marker-date">{{ formatDate(milestone.date) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Summary -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Schedule Summary</h3>
            </div>
            <div class="card-content">
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-label">Total Milestones</span>
                  <span class="stat-value">{{ currentProject.evaluation.schedule.major_milestones?.length || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Time to Production</span>
                  <span class="stat-value">{{ getTimeToProduction(currentProject.evaluation.schedule.expected_first_production_year) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Risk Level</span>
                  <span class="stat-value" :class="getRiskClass(currentProject.evaluation.schedule.schedule_risk_index)">
                    {{ getRiskLevel(currentProject.evaluation.schedule.schedule_risk_index) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <CalendarIcon />
        </div>
        <h4>No Schedule Data Available</h4>
        <p>Schedule evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { CalendarIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const availableProjects = computed(() => projectStore.getAllProjects())

const setSelectedProject = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
}

const formatYear = (year: number | null): string => {
  if (year === null) return 'TBD'
  return year.toString()
}

const formatDate = (dateString: string): string => {
  // Convert "YYYY-MM" format to "MMM YYYY"
  const [year, month] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getRiskClass = (riskIndex: number): string => {
  if (riskIndex <= 1) return 'low'
  if (riskIndex <= 2) return 'medium-low'
  if (riskIndex <= 3) return 'medium'
  if (riskIndex <= 4) return 'medium-high'
  return 'high'
}

const getRiskLevel = (riskIndex: number): string => {
  if (riskIndex <= 1) return 'Low'
  if (riskIndex <= 2) return 'Medium-Low'
  if (riskIndex <= 3) return 'Medium'
  if (riskIndex <= 4) return 'Medium-High'
  return 'High'
}

const getMilestoneProgress = (dateString: string): string => {
  const [year, month] = dateString.split('-')
  const milestoneDate = new Date(parseInt(year), parseInt(month) - 1)
  const now = new Date()

  if (milestoneDate < now) return 'Completed'
  if (milestoneDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return 'Due Soon'
  return 'Upcoming'
}

const getMilestoneStatus = (dateString: string): string => {
  const [year, month] = dateString.split('-')
  const milestoneDate = new Date(parseInt(year), parseInt(month) - 1)
  const now = new Date()

  if (milestoneDate < now) return 'completed'
  if (milestoneDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return 'due-soon'
  return 'upcoming'
}

const getTimeToProduction = (productionYear: number | null): string => {
  if (productionYear === null) return 'TBD'
  const now = new Date()
  const currentYear = now.getFullYear()
  const yearsToProduction = productionYear - currentYear

  if (yearsToProduction <= 0) return 'This year'
  if (yearsToProduction === 1) return '1 year'
  return `${yearsToProduction} years`
}
</script>

<style scoped>
.schedule-evaluation-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.schedule-evaluation-content {
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

/* Production Section */
.production-section {
  text-align: center;
}

.production-year {
  font-size: 48px;
  font-weight: 700;
  color: #008C8E;
  margin-bottom: 12px;
}

.production-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* Risk Section */
.risk-section {
  text-align: center;
}

.risk-index {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}

.risk-index.low {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
}

.risk-index.medium-low {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
}

.risk-index.medium {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  color: white;
}

.risk-index.medium-high {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
}

.risk-index.high {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
}

.risk-level {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.risk-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* Milestones */
.milestones .card-content {
  padding: 24px;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.milestone-item {
  padding: 16px;
  background: #f7f9fc;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.milestone-item .milestone-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.progress-circle.completed {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}

.progress-circle.due-soon {
  background: linear-gradient(135deg, #d97706, #f59e0b);
}

.progress-circle.upcoming {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.progress-number {
  font-size: 14px;
  font-weight: 600;
}

.milestone-content {
  flex: 1;
}

.milestone-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.milestone-date {
  font-size: 14px;
  color: #666;
}

.milestone-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.due-soon {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.upcoming {
  background: #f3f4f6;
  color: #6b7280;
}

.no-milestones {
  text-align: center;
  color: #666;
  font-style: italic;
}

/* Timeline Overview */
.timeline-overview .card-content {
  padding: 24px;
}

.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  transform: translateY(-50%);
}

.timeline-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #e5e7eb;
  z-index: 1;
}

.timeline-marker.completed .marker-dot {
  background: #16a34a;
  box-shadow: 0 0 0 2px #16a34a;
}

.timeline-marker.due-soon .marker-dot {
  background: #d97706;
  box-shadow: 0 0 0 2px #d97706;
}

.timeline-marker.upcoming .marker-dot {
  background: #6b7280;
  box-shadow: 0 0 0 2px #6b7280;
}

.marker-label {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-top: 8px;
  max-width: 120px;
}

.marker-date {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 4px;
}

/* Summary Stats */
.summary-stats {
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

.stat-value.low {
  color: #16a34a;
}

.stat-value.medium-low {
  color: #d97706;
}

.stat-value.medium {
  color: #d97706;
}

.stat-value.medium-high {
  color: #dc2626;
}

.stat-value.high {
  color: #dc2626;
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

  .schedule-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .production-year {
    font-size: 36px;
  }

  .risk-index {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .milestone-status {
    align-self: flex-end;
  }

  .timeline-container {
    padding: 10px 0;
  }

  .marker-label {
    max-width: 100px;
  }
}
</style>
