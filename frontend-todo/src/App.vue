<template>
  <div id="app">
    <router-view />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Toast from './components/Toast.vue'
import { useAuth } from './composables/useAuth'

const { initializeAuth } = useAuth()

onMounted(() => {
  initializeAuth()
})
</script>