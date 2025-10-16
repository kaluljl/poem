<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
      active 
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/20'
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
