<template>
  <div class="sections-heatmap">
    <div class="heatmap-header">
      <h3>Feasibility Study Progress Heatmap</h3>
      <div class="heatmap-legend">
        <div class="legend-item">
          <span class="legend-color progress-high"></span>
          <span>80%+ Complete</span>
        </div>
        <div class="legend-item">
          <span class="legend-color progress-medium"></span>
          <span>60-79% Complete</span>
        </div>
        <div class="legend-item">
          <span class="legend-color progress-low"></span>
          <span>40-59% Complete</span>
        </div>
        <div class="legend-item">
          <span class="legend-color progress-critical"></span>
          <span>&lt;40% Complete</span>
        </div>
      </div>
    </div>

    <div class="heatmap-grid">
      <div
        v-for="section in sections"
        :key="section.sectionId"
        class="heatmap-cell"
        :class="getProgressClass(section.percentComplete)"
        @click="handleCellClick(section)"
      >
        <div class="cell-header">
          <span class="section-id">{{ section.sectionId }}</span>
          <span class="quality-indicator" :class="getQualityClass(section.qualityRating)">
            {{ section.qualityRating.charAt(0) }}
          </span>
        </div>
        <div class="cell-content">
          <div class="section-name">{{ getShortName(section.sectionName) }}</div>
          <div class="progress-percentage">{{ section.percentComplete }}%</div>
        </div>
        <div class="cell-footer">
          <span class="issues-count" v-if="section.issues.length > 0">
            {{ section.issues.length }} issues
          </span>
          <span class="observations-count" v-if="section.observations.length > 0">
            {{ section.observations.length }} obs
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Section {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  issues: any[]
  observations: any[]
}

interface Props {
  sections: Section[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cellClick: [section: Section]
}>()

const handleCellClick = (section: Section) => {
  emit('cellClick', section)
}

const getProgressClass = (percent: number) => {
  if (percent >= 80) return 'progress-high'
  if (percent >= 60) return 'progress-medium'
  if (percent >= 40) return 'progress-low'
  return 'progress-critical'
}

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

const getShortName = (fullName: string) => {
  // Remove the section number prefix and get the main part
  const parts = fullName.split(' - ')
  if (parts.length > 1) {
    return parts[1]
  }
  return fullName
}
</script>

<style scoped>
.sections-heatmap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.heatmap-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.heatmap-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.progress-high {
  background: linear-gradient(135deg, #10b981, #059669);
}

.progress-medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.progress-low {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.progress-critical {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  max-width: 100%;
}

.heatmap-cell {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.heatmap-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: inherit;
}

.heatmap-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
}

.cell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-id {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.quality-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.quality-high {
  background: #10b981;
}

.quality-good {
  background: #f59e0b;
}

.quality-moderate {
  background: #f59e0b;
}

.quality-low {
  background: #ef4444;
}

.quality-unknown {
  background: #6b7280;
}

.cell-content {
  margin-bottom: 8px;
}

.section-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.cell-footer {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: #666;
}

.issues-count,
.observations-count {
  padding: 2px 6px;
  background: #f3f4f6;
  border-radius: 4px;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sections-heatmap {
    padding: 16px;
  }

  .heatmap-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .heatmap-legend {
    justify-content: flex-start;
  }

  .heatmap-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }

  .heatmap-cell {
    padding: 8px;
  }

  .section-name {
    font-size: 12px;
  }

  .progress-percentage {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .heatmap-grid {
    grid-template-columns: 1fr;
  }
}
</style>
