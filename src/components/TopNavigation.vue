<template>
  <nav class="bg-theme-primary shadow-sm border-b border-theme-light">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-theme-primary">agent-workbench-chat</h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Navigation Links -->
          <div class="flex items-center space-x-2">
            <router-link
              to="/workbench"
              class="nav-item"
              :class="{ 'nav-item-active': $route.name === 'Workbench' }"
            >
              <HomeIcon class="h-5 w-5" />
              <span class="text-sm font-medium">Workbench</span>
            </router-link>

            <router-link
              to="/entities"
              class="nav-item"
              :class="{ 'nav-item-active': $route.name === 'Entities' }"
            >
              <ServerStackIcon class="h-5 w-5" />
              <span class="text-sm font-medium">Entities</span>
            </router-link>

            <router-link
              to="/files"
              class="nav-item"
              :class="{ 'nav-item-active': $route.name === 'Files' }"
            >
              <FolderIcon class="h-5 w-5" />
              <span class="text-sm font-medium">Files</span>
            </router-link>
          </div>



          <!-- User Info and Logout -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="font-medium">{{ getUserDisplayName() }}</span>
            </div>
            <button
              @click="signOut"
              class="text-theme-secondary hover:text-theme-primary p-2 rounded-md transition-colors duration-200"
              title="Sign Out"
            >
              <ArrowLeftStartOnRectangleIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ArrowLeftStartOnRectangleIcon, HomeIcon, ServerStackIcon, FolderIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const getUserDisplayName = () => {
  const user = authStore.user
  if (!user) return 'User'

  // If username looks like an email, use it
  if (user.username && user.username.includes('@')) {
    return user.username
  }

  // If email is available and username is not an email, use email
  if (user.email && user.email.includes('@')) {
    return user.email
  }

  // If username is a UUID or long ID, use email or fallback
  if (user.username && user.username.length > 20) {
    return user.email || 'User'
  }

  // Use username if it's a reasonable name
  if (user.username) {
    return user.username
  }

  return user.email || 'User'
}

const signOut = async () => {
  try {
    await authStore.signOut()
    // Redirect to landing page after successful sign out
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>
