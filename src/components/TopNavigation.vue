<template>
  <nav class="top-nav">
    <div class="top-nav-left">
      <img :src="RioLogo" alt="Rio Tinto" class="logo" />
      <span class="beta-badge">BETA</span>
      <select class="project-switcher" v-model="selectedProject">
        <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
    </div>
    <div class="top-nav-center"></div>
    <div class="top-nav-right">
      <button class="icon-btn notification-btn" title="Notifications">
        <BellIcon class="icon" />
      </button>
      <button class="primary-btn new-project-btn">
        <PlusIcon class="icon" /> New Project
      </button>
      <div class="user-menu" @click="toggleMenu">
        <img :src="user.avatar" alt="User" class="avatar" />
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
        <ChevronDownIcon class="icon chevron" />
        <div v-if="menuOpen" class="user-dropdown">
          <button @click="signOut" class="dropdown-item">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import RioLogo from '@/assets/RioLogo.svg'
import { BellIcon, PlusIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
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
const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
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
  gap: 16px;
}
.logo {
  height: 32px;
  width: auto;
}
.beta-badge {
  background: #E63757;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 8px;
  margin-left: 8px;
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
.primary-btn {
  background: #008C8E;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.primary-btn:hover {
  background: #009688;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}
.user-menu:hover {
  background: #f7f9fc;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.user-name {
  font-weight: 600;
  font-size: 14px;
}
.user-email {
  font-size: 12px;
  color: #888;
}
.chevron {
  margin-left: 4px;
}
.user-dropdown {
  position: absolute;
  right: 0;
  top: 110%;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  min-width: 120px;
  z-index: 10;
}
.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #E63757;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background: #f7f9fc;
}
</style>
