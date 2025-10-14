<!-- 使用 TailwindCSS 的响应式页面：数据驱动、可访问性优化、搜索联动 -->
<template>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-amber-600 text-white px-3 py-1 rounded">跳到主内容</a>
  <div class="min-h-screen bg-white text-gray-800 font-sans">
    <!-- Header / Navigation -->
    <header class="relative w-full bg-white shadow-md z-10" role="banner" aria-label="主导航">
      <div class="mx-auto max-w-screen-xl px-4 md:px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img
            src="https://ai-public.mastergo.com/ai/img_res/d07c1e362295db3d80f132463fcc5dfd.jpg"
            alt="古韵诗香 Logo"
            class="h-10 object-contain"
            loading="eager"
          />
        </div>

        <nav class="hidden md:flex space-x-8" aria-label="站点导航">
          <a href="#" class="text-lg hover:text-amber-700 transition-colors">首页</a>
          <a href="#" class="text-lg hover:text-amber-700 transition-colors">诗词分类</a>
          <a href="#" class="text-lg hover:text-amber-700 transition-colors">诗人介绍</a>
          <a href="#" class="text-lg hover:text-amber-700 transition-colors">名句赏析</a>
          <a href="#" class="text-lg hover:text-amber-700 transition-colors">互动社区</a>
        </nav>

        <div class="relative w-64" aria-label="搜索诗词">
          <input
            v-model.trim="query"
            type="text"
            placeholder="搜索诗词..."
            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            aria-label="搜索诗词"
          />
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
            title="搜索"
          >🔍</span>
        </div>
      </div>
    </header>

    <main id="main">
      <!-- Hero Section -->
      <section
        class="hero pt-12 pb-12 relative bg-cover bg-center bg-no-repeat z-0 overflow-hidden"
        style="background-image: url('https://mastergo.com/ai/api/search-image?query=chinese%20ink%20painting%20landscape%20with%20mountains%20and%20water%20for%20poetry%20website%20background&width=1440&height=600&orientation=landscape&flag=518c9dc5d30135be8819223802457231'); min-height: 600px; background-position: center top; background-attachment: scroll;"
        aria-label="横幅"
      >
        <div class="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true"></div>
        <div class="mx-auto max-w-screen-xl px-4 md:px-6 relative z-10 h-full flex flex-col justify-center items-start">
          <h1 class="text-5xl font-bold text-white mb-4 tracking-wider">古韵诗香</h1>
          <p class="text-xl text-white mb-8 max-w-2xl">品味千年诗词之美</p>
          <div class="relative w-full max-w-md">
            <input
              v-model.trim="query"
              type="text"
              placeholder="请输入诗词名称或作者..."
              class="w-full pl-10 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
              aria-label="搜索诗词或作者"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">🔎</span>
          </div>
        </div>
      </section>

      <!-- Featured Poems -->
      <section class="py-16 bg-amber-50 relative z-10" aria-labelledby="featured-poems-title">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 id="featured-poems-title" class="text-3xl font-bold text-center mb-12">精选诗词</h2>

          <div v-if="filteredPoems.length === 0" class="text-center text-gray-500">
            未找到与“{{ query }}”相关的诗词
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article
              v-for="poem in filteredPoems"
              :key="poem.title + poem.author"
              class="bg-white/80 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-1">{{ poem.title }}</h3>
                <p class="text-gray-600 mb-3">{{ poem.author }} · {{ poem.dynasty }}</p>
                <p class="text-gray-700 italic line-clamp-3">{{ poem.content }}</p>
                <button
                  type="button"
                  class="mt-6 rounded-full bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors"
                  @click="viewPoem(poem)"
                >
                  查看详情
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="py-16 bg-white relative z-10" aria-labelledby="categories-title">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 id="categories-title" class="text-3xl font-bold text-center mb-12">诗词分类</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              v-for="cat in categories"
              :key="cat.name"
              class="flex flex-col items-center text-center group cursor-pointer"
              @click="selectCategory(cat.name)"
            >
              <div class="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <img :src="cat.img" :alt="cat.name" class="w-12 h-12 object-contain" loading="lazy" />
              </div>
              <h3 class="text-xl font-medium">{{ cat.name }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Articles -->
      <section class="py-16 bg-amber-50 relative z-10" aria-labelledby="latest-articles-title">
        <div class="mx-auto max-w-screen-xl px-4 md:px-6">
          <h2 id="latest-articles-title" class="text-3xl font-bold text-center mb-12">最新赏析</h2>
          <div class="max-w-4xl mx-auto">
            <article
              v-for="post in articles"
              :key="post.title + post.author"
              class="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start">
                <img
                  :src="post.cover"
                  alt="文章配图"
                  class="w-24 h-24 object-cover rounded-lg mr-6"
                  loading="lazy"
                />
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
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-16 pb-8" role="contentinfo">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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
            <h4 class="text-lg font-semibold mb-4">联系我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-start">
                <span class="mt-1 mr-3" aria-hidden="true">📍</span>
                <span>北京市朝阳区文化路 123 号</span>
              </li>
              <li class="flex items-center">
                <span class="mr-3" aria-hidden="true">☎️</span>
                <span>010-12345678</span>
              </li>
              <li class="flex items-center">
                <span class="mr-3" aria-hidden="true">✉️</span>
                <span>contact@poetry.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; 2023 古韵诗香. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// 搜索关键词（导航与英雄区共享）
const query = ref('')

// 分类
const categories = [
  { name: '唐诗', img: 'https://ai-public.mastergo.com/ai/img_res/f875f9896dc7b44a911d077d9380cb6c.jpg' },
  { name: '宋词', img: 'https://ai-public.mastergo.com/ai/img_res/3d9b7c1c79bfd87568099bf64023ed49.jpg' },
  { name: '元曲', img: 'https://ai-public.mastergo.com/ai/img_res/cf2c500027cf73bb8088e9b6facdbd14.jpg' },
  { name: '古风', img: 'https://ai-public.mastergo.com/ai/img_res/c9ad84cfdfd7663a53cb9d12b831c87e.jpg' },
]

// 精选诗词数据
const poems = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    category: '唐诗',
  },
  {
    title: '水调歌头',
    author: '苏轼',
    dynasty: '宋代',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。',
    category: '宋词',
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    category: '唐诗',
  },
  {
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋代',
    content: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。',
    category: '宋词',
  },
]

// 文章数据
const articles = [
  {
    title: '《静夜思》中的乡愁意象解析',
    author: '李文博',
    date: '2023-05-15',
    cover: 'https://ai-public.mastergo.com/ai/img_res/7e6a4cc3b9ebe3abf1d9da0be376ba33.jpg',
    summary: '李白通过月光、霜色等自然景象，表达游子思乡之情……',
  },
  {
    title: '苏轼《水调歌头》中秋情怀解读',
    author: '王雅琴',
    date: '2023-09-22',
    cover: 'https://ai-public.mastergo.com/ai/img_res/efb3bf7d9b45c0429a4fa26628e9ee36.jpg',
    summary: '对月之问展现复杂情感与人生思考，词中人事与天问相互映照……',
  },
  {
    title: '孟浩然《春晓》的自然美学探析',
    author: '张明轩',
    date: '2023-03-10',
    cover: 'https://ai-public.mastergo.com/ai/img_res/ec0952c4edb11c991480eeff94ac77ac.jpg',
    summary: '短短二十字勾勒春晨景象，体现敏锐观察与深厚情感……',
  },
]

// 过滤逻辑：按标题、作者、朝代或分类匹配
const filteredPoems = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return poems
  return poems.filter(p =>
    [p.title, p.author, p.dynasty, p.category].some(v => v.toLowerCase().includes(q))
  )
})

function viewPoem(poem: (typeof poems)[number]) {
  // 占位逻辑：可后续接入路由或弹窗
  alert(`查看：${poem.title}（${poem.author} · ${poem.dynasty}）`)
}

function selectCategory(name: string) {
  query.value = name
}
</script>

<style scoped>
/* 可选：限制摘录段落行数（需要 Tailwind 的 line-clamp 插件可替换为 CSS） */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 防止图片尺寸溢出遮挡页面 */
img {
  max-width: 100%;
  height: auto;
}

/* 英雄区背景不随滚动固定，且不重复 */
.hero {
  background-repeat: no-repeat;
  background-attachment: scroll;
}
/* 英雄区底部加渐变遮罩，避免与后续内容交界处视觉“延续” */
.hero::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
  pointer-events: none;
}
/* 可访问性：清晰的键盘聚焦样式 */
:focus-visible {
  outline: 2px solid #d97706; /* amber-600 */
  outline-offset: 2px;
}

/* 用户偏好减少动效：关闭大部分过渡与动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>