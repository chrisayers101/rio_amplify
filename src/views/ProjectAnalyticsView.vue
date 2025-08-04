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

      <!-- Project Facts Cards -->
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

      <!-- Project Details -->
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pre-sanction': 'Pre-Sanction',
    'licence-revoked': 'Licence Revoked',
    'operational': 'Operational',
    'pfs-progress': 'PFS Progress'
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
