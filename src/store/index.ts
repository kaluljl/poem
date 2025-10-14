import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const title = ref('诗光词影')
  const counter = ref(0)
  function increment() { counter.value++ }
  return { title, counter, increment }
})