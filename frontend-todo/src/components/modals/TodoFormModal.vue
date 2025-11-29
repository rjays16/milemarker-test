<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        {{ todo ? 'Edit Todo' : 'Add New Todo' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="What needs to be done?"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Add more details..."
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            v-model="form.category_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">No Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Completed Status (only for edit) -->
        <div v-if="todo" class="flex items-center">
          <input
            id="is_completed"
            v-model="form.is_completed"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="is_completed" class="ml-2 text-sm text-gray-700">
            Mark as completed
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {{ loading ? 'Saving...' : (todo ? 'Update' : 'Create') }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTodos } from '../../composables/useTodos'

const props = defineProps({
  todo: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const { createTodo, updateTodo, loading } = useTodos()

const form = ref({
  title: '',
  description: '',
  category_id: '',
  due_date: '',
  is_completed: false
})

const handleSubmit = async () => {
  try {
    if (props.todo) {
      // Update existing todo
      await updateTodo(props.todo.id, form.value)
    } else {
      // Create new todo
      await createTodo(form.value)
    }
    emit('save')
  } catch (err) {
    console.error('Error saving todo:', err)
  }
}

onMounted(() => {
  if (props.todo) {
    form.value = {
      title: props.todo.title,
      description: props.todo.description || '',
      category_id: props.todo.category_id || '',
      due_date: props.todo.due_date || '',
      is_completed: props.todo.is_completed
    }
  }
})
</script>