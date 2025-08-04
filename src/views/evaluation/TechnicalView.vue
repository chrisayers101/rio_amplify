<template>
  <div class="technical-evaluation-layout">
    <div class="technical-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Technical Evaluation</h1>
          <p>Design maturity, compliance, and technical risks for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.technical" class="project-content">
        <div class="evaluation-grid">
          <!-- Compliance Study Definition Guidelines -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Compliance Study Definition Guidelines</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.technical.compliance_study_definition_guidelines }}</p>
            </div>
          </div>

          <!-- Design Maturity -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Design Maturity</h3>
            </div>
            <div class="card-content">
              <div class="maturity-section">
                <div class="maturity-header">
                  <span class="maturity-label">Design Maturity</span>
                  <span class="maturity-value">{{ currentProject.evaluation.technical.design_maturity_percent }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${currentProject.evaluation.technical.design_maturity_percent}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Technology Readiness Level -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Technology Readiness Level</h3>
            </div>
            <div class="card-content">
              <div class="trl-section">
                <div class="trl-value">{{ currentProject.evaluation.technical.technology_readiness_level }}</div>
                <div class="trl-description">
                  {{ getTRLDescription(currentProject.evaluation.technical.technology_readiness_level) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Red Flags -->
          <div class="evaluation-card red-flags">
            <div class="card-header">
              <h3>Red Flags</h3>
            </div>
            <div class="card-content">
              <div v-if="currentProject.evaluation.technical.red_flags && currentProject.evaluation.technical.red_flags.length > 0" class="flags-list">
                <div v-for="(flag, index) in currentProject.evaluation.technical.red_flags" :key="index" class="flag-item" :class="flag.severity.toLowerCase()">
                  <div class="flag-header">
                    <span class="flag-category">{{ flag.category }}</span>
                    <span class="flag-severity" :class="flag.severity.toLowerCase()">{{ flag.severity }}</span>
                  </div>
                  <p class="flag-description">{{ flag.description }}</p>
                </div>
              </div>
              <div v-else class="no-flags">
                <p>No red flags identified</p>
              </div>
            </div>
          </div>

          <!-- SME Assessments -->
          <div class="evaluation-card">
            <div class="card-header">
              <h3>SME Assessments</h3>
            </div>
            <div class="card-content">
              <div class="sme-assessments">
                <div class="sme-item">
                  <h4 class="sme-title">Electrical</h4>
                  <p class="sme-content">{{ currentProject.evaluation.technical.sme.electrical }}</p>
                </div>
                <div class="sme-item">
                  <h4 class="sme-title">Environmental</h4>
                  <p class="sme-content">{{ currentProject.evaluation.technical.sme.environmental }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <CogIcon />
        </div>
        <h4>No Technical Data Available</h4>
        <p>Technical evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { CogIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const availableProjects = computed(() => projectStore.getAllProjects())

const setSelectedProject = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
}

const getTRLDescription = (level: number): string => {
  const descriptions: Record<number, string> = {
    1: 'Basic principles observed and reported',
    2: 'Technology concept and/or application formulated',
    3: 'Analytical and experimental critical function and/or characteristic proof-of-concept',
    4: 'Component and/or breadboard validation in laboratory environment',
    5: 'Component and/or breadboard validation in relevant environment',
    6: 'System/subsystem model or prototype demonstration in a relevant environment',
    7: 'System prototype demonstration in an operational environment',
    8: 'Actual system completed and qualified through test and demonstration',
    9: 'Actual system proven through successful mission operations'
  }
  return descriptions[level] || 'Level not defined'
}
</script>

<style scoped>
.technical-evaluation-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.technical-evaluation-content {
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

/* Design Maturity */
.maturity-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.maturity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.maturity-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.maturity-value {
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

/* Technology Readiness Level */
.trl-section {
  text-align: center;
}

.trl-value {
  font-size: 48px;
  font-weight: 700;
  color: #008C8E;
  margin-bottom: 12px;
}

.trl-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* Red Flags */
.red-flags .card-content {
  padding: 24px;
}

.flags-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flag-item {
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.flag-item.high {
  background: #fef2f2;
  border-left-color: #dc2626;
}

.flag-item.medium {
  background: #fffbeb;
  border-left-color: #d97706;
}

.flag-item.low {
  background: #f0f9ff;
  border-left-color: #2563eb;
}

.flag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.flag-category {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.flag-severity {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.flag-severity.high {
  background: #dc2626;
  color: white;
}

.flag-severity.medium {
  background: #d97706;
  color: white;
}

.flag-severity.low {
  background: #2563eb;
  color: white;
}

.flag-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.no-flags {
  text-align: center;
  color: #666;
  font-style: italic;
}

/* SME Assessments */
.sme-assessments {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sme-item {
  padding: 16px;
  background: #f7f9fc;
  border-radius: 8px;
}

.sme-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.sme-content {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
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

  .technical-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .trl-value {
    font-size: 36px;
  }

  .flag-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
