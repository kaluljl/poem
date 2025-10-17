<template>
  <button
    :style="{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: active 
        ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' 
        : 'rgba(59, 130, 246, 0.1)',
      color: active ? 'white' : '#3b82f6',
      boxShadow: active 
        ? '0 4px 15px rgba(59, 130, 246, 0.3)' 
        : 'none'
    }"
    @click="$emit('click')"
    @mouseover="!active && ($event.target.style.background = 'rgba(59, 130, 246, 0.2)')"
    @mouseout="!active && ($event.target.style.background = 'rgba(59, 130, 246, 0.1)')"
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
