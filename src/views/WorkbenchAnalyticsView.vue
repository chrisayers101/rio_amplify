<template>
  <div class="workbench-layout">
    <!-- Sidebar Navigation -->
    <WorkbenchSidebar v-model="activeSection" />

    <!-- Main Content Area -->
    <div class="workbench-main">
      <div class="main-header">
        <h1>{{ getSectionTitle() }}</h1>
        <p>{{ getSectionDescription() }}</p>
      </div>

      <div class="main-content">
        <!-- Data Explorer Section -->
        <div v-if="activeSection === 'data-explorer'" class="content-section">
          <div class="placeholder-card">
            <h3>Data Explorer</h3>
            <p>Interactive data exploration and visualization tools for mining project analysis.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Interactive Charts</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔍</span>
                <span>Data Filtering</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📈</span>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistical Analysis Section -->
        <div v-if="activeSection === 'statistical-analysis'" class="content-section">
          <div class="placeholder-card">
            <h3>Statistical Analysis</h3>
            <p>Advanced statistical methods for mining data analysis and hypothesis testing.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📉</span>
                <span>Regression Analysis</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Hypothesis Testing</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Correlation Analysis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Trend Analysis Section -->
        <div v-if="activeSection === 'trend-analysis'" class="content-section">
          <div class="placeholder-card">
            <h3>Trend Analysis</h3>
            <p>Identify patterns and trends in mining project data over time.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📈</span>
                <span>Time Series Analysis</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔄</span>
                <span>Seasonal Patterns</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Forecasting</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Predictive Models Section -->
        <div v-if="activeSection === 'predictive-models'" class="content-section">
          <div class="placeholder-card">
            <h3>Predictive Models</h3>
            <p>Machine learning models for predicting mining project outcomes and performance.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">🤖</span>
                <span>ML Algorithms</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Model Validation</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Performance Metrics</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Optimization Tools Section -->
        <div v-if="activeSection === 'optimization'" class="content-section">
          <div class="placeholder-card">
            <h3>Optimization Tools</h3>
            <p>Advanced optimization algorithms for mining operations and resource allocation.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>Linear Programming</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Genetic Algorithms</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Multi-objective Optimization</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulation Section -->
        <div v-if="activeSection === 'simulation'" class="content-section">
          <div class="placeholder-card">
            <h3>Simulation</h3>
            <p>Monte Carlo and discrete event simulation for mining project risk analysis.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">🎲</span>
                <span>Monte Carlo</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⏱️</span>
                <span>Discrete Event</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Risk Analysis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Reports Section -->
        <div v-if="activeSection === 'custom-reports'" class="content-section">
          <div class="placeholder-card">
            <h3>Custom Reports</h3>
            <p>Create and customize reports for specific mining project requirements.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📄</span>
                <span>Report Builder</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎨</span>
                <span>Custom Templates</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Interactive Charts</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboards Section -->
        <div v-if="activeSection === 'dashboards'" class="content-section">
          <div class="placeholder-card">
            <h3>Dashboards</h3>
            <p>Real-time dashboards for monitoring mining project KPIs and metrics.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Real-time KPIs</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>Custom Widgets</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📱</span>
                <span>Mobile Responsive</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Exports Section -->
        <div v-if="activeSection === 'exports'" class="content-section">
          <div class="placeholder-card">
            <h3>Exports</h3>
            <p>Export analysis results and reports in various formats for external use.</p>
            <div class="placeholder-features">
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Excel Export</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📄</span>
                <span>PDF Reports</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔗</span>
                <span>API Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WorkbenchSidebar from '@/components/WorkbenchSidebar.vue'

const activeSection = ref('data-explorer')

const getSectionTitle = () => {
  const titles: { [key: string]: string } = {
    'data-explorer': 'Data Explorer',
    'statistical-analysis': 'Statistical Analysis',
    'trend-analysis': 'Trend Analysis',
    'predictive-models': 'Predictive Models',
    'optimization': 'Optimization Tools',
    'simulation': 'Simulation',
    'custom-reports': 'Custom Reports',
    'dashboards': 'Dashboards',
    'exports': 'Exports'
  }
  return titles[activeSection.value] || 'Workbench Analytics'
}

const getSectionDescription = () => {
  const descriptions: { [key: string]: string } = {
    'data-explorer': 'Interactive data exploration and visualization tools for mining project analysis.',
    'statistical-analysis': 'Advanced statistical methods for mining data analysis and hypothesis testing.',
    'trend-analysis': 'Identify patterns and trends in mining project data over time.',
    'predictive-models': 'Machine learning models for predicting mining project outcomes and performance.',
    'optimization': 'Advanced optimization algorithms for mining operations and resource allocation.',
    'simulation': 'Monte Carlo and discrete event simulation for mining project risk analysis.',
    'custom-reports': 'Create and customize reports for specific mining project requirements.',
    'dashboards': 'Real-time dashboards for monitoring mining project KPIs and metrics.',
    'exports': 'Export analysis results and reports in various formats for external use.'
  }
  return descriptions[activeSection.value] || 'Advanced analytics tools for mining projects.'
}
</script>

<style scoped>
.workbench-layout {
  display: flex;
  height: calc(100vh - 64px);
  background: #f8fafc;
}

/* Main Content Styles */
.workbench-main {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.main-header {
  margin-bottom: 32px;
}

.main-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.main-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.content-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.placeholder-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.placeholder-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #008C8E;
}

.placeholder-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.placeholder-card p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.placeholder-features {
  display: grid;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.feature-item:hover {
  background: #f0f9fa;
  border-color: #008C8E;
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-item span:last-child {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .workbench-layout {
    flex-direction: column;
    height: auto;
  }

  .workbench-main {
    padding: 16px;
  }

  .main-header h1 {
    font-size: 1.5rem;
  }

  .placeholder-card {
    padding: 20px;
  }
}
</style>
