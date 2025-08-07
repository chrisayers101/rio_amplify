import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewStore = defineStore('view', () => {
  // Current view mode: 'dashboard' or 'workbench'
  const currentView = ref<'dashboard' | 'workbench'>('dashboard')

  // Set the current view
  const setCurrentView = (view: 'dashboard' | 'workbench') => {
    currentView.value = view
  }

  // Toggle between dashboard and workbench
  const toggleView = () => {
    currentView.value = currentView.value === 'dashboard' ? 'workbench' : 'dashboard'
  }

  // Get the current view
  const getCurrentView = () => currentView.value

  // Check if current view is dashboard
  const isDashboard = () => currentView.value === 'dashboard'

  // Check if current view is workbench
  const isWorkbench = () => currentView.value === 'workbench'

  return {
    currentView,
    setCurrentView,
    toggleView,
    getCurrentView,
    isDashboard,
    isWorkbench
  }
})
