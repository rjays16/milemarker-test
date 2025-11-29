<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg max-w-sm"
      :class="toastClasses"
    >
      <div class="flex-1">
        {{ toast.message }}
      </div>
      <button
        @click="hideToast"
        class="text-white hover:text-gray-200 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const { toast, hideToast } = useToast()

const toastClasses = computed(() => {
  const baseClasses = 'text-white'
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }
  return `${baseClasses} ${typeClasses[toast.value.type] || typeClasses.info}`
})
</script>