<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow group">
    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ title }}</h3>
    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>
