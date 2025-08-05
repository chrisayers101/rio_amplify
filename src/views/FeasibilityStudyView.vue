<template>
  <div class="feasibility-study-layout">
    <div class="feasibility-study-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>{{ projectMetadata.name }}</h1>
          <div class="project-meta">
            <span class="location">{{ projectMetadata.location }}</span>
            <span class="status">{{ projectMetadata.status }}</span>
            <span class="last-updated">Last updated: {{ formatDate(projectMetadata.lastUpdated) }}</span>
          </div>
        </div>
      </div>

      <!-- Summary Bar -->
      <div class="summary-bar">
        <div class="summary-item">
          <span class="summary-label">Total Sections</span>
          <span class="summary-value">{{ sections.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Average Completion</span>
          <span class="summary-value">{{ averageCompletion }}%</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Issues</span>
          <span class="summary-value">{{ totalIssues }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Observations</span>
          <span class="summary-value">{{ totalObservations }}</span>
        </div>
      </div>

      <!-- Sections Heatmap -->
      <SectionsHeatmap
        :sections="sections"
        @cell-click="handleHeatmapClick"
      />

      <!-- Sections Overview -->
      <div class="sections-container">
        <div class="sections-header">
          <h2>Feasibility Study Sections</h2>
          <div class="header-actions">
            <div class="filter-controls">
              <select v-model="selectedQuality" class="filter-select">
                <option value="">All Quality Levels</option>
                <option value="High">High Quality</option>
                <option value="Good">Good Quality</option>
                <option value="Moderate">Moderate Quality</option>
                <option value="Low">Low Quality</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Column Headers -->
        <div class="column-headers">
          <div class="header-section">Section</div>
          <div class="header-progress">Progress</div>
          <div class="header-metrics">Quality & Metrics</div>
          <div class="header-actions">Actions</div>
        </div>

        <!-- Sections List -->
        <div class="sections-list">
          <SectionRollupRow
            v-for="section in filteredSections"
            :key="section.sectionId"
            :section="section"
            @view-details="handleViewDetails"
          />
        </div>

        <!-- No Results -->
        <div v-if="filteredSections.length === 0" class="no-results">
          <p>No sections match the current filter criteria.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SectionRollupRow from '@/components/SectionRollupRow.vue'
import SectionsHeatmap from '@/components/SectionsHeatmap.vue'
import feasibilityData from '@/data/feasibility_scaffold_full.json'

const router = useRouter()

// Extract data from JSON
const projectMetadata = feasibilityData.feasibilityStudyView.projectMetadata
const sections = feasibilityData.feasibilityStudyView.sections

// Define Section interface
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
}

// Filter state
const selectedQuality = ref('')

// Computed properties
const filteredSections = computed(() => {
  if (!selectedQuality.value) {
    return sections
  }
  return sections.filter(section => section.qualityRating === selectedQuality.value)
})

const averageCompletion = computed(() => {
  if (sections.length === 0) return 0
  const total = sections.reduce((sum, section) => sum + section.percentComplete, 0)
  return Math.round(total / sections.length)
})

const totalIssues = computed(() => {
  return sections.reduce((sum, section) => sum + section.issues.length, 0)
})

const totalObservations = computed(() => {
  return sections.reduce((sum, section) => sum + section.observations.length, 0)
})

// Methods
const handleViewDetails = (section: Section) => {
  // Navigate to section detail view
  router.push(`/feasibility/section/${section.sectionId}`)
}

const handleHeatmapClick = (section: Section) => {
  // Navigate to section detail view when clicking on heatmap cell
  router.push(`/feasibility/section/${section.sectionId}`)
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
.feasibility-study-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}

.feasibility-study-content {
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

.project-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
}

.project-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location::before {
  content: "📍";
}

.status::before {
  content: "●";
  color: #10b981;
}

.last-updated::before {
  content: "🕒";
}

/* Summary Bar */
.summary-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.summary-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Sections Container */
.sections-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
}

.sections-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.filter-select option {
  background: white;
  color: #1a1a1a;
}

/* Column Headers */
.column-headers {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.header-section {
  grid-column: 1;
}

.header-progress {
  grid-column: 2;
  text-align: center;
}

.header-metrics {
  grid-column: 3;
  text-align: center;
}

.header-actions {
  grid-column: 4;
  text-align: center;
}

/* Sections List */
.sections-list {
  padding: 0 24px 24px 24px;
}

.no-results {
  text-align: center;
  padding: 48px 24px;
  color: #666;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .feasibility-study-content {
    padding: 0 16px 16px 16px;
  }

  .project-meta {
    flex-direction: column;
    gap: 8px;
  }

  .summary-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .sections-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .column-headers {
    display: none;
  }

  .sections-list {
    padding: 0 16px 16px 16px;
  }
}

@media (max-width: 480px) {
  .summary-bar {
    grid-template-columns: 1fr;
  }
}
</style>
