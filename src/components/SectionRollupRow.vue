<template>
  <div class="section-row" @click="handleViewDetails">
    <div class="section-info">
      <div class="section-name">{{ section.sectionName }}</div>
      <div class="section-status">{{ section.statusOfCompleteness }}</div>
    </div>

    <div class="section-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${section.percentComplete}%` }"
          :class="getProgressClass(section.percentComplete)"
        ></div>
      </div>
      <div class="progress-text">{{ section.percentComplete }}%</div>
    </div>

    <div class="section-metrics">
      <div class="quality-badge" :class="getQualityClass(section.qualityRating)">
        {{ section.qualityRating }}
      </div>
      <div class="metrics">
        <span class="metric">
          <span class="metric-label">Issues:</span>
          <span class="metric-value">{{ section.issues.length }}</span>
        </span>
        <span class="metric">
          <span class="metric-label">Observations:</span>
          <span class="metric-value">{{ section.observations.length }}</span>
        </span>
      </div>
    </div>

    <div class="section-actions">
      <button class="view-details-btn" @click.stop="handleViewDetails">
        View Details
      </button>
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
  section: Section
}

const props = defineProps<Props>()

const emit = defineEmits<{
  viewDetails: [section: Section]
}>()

const handleViewDetails = () => {
  emit('viewDetails', props.section)
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
</script>

<style scoped>
.section-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-row:hover {
  border-color: #008C8E;
  box-shadow: 0 2px 8px rgba(0, 140, 142, 0.1);
  transform: translateY(-1px);
}

.section-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.section-status {
  font-size: 12px;
  color: #666;
}

.section-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-high {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-low {
  background: linear-gradient(90deg, #f97316, #ea580c);
}

.progress-critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.section-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
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

.metrics {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.metric-label {
  color: #666;
  font-size: 10px;
}

.metric-value {
  font-weight: 600;
  color: #1a1a1a;
}

.section-actions {
  display: flex;
  justify-content: center;
}

.view-details-btn {
  background: linear-gradient(135deg, #008C8E, #009688);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-details-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 140, 142, 0.3);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .section-row {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .section-info {
    order: 1;
  }

  .section-progress {
    order: 2;
  }

  .section-metrics {
    order: 3;
    flex-direction: row;
    justify-content: center;
  }

  .section-actions {
    order: 4;
  }
}
</style>
