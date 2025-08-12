import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import AuthView from '@/views/AuthView.vue'
import FilesView from '@/views/FilesView.vue'
import HomeView from '@/views/HomeView.vue'
import ProjectAnalyticsView from '@/views/ProjectAnalyticsView.vue'
import WorkbenchAnalyticsView from '@/views/WorkbenchAnalyticsView.vue'
import CommercialView from '@/views/evaluation/CommercialView.vue'
import HSEView from '@/views/evaluation/HSEView.vue'
import TechnicalView from '@/views/evaluation/TechnicalView.vue'
import AssetView from '@/views/evaluation/AssetView.vue'
import ScheduleView from '@/views/evaluation/ScheduleView.vue'

// Show Me section imports
import SummaryView from '@/views/show-me/SummaryView.vue'
import MetricsView from '@/views/show-me/MetricsView.vue'

// Help Me section imports
import GapAssessmentView from '@/views/help-me/GapAssessmentView.vue'
import CompareProjectsView from '@/views/help-me/CompareProjectsView.vue'
import CreateWorkplanView from '@/views/help-me/CreateWorkplanView.vue'

// Project Team section imports
import TalkToVSMEView from '@/views/project-team/TalkToVSMEView.vue'
import AssignTasksView from '@/views/project-team/AssignTasksView.vue'

// Results section imports
import AssuranceChecksView from '@/views/results/AssuranceChecksView.vue'
import StakeholderStressTestView from '@/views/results/StakeholderStressTestView.vue'
import ReportOutView from '@/views/results/ReportOutView.vue'

import { useAuthStore } from '@/stores/authStore'

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
        {
            path: '/workbench',
            name: 'Workbench Analytics',
            component: WorkbenchAnalyticsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/evaluation/commercial',
            name: 'Commercial Evaluation',
            component: CommercialView,
            meta: { requiresAuth: true }
        },
        {
            path: '/evaluation/hse',
            name: 'HSE Evaluation',
            component: HSEView,
            meta: { requiresAuth: true }
        },
        {
            path: '/evaluation/technical',
            name: 'Technical Evaluation',
            component: TechnicalView,
            meta: { requiresAuth: true }
        },
        {
            path: '/evaluation/asset',
            name: 'Asset Management Evaluation',
            component: AssetView,
            meta: { requiresAuth: true }
        },
        {
            path: '/evaluation/schedule',
            name: 'Schedule Evaluation',
            component: ScheduleView,
            meta: { requiresAuth: true }
        },
        // Show Me section routes
        {
            path: '/show-me/summary',
            name: 'Show Me Summary',
            component: SummaryView,
            meta: { requiresAuth: true }
        },
        {
            path: '/show-me/metrics',
            name: 'Show Me Metrics',
            component: MetricsView,
            meta: { requiresAuth: true }
        },
        // Help Me section routes
        {
            path: '/help-me/gap-assessment',
            name: 'Help Me Gap Assessment',
            component: GapAssessmentView,
            meta: { requiresAuth: true }
        },
        {
            path: '/help-me/compare-projects',
            name: 'Help Me Compare Projects',
            component: CompareProjectsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/help-me/create-workplan',
            name: 'Help Me Create Workplan',
            component: CreateWorkplanView,
            meta: { requiresAuth: true }
        },
        // Project Team section routes
        {
            path: '/project-team/talk-to-vsme',
            name: 'Project Team Talk to VSME',
            component: TalkToVSMEView,
            meta: { requiresAuth: true }
        },
        {
            path: '/project-team/assign-tasks',
            name: 'Project Team Assign Tasks',
            component: AssignTasksView,
            meta: { requiresAuth: true }
        },
        // Results section routes
        {
            path: '/results/assurance-checks',
            name: 'Results Assurance Checks',
            component: AssuranceChecksView,
            meta: { requiresAuth: true }
        },
        {
            path: '/results/stakeholder-stress-test',
            name: 'Results Stakeholder Stress Test',
            component: StakeholderStressTestView,
            meta: { requiresAuth: true }
        },
        {
            path: '/results/report-out',
            name: 'Results Report Out',
            component: ReportOutView,
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

  const authStore = useAuthStore()

  // Use cached auth state first for faster navigation
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Only perform async check if cached state shows not authenticated
    const authenticated = await authStore.checkAuthState()
    if (!authenticated) {
      return { name: 'Auth' }
    }
  }

  // If user is authenticated and trying to access landing or auth, redirect to home
  if (authStore.isAuthenticated && (to.name === 'LandingPage' || to.name === 'Auth')) {
    return { name: 'Home' }
  }
})

export default router
