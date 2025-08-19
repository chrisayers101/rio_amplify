import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { getCurrentUser, signOut as amplifySignOut, fetchUserAttributes } from 'aws-amplify/auth'
import type { AuthUser } from 'aws-amplify/auth'
import type { AppUser } from '../../shared/interfaces'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AppUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const currentUserId = computed(() => user.value?.userId || null)
  const displayName = computed(() => {
    if (!user.value) return 'User'

    // Try to get the full name first
    if (user.value.name) return user.value.name
    if (user.value.givenName && user.value.familyName) {
      return `${user.value.givenName} ${user.value.familyName}`
    }
    if (user.value.givenName) return user.value.givenName
    if (user.value.familyName) return user.value.familyName

    // Fallback to email or username
    if (user.value.email && user.value.email !== 'Unknown') {
      return user.value.email.split('@')[0]
    }

    return user.value.username || 'User'
  })

  // Actions
  const checkAuthState = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const currentUser: AuthUser = await getCurrentUser()
      const userAttributes = await fetchUserAttributes()

      const userInfo: AppUser = {
        userId: currentUser.userId,
        username: currentUser.username,
        email: userAttributes.email || currentUser.signInDetails?.loginId || 'Unknown',
        name: userAttributes.name,
        givenName: userAttributes.given_name,
        familyName: userAttributes.family_name,
        signInDetails: currentUser.signInDetails as Record<string, unknown>
      }

      user.value = userInfo



      return true
    } catch (err) {

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
    displayName,

    // Actions
    checkAuthState,
    signOut,
    refreshUser,
    clearError,
    initializeAuth
  }
})
