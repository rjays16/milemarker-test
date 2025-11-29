<template>
  <span
    v-if="category"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
    :style="{ backgroundColor: category.color }"
  >
    {{ category.name }}
  </span>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    default: null
  }
})
</script>