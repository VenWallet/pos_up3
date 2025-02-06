import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMountPosStore = defineStore('mount-pos', () => {
  // State
  const state = ref('')

  // Actions
  const set = (value: string) => {
    state.value = value
  }

  return {
    state,
    set,
  }
})
