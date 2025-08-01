import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth'
import type { AuthUser } from 'aws-amplify/auth'

export interface AppUser {
  userId: string
  username: string
  email: string
  signInDetails?: Record<string, unknown>
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AppUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const currentUserId = computed(() => user.value?.userId || null)

  // Actions
  const checkAuthState = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const currentUser: AuthUser = await getCurrentUser()

      const userInfo: AppUser = {
        userId: currentUser.userId,
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || 'Unknown',
        signInDetails: currentUser.signInDetails as Record<string, unknown>
      }

      user.value = userInfo

      console.log('User authenticated:', {
        userId: userInfo.userId,
        username: userInfo.username,
        email: userInfo.email
      })

      return true
    } catch (err) {
      console.log('User not authenticated:', err)
      user.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await amplifySignOut()
      user.value = null
      error.value = null
      console.log('User signed out successfully')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign out failed'
      console.error('Sign out error:', err)
      throw err
    }
  }

  const refreshUser = async (): Promise<void> => {
    await checkAuthState()
  }

  const clearError = (): void => {
    error.value = null
  }

  // Initialize auth state check
  const initializeAuth = async (): Promise<boolean> => {
    return await checkAuthState()
  }

  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    isAuthenticated,
    currentUserId,

    // Actions
    checkAuthState,
    signOut,
    refreshUser,
    clearError,
    initializeAuth
  }
})
