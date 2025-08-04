import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import AuthView from '@/views/AuthView.vue'
import EntitiesView from '@/views/EntitiesView.vue'
import FilesView from '@/views/FilesView.vue'
import HomeView from '@/views/HomeView.vue'
import ProjectAnalyticsView from '@/views/ProjectAnalyticsView.vue'

import { useAuthStore } from '@/stores/authStore'

async function isAuthenticated() {
  const authStore = useAuthStore()
  return await authStore.checkAuthState()
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/auth',
            name: 'Auth',
            component: AuthView,
        },

        {
            path: '/entities',
            name: 'Entities',
            component: EntitiesView,
            meta: { requiresAuth: true }
        },
        {
            path: '/files',
            name: 'Files',
            component: FilesView,
            meta: { requiresAuth: true }
        },
        {
            path: '/dashboard',
            name: 'Project Analytics',
            component: ProjectAnalyticsView,
            meta: { requiresAuth: true }
        },
    ],
})

// Global guard: redirect to /auth if route requires auth and user not signed in
// Also redirect authenticated users from landing/auth to home
router.beforeEach(async (to) => {
  // Skip auth check for non-protected routes to improve performance
  if (!to.meta.requiresAuth && to.name !== 'LandingPage' && to.name !== 'Auth') {
    return
  }

  const authenticated = await isAuthenticated()

  // If route requires auth and user not signed in, redirect to auth
  if (to.meta.requiresAuth && !authenticated) {
    return { name: 'Auth' }
  }

  // If user is authenticated and trying to access landing or auth, redirect to home
  if (authenticated && (to.name === 'LandingPage' || to.name === 'Auth')) {
    return { name: 'Home' }
  }
})

export default router
