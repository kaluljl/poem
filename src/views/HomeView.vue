<script setup lang="ts">
import { useAppStore } from '@/store'
const store = useAppStore()
</script>

<template>
  <main class="container">
    <h1>{{ store.title }}</h1>
    <p>欢迎来到“诗光词影”智能诗词赏析平台（MVP）。</p>
    <section class="card">
      <p>计数示例：{{ store.counter }}</p>
      <button @click="store.increment">+1</button>
    </section>
  <section style="margin-top:16px">
    <RouterLink to="/search">前往检索</RouterLink>
  </section>
  </main>
</template>

<style scoped>
.container { padding: 24px; }
.card { margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
button { padding: 6px 12px; }
</style>