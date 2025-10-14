<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { fetchPoems, searchPoems, type Poem } from '@/data/poems'

const query = ref('')
const dynasty = ref('')
const tag = ref('')

const loading = ref(false)
const error = ref<string | null>(null)
const dataset = ref<Poem[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    dataset.value = await fetchPoems()
  } catch (e: any) {
    error.value = e?.message || '数据加载失败'
  } finally {
    loading.value = false
  }
})

// 防抖
const debouncedQuery = ref('')
let debounceTimer: any = null
watch([query], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = query.value
  }, 250)
})

// 基础检索结果（基于真实数据）
const baseResults = computed<Poem[]>(() => {
  return searchPoems(dataset.value, debouncedQuery.value, {
    dynasty: dynasty.value || undefined,
    tag: tag.value || undefined,
  })
})

// 分页
const pageSize = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(baseResults.value.length / pageSize.value)))
const pagedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return baseResults.value.slice(start, start + pageSize.value)
})
watch([baseResults, pageSize], () => {
  currentPage.value = 1
})

// 高亮
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function highlight(text: string, q: string) {
  const needle = q.trim()
  if (!needle) return text
  try {
    const re = new RegExp(escapeRegExp(needle), 'gi')
    return text.replace(re, (m) => `<mark>${m}</mark>`)
  } catch {
    return text
  }
}

function clearAll() {
  query.value = ''
  dynasty.value = ''
  tag.value = ''
}
</script>

<template>
  <main class="container">
    <h1>诗词检索</h1>

    <section class="search-bar">
      <input v-model="query" type="text" placeholder="搜索标题 / 作者 / 正文 / 标签" />
      <input v-model="dynasty" type="text" placeholder="按朝代筛选（如：唐、宋）" />
      <input v-model="tag" type="text" placeholder="按标签筛选（如：思乡、自然）" />
      <button @click="clearAll">清空</button>
    </section>

    <section v-if="loading" class="loading">正在加载数据...</section>
    <section v-else-if="error" class="error">加载失败：{{ error }}</section>

    <section v-else>
      <section class="meta">
        <p>共 {{ baseResults.length }} 条结果 · 每页 {{ pageSize }} 条 · 第 {{ currentPage }} / {{ totalPages }} 页</p>
      </section>

      <section class="list">
        <article v-for="p in pagedResults" :key="p.id" class="item">
          <header class="header">
            <h2 class="title" v-html="highlight(p.title, debouncedQuery)"></h2>
            <div class="sub">
              <span v-html="highlight(p.author, debouncedQuery)"></span> ·
              {{ p.dynasty }}
            </div>
          </header>
          <p class="text" v-html="highlight(p.text, debouncedQuery)"></p>
          <div class="tags">
            <span v-for="t in p.tags" :key="t" class="tag" v-html="'#' + highlight(t, debouncedQuery)"></span>
          </div>
        </article>
      </section>

      <section class="pager">
        <button :disabled="currentPage <= 1" @click="currentPage--">上一页</button>
        <button :disabled="currentPage >= totalPages" @click="currentPage++">下一页</button>
        <label class="pagesize">
          每页
          <select v-model.number="pageSize">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
          条
        </label>
      </section>
    </section>
  </main>
</template>

<style scoped>
.container { padding: 24px; }
.search-bar { display: grid; grid-template-columns: 1fr 200px 200px auto; gap: 8px; margin-bottom: 12px; }
.search-bar input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
.search-bar button { padding: 8px 12px; }
.loading, .error { margin: 12px 0; color: #666; }
.meta { margin: 8px 0 16px; color: #666; }
.list { display: grid; gap: 16px; }
.item { padding: 12px; border: 1px solid #eee; border-radius: 10px; background: #fafafa; }
.header { display: flex; align-items: baseline; gap: 8px; }
.title { margin: 0; }
.sub { color: #888; font-size: 14px; }
.text { margin: 8px 0; line-height: 1.8; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { padding: 3px 8px; background: #eef; border-radius: 999px; font-size: 12px; }
.pager { display: flex; gap: 8px; align-items: center; margin-top: 16px; }
.pagesize select { margin-left: 6px; padding: 4px 8px; }
mark { background: #ffea8a; padding: 0 2px; border-radius: 2px; }
@media (max-width: 640px) {
  .search-bar { grid-template-columns: 1fr; }
}
</style>