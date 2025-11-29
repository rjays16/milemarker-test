<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Todo App</h1>
              <p class="text-xs text-gray-500">Welcome, {{ user?.name }}</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with Buttons -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">My Todos</h2>
          <p class="text-gray-600 mt-1">Manage your tasks efficiently</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showCategoryModal = true"
            class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categories
          </button>
          <button
            @click="showAddModal = true"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Todo
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search todos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>

          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @change="handleFilter"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select
              v-model="filters.is_completed"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @change="handleFilter"
            >
              <option value="">All Status</option>
              <option value="0">Pending</option>
              <option value="1">Completed</option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <select
              v-model="filters.sort_by"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @change="handleFilter"
            >
              <option value="created_at">Sort by Created</option>
              <option value="due_date">Sort by Due Date</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="todosLoading" />

      <!-- Empty State -->
      <div v-else-if="todos.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No todos yet</h3>
        <p class="text-gray-500 mb-6">Get started by creating your first todo</p>
        <button
          @click="showAddModal = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Create Todo
        </button>
      </div>

      <!-- Todo List -->
      <div v-else class="space-y-4">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @toggle="handleToggle"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- Add/Edit Todo Modal -->
    <TodoFormModal
      v-if="showAddModal || showEditModal"
      :todo="editingTodo"
      :categories="categories"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- Category Management Modal -->
    <CategoryModal
      v-if="showCategoryModal"
      :categories="categories"
      @close="showCategoryModal = false"
      @refresh="handleCategoryRefresh"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteConfirm"
      title="Delete Todo?"
      message="Are you sure you want to delete this todo? This action cannot be undone."
      confirm-text="Delete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useTodos } from '../composables/useTodos'
import { useCategories } from '../composables/useCategories'
import { useToast } from '../composables/useToast'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TodoItem from '../components/TodoItem.vue'
import TodoFormModal from '../components/modals/TodoFormModal.vue'
import CategoryModal from '../components/modals/CategoryModal.vue'
import ConfirmModal from '../components/modals/ConfirmModal.vue'

const { user, logout } = useAuth()
const { todos, loading: todosLoading, fetchTodos, toggleTodo, deleteTodo } = useTodos()
const { categories, fetchCategories } = useCategories()
const { showToast } = useToast()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showCategoryModal = ref(false)
const showDeleteConfirm = ref(false)
const editingTodo = ref(null)
const todoToDelete = ref(null)

const filters = ref({
  search: '',
  category_id: '',
  is_completed: '',
  sort_by: 'created_at'
})

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFilter()
  }, 500)
}

const handleFilter = () => {
  const filterParams = {}
  if (filters.value.search) filterParams.search = filters.value.search
  if (filters.value.category_id) filterParams.category_id = filters.value.category_id
  if (filters.value.is_completed !== '') filterParams.is_completed = filters.value.is_completed
  if (filters.value.sort_by) filterParams.sort_by = filters.value.sort_by
  
  fetchTodos(filterParams)
}

const handleToggle = async (id) => {
  try {
    await toggleTodo(id)
    showToast('Todo status updated', 'success')
  } catch (err) {
    showToast('Failed to update todo', 'error')
  }
}

const handleEdit = (todo) => {
  editingTodo.value = { ...todo }
  showEditModal.value = true
}

const handleDelete = (id) => {
  todoToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteTodo(todoToDelete.value)
    showToast('Todo deleted successfully', 'success')
    showDeleteConfirm.value = false
    todoToDelete.value = null
  } catch (err) {
    showToast('Failed to delete todo', 'error')
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  todoToDelete.value = null
}

const handleSave = () => {
  closeModals()
  handleFilter()
  showToast(editingTodo.value ? 'Todo updated successfully' : 'Todo created successfully', 'success')
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingTodo.value = null
}

const handleCategoryRefresh = async () => {
  await fetchCategories()
}

const handleLogout = async () => {
  await logout()
  showToast('Logged out successfully', 'success')
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTodos()
  ])
})
</script>