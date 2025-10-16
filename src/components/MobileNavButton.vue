<template>
  <button
    :class="[
      'block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors',
      active 
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
        : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-300 dark:hover:text-amber-400 dark:hover:bg-amber-900/20'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>
