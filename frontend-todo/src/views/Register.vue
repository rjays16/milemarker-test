<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Sign up to get started</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6" novalidate>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :class="errors.name ? 'border-red-500' : 'border-gray-300'"
            placeholder="John Doe"
            @blur="validateName"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :class="errors.email ? 'border-red-500' : 'border-gray-300'"
            placeholder="your@email.com"
            @blur="validateEmail"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
            placeholder="••••••••"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            :class="errors.password_confirmation ? 'border-red-500' : 'border-gray-300'"
            placeholder="••••••••"
            @blur="validatePasswordConfirmation"
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { register, loading, error } = useAuth()
const { showToast } = useToast()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const validateName = () => {
  errors.value.name = ''
  if (!form.value.name) {
    errors.value.name = 'Name is required'
  }
}

const validateEmail = () => {
  errors.value.email = ''
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
}

const validatePassword = () => {
  errors.value.password = ''
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }
}

const validatePasswordConfirmation = () => {
  errors.value.password_confirmation = ''
  if (!form.value.password_confirmation) {
    errors.value.password_confirmation = 'Please confirm your password'
  } else if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match'
  }
}

const handleRegister = async () => {
  // Validate all fields
  validateName()
  validateEmail()
  validatePassword()
  validatePasswordConfirmation()

  // Check if there are any errors
  if (errors.value.name || errors.value.email || errors.value.password || errors.value.password_confirmation) {
    return
  }

  try {
    await register(form.value)
    showToast('Registration successful!', 'success')
    router.push('/dashboard')
  } catch (err) {
    showToast('Registration failed. Please try again.', 'error')
  }
}
</script>