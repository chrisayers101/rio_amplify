<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TopNavigation from '@/components/TopNavigation.vue'
import Sidebar from '@/components/Sidebar.vue'
import ConversationPanel from '@/components/Conversation.vue'
import ToggleConversationButton from '@/components/TopNavigation.vue'
import { useAuthStore } from '@/stores/authStore'
import { ViewportHandler } from '@/utils/viewport'
import './assets/main.css'
import './assets/mobile-optimizations.css'

const route = useRoute()
const authStore = useAuthStore()
const conversationOpen = ref(false)
let viewportHandler: ViewportHandler | null = null

// Initialize authentication state and viewport handler on app startup
onMounted(async () => {
  try {
    await authStore.initializeAuth()
    console.log('Authentication initialized:', authStore.isAuthenticated)

    // Initialize viewport handler for mobile layout fixes
    if (ViewportHandler.isMobile()) {
      viewportHandler = ViewportHandler.getInstance()
      console.log('Mobile viewport handler initialized')
    }
  } catch (error) {
    console.error('Failed to initialize authentication:', error)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (viewportHandler) {
    viewportHandler.destroy()
  }
})

// Show sidebar on authenticated routes (not on auth page)
const showSidebar = computed(() => route.path !== '/auth')
const showConversationPanel = computed(() => showSidebar.value && conversationOpen.value)
function toggleConversation() {
  conversationOpen.value = !conversationOpen.value
}
</script>

<template>
  <div id="app">
    <TopNavigation v-if="showSidebar" />
    <div class="main-layout" v-if="showSidebar">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <router-view v-else />
    <ConversationPanel v-if="showConversationPanel" :open="conversationOpen" @close="toggleConversation" />
    <ToggleConversationButton v-if="showSidebar" @click="toggleConversation" />
  </div>
</template>

<style>
html, body {
    height: 100%;
    width: 100%;
}

/* Base font settings that will cascade to all elements */
body {
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

/* Set heading font family */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

/* Set monospace font for code, pre, and numeric elements if needed */
code, pre, .numeric {
    font-family: 'Roboto Mono', monospace;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure proper height for the app container */
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  height: calc(100vh - 64px);
  margin-top: 64px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f7f9fc;
}

/* Smooth transitions for layout changes */
main {
  transition: all 0.3s ease-in-out;
}
</style>

