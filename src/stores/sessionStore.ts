import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    currentSession: null as { id: string; startedAt: string } | null,
  }),
  actions: {
    async startSession() {
      // DataStore integration will be added later (task_408). For now, use in-memory placeholder.
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
      this.currentSession = { id, startedAt: new Date().toISOString() }
    },
  },
})
