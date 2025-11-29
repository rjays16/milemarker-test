import { ref } from 'vue'
import api from '../services/api'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

export function useCategories() {
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/categories')
      categories.value = response.data.data || response.data
      return categories.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create category
  const createCategory = async (categoryData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/categories', categoryData)
      categories.value.push(response.data.data)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(`/categories/${id}`, categoryData)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = response.data.data
      }
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}