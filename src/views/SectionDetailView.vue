<template>
  <div class="section-detail-view">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        ← Back to Overview
      </button>
      <h1>{{ section?.sectionName }}</h1>
    </div>

    <div v-if="section" class="detail-content">
      <!-- Section Summary -->
      <div class="section-summary">
        <div class="summary-card">
          <h3>Section Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Completion:</span>
              <span class="value">{{ section.percentComplete }}%</span>
            </div>
            <div class="summary-item">
              <span class="label">Status:</span>
              <span class="value">{{ section.statusOfCompleteness }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Quality:</span>
              <span class="value quality-badge" :class="getQualityClass(section.qualityRating)">
                {{ section.qualityRating }}
              </span>
            </div>
            <div class="summary-item">
              <span class="label">Issues:</span>
              <span class="value">{{ section.issues.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Observations:</span>
              <span class="value">{{ section.observations.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Sub-sections:</span>
              <span class="value">{{ section.subSections?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub-sections -->
      <div v-if="section.subSections && section.subSections.length > 0" class="sub-sections">
        <h3>Sub-sections ({{ section.subSections.length }})</h3>
        <div class="sub-sections-grid">
          <div v-for="subSection in section.subSections" :key="subSection.subSectionId" class="sub-section-card">
            <div class="sub-section-header">
              <h4>{{ subSection.subSectionTitle }}</h4>
              <div class="sub-section-meta">
                <span class="completion">{{ subSection.percentComplete }}%</span>
                <span class="quality-badge" :class="getQualityClass(subSection.assessment.quality)">
                  {{ subSection.assessment.quality }}
                </span>
              </div>
            </div>
            
            <!-- Assessment Details -->
            <div class="assessment-details">
              <div class="assessment-grid">
                <div class="assessment-item">
                  <span class="label">Consistency:</span>
                  <span class="value">{{ subSection.assessment.consistency }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Contradictions:</span>
                  <span class="value">{{ subSection.assessment.contradictions }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Gaps:</span>
                  <span class="value">{{ subSection.assessment.gaps }}</span>
                </div>
                <div class="assessment-item">
                  <span class="label">Guideline:</span>
                  <span class="value">{{ subSection.assessment.guidelineReference }}</span>
                </div>
              </div>
            </div>

            <!-- Sub-section Observations -->
            <div v-if="subSection.observations && subSection.observations.length > 0" class="sub-observations">
              <h5>Observations ({{ subSection.observations.length }})</h5>
              <div class="observations-list">
                <div v-for="(observation, index) in subSection.observations" :key="index" class="observation-item">
                  <div class="observation-header">
                    <span class="observation-change" :class="{ 'changed': observation.changeDetected }">
                      {{ observation.changeDetected ? 'Changed' : 'No Change' }}
                    </span>
                  </div>
                  <p class="observation-text">{{ observation.note }}</p>
                  <p class="observation-source">Source: {{ observation.source }}</p>
                </div>
              </div>
            </div>

            <!-- Sub-section Decisions -->
            <div v-if="subSection.decisions && subSection.decisions.length > 0" class="sub-decisions">
              <h5>Decisions ({{ subSection.decisions.length }})</h5>
              <div class="decisions-list">
                <div v-for="(decision, index) in subSection.decisions" :key="index" class="decision-item">
                  <div class="decision-header">
                    <span class="decision-date">{{ formatDate(decision.date) }}</span>
                  </div>
                  <div class="decision-content">
                    <div class="decision-original">
                      <strong>Original:</strong> {{ decision.original }}
                    </div>
                    <div class="decision-revised">
                      <strong>Revised:</strong> {{ decision.revised }}
                    </div>
                    <div class="decision-reason">
                      <strong>Reason:</strong> {{ decision.reason }}
                    </div>
                  </div>
                  <p class="decision-source">Source: {{ decision.source }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Section Issues -->
      <div v-if="section.issues && section.issues.length > 0" class="section-issues">
        <h3>Issues ({{ section.issues.length }})</h3>
        <div class="issues-list">
          <div v-for="issue in section.issues" :key="issue.id" class="issue-item">
            <div class="issue-header">
              <span class="issue-id">{{ issue.id }}</span>
              <span class="issue-status" :class="getStatusClass(issue.status)">
                {{ issue.status }}
              </span>
            </div>
            <p class="issue-description">{{ issue.description }}</p>
            <p class="issue-source">Source: {{ issue.source }}</p>
          </div>
        </div>
      </div>

      <!-- Main Section Observations -->
      <div v-if="section.observations && section.observations.length > 0" class="section-observations">
        <h3>Observations ({{ section.observations.length }})</h3>
        <div class="observations-list">
          <div v-for="observation in section.observations" :key="observation.id" class="observation-item">
            <div class="observation-header">
              <span class="observation-id">{{ observation.id }}</span>
              <span class="observation-change" :class="{ 'changed': observation.changeOccurred }">
                {{ observation.changeOccurred ? 'Changed' : 'No Change' }}
              </span>
            </div>
            <p class="observation-text">{{ observation.text }}</p>
            <p class="observation-source">Source: {{ observation.source }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading section details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import feasibilityData from '@/data/feasibility_scaffold_full.json'

interface SubSection {
  subSectionId: string
  subSectionTitle: string
  percentComplete: number
  assessment: {
    quality: string
    consistency: string
    contradictions: string
    gaps: string
    guidelineReference: string
  }
  observations: Array<{
    note: string
    source: string
    changeDetected: boolean
  }>
  decisions: Array<{
    date: string
    original: string
    revised: string
    reason: string
    source: string
  }>
}

interface Section {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  issues: Array<{
    id: string
    description: string
    status: string
    source: string
  }>
  observations: Array<{
    id: string
    text: string
    source: string
    changeOccurred: boolean
  }>
  subSections?: SubSection[]
}

const route = useRoute()
const section = ref<Section | null>(null)

onMounted(() => {
  const sectionId = route.params.sectionId as string
  console.log('Loading section:', sectionId)

  // Load section data from the JSON file
  const sections = feasibilityData.feasibilityStudyView.sections
  const foundSection = sections.find(s => s.sectionId === sectionId)
  
  if (foundSection) {
    section.value = foundSection
    console.log('Loaded section:', foundSection)
  } else {
    console.error('Section not found:', sectionId)
  }
})

const getQualityClass = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'high':
      return 'quality-high'
    case 'good':
      return 'quality-good'
    case 'moderate':
      return 'quality-moderate'
    case 'low':
      return 'quality-low'
    default:
      return 'quality-unknown'
  }
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'status-resolved'
    case 'open':
      return 'status-open'
    case 'in progress':
      return 'status-in-progress'
    default:
      return 'status-unknown'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.section-detail-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #e5e7eb;
}

.detail-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.section-summary {
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.summary-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.summary-item .label {
  font-weight: 500;
  color: #6b7280;
}

.summary-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

.quality-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.quality-high {
  background: #dcfce7;
  color: #166534;
}

.quality-good {
  background: #fef3c7;
  color: #92400e;
}

.quality-moderate {
  background: #fef3c7;
  color: #92400e;
}

.quality-low {
  background: #fee2e2;
  color: #991b1b;
}

.quality-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* Sub-sections */
.sub-sections {
  margin-bottom: 32px;
}

.sub-sections h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.sub-sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.sub-section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.sub-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sub-section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.sub-section-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sub-section-meta .completion {
  font-weight: 600;
  color: #059669;
}

.assessment-details {
  margin-bottom: 16px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.assessment-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.assessment-item .label {
  color: #6b7280;
}

.assessment-item .value {
  font-weight: 500;
  color: #1a1a1a;
}

.sub-observations,
.sub-decisions {
  margin-top: 16px;
}

.sub-observations h5,
.sub-decisions h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

/* Issues and Observations */
.section-issues,
.section-observations {
  margin-bottom: 32px;
}

.section-issues h3,
.section-observations h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.issues-list,
.observations-list,
.decisions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item,
.observation-item,
.decision-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
}

.issue-header,
.observation-header,
.decision-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-id,
.observation-id {
  font-weight: 600;
  color: #059669;
  font-size: 14px;
}

.issue-status,
.observation-change {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-resolved {
  background: #dcfce7;
  color: #166534;
}

.status-open {
  background: #fee2e2;
  color: #991b1b;
}

.status-in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

.observation-change.changed {
  background: #fee2e2;
  color: #991b1b;
}

.observation-change:not(.changed) {
  background: #dcfce7;
  color: #166534;
}

.issue-description,
.observation-text {
  margin: 8px 0;
  color: #1a1a1a;
  line-height: 1.5;
}

.issue-source,
.observation-source,
.decision-source {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Decision specific styles */
.decision-date {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.decision-content {
  margin: 8px 0;
}

.decision-original,
.decision-revised,
.decision-reason {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.4;
}

.decision-original strong,
.decision-revised strong,
.decision-reason strong {
  color: #374151;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .section-detail-view {
    padding: 16px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .sub-sections-grid {
    grid-template-columns: 1fr;
  }
  
  .assessment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
