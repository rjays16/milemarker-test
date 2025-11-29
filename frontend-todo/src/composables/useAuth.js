import { ref, computed } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const user = ref(null)
const token = ref(localStorage.getItem('token') || null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  // Register
  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/register', userData)
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/login', credentials)
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  // Get current user
  const getUser = async () => {
    try {
      const response = await api.get('/user')
      user.value = response.data
      return response.data
    } catch (err) {
      console.error('Get user error:', err)
      throw err
    }
  }

  // Initialize user from localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getUser,
    initializeAuth
  }
}