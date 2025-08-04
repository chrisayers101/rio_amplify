import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const collapsed = ref(false)

  function toggleSidebar() {
    collapsed.value = !collapsed.value
  }

  function setCollapsed(value: boolean) {
    collapsed.value = value
  }

  return {
    collapsed,
    toggleSidebar,
    setCollapsed
  }
}) 