import { ref } from 'vue'

const toast = ref({
  show: false,
  message: '',
  type: 'success' // success, error, info
})

export function useToast() {
  const showToast = (message, type = 'success') => {
    toast.value = {
      show: true,
      message,
      type
    }

    setTimeout(() => {
      hideToast()
    }, 3000)
  }

  const hideToast = () => {
    toast.value.show = false
  }

  return {
    toast,
    showToast,
    hideToast
  }
}