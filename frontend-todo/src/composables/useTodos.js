import { ref } from 'vue'
import api from '../services/api'

const todos = ref([])
const loading = ref(false)
const error = ref(null)

export function useTodos() {
  // Fetch all todos with filters
  const fetchTodos = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category_id) params.append('category_id', filters.category_id)
      if (filters.is_completed !== undefined) params.append('is_completed', filters.is_completed)
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      
      const response = await api.get(`/todos?${params.toString()}`)
      todos.value = response.data.data || response.data
      return todos.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch todos'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create todo
  const createTodo = async (todoData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/todos', todoData)
      todos.value.unshift(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update todo
  const updateTodo = async (id, todoData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(`/todos/${id}`, todoData)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to toggle todo'
      throw err
    }
  }

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/todos/${id}`)
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo
  }
}