<template>
  <nav class="top-nav">
    <div class="top-nav-left">
      <img :src="RioLogo" alt="Rio Tinto" class="logo" />
      <div class="project-selector-container">
        <label class="project-label">Select Project</label>
        <select class="project-switcher" v-model="selectedProject">
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
      </div>
    </div>
    <div class="top-nav-center"></div>
    <div class="top-nav-right">
      <button class="user-btn" @click="signOut" title="Logout">
        <span class="user-email">{{ user.email }}</span>
        <ArrowLeftStartOnRectangleIcon class="icon" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import RioLogo from '@/assets/RioLogo.svg'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { rioTintoProjects } from '@/mockdata/mockData'

const authStore = useAuthStore()
const user = {
  name: authStore.user?.username || 'User',
  email: authStore.user?.email || 'user@email.com',
  avatar: '/assets/avatar.png',
}
const projects = rioTintoProjects.map(project => ({
  id: project.id,
  name: project.name
}))
const selectedProject = ref(projects[0].id)
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
  gap: 100px;
}
.logo {
  height: 32px;
  width: auto;
}
.project-switcher {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  font-size: 14px;
}
.project-selector-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.project-label {
  font-size: 16px;
  font-weight: 600;
  color: #555;
}
.top-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.icon {
  width: 20px;
  height: 20px;
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
</style>
