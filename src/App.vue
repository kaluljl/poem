<!-- 优美国风首页：遵循 .cursorrules，响应式、可访问性、数据驱动 -->
<template>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-amber-600 text-white px-3 py-1 rounded">跳到主内容</a>
  <div class="min-h-screen bg-white text-gray-800 font-sans">
    <!-- Header / Navigation（不固定） -->
    <header class="relative w-full bg-white shadow-sm" role="banner" aria-label="主导航">
      <div class="mx-auto max-w-screen-xl px-4 md:px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img
            src="https://ai-public.mastergo.com/ai/img_res/d07c1e362295db3d80f132463fcc5dfd.jpg"
            alt="古韵诗香 Logo"
            class="h-10 object-contain"
            loading="eager"
          />
          <span class="text-lg font-semibold tracking-wide">古韵诗香</span>
        </div>
        <!-- 移动端菜单按钮 -->
        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-100"
          aria-label="打开导航菜单"
          @click="toggleMobile()"
        >
          ☰
        </button>
        <nav class="hidden md:flex gap-6" aria-label="站点导航">
          <a href="#featured" class="hover:text-amber-700 transition-colors">精选</a>
          <a href="#categories" class="hover:text-amber-700 transition-colors">分类</a>
          <a href="#quotes" class="hover:text-amber-700 transition-colors">名句</a>
          <a href="#articles" class="hover:text-amber-700 transition-colors">赏析</a>
        </nav>
        <div class="relative w-56 md:w-64" aria-label="搜索诗词">
          <input
            v-model.trim="query"
            type="text"
            placeholder="搜索诗词…"
            class="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            aria-label="搜索诗词"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">🔍</span>
        </div>
      </div>
    </header>
    <!-- 移动端抽屉菜单 -->
    <transition name="fade" mode="out-in">
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-gray-200 bg-white"
        role="dialog"
        aria-label="移动导航"
      >
        <div class="mx-auto max-w-screen-xl px-4 py-3 flex flex-col gap-2">
          <a href="#featured" class="py-2 rounded-md hover:bg-gray-100" @click="mobileOpen=false">精选</a>
          <a href="#categories" class="py-2 rounded-md hover:bg-gray-100" @click="mobileOpen=false">分类</a>
          <a href="#quotes" class="py-2 rounded-md hover:bg-gray-100" @click="mobileOpen=false">名句</a>
          <a href="#articles" class="py-2 rounded-md hover:bg-gray-100" @click="mobileOpen=false">赏析</a>
        </div>
      </div>
    </transition>

    <main id="main">
      <!-- Hero：国风山水背景 -->
      <section
        class="hero relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style="background-image: url('https://mastergo.com/ai/api/search-image?query=chinese%20ink%20painting%20landscape%20with%20mountains%20and%20water%20for%20poetry%20website%20background&width=1440&height=600&orientation=landscape&flag=518c9dc5d30135be8819223802457231'); min-height: 600px; background-position: center top; background-attachment: scroll;"
        aria-label="站点横幅"
      >
        <div class="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true"></div>
        <div class="mx-auto max-w-screen-xl px-4 md:px-6 relative z-10 h-full flex flex-col justify-center items-start py-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">古韵诗香</h1>
          <p class="text-lg md:text-xl text-white/95 mb-8 max-w-2xl">品味千年诗词之美，在清雅国风中漫步。</p>
          <div class="flex gap-3">
            <a href="#featured" class="inline-flex items-center rounded-full bg-amber-600 text-white px-5 py-2 hover:bg-amber-700 transition-colors">探索精选</a>
            <a href="#quotes" class="inline-flex items-center rounded-full bg-white/90 text-gray-800 px-5 py-2 hover:bg-white transition-colors">名句集锦</a>
          </div>
        </div>
        <!-- 渐变淡出，避免与下文硬切 -->
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none" aria-hidden="true"></div>
      </section>

      <!-- 分类标签：可横向滚动 -->
      <section id="categories" class="py-10">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">诗词分类</h2>
          <div class="flex gap-3 overflow-x-auto pb-2 -mx-1" role="list">
            <button
              v-for="cat in categories"
              :key="cat.name"
              type="button"
              :class="['flex-shrink-0 px-4 py-2 rounded-full border transition-colors', (selectedCategory === cat.name) ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100']"
              @click="selectCategory(cat.name)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- 精选诗词 -->
      <section id="featured" class="py-12 bg-amber-50">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">精选诗词</h2>
          <div v-if="filteredPoems.length === 0" class="text-center text-gray-500">未找到与“{{ query }}”相关的诗词</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <article
              v-for="poem in filteredPoems"
              :key="poem.title + poem.author"
              class="bg-white/90 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div class="p-5">
                <h3 class="text-lg font-semibold mb-1">{{ poem.title }}</h3>
                <p class="text-gray-600 mb-3">{{ poem.author }} · {{ poem.dynasty }}</p>
                <p class="text-gray-700 italic line-clamp-3">{{ poem.content }}</p>
                <button
                  type="button"
                  class="mt-5 rounded-full bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors"
                  @click="viewPoem(poem)"
                >
                  查看详情
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- 精选名句轮播 -->
      <section id="quotes" class="py-12">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">精选名句</h2>
          <div class="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <figure class="text-center">
              <blockquote class="text-xl md:text-2xl font-medium text-gray-900 mb-3">“{{ currentQuote.text }}”</blockquote>
              <figcaption class="text-gray-600">—— {{ currentQuote.author }} · {{ currentQuote.dynasty }}</figcaption>
            </figure>
            <div class="mt-6 flex justify-center gap-3">
              <button type="button" class="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100" @click="prevQuote" aria-label="上一条">←</button>
              <button type="button" class="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100" @click="nextQuote" aria-label="下一条">→</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新赏析 -->
      <section id="articles" class="py-12 bg-amber-50">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">最新赏析</h2>
          <div class="max-w-4xl mx-auto">
            <article
              v-for="post in articles"
              :key="post.title + post.author"
              class="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start">
                <img :src="post.cover" alt="文章配图" class="w-24 h-24 object-cover rounded-lg mr-6" loading="lazy" />
                <div>
                  <h3 class="text-xl font-semibold mb-2">{{ post.title }}</h3>
                  <div class="flex items-center text-gray-600 text-sm mb-3">
                    <span class="mr-4">👤 {{ post.author }}</span>
                    <span>🕒 {{ post.date }}</span>
                  </div>
                  <p class="text-gray-700">{{ post.summary }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    <!-- 返回顶部 -->
    <button type="button" class="fixed bottom-5 right-5 z-50 rounded-full bg-amber-600 text-white px-3 py-2 shadow-md hover:bg-amber-700" aria-label="返回顶部" @click="window.scrollTo({ top: 0, behavior: 'smooth' })">↑</button>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-12 pb-8" role="contentinfo">
      <div class="mx-auto max-w-screen-xl px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 class="text-xl font-bold mb-4">古韵诗香</h3>
            <p class="text-gray-400">传承中华文化，品读千年诗词之美。我们致力于为广大诗词爱好者提供优质的内容和服务。</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">快速链接</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">联系我们</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">版权声明</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">网站地图</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">友情链接</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">中华诗词网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">古诗文网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">诗词名句网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">中国诗歌网</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">订阅更新</h4>
            <form class="flex gap-2" @submit.prevent="subscribe">
              <input type="email" v-model="email" placeholder="输入邮箱…" class="flex-1 px-3 py-2 rounded-md text-gray-900" aria-label="订阅邮箱" />
              <button type="submit" class="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700">订阅</button>
            </form>
            <p v-if="subscribed" class="mt-2 text-amber-400">订阅成功！</p>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-center text-gray-500">
          <p>&copy; 2025 古韵诗香. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 搜索关键词
const query = ref('')
const selectedCategory = ref<string | null>(null)
const mobileOpen = ref(false)

// 分类
const categories = [
  { name: '唐诗' }, { name: '宋词' }, { name: '元曲' }, { name: '古风' },
]

// 精选诗词
const poems = [
  { title: '静夜思', author: '李白', dynasty: '唐代', content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。', category: '唐诗' },
  { title: '水调歌头', author: '苏轼', dynasty: '宋代', content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。', category: '宋词' },
  { title: '春晓', author: '孟浩然', dynasty: '唐代', content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', category: '唐诗' },
  { title: '念奴娇·赤壁怀古', author: '苏轼', dynasty: '宋代', content: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。', category: '宋词' },
]

// 名句
const quotes = [
  { text: '大漠孤烟直，长河落日圆。', author: '王维', dynasty: '唐代' },
  { text: '但愿人长久，千里共婵娟。', author: '苏轼', dynasty: '宋代' },
  { text: '会当凌绝顶，一览众山小。', author: '杜甫', dynasty: '唐代' },
]
const quoteIndex = ref(0)
const currentQuote = computed(() => quotes[quoteIndex.value] || quotes[0])
function nextQuote() { quoteIndex.value = (quoteIndex.value + 1) % quotes.length }
function prevQuote() { quoteIndex.value = (quoteIndex.value - 1 + quotes.length) % quotes.length }

// 自动播放（尊重“减少动效”偏好）
let quoteTimer: number | null = null
onMounted(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    quoteTimer = window.setInterval(() => nextQuote(), 6000)
  }
})
onUnmounted(() => {
  if (quoteTimer) {
    clearInterval(quoteTimer)
    quoteTimer = null
  }
})

// 文章
const articles = [
  { title: '《静夜思》中的乡愁意象解析', author: '李文博', date: '2023-05-15', cover: 'https://ai-public.mastergo.com/ai/img_res/7e6a4cc3b9ebe3abf1d9da0be376ba33.jpg', summary: '李白通过月光、霜色等自然景象，表达游子思乡之情……' },
  { title: '苏轼《水调歌头》中秋情怀解读', author: '王雅琴', date: '2023-09-22', cover: 'https://ai-public.mastergo.com/ai/img_res/efb3bf7d9b45c0429a4fa26628e9ee36.jpg', summary: '对月之问展现复杂情感与人生思考，词中人事与天问相互映照……' },
  { title: '孟浩然《春晓》的自然美学探析', author: '张明轩', date: '2023-03-10', cover: 'https://ai-public.mastergo.com/ai/img_res/ec0952c4edb11c991480eeff94ac77ac.jpg', summary: '短短二十字勾勒春晨景象，体现敏锐观察与深厚情感……' },
]

// 过滤逻辑
const filteredPoems = computed(() => {
  const q = query.value.toLowerCase()
  return poems.filter(p => {
    const matchQuery = !q || [p.title, p.author, p.dynasty, p.category].some(v => v.toLowerCase().includes(q))
    const matchCat = !selectedCategory.value || p.category === selectedCategory.value
    return matchQuery && matchCat
  })
})

function viewPoem(poem: (typeof poems)[number]) {
  alert(`查看：${poem.title}（${poem.author} · ${poem.dynasty}）`)
}

function selectCategory(name: string) {
  selectedCategory.value = selectedCategory.value === name ? null : name
}

// 订阅
const email = ref('')
const subscribed = ref(false)
function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function subscribe() {
  if (email.value && /\S+@\S+\.\S+/.test(email.value)) {
    subscribed.value = true
    setTimeout(() => (subscribed.value = false), 3000)
    email.value = ''
  } else {
    alert('请输入有效邮箱地址')
  }
}
</script>

<style scoped>
/* 描述段落限制行数（Tailwind line-clamp 替代方案） */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 图片尺寸约束 */
img { max-width: 100%; height: auto; }

/* 英雄区背景不固定，且不重复 */
.hero { background-repeat: no-repeat; background-attachment: scroll; }

/* 可访问性：清晰的键盘聚焦样式 */
:focus-visible {
  outline: 2px solid #d97706; /* amber-600 */
  outline-offset: 2px;
}

/* 用户偏好减少动效：关闭过渡与动画 */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
/* 头部与标题微调：更优雅的字距与行高 */
h1, h2, h3 { letter-spacing: 0.02em; }

/* 抽屉淡入淡出动效（尊重“减少动效”偏好） */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

</style>