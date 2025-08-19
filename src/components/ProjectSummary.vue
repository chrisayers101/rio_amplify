<template>
  <div class="project-summary">
    <div class="summary-header">
      <h2>Project Summary</h2>
      <p>Comprehensive overview of project status and key metrics</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-icon">
          <ChartBarIcon />
        </div>
        <div class="card-content">
          <h3>Overall Progress</h3>
          <div class="progress-circle">
            <div class="progress-value">{{ overallProgress }}%</div>
            <div class="progress-ring">
              <svg class="progress-svg" viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="45" />
                <circle
                  class="progress-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="strokeDashoffset"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <CheckCircleIcon />
        </div>
        <div class="card-content">
          <h3>Completed Sections</h3>
          <div class="metric-value">{{ completedSections }}</div>
          <div class="metric-label">out of {{ totalSections }} total</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <ExclamationTriangleIcon />
        </div>
        <div class="card-content">
          <h3>Critical Issues</h3>
          <div class="metric-value">{{ criticalIssues }}</div>
          <div class="metric-label">require immediate attention</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <ClockIcon />
        </div>
        <div class="card-content">
          <h3>Next Milestone</h3>
          <div class="metric-value">{{ nextMilestone }}</div>
          <div class="metric-label">due in {{ daysUntilMilestone }} days</div>
        </div>
      </div>
    </div>

    <!-- Project Overview -->
    <div class="overview-section">
      <h3>Project Overview</h3>
      <div class="overview-content">
        <div class="overview-item">
          <h4>Project Name</h4>
          <p>{{ projectName || 'N/A' }}</p>
        </div>
        <div class="overview-item">
          <h4>Current Phase</h4>
          <p>{{ currentPhase || 'N/A' }}</p>
        </div>
        <div class="overview-item">
          <h4>Project Manager</h4>
          <p>{{ projectManager || 'N/A' }}</p>
        </div>
        <div class="overview-item">
          <h4>Last Updated</h4>
          <p>{{ lastUpdated || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <!-- Key Highlights -->
    <div class="highlights-section">
      <h3>Key Highlights</h3>
      <div class="highlights-list">
        <div class="highlight-item">
          <div class="highlight-icon success">
            <CheckIcon />
          </div>
          <div class="highlight-content">
            <h4>Major Milestone Achieved</h4>
            <p>Environmental Impact Assessment completed and approved by regulatory authorities.</p>
          </div>
        </div>
        <div class="highlight-item">
          <div class="highlight-icon info">
            <InformationCircleIcon />
          </div>
          <div class="highlight-content">
            <h4>Stakeholder Engagement</h4>
            <p>Community consultation meetings scheduled for next quarter.</p>
          </div>
        </div>
        <div class="highlight-item">
          <div class="highlight-icon warning">
            <ExclamationTriangleIcon />
          </div>
          <div class="highlight-content">
            <h4>Resource Allocation</h4>
            <p>Additional engineering resources required for technical design phase.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Mock data - in a real app, this would come from props or store
const overallProgress = 65
const completedSections = 8
const totalSections = 12
const criticalIssues = 3
const nextMilestone = 'Technical Design Review'
const daysUntilMilestone = 14
const projectName = 'Iron Ore Expansion Project'
const currentPhase = 'Feasibility Study'
const projectManager = 'Sarah Johnson'
const lastUpdated = '2024-01-15'

// Calculate progress circle values
const circumference = 2 * Math.PI * 45
const strokeDashoffset = circumference - (overallProgress / 100) * circumference
</script>

<style scoped>
.project-summary {
  padding: 24px;
  background: #f8fafc;
  height: 100%;
  overflow-y: auto;
}

.summary-header {
  margin-bottom: 32px;
  text-align: center;
}

.summary-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.summary-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #008C8E, #009688);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-circle {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.progress-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 700;
  color: #008C8E;
  z-index: 2;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke: #008C8E;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #008C8E;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.overview-section,
.highlights-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.overview-section h3,
.highlights-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.overview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-item h4 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.overview-item p {
  font-size: 16px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 500;
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.highlight-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.highlight-item:nth-child(1) {
  border-left-color: #10b981;
}

.highlight-item:nth-child(2) {
  border-left-color: #3b82f6;
}

.highlight-item:nth-child(3) {
  border-left-color: #f59e0b;
}

.highlight-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.highlight-icon.success {
  background: #dcfce7;
  color: #166534;
}

.highlight-icon.info {
  background: #dbeafe;
  color: #1e40af;
}

.highlight-icon.warning {
  background: #fef3c7;
  color: #92400e;
}

.highlight-icon svg {
  width: 20px;
  height: 20px;
}

.highlight-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.highlight-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .project-summary {
    padding: 16px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .overview-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .highlight-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
