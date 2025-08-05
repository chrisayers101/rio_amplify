<template>
  <div class="feasibility-study-layout">
    <div class="feasibility-study-content">
      <!-- Project Header -->
      <div class="project-header">
        <div class="header-text">
          <h1>Feasibility Study Report</h1>
          <p>Creation and assessment of feasibility studies for {{ currentProject?.name }}</p>
        </div>
      </div>

      <!-- Placeholder Card -->
      <div class="placeholder-card">
        <div class="card-header">
          <h3>Feasibility Study Report</h3>
        </div>
        <div class="card-content">
          <div class="placeholder-content">
            <div class="placeholder-icon">
              <DocumentTextIcon />
            </div>
            <h4>Feasibility Study Report</h4>
            <p>This section will contain the creation and assessment tools for feasibility study reports.</p>
            <p>Features coming soon:</p>
            <ul class="feature-list">
              <li>Report creation wizard</li>
              <li>Assessment criteria</li>
              <li>Risk evaluation</li>
              <li>Financial modeling</li>
              <li>Technical analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const projectStore = useProjectStore()

const currentProject = computed(() => projectStore.selectedProject)
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

.header-text p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Placeholder Card */
.placeholder-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.placeholder-card:hover {
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
  padding: 40px 24px;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #008C8E, #009688);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
}

.placeholder-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.placeholder-content h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.placeholder-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.feature-list {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.feature-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.feature-list li::before {
  content: "•";
  color: #008C8E;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .feasibility-study-content {
    padding: 0 16px 16px 16px;
  }

  .card-content {
    padding: 24px 16px;
  }

  .placeholder-icon {
    width: 60px;
    height: 60px;
  }

  .placeholder-icon svg {
    width: 30px;
    height: 30px;
  }

  .placeholder-content h4 {
    font-size: 18px;
  }

  .placeholder-content p {
    font-size: 14px;
  }
}
</style> 