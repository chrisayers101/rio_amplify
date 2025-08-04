<template>
  <nav class="top-nav">
    <div class="top-nav-left">
      <img :src="RioLogo" alt="Rio Tinto" class="logo" />
      <select class="project-switcher" v-model="selectedProject">
        <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
    </div>
    <div class="top-nav-center"></div>
    <div class="top-nav-right">
      <button class="icon-btn notification-btn" title="Notifications">
        <BellIcon class="icon" />
      </button>
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
import { BellIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline'
const authStore = useAuthStore()
const user = {
  name: authStore.user?.username || 'User',
  email: authStore.user?.email || 'user@email.com',
  avatar: '/assets/avatar.png',
}
const projects = [
  { id: 1, name: 'Hamersley Iron Expansion' },
  { id: 2, name: 'Brockman 4 Upgrade' },
  { id: 3, name: 'Yandicoogina Mine Study' },
]
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
  gap: 16px;
}
.logo {
  height: 32px;
  width: auto;
}
.project-switcher {
  margin-left: 16px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #eee;
  font-size: 14px;
}
.top-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #f7f9fc;
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
