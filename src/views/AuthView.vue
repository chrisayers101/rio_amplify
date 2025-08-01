<template>
  <div class="auth-container">
    <!-- Header with Ab Logo -->
    <header class="auth-header">
      <router-link to="/" class="logo-link">

      </router-link>
    </header>

    <!-- Main Auth Content -->
    <main class="auth-main">
      <!-- Logo Section -->
      <div class="auth-title-section">
        <img src="@/assets/RioLogo.svg" alt="Rio Tinto" class="auth-logo" />
      </div>

      <!-- Auth Form -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Name Field (only for sign up) -->
        <div v-if="isSignUp" class="form-group">
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Full Name"
            class="form-input"
            :class="{ 'error': errors.fullName }"
            required
          />
          <div v-if="errors.fullName" class="error-message">{{ errors.fullName }}</div>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="form-input"
            :class="{ 'error': errors.email }"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="form-input"
            :class="{ 'error': errors.password }"
            required
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <!-- Confirm Password (only for sign up) -->
        <div v-if="isSignUp" class="form-group">
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="form-input"
            :class="{ 'error': errors.confirmPassword }"
            required
          />
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
        </div>

        <!-- Confirmation Code (only for sign up) -->
        <div v-if="needsConfirmation" class="form-group">
          <input
            v-model="confirmationCode"
            type="text"
            placeholder="Verification Code"
            class="form-input"
            required
          />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-button" :disabled="isLoading">
          <span v-if="!isLoading">
            {{ isSignUp ? 'Create Account' : 'Sign In' }}
          </span>
          <span v-else class="loading-text">
            {{ isSignUp ? 'Creating account...' : 'Signing in...' }}
          </span>
        </button>

        <!-- Form Links -->
        <div class="form-links">
          <button
            v-if="!isSignUp"
            type="button"
            @click="showForgotPassword"
            class="link-button"
          >
            Forgot Password?
          </button>

          <button style="display: none;"
            type="button"
            @click="toggleMode"
            class="link-button primary"
          >
            {{ isSignUp ? 'Already have an account? Sign In' : 'Create Account' }}
          </button>
        </div>
      </form>

      <!-- Error Display -->
      <div v-if="globalError" class="global-error">
        {{ globalError }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { signIn, signUp, resetPassword, confirmSignUp } from 'aws-amplify/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const isSignUp = ref(false)
const isLoading = ref(false)
const globalError = ref('')
const needsConfirmation = ref(false)
const confirmationCode = ref('')

// Form data
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Form errors
const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Check if user is already authenticated and redirect to home
onMounted(async () => {
  try {
    if (await authStore.checkAuthState()) {
      // User is already signed in, redirect to workbench
      router.push('/workbench')
    }
    // User is not signed in, stay on auth page
  } catch {
    // User is not signed in, stay on auth page
  }
})

// Clear errors
const clearErrors = () => {
  errors.fullName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  globalError.value = ''
}

// Validate form
const validateForm = () => {
  clearErrors()
  let isValid = true

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  // Sign up specific validations
  if (isSignUp.value) {
    if (!form.fullName.trim()) {
      errors.fullName = 'Full name is required'
      isValid = false
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
  }

  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  if (needsConfirmation.value) {
    // confirm code flow
    try {
      await confirmSignUp({ username: form.email, confirmationCode: confirmationCode.value })
      await signIn({ username: form.email, password: form.password })
      router.push('/workbench')
    } catch (error) {
      globalError.value = (error as Error).message || 'Confirmation failed'
    }
    return
  }
  if (!validateForm()) return

  isLoading.value = true
  clearErrors()

  try {
    if (isSignUp.value) {
      const result = await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            name: form.fullName
          }
        }
      })
      if (result.isSignUpComplete) {
        await signIn({ username: form.email, password: form.password })
        router.push('/workbench')
      } else {
        needsConfirmation.value = true
      }
    } else {
      await signIn({
        username: form.email,
        password: form.password
      })
      router.push('/workbench')
    }
  } catch (error) {
    console.error('Authentication error:', error)
    globalError.value = (error as Error).message || 'An error occurred during authentication'
  } finally {
    isLoading.value = false
  }
}

// Toggle between sign up and sign in
const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  clearErrors()
  // Reset form
  form.fullName = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
}

// Show forgot password
const showForgotPassword = async () => {
  if (!form.email) {
    errors.email = 'Please enter your email address first'
    return
  }

  try {
    await resetPassword({ username: form.email })
    globalError.value = 'Password reset instructions sent to your email'
  } catch (error) {
    globalError.value = (error as Error).message || 'Error sending password reset'
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100%;
  background: var(--color-background-primary);
  display: flex;
  flex-direction: column;
}

.auth-header {
  padding: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.auth-logo {
  height: 60px;
  width: auto;
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.auth-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.auth-title-section {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-red);
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  background: var(--color-primary-red);
  color: var(--color-text-white);
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-red-hover);
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  opacity: 0.8;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.5; }
}

.form-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  text-align: center;
}

.link-button {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: var(--color-primary-red);
}

.link-button.primary {
  color: var(--color-primary-red);
  font-weight: 600;
  text-decoration: none;
}

.link-button.primary:hover {
  color: var(--color-primary-red-hover);
}

.global-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .auth-header {
    padding: 1rem;
  }

  .auth-main {
    padding: 1rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .brand-name {
    font-size: 1.5rem;
  }
}
</style>
