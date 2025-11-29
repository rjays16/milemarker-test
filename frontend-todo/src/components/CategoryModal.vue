<template>
  <div>
    <!-- Main Category Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Manage Categories</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Add New Category Form -->
        <form @submit.prevent="handleAddCategory" class="mb-6 p-4 bg-gray-50 rounded-lg" novalidate>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                v-model="newCategory.name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
                placeholder="e.g., Work, Personal"
                @blur="validateName"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div class="flex gap-2">
                <input
                  v-model="newCategory.color"
                  type="color"
                  class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  v-model="newCategory.color"
                  type="text"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {{ loading ? 'Adding...' : 'Add Category' }}
          </button>
        </form>

        <!-- Categories List -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Categories</h3>
          <div v-if="categories.length === 0" class="text-center py-8 text-gray-500">
            No categories yet. Create your first one above!
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 rounded"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <div>
                  <span class="font-medium text-gray-900">{{ category.name }}</span>
                  <span class="ml-2 text-sm text-gray-500">({{ category.todos_count || 0 }} todos)</span>
                </div>
              </div>
              <button
                @click="handleDeleteCategory(category.id)"
                class="text-red-600 hover:text-red-700 p-2"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <ConfirmModal
        :show="showDeleteConfirm"
        title="Delete Category?"
        message="Are you sure you want to delete this category? Todos in this category will not be deleted."
        confirm-text="Delete"
        @confirm="confirmDeleteCategory"
        @cancel="cancelDeleteCategory"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCategories } from '../composables/useCategories'
import { useToast } from '../composables/useToast'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

const { createCategory, deleteCategory, loading } = useCategories()
const { showToast } = useToast()

const newCategory = ref({
  name: '',
  color: '#3b82f6'
})

const errors = ref({
  name: ''
})

const showDeleteConfirm = ref(false)
const categoryToDelete = ref(null)

const validateName = () => {
  errors.value.name = ''
  if (!newCategory.value.name || newCategory.value.name.trim() === '') {
    errors.value.name = 'Category name is required'
    return false
  }
  return true
}

const handleAddCategory = async () => {
  if (!validateName()) {
    return
  }

  try {
    await createCategory(newCategory.value)
    showToast('Category created successfully', 'success')
    newCategory.value = { name: '', color: '#3b82f6' }
    errors.value.name = ''
    emit('refresh')
  } catch (err) {
    showToast('Failed to create category', 'error')
  }
}

const handleDeleteCategory = (id) => {
  categoryToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDeleteCategory = async () => {
  try {
    await deleteCategory(categoryToDelete.value)
    showToast('Category deleted successfully', 'success')
    emit('refresh')
    showDeleteConfirm.value = false
    categoryToDelete.value = null
  } catch (err) {
    showToast('Failed to delete category', 'error')
  }
}

const cancelDeleteCategory = () => {
  showDeleteConfirm.value = false
  categoryToDelete.value = null
}
</script>