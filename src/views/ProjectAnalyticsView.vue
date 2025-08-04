<template>
  <div class="project-analytics-layout">
    <div class="project-analytics-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Project Analytics</h1>
          <p>Comprehensive analysis and insights for your selected project</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Project Facts Tab -->
        <div v-if="activeTab === 'facts'" class="tab-panel">
          <div class="project-facts-section">
            <h3>Project Facts</h3>
            <div class="facts-grid">
              <div class="fact-card">
                <div class="fact-icon">
                  <MapPinIcon />
                </div>
                <div class="fact-content">
                  <h4>Location</h4>
                  <p>{{ currentProject?.country_region || 'N/A' }}</p>
                </div>
              </div>

              <div class="fact-card">
                <div class="fact-icon">
                  <CurrencyDollarIcon />
                </div>
                <div class="fact-content">
                  <h4>Capital Cost</h4>
                  <p>{{ currentProject?.capital_cost_usd_billion ? `$${currentProject.capital_cost_usd_billion}B` : 'TBD' }}</p>
                </div>
              </div>

              <div class="fact-card">
                <div class="fact-icon">
                  <ChartBarIcon />
                </div>
                <div class="fact-content">
                  <h4>IRR</h4>
                  <p>{{ currentProject?.post_tax_irr_percent || 'TBD' }}</p>
                </div>
              </div>

              <div class="fact-card">
                <div class="fact-icon">
                  <UserGroupIcon />
                </div>
                <div class="fact-content">
                  <h4>Workforce</h4>
                  <p>{{ currentProject?.workforce_construction_ops || 'TBD' }}</p>
                </div>
              </div>

              <div class="fact-card">
                <div class="fact-icon">
                  <BuildingOfficeIcon />
                </div>
                <div class="fact-content">
                  <h4>Status</h4>
                  <p>{{ formatStatus(currentProject?.status) }}</p>
                </div>
              </div>

              <div class="fact-card">
                <div class="fact-icon">
                  <GlobeAltIcon />
                </div>
                <div class="fact-content">
                  <h4>Key Minerals</h4>
                  <div class="minerals-tags">
                    <span v-for="mineral in currentProject?.key_minerals" :key="mineral" class="mineral-tag">
                      {{ mineral }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Details Tab -->
        <div v-if="activeTab === 'details'" class="tab-panel">
          <div class="project-details-section">
            <h3>Project Details</h3>
            <div class="details-content">
              <div class="detail-item">
                <h4>Current Status</h4>
                <p>{{ currentProject?.current_status || 'N/A' }}</p>
              </div>
              <div class="detail-item">
                <h4>Summary</h4>
                <p>{{ currentProject?.summary || 'N/A' }}</p>
              </div>
              <div class="detail-item">
                <h4>Key Issues & Risks</h4>
                <p>{{ currentProject?.key_issues_risks || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Milestones Tab -->
        <div v-if="activeTab === 'milestones'" class="tab-panel">
          <div class="milestones-section">
            <h3>Project Milestones</h3>
            <div class="timeline-container">
              <div v-if="currentProject?.milestones && currentProject.milestones.length > 0" class="timeline">
                <div v-for="(milestone, index) in currentProject.milestones" :key="index" class="timeline-item">
                  <div class="timeline-marker" :class="milestone.status">
                    <CheckIcon v-if="milestone.status === 'completed'" class="marker-icon" />
                    <ClockIcon v-else-if="milestone.status === 'in-progress'" class="marker-icon" />
                    <CalendarIcon v-else class="marker-icon" />
                  </div>
                  <div class="timeline-content">
                    <div class="milestone-header">
                      <h4 class="milestone-title">{{ milestone.title }}</h4>
                      <span class="milestone-date">{{ milestone.date }}</span>
                    </div>
                    <p class="milestone-description">{{ milestone.description }}</p>
                    <div class="milestone-status">
                      <span class="status-badge" :class="milestone.status || 'pending'">
                        {{ formatMilestoneStatus(milestone.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <div class="empty-icon">
                  <CalendarIcon />
                </div>
                <h4>No Milestones Available</h4>
                <p>Milestone information for this project will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Governance Tab -->
        <div v-if="activeTab === 'governance'" class="tab-panel">
          <div class="governance-section">
            <h3>Governance</h3>
            <div class="empty-state">
              <div class="empty-icon">
                <BuildingOfficeIcon />
              </div>
              <h4>Governance Information</h4>
              <p>Governance details and compliance information will be displayed here.</p>
            </div>
          </div>
        </div>

        <!-- AI Insight Tab -->
        <div v-if="activeTab === 'ai-insight'" class="tab-panel">
          <div class="ai-insight-section">
            <h3>AI Insight</h3>
            <div class="empty-state">
              <div class="empty-icon">
                <ChartBarIcon />
              </div>
              <h4>AI-Powered Insights</h4>
              <p>AI-generated analysis and recommendations will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('facts')

const tabs = [
  { id: 'facts', label: 'Project Facts' },
  { id: 'details', label: 'Project Details' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'governance', label: 'Governance' },
  { id: 'ai-insight', label: 'AI Insight' }
]

const formatStatus = (status: string | undefined) => {
  if (!status) return 'N/A'
  const statusMap: Record<string, string> = {
    'pre-sanction': 'Pre-Sanction',
    'licence-revoked': 'Licence Revoked',
    'operational': 'Operational',
    'pfs-progress': 'PFS Progress'
  }
  return statusMap[status] || status
}

const formatMilestoneStatus = (status: string | undefined) => {
  if (!status) return 'Unknown'
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.project-analytics-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.project-analytics-content {
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

/* Tab Content Styles */
.tab-content {
  min-height: 400px;
}

.tab-panel {
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

/* Project Facts Section */
.project-facts-section {
  margin-bottom: 32px;
}

.project-facts-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.fact-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.fact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
}

.fact-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #008C8E, #009688);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fact-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.fact-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fact-content p {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.minerals-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mineral-tag {
  background: #f0f9fa;
  color: #008C8E;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* Project Details Section */
.project-details-section {
  margin-top: 32px;
}

.project-details-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.details-content {
  display: grid;
  gap: 24px;
}

.detail-item {
  background: #f7f9fc;
  border-radius: 12px;
  padding: 24px;
}

.detail-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.detail-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Milestones Section */
.milestones-section {
  margin-top: 32px;
}

.milestones-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.timeline-container {
  position: relative;
  padding: 24px 0;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding: 0;
  list-style: none;
}

.timeline:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #e5e7eb;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.timeline-marker.completed {
  background: linear-gradient(135deg, #008C8E, #009688);
  box-shadow: 0 0 0 4px #e5e7eb;
}

.timeline-marker.in-progress {
  background: linear-gradient(135deg, #008C8E, #009688);
  box-shadow: 0 0 0 4px #e5e7eb;
}

.timeline-marker.upcoming {
  background: #e5e7eb;
  box-shadow: 0 0 0 4px #e5e7eb;
}

.marker-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.timeline-content {
  position: relative;
  padding: 0 0 0 30px; /* Adjust based on marker width */
  flex-grow: 1;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.milestone-date {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.milestone-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.milestone-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  background: #f0f9fa;
  color: #008C8E;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.completed {
  background: #e5f9f0;
  color: #008C8E;
}

.status-badge.in-progress {
  background: #f0f9fa;
  color: #008C8E;
}

.status-badge.upcoming {
  background: #f7f9fc;
  color: #666;
}

/* Governance and AI Insight Sections */
.governance-section,
.ai-insight-section {
  margin-top: 32px;
}

.governance-section h3,
.ai-insight-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

/* Empty State Styles */
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

  .facts-grid {
    grid-template-columns: 1fr;
  }

  .timeline-container {
    padding: 0 16px;
  }

  .timeline:before {
    left: 10px;
    right: 10px;
    width: auto;
    margin-left: -50%;
  }

  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 30px;
  }

  .timeline-marker {
    position: static;
    transform: none;
    margin-bottom: 15px;
  }

  .timeline-content {
    padding: 0;
    width: 100%;
  }

  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .milestone-title {
    margin-bottom: 4px;
  }

  .milestone-date {
    font-size: 12px;
  }

  .milestone-description {
    font-size: 13px;
  }

  .milestone-status {
    justify-content: flex-start;
  }

  .empty-state {
    padding: 60px 16px;
  }
}
</style>
