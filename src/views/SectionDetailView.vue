<template>
  <div class="section-detail-view">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        ← Back to Overview
      </button>
      <h1>{{ section?.sectionName }}</h1>
    </div>

    <div v-if="section" class="detail-content">
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
          </div>
        </div>
      </div>

      <div class="section-sections">
        <div class="section">
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

        <div class="section">
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
    </div>

    <div v-else class="loading">
      <p>Loading section details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Section {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  issues: any[]
  observations: any[]
}

const route = useRoute()
const section = ref<Section | null>(null)

onMounted(() => {
  // In a real app, you'd fetch the section data based on the route params
  // For now, we'll simulate loading the section data
  const sectionId = route.params.sectionId as string
  console.log('Loading section:', sectionId)

  // TODO: Fetch section data from API or store
  // For now, we'll set a placeholder
  section.value = {
    sectionId: sectionId,
    sectionName: `Section ${sectionId}`,
    percentComplete: 75,
    statusOfCompleteness: 'Mostly Complete',
    qualityRating: 'High',
    issues: [],
    observations: []
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
    case 'in-progress':
      return 'status-in-progress'
    default:
      return 'status-unknown'
  }
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

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 600;
  color: #1a1a1a;
}

.quality-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  color: #374151;
}

.section-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.issues-list,
.observations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-item,
.observation-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.issue-header,
.observation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-id,
.observation-id {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.issue-status,
.observation-change {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
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
  color: #374151;
}

.observation-change.changed {
  background: #fef3c7;
  color: #92400e;
}

.issue-description,
.observation-text {
  margin: 8px 0;
  color: #374151;
  line-height: 1.5;
}

.issue-source,
.observation-source {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 48px;
  color: #666;
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

  .section-sections {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
