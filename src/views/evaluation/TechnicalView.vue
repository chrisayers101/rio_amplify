<template>
  <div class="technical-evaluation-layout">
    <div class="technical-evaluation-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Technical Evaluation</h1>
          <p>Technical requirements, compliance, and design assessment for {{ currentProject?.name }}</p>
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
      <div v-if="currentProject?.evaluation?.technical" class="project-content">
        <!-- Compliance Guidelines Tab -->
        <div v-if="activeTab === 'compliance-guidelines'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Compliance Study Definition Guidelines</h3>
            </div>
            <div class="card-content">
              <p>{{ currentProject.evaluation.technical.compliance_study_definition_guidelines }}</p>
            </div>
          </div>
        </div>

        <!-- Red Flags Tab -->
        <div v-if="activeTab === 'red-flags'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Red Flags</h3>
            </div>
            <div class="card-content">
              <div class="red-flags-list">
                <div
                  v-for="(flag, index) in currentProject.evaluation.technical.red_flags"
                  :key="index"
                  class="red-flag-item"
                >
                  <div class="flag-header">
                    <span class="flag-category">{{ flag.category }}</span>
                    <span :class="['flag-severity', `severity-${flag.severity.toLowerCase()}`]">
                      {{ flag.severity }}
                    </span>
                  </div>
                  <p class="flag-description">{{ flag.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SME Assessment Tab -->
        <div v-if="activeTab === 'sme-assessment'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>SME Assessment</h3>
            </div>
            <div class="card-content">
              <div class="sme-grid">
                <div class="sme-item">
                  <span class="sme-label">Electrical</span>
                  <p class="sme-value">{{ currentProject.evaluation.technical.sme.electrical }}</p>
                </div>
                <div class="sme-item">
                  <span class="sme-label">Environmental</span>
                  <p class="sme-value">{{ currentProject.evaluation.technical.sme.environmental }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Design Maturity Tab -->
        <div v-if="activeTab === 'design-maturity'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Design Maturity</h3>
            </div>
            <div class="card-content">
              <div class="maturity-display">
                <div class="maturity-percentage">
                  <span class="percentage-value">{{ currentProject.evaluation.technical.design_maturity_percent }}%</span>
                  <span class="percentage-label">Complete</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${currentProject.evaluation.technical.design_maturity_percent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Readiness Tab -->
        <div v-if="activeTab === 'technology-readiness'" class="tab-panel">
          <div class="evaluation-card">
            <div class="card-header">
              <h3>Technology Readiness Level</h3>
            </div>
            <div class="card-content">
              <div class="trl-display">
                <div class="trl-level">
                  <span class="level-number">TRL {{ currentProject.evaluation.technical.technology_readiness_level }}</span>
                  <span class="level-description">{{ getTRLDescription(currentProject.evaluation.technical.technology_readiness_level) }}</span>
                </div>
                <div class="trl-scale">
                  <div class="scale-bar">
                    <div
                      class="scale-fill"
                      :style="{ width: `${(currentProject.evaluation.technical.technology_readiness_level / 9) * 100}%` }"
                    ></div>
                  </div>
                  <div class="scale-labels">
                    <span>TRL 1</span>
                    <span>TRL 9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <CpuChipIcon />
        </div>
        <h4>No Technical Data Available</h4>
        <p>Technical evaluation data for this project will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { CpuChipIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const activeTab = ref('compliance-guidelines')

const evaluationTabs = [
  { id: 'compliance-guidelines', label: 'Compliance Guidelines' },
  { id: 'red-flags', label: 'Red Flags' },
  { id: 'sme-assessment', label: 'SME Assessment' },
  { id: 'design-maturity', label: 'Design Maturity' },
  { id: 'technology-readiness', label: 'Technology Readiness' }
]

const getTRLDescription = (level: number): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Basic principles observed',
    2: 'Technology concept formulated',
    3: 'Analytical and experimental critical function proof-of-concept',
    4: 'Component and/or breadboard validation in laboratory environment',
    5: 'Component and/or breadboard validation in relevant environment',
    6: 'System/subsystem model or prototype demonstration in relevant environment',
    7: 'System prototype demonstration in operational environment',
    8: 'Actual system completed and qualified through test and demonstration',
    9: 'Actual system proven through successful mission operations'
  }
  return descriptions[level] || 'Unknown level'
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

/* Red Flags */
.red-flags-list {
  display: grid;
  gap: 16px;
}

.red-flag-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
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
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.flag-severity.severity-high {
  background-color: #fef2f2;
  color: #dc2626;
}

.flag-severity.severity-medium {
  background-color: #fffbeb;
  color: #d97706;
}

.flag-severity.severity-low {
  background-color: #ecfdf5;
  color: #059669;
}

.flag-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* SME Assessment */
.sme-grid {
  display: grid;
  gap: 20px;
}

.sme-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.sme-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
  margin-bottom: 8px;
}

.sme-value {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Design Maturity */
.maturity-display {
  text-align: center;
}

.maturity-percentage {
  margin-bottom: 20px;
}

.percentage-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #008C8E;
  display: block;
}

.percentage-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-top: 4px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 6px;
  transition: width 0.3s ease;
}

/* Technology Readiness */
.trl-display {
  text-align: center;
}

.trl-level {
  margin-bottom: 24px;
}

.level-number {
  font-size: 2rem;
  font-weight: 700;
  color: #008C8E;
  display: block;
}

.level-description {
  font-size: 14px;
  color: #666;
  display: block;
  margin-top: 8px;
  line-height: 1.4;
}

.trl-scale {
  margin-top: 20px;
}

.scale-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.scale-fill {
  height: 100%;
  background: linear-gradient(135deg, #008C8E, #009688);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
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

  .technical-evaluation-content {
    padding: 0 16px 16px 16px;
  }

  .percentage-value {
    font-size: 2rem;
  }

  .level-number {
    font-size: 1.5rem;
  }
}
</style>
