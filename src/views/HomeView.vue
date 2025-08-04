<template>
  <div class="dashboard-layout">
    <div class="dashboard-content">
      <div class="dashboard-header">
        <div class="header-text">
          <h1>Welcome back, {{ authStore.displayName }}</h1>
        </div>
      </div>



      <div class="dashboard-main">
        <div class="dashboard-main-full">
          <div class="section-header">
            <p>Comprehensive view of all mining projects and their current status</p>
          </div>
          <div class="project-cards-grid">
            <div v-for="project in rioTintoProjects" :key="project.id" class="project-card-detailed" @click="handleProjectClick(project.id)">
              <div class="project-card-header">
                <div class="project-icon" :class="`icon-${project.color}`">
                  <component :is="project.icon" />
                </div>
                <div class="project-title-section">
                  <h4 class="project-name">{{ project.name }}</h4>
                  <div class="project-location">
                    <MapPinIcon class="location-icon" />
                    <span>{{ project.country_region }}</span>
                  </div>
                </div>
                <div class="project-status" :class="`status-${project.status}`">
                  {{ formatStatus(project.status) }}
                </div>
              </div>

              <div class="project-summary">
                <p>{{ project.summary }}</p>
              </div>

              <div class="project-details-grid">
                <div class="detail-item">
                  <div class="detail-label">Capital Cost</div>
                  <div class="detail-value">
                    {{ project.capital_cost_usd_billion ? `$${project.capital_cost_usd_billion}B` : 'TBD' }}
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-label">IRR</div>
                  <div class="detail-value">
                    {{ project.post_tax_irr_percent || 'TBD' }}
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-label">Workforce</div>
                  <div class="detail-value">
                    {{ project.workforce_construction_ops || 'TBD' }}
                  </div>
                </div>
              </div>

              <div class="project-minerals">
                <div class="detail-label">Key Minerals</div>
                <div class="minerals-tags">
                  <span v-for="mineral in project.key_minerals" :key="mineral" class="mineral-tag">
                    {{ mineral }}
                  </span>
                </div>
              </div>

              <div class="project-current-status">
                <div class="detail-label">Current Status</div>
                <p class="status-text">{{ project.current_status }}</p>
              </div>

              <div class="project-risks">
                <div class="detail-label">Key Issues & Risks</div>
                <p class="risks-text">{{ project.key_issues_risks }}</p>
              </div>

              <button class="view-project-btn" @click.stop="handleProjectClick(project.id)">View Full Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { useRouter } from 'vue-router'
import { rioTintoProjects } from '@/mockdata/mockData'
import { MapPinIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const router = useRouter()

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pre-sanction': 'Pre-Sanction',
    'licence-revoked': 'Licence Revoked',
    'operational': 'Operational',
    'pfs-progress': 'PFS Progress'
  }
  return statusMap[status] || status
}

const handleProjectClick = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
  router.push('/dashboard')
}
</script>

<style scoped>
.dashboard-layout {
  padding: 0;
  max-width: 1680px;
  margin: 0 auto;
}
.dashboard-content {
  background: #fff;
  padding: 0 32px 32px 32px;
  margin-top: 0;
}
.dashboard-header {
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

.dashboard-main {
  display: block;
}
.dashboard-main-full {
  width: 100%;
}
.section-header {
  margin-bottom: 24px;
}
.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}
.section-header p {
  color: #666;
  margin: 0;
}

/* Project Cards Grid */
.project-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  max-height: none;
  overflow-y: visible;
}

.project-card-detailed {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.project-card-detailed:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
  background: #f8fffe;
}

.project-card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.project-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.icon-blue { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
.icon-red { background: linear-gradient(135deg, #EF4444, #DC2626); }
.icon-green { background: linear-gradient(135deg, #10B981, #059669); }
.icon-yellow { background: linear-gradient(135deg, #F59E0B, #D97706); }

.project-title-section {
  flex: 1;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.project-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6B7280;
  font-size: 0.9rem;
}

.location-icon {
  width: 16px;
  height: 16px;
}

.project-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pre-sanction {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-licence-revoked {
  background: #FEE2E2;
  color: #DC2626;
}

.status-operational {
  background: #D1FAE5;
  color: #065F46;
}

.status-pfs-progress {
  background: #FEF3C7;
  color: #92400E;
}

.project-summary {
  margin-bottom: 20px;
}

.project-summary p {
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.project-details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 12px;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.project-minerals {
  margin-bottom: 20px;
}

.minerals-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.mineral-tag {
  background: #E0E7FF;
  color: #3730A3;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-current-status,
.project-risks {
  margin-bottom: 16px;
}

.status-text,
.risks-text {
  color: #4B5563;
  line-height: 1.5;
  margin: 8px 0 0 0;
  font-size: 0.9rem;
}

.view-project-btn {
  width: 100%;
  background: linear-gradient(135deg, #008C8E, #006D6F);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;
}

.view-project-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 140, 142, 0.3);
}
</style>
