<template>
  <div class="sections-heatmap">
    <div class="heatmap-header">
      <h3>Feasibility Study Progress Heatmap</h3>
      <div class="heatmap-legend">
        <div class="legend-item">
          <span class="legend-color quality-high"></span>
          <span>High Quality</span>
        </div>
        <div class="legend-item">
          <span class="legend-color quality-good"></span>
          <span>Good Quality</span>
        </div>
        <div class="legend-item">
          <span class="legend-color quality-moderate"></span>
          <span>Moderate Quality</span>
        </div>
        <div class="legend-item">
          <span class="legend-color quality-low"></span>
          <span>Low Quality</span>
        </div>
      </div>
    </div>

    <div class="heatmap-grid">
      <div
        v-for="section in sections"
        :key="section.sectionId"
        class="heatmap-cell"
        :class="getQualityClass(section.qualityRating)"
        @click="handleCellClick(section)"
      >
        <div class="cell-header">
          <span class="section-id">{{ section.sectionId }}</span>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${section.percentComplete}%` }"
              ></div>
              <span class="progress-text">{{ section.percentComplete }}%</span>
            </div>
          </div>
        </div>
        <div class="cell-content">
          <div class="section-name">{{ getShortName(section.sectionName) }}</div>
          <div class="status-text">{{ section.statusOfCompleteness }}</div>
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

interface Props {
  sections: Section[]
}

defineProps<Props>()

const emit = defineEmits<{
  cellClick: [section: Section]
}>()

const handleCellClick = (section: Section) => {
  emit('cellClick', section)
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

.quality-high {
  background: linear-gradient(135deg, #86efac, #4ade80);
}

.quality-good {
  background: linear-gradient(135deg, #fcd34d, #fbbf24);
}

.quality-moderate {
  background: linear-gradient(135deg, #c4b5fd, #a78bfa);
}

.quality-low {
  background: linear-gradient(135deg, #fca5a5, #f87171);
}

.quality-unknown {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  max-width: 100%;
}

.heatmap-cell {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  color: #1a1a1a;
}

.heatmap-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.heatmap-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
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
  color: rgba(26, 26, 26, 0.8);
}

.progress-bar-container {
  width: 80px;
  height: 20px;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  border-radius: 10px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 700;
  color: #1a1a1a;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
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

.status-text {
  font-size: 11px;
  color: rgba(26, 26, 26, 0.7);
  font-weight: 500;
}

.cell-footer {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: rgba(26, 26, 26, 0.7);
}

.issues-count,
.observations-count {
  padding: 2px 6px;
  background: rgba(26, 26, 26, 0.1);
  border-radius: 4px;
  font-weight: 500;
  backdrop-filter: blur(4px);
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

  .progress-bar-container {
    width: 60px;
    height: 16px;
  }

  .progress-text {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .heatmap-grid {
    grid-template-columns: 1fr;
  }
}
</style>
