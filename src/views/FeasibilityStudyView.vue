<template>
  <div class="feasibility-study-layout">
    <div class="feasibility-study-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>
            Feasibility Study Report and Assessment
            <span class="project-badge">Amrun</span>
          </h1>
          <div class="project-meta">
            <span class="location">{{ projectMetadata.location }}</span>
            <span class="status">{{ projectMetadata.status }}</span>
            <span class="last-updated">Last updated: {{ formatDate(projectMetadata.lastUpdated) }}</span>
          </div>
        </div>
      </div>


            <!-- Download Section -->
      <div class="download-section">
        <button @click="downloadFullReport" class="download-btn">
          📄 Download Full Report
        </button>
      </div>

            <!-- Summary Bar -->
      <div class="summary-bar">
        <div class="summary-item">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-label">Total Sections</span>
            <span class="summary-value">{{ sections.length }}</span>
            <div class="metric-tag">
              <span class="tag-text">Active</span>
            </div>
          </div>
        </div>

        <div class="summary-item">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10"/>
              <path d="M12 20V4"/>
              <path d="M6 20v-6"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-label">Average Completion</span>
            <span class="summary-value">{{ averageCompletion }}%</span>
            <div class="completion-bar">
              <div class="bar-fill" :style="{ width: `${averageCompletion}%` }"></div>
            </div>
            <span class="completion-status" :class="getCompletionStatus(averageCompletion)">
              {{ getCompletionText(averageCompletion) }}
            </span>
          </div>
        </div>

        <div class="summary-item">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-label">Total Issues</span>
            <span class="summary-value">{{ totalIssues }}</span>
            <div class="issues-breakdown">
              <div class="issue-type">
                <span class="issue-dot resolved"></span>
                <span class="issue-count">{{ getResolvedIssues() }}</span>
              </div>
              <div class="issue-type">
                <span class="issue-dot open"></span>
                <span class="issue-count">{{ getOpenIssues() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-item">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div class="summary-content">
            <span class="summary-label">Total Observations</span>
            <span class="summary-value">{{ totalObservations }}</span>
            <div class="observations-chart">
              <div class="chart-bar" :style="{ height: `${getObservationsPercentage()}%` }"></div>
              <span class="chart-label">Recent</span>
            </div>
          </div>
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
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

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

const getCompletionStatus = (percentage: number) => {
  if (percentage >= 90) return 'excellent'
  if (percentage >= 80) return 'good'
  if (percentage >= 70) return 'moderate'
  return 'needs-improvement'
}

const getCompletionText = (percentage: number) => {
  if (percentage >= 90) return 'Excellent'
  if (percentage >= 80) return 'Good Progress'
  if (percentage >= 70) return 'Moderate'
  return 'Needs Attention'
}

const getResolvedIssues = () => {
  return sections.reduce((count, section) =>
    count + section.issues.filter(issue => issue.status === 'Resolved').length, 0
  )
}

const getOpenIssues = () => {
  return sections.reduce((count, section) =>
    count + section.issues.filter(issue => issue.status === 'Open').length, 0
  )
}

const getObservationsPercentage = () => {
  // Mock percentage for visual effect
  return Math.min(100, (totalObservations.value / 50) * 100)
}

const downloadFullReport = async () => {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              text: 'Amrun Bauxite Project - Feasibility Study Report',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `Generated on ${new Date().toLocaleDateString()}`,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ text: '' }), // Spacing

            // Project Metadata
            new Paragraph({
              text: 'Project Information',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Project: ', bold: true }),
                new TextRun({ text: projectMetadata.name })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Location: ', bold: true }),
                new TextRun({ text: projectMetadata.location })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Status: ', bold: true }),
                new TextRun({ text: projectMetadata.status })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Last Updated: ', bold: true }),
                new TextRun({ text: formatDate(projectMetadata.lastUpdated) })
              ]
            }),
            new Paragraph({ text: '' }), // Spacing

            // Executive Summary
            new Paragraph({
              text: 'Executive Summary',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              text: 'This feasibility study report provides a comprehensive assessment of the Amrun Bauxite Project, including economic analysis, market assessment, and strategic recommendations.',
              alignment: AlignmentType.JUSTIFIED
            }),
            new Paragraph({ text: '' }), // Spacing

            // Sections Overview
            new Paragraph({
              text: 'Sections Overview',
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              text: `Total Sections: ${sections.length}`,
              alignment: AlignmentType.LEFT
            }),
            new Paragraph({
              text: `Average Completion: ${averageCompletion.value}%`,
              alignment: AlignmentType.LEFT
            }),
            new Paragraph({
              text: `Total Issues: ${totalIssues.value}`,
              alignment: AlignmentType.LEFT
            }),
            new Paragraph({
              text: `Total Observations: ${totalObservations.value}`,
              alignment: AlignmentType.LEFT
            }),
            new Paragraph({ text: '' }), // Spacing

            // Individual Sections
            ...sections.map(section => [
              new Paragraph({
                text: section.sectionName,
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Completion: ', bold: true }),
                  new TextRun({ text: `${section.percentComplete}%` })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Status: ', bold: true }),
                  new TextRun({ text: section.statusOfCompleteness })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Quality: ', bold: true }),
                  new TextRun({ text: section.qualityRating })
                ]
              }),
              // Add section content if available
              ...(section.content?.executiveSummary ? [
                new Paragraph({
                  text: 'Executive Summary',
                  heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                  text: section.content.executiveSummary,
                  alignment: AlignmentType.JUSTIFIED
                })
              ] : []),
              ...(section.content?.keyRecommendations ? [
                new Paragraph({
                  text: 'Key Recommendations',
                  heading: HeadingLevel.HEADING_3
                }),
                ...section.content.keyRecommendations.map(rec =>
                  new Paragraph({
                    text: `• ${rec}`,
                    alignment: AlignmentType.LEFT
                  })
                )
              ] : []),
              ...(section.content?.economicHighlights ? [
                new Paragraph({
                  text: 'Economic Highlights',
                  heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                  text: section.content.economicHighlights,
                  alignment: AlignmentType.JUSTIFIED
                })
              ] : []),
              ...(section.content?.riskAssessment ? [
                new Paragraph({
                  text: 'Risk Assessment',
                  heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                  text: section.content.riskAssessment,
                  alignment: AlignmentType.JUSTIFIED
                })
              ] : []),
              new Paragraph({ text: '' }), // Spacing between sections
            ]).flat()
          ]
        }
      ]
    })

    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Amrun_Feasibility_Study_Report_${new Date().toISOString().split('T')[0]}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating Word document:', error)
    alert('Error generating Word document. Please try again.')
  }
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
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.project-badge {
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 12px;
  margin-bottom: 12px;
  color: #475569;
}

.summary-icon svg {
  width: 24px;
  height: 24px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.metric-tag {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #dcfce7;
  color: #166534;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.tag-text {
  font-size: 11px;
  font-weight: 600;
}

.completion-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.completion-status {
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  padding: 2px 6px;
  border-radius: 4px;
}

.completion-status.excellent {
  background: #dcfce7;
  color: #166534;
}

.completion-status.good {
  background: #dbeafe;
  color: #1e40af;
}

.completion-status.moderate {
  background: #fef3c7;
  color: #92400e;
}

.completion-status.needs-improvement {
  background: #fee2e2;
  color: #991b1b;
}

.issues-breakdown {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.issue-type {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.issue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.issue-dot.resolved {
  background: #10b981;
}

.issue-dot.open {
  background: #f59e0b;
}

.issue-count {
  font-weight: 600;
}

.observations-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  height: 30px;
  position: relative;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
  border-radius: 2px;
  transition: height 0.3s ease;
}

.chart-label {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
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

.download-section {
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.download-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.download-btn:active {
  transform: translateY(0);
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
