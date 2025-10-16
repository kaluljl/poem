<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer group border border-gray-100 dark:border-gray-700"
    @click="$emit('click')"
  >
    <!-- 标题和作者 -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        {{ poem.title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ poem.author }} · {{ poem.dynasty }}
      </p>
    </div>
    
    <!-- 诗词内容预览 -->
    <div class="text-gray-700 dark:text-gray-300 leading-relaxed serif mb-4 line-clamp-3">
      {{ poem.content }}
    </div>
    
    <!-- 标签和统计 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ formatNumber(poem.view_count) }}
        </span>
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ formatNumber(poem.like_count) }}
        </span>
      </div>
      
      <div class="flex items-center space-x-1">
        <span v-if="poem.category" class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
          {{ poem.category }}
        </span>
        <span v-if="poem.style" class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
          {{ poem.style }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClassicPoem } from '@/lib/database'

defineProps<{
  poem: ClassicPoem
}>()

defineEmits<{
  click: []
}>()

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
