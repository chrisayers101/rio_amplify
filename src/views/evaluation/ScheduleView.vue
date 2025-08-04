<template>
  <div class="schedule-evaluation-layout">
    <div class="schedule-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Schedule Evaluation</h1>
          <p>Timeline, milestones, and schedule risk assessment for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.schedule" class="project-content">
        <!-- Production Timeline Tab -->
        <div v-if="activeTab === 'production-timeline'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Production Timeline</h3>
            </div>
            <div class="card-content">
              <div class="timeline-display">
                <div class="timeline-info">
                  <div class="timeline-item">
                    <span class="timeline-label">Expected First Production</span>
                    <span class="timeline-value">{{ formatYear(currentProject.evaluation.schedule.expected_first_production_year) }}</span>
                  </div>
                  <div class="timeline-item">
                    <span class="timeline-label">Time to Production</span>
                    <span class="timeline-value">{{ getTimeToProduction(currentProject.evaluation.schedule.expected_first_production_year) }}</span>
                  </div>
                </div>
                <div class="timeline-visualization">
                  <div class="timeline-bar">
                    <div class="timeline-marker" :style="{ left: getTimelinePosition(currentProject.evaluation.schedule.expected_first_production_year) }"></div>
                  </div>
                  <div class="timeline-scale">
                    <span>2020</span>
                    <span>2030</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Major Milestones Tab -->
        <div v-if="activeTab === 'major-milestones'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Major Milestones</h3>
            </div>
            <div class="card-content">
              <div class="milestones-list">
                <div
                  v-for="(milestone, index) in currentProject.evaluation.schedule.major_milestones"
                  :key="index"
                  class="milestone-item"
                >
                  <div class="milestone-header">
                    <span class="milestone-name">{{ milestone.name }}</span>
                    <span :class="['milestone-status', getMilestoneStatus(milestone.date)]">
                      {{ getMilestoneStatus(milestone.date) }}
                    </span>
                  </div>
                  <div class="milestone-date">{{ formatDate(milestone.date) }}</div>
                  <div class="milestone-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: getMilestoneProgress(milestone.date) }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Path Issues Tab -->
        <div v-if="activeTab === 'critical-path-issues'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Critical Path Issues</h3>
            </div>
            <div class="card-content">
              <div class="issues-display">
                <p>{{ currentProject.evaluation.schedule.critical_path_issues }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Risk Tab -->
        <div v-if="activeTab === 'schedule-risk'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Schedule Risk Assessment</h3>
            </div>
            <div class="card-content">
              <div class="risk-display">
                <div class="risk-metric">
                  <span class="risk-label">Schedule Risk Index</span>
                  <span class="risk-value">{{ currentProject.evaluation.schedule.schedule_risk_index }}</span>
                </div>
                <div class="risk-classification">
                  <span class="classification-label">Risk Level</span>
                  <span :class="['classification-value', `risk-${getRiskLevel(currentProject.evaluation.schedule.schedule_risk_index)}`]">
                    {{ getRiskClass(currentProject.evaluation.schedule.schedule_risk_index) }}
                  </span>
                </div>
                <div class="risk-indicator">
                  <div class="indicator-bar">
                    <div
                      class="indicator-fill"
                      :style="{ width: `${(currentProject.evaluation.schedule.schedule_risk_index / 10) * 100}%` }"
                    ></div>
                  </div>
                  <div class="indicator-scale">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Overview Tab -->
        <div v-if="activeTab === 'timeline-overview'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Timeline Overview</h3>
            </div>
            <div class="card-content">
              <div class="overview-display">
                <div class="overview-item">
                  <span class="overview-label">Project Duration</span>
                  <span class="overview-value">{{ getProjectDuration() }}</span>
                </div>
                <div class="overview-item">
                  <span class="overview-label">Milestone Count</span>
                  <span class="overview-value">{{ currentProject.evaluation.schedule.major_milestones.length }}</span>
                </div>
                <div class="overview-item">
                  <span class="overview-label">Average Milestone Spacing</span>
                  <span class="overview-value">{{ getAverageMilestoneSpacing() }}</span>
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
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { CalendarIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('production-timeline')

const evaluationTabs = [
  { id: 'production-timeline', label: 'Production Timeline' },
  { id: 'major-milestones', label: 'Major Milestones' },
  { id: 'critical-path-issues', label: 'Critical Path Issues' },
  { id: 'schedule-risk', label: 'Schedule Risk' },
  { id: 'timeline-overview', label: 'Timeline Overview' }
]

const formatYear = (year: number | null): string => {
  if (year === null) return 'TBD'
  return year.toString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const getTimeToProduction = (year: number | null): string => {
  if (year === null) return 'TBD'

  const now = new Date()
  const currentYear = now.getFullYear()
  const yearsToProduction = year - currentYear

  if (yearsToProduction <= 0) return 'This year'
  if (yearsToProduction === 1) return '1 year'
  return `${yearsToProduction} years`
}

const getTimelinePosition = (year: number | null): string => {
  if (year === null) return '50%'

  // Position between 2020-2030 scale
  const minYear = 2020
  const maxYear = 2030
  const position = Math.max(0, Math.min(100, ((year - minYear) / (maxYear - minYear)) * 100))
  return `${position}%`
}

const getMilestoneStatus = (dateString: string): string => {
  const milestoneDate = new Date(dateString)
  const now = new Date()

  if (milestoneDate < now) return 'Completed'
  if (milestoneDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return 'Upcoming'
  return 'Planned'
}

const getMilestoneProgress = (dateString: string): string => {
  const milestoneDate = new Date(dateString)
  const now = new Date()

  if (milestoneDate < now) return '100%'

  // Calculate progress based on project start (assuming 2020)
  const projectStart = new Date('2020-01-01')
  const totalDuration = milestoneDate.getTime() - projectStart.getTime()
  const elapsed = now.getTime() - projectStart.getTime()

  if (elapsed <= 0) return '0%'
  if (elapsed >= totalDuration) return '100%'

  return `${(elapsed / totalDuration) * 100}%`
}

const getRiskClass = (index: number): string => {
  if (index <= 3) return 'Low'
  if (index <= 6) return 'Medium'
  return 'High'
}

const getRiskLevel = (index: number): string => {
  if (index <= 3) return 'low'
  if (index <= 6) return 'medium'
  return 'high'
}

const getProjectDuration = (): string => {
  const milestones = currentProject.value?.evaluation?.schedule?.major_milestones
  if (!milestones || milestones.length < 2) return 'TBD'

  const firstDate = new Date(milestones[0].date)
  const lastDate = new Date(milestones[milestones.length - 1].date)
  const durationYears = (lastDate.getFullYear() - firstDate.getFullYear())

  if (durationYears === 1) return '1 year'
  return `${durationYears} years`
}

const getAverageMilestoneSpacing = (): string => {
  const milestones = currentProject.value?.evaluation?.schedule?.major_milestones
  if (!milestones || milestones.length < 2) return 'TBD'

  const firstDate = new Date(milestones[0].date)
  const lastDate = new Date(milestones[milestones.length - 1].date)
  const totalMonths = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
                      (lastDate.getMonth() - firstDate.getMonth())
  const averageMonths = Math.round(totalMonths / (milestones.length - 1))

  if (averageMonths === 1) return '1 month'
  if (averageMonths < 12) return `${averageMonths} months`

  const years = Math.floor(averageMonths / 12)
  const months = averageMonths % 12

  if (months === 0) return `${years} year${years > 1 ? 's' : ''}`
  return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`
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

/* Timeline Display */
.timeline-display {
  text-align: center;
}

.timeline-info {
  margin-bottom: 24px;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.timeline-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.timeline-visualization {
  margin-top: 24px;
}

.timeline-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  position: relative;
  margin-bottom: 12px;
}

.timeline-marker {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
}

.timeline-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

/* Milestones List */
.milestones-list {
  display: grid;
  gap: 16px;
}

.milestone-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.milestone-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.milestone-status.completed {
  background-color: #ecfdf5;
  color: #059669;
}

.milestone-status.upcoming {
  background-color: #fffbeb;
  color: #d97706;
}

.milestone-status.planned {
  background-color: #f0f9ff;
  color: #2563eb;
}

.milestone-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.milestone-progress {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Issues Display */
.issues-display p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Risk Display */
.risk-display {
  text-align: center;
}

.risk-metric {
  margin-bottom: 24px;
}

.risk-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.risk-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #008C8E;
  display: block;
}

.risk-classification {
  margin-bottom: 24px;
}

.classification-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.classification-value {
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  display: inline-block;
}

.classification-value.risk-low {
  background-color: #ecfdf5;
  color: #059669;
}

.classification-value.risk-medium {
  background-color: #fffbeb;
  color: #d97706;
}

.classification-value.risk-high {
  background-color: #fef2f2;
  color: #dc2626;
}

.risk-indicator {
  margin-top: 24px;
}

.indicator-bar {
  width: 100%;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.indicator-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.indicator-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

/* Overview Display */
.overview-display {
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

  .schedule-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .risk-value {
    font-size: 2rem;
  }

  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
