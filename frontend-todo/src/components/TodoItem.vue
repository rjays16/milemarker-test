<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start gap-4">
      <!-- Checkbox -->
      <button
        @click="$emit('toggle', todo.id)"
        class="flex-shrink-0 mt-1"
      >
        <div
          class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200"
          :class="todo.is_completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'"
        >
          <svg v-if="todo.is_completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3
          class="font-medium text-gray-900 mb-1"
          :class="{ 'line-through text-gray-400': todo.is_completed }"
        >
          {{ todo.title }}
        </h3>
        
        <p
          v-if="todo.description"
          class="text-sm text-gray-600 mb-2"
          :class="{ 'line-through text-gray-400': todo.is_completed }"
        >
          {{ todo.description }}
        </p>

        <div class="flex items-center gap-3 text-sm">
          <!-- Category Badge -->
          <CategoryBadge v-if="todo.category" :category="todo.category" />

          <!-- Due Date -->
          <span v-if="todo.due_date" class="flex items-center gap-1 text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(todo.due_date) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('edit', todo)"
          class="text-indigo-600 hover:text-indigo-700 p-2"
          title="Edit"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', todo.id)"
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
</template>

<script setup>
import CategoryBadge from './CategoryBadge.vue'

defineProps({
  todo: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'edit', 'delete'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>