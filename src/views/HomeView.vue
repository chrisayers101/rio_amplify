<template>
  <div class="dashboard-layout">
    <div class="dashboard-content">
      <div class="dashboard-header">
        <div class="header-text">
          <h1>Welcome back, {{ authStore.displayName }}</h1>
          <p>Here's what's happening with your project analysis today</p>
        </div>
      </div>

      <div class="dashboard-metrics">
        <div v-for="card in metricCards" :key="card.id" class="metric-card">
          <div class="metric-icon">
            <component :is="card.icon" />
          </div>
          <div class="metric-content">
            <h3 class="metric-title">{{ card.title }}</h3>
            <div class="metric-value">{{ card.value }}</div>
            <div class="metric-subtext">{{ card.subtext }}</div>
          </div>
        </div>
      </div>

      <div class="dashboard-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: tab.id === selectedTab }"
          @click="selectedTab = tab.id"
          class="tab-button"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="dashboard-main">
        <div class="dashboard-main-left">
          <div class="section-header">
            <h3>Recent Projects</h3>
            <p>Your most recent project analysis projects</p>
          </div>
          <div class="project-list">
            <div v-for="project in recentProjects" :key="project.id" class="project-card">
              <div class="project-header">
                <h4 class="project-name">{{ project.name }}</h4>
                <span class="project-id">{{ project.id }}</span>
              </div>
              <div class="project-details">
                <span class="proposer-count">{{ project.proposers }} proposers</span>
                <span :class="['status-badge', project.status]">{{ project.status }}</span>
              </div>
              <button class="view-btn">View</button>
            </div>
          </div>
        </div>

        <div class="dashboard-main-right">
          <div class="section-header">
            <h3>AI Suggestions</h3>
            <p>Recommended actions based on your workflow</p>
          </div>
          <div class="suggestion-list">
            <div v-for="suggestion in aiSuggestions" :key="suggestion.id" class="suggestion-card">
              <div class="suggestion-icon">
                <component :is="suggestion.icon" />
              </div>
              <div class="suggestion-content">
                <p class="suggestion-text">{{ suggestion.text }}</p>
                <span class="project-ref">{{ suggestion.projectRef }}</span>
              </div>
              <button class="view-btn">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { metricCards, tabs, recentProjects, aiSuggestions } from '@/mockdata/mockData'

const authStore = useAuthStore()
const selectedTab = ref('overview')
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
  padding-top: 64px;
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
.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}
.metric-card {
  background: #f7f9fc;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.2s;
}
.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.metric-icon {
  width: 48px;
  height: 48px;
  background: #008C8E;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.metric-icon svg {
  width: 24px;
  height: 24px;
}
.metric-content {
  flex: 1;
}
.metric-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}
.metric-subtext {
  font-size: 0.9rem;
  color: #888;
}
.dashboard-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
}
.tab-button {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 16px 24px;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}
.tab-button:hover {
  color: #008C8E;
}
.tab-button.active {
  color: #008C8E;
  border-bottom-color: #008C8E;
}
.dashboard-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
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
.project-list, .suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.project-card, .suggestion-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}
.project-card:hover, .suggestion-card:hover {
  border-color: #008C8E;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.project-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.project-name {
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.project-id {
  font-size: 0.9rem;
  color: #888;
  font-family: monospace;
}
.project-details {
  display: flex;
  align-items: center;
  gap: 12px;
}
.proposer-count {
  font-size: 0.9rem;
  color: #666;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}
.status-badge.active {
  background: #e6f7f8;
  color: #008C8E;
}
.status-badge.review {
  background: #fff3cd;
  color: #856404;
}
.status-badge.pending {
  background: #f8d7da;
  color: #721c24;
}
.suggestion-icon {
  width: 40px;
  height: 40px;
  background: #f7f9fc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #008C8E;
  flex-shrink: 0;
}
.suggestion-icon svg {
  width: 20px;
  height: 20px;
}
.suggestion-content {
  flex: 1;
}
.suggestion-text {
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}
.project-ref {
  font-size: 0.9rem;
  color: #888;
}
.view-btn {
  background: #008C8E;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.view-btn:hover {
  background: #009688;
}
</style>
