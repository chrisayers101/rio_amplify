<template>
  <nav class="top-nav">
    <div class="top-nav-left">
      <img :src="RioLogo" alt="Rio Tinto" class="logo" />
    </div>
    <div class="top-nav-center">
      <div v-if="projectStore.hasSelectedProject" class="active-project">
        <span class="active-project-label">Active Project:</span>
        <span class="active-project-name">{{ projectStore.selectedProject?.name }}</span>
      </div>
    </div>
    <div class="top-nav-right">
      <button class="user-btn" @click="signOut" title="Logout">
        <span class="user-email">{{ user.email }}</span>
        <ArrowLeftStartOnRectangleIcon class="icon" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import RioLogo from '@/assets/RioLogo.svg'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const user = {
  name: authStore.user?.username || 'User',
  email: authStore.user?.email || 'user@email.com',
  avatar: '/assets/avatar.png',
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
}

.active-project {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f9fa;
  border-radius: 8px;
  border: 1px solid #e6f7f8;
}

.active-project-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.active-project-name {
  font-size: 16px;
  font-weight: 700;
  color: #008C8E;
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
