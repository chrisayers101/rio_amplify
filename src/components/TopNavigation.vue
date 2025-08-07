<template>
  <nav class="top-nav">
    <div class="top-nav-left">
      <img :src="RioLogo" alt="Rio Tinto" class="logo" />
    </div>
    <div class="top-nav-center">
      <!-- View Toggle Buttons -->
      <div class="view-toggle-container">
        <button
          class="view-btn"
          :class="{ active: viewStore.isDashboard() }"
          @click="switchToDashboard"
          title="Project Dashboard"
        >
          <ChartBarIcon class="view-icon" />
          <span>Project Dashboard</span>
        </button>
        <button
          class="view-btn"
          :class="{ active: viewStore.isWorkbench() }"
          @click="switchToWorkbench"
          title="Workbench Analytics"
        >
          <CpuChipIcon class="view-icon" />
          <span>Workbench Analytics</span>
        </button>
      </div>

      <div v-if="projectStore.hasSelectedProject" class="active-project" @click="toggleProjectDropdown">
        <span class="active-project-name">{{ projectStore.selectedProject?.name }}</span>
        <ChevronDownIcon class="dropdown-arrow" />
      </div>
      <div v-if="showProjectDropdown" class="project-dropdown">
        <div
          v-for="project in projectStore.projects"
          :key="project.id"
          class="project-option"
          :class="{ 'selected': project.id === projectStore.selectedProjectId }"
          @click="selectProject(project.id)"
        >
          {{ project.name }}
        </div>
      </div>
    </div>
    <div class="top-nav-right">
      <!-- <button class="nav-btn" @click="navigateToFiles" title="Files">
        <DocumentIcon class="icon" />
      </button>
      <button class="nav-btn" @click="navigateToEntities" title="Entities">
        <ServerIcon class="icon" />
      </button> -->
      <button class="user-btn" @click="signOut" title="Logout">
        <span class="user-email">{{ user.email }}</span>
        <ArrowLeftStartOnRectangleIcon class="icon" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { useViewStore } from '@/stores/viewStore'
import RioLogo from '@/assets/RioLogo.svg'
import { ArrowLeftStartOnRectangleIcon, ChevronDownIcon, DocumentIcon, ServerIcon, ChartBarIcon, CpuChipIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectStore()
const viewStore = useViewStore()
const showProjectDropdown = ref(false)

const user = {
  name: authStore.user?.username || 'User',
  email: authStore.user?.email || 'user@email.com',
  avatar: '/assets/avatar.png',
}

const toggleProjectDropdown = () => {
  showProjectDropdown.value = !showProjectDropdown.value
}

const selectProject = (projectId: string) => {
  projectStore.setSelectedProject(projectId)
  showProjectDropdown.value = false
}

const switchToDashboard = () => {
  viewStore.setCurrentView('dashboard')
  router.push('/home')
}

const switchToWorkbench = () => {
  viewStore.setCurrentView('workbench')
  router.push('/workbench')
}

// Update view store when component mounts to match current route
const updateViewFromRoute = () => {
  if (router.currentRoute.value.path === '/workbench') {
    viewStore.setCurrentView('workbench')
  } else {
    viewStore.setCurrentView('dashboard')
  }
}

// Call this when component mounts
updateViewFromRoute()

// Watch for route changes to update view store
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath === '/workbench') {
    viewStore.setCurrentView('workbench')
  } else {
    viewStore.setCurrentView('dashboard')
  }
})

const navigateToFiles = () => {
  router.push('/files')
}

const navigateToEntities = () => {
  router.push('/entities')
}

async function signOut() {
  await authStore.signOut()
  window.location.href = '/'
}
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.top-nav-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 32px;
  width: auto;
}
.top-nav-center {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.active-project {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f9fa;
  border-radius: 8px;
  border: 1px solid #e6f7f8;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.active-project:hover {
  background: #e6f7f8;
  border-color: #008C8E;
}

.active-project-name {
  font-size: 16px;
  font-weight: 700;
  color: #008C8E;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #008C8E;
  transition: transform 0.2s;
}

.active-project:hover .dropdown-arrow {
  transform: translateY(1px);
}

.project-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  margin-top: 4px;
}

.project-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.project-option:last-child {
  border-bottom: none;
}

.project-option:hover {
  background: #f0f9fa;
}

.project-option.selected {
  background: #e6f7f8;
  color: #008C8E;
  font-weight: 600;
}
.top-nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon {
  width: 20px;
  height: 20px;
}
.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fc;
  border: 1px solid #eee;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  color: #333;
}
.nav-btn:hover {
  background: #e6e8eb;
  border-color: #ddd;
  color: #008C8E;
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f7f9fc;
  border: 1px solid #eee;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  color: #333;
}
.user-btn:hover {
  background: #e6e8eb;
  border-color: #ddd;
}
.user-email {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* View Toggle Container and Button Styles */
.view-toggle-container {
  display: flex;
  gap: 12px;
  margin-right: 32px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #666;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  justify-content: center;
}

.view-btn:hover {
  background: #f0f9fa;
  border-color: #008C8E;
  color: #008C8E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 140, 142, 0.15);
}

.view-btn.active {
  background: linear-gradient(135deg, #008C8E, #009688);
  border-color: #008C8E;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 140, 142, 0.25);
  transform: translateY(-1px);
}

.view-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
