<template>
  <div class="text-center">
    <div class="text-3xl mb-2">{{ icon }}</div>
    <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ value }}</div>
    <div class="text-gray-600 dark:text-gray-400">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
  icon: string
}>()
</script>
