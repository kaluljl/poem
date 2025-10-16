<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 英雄区域 -->
    <section class="relative overflow-hidden">
      <!-- 背景图片 -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center"
          alt="诗词背景"
          class="w-full h-full object-cover opacity-20"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
      </div>
      
      <!-- 内容 -->
      <div class="relative container mx-auto px-4 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            诗境雅集
            <span class="block text-2xl md:text-3xl font-normal text-amber-600 dark:text-amber-400 mt-2">
              AI诗词创作平台
            </span>
          </h1>
          
          <p class="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            在这里，传统诗词与现代AI相遇<br>
            让每一个人都能体验诗词创作的美妙
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="$emit('navigate', 'create')"
              class="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <span class="mr-2">✨</span>
              开始AI创作
            </button>
            <button 
              @click="scrollToPoems"
              class="btn btn-outline text-lg px-8 py-3 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
            >
              <span class="mr-2">📜</span>
              欣赏经典
            </button>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🌸</div>
      <div class="absolute top-40 right-20 text-4xl opacity-10 animate-pulse delay-1000">🍃</div>
      <div class="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse delay-2000">🌙</div>
    </section>

    <!-- 特色功能 -->
    <section class="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">平台特色</h2>
          <p class="text-gray-600 dark:text-gray-400">融合传统文化与现代科技，打造全新的诗词体验</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🤖"
            title="AI智能创作"
            description="先进的AI技术，根据您的主题和情感，生成优美的诗词作品"
          />
          <FeatureCard
            icon="📚"
            title="经典诗词库"
            description="收录历代经典诗词，配有详细注释和赏析，传承文化精髓"
          />
          <FeatureCard
            icon="🌸"
            title="社区互动"
            description="与诗词爱好者交流创作心得，分享作品，共同成长"
          />
        </div>
      </div>
    </section>

    <!-- 今日推荐 -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">今日推荐</h2>
          <p class="text-gray-600 dark:text-gray-400">精选经典诗词，感受千年文化魅力</p>
        </div>
        
        <!-- 每日一诗 -->
        <div class="max-w-4xl mx-auto mb-12">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div class="text-sm text-amber-600 dark:text-amber-400 font-medium mb-4">每日一诗</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ dailyPoem.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">{{ dailyPoem.author }} · {{ dailyPoem.dynasty }}</p>
            <div class="text-lg leading-relaxed text-gray-800 dark:text-gray-200 serif mb-6 whitespace-pre-line">
              {{ dailyPoem.content }}
            </div>
            <button 
              @click="viewPoemDetail(dailyPoem)"
              class="text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              查看详情 →
            </button>
          </div>
        </div>
        
        <!-- 热门诗词 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref="poemsSection">
          <PoemCard
            v-for="poem in featuredPoems"
            :key="poem.id"
            :poem="poem"
            @click="viewPoemDetail(poem)"
          />
        </div>
        
        <div class="text-center mt-8">
          <button 
            @click="loadMorePoems"
            :disabled="loading"
            class="btn btn-outline"
          >
            <span v-if="loading">加载中...</span>
            <span v-else>查看更多</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 创作灵感 -->
    <section class="py-16 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">创作灵感</h2>
          <p class="text-gray-600 dark:text-gray-400">从这些主题开始，创作属于您的诗词</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <button
            v-for="theme in inspirationThemes"
            :key="theme"
            @click="startCreationWithTheme(theme)"
            class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm hover:shadow-md"
          >
            {{ theme }}
          </button>
        </div>
        
        <div class="text-center">
          <button 
            @click="$emit('navigate', 'create')"
            class="btn btn-primary"
          >
            立即开始创作
          </button>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard
            :value="stats.totalPoems"
            label="收录诗词"
            icon="📜"
          />
          <StatCard
            :value="stats.totalUsers"
            label="注册用户"
            icon="👥"
          />
          <StatCard
            :value="stats.totalCreations"
            label="AI创作"
            icon="✨"
          />
          <StatCard
            :value="stats.totalLikes"
            label="获得点赞"
            icon="❤️"
          />
        </div>
      </div>
    </section>

    <!-- 底部CTA -->
    <section class="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">加入诗境雅集</h2>
        <p class="text-xl mb-8 opacity-90">与千万诗词爱好者一起，探索诗词创作的无限可能</p>
        <button 
          @click="$emit('navigate', 'community')"
          class="btn bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-3"
        >
          加入社区
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DatabaseService } from '@/lib/database'
import type { ClassicPoem } from '@/lib/database'
import FeatureCard from '@/components/FeatureCard.vue'
import PoemCard from '@/components/PoemCard.vue'
import StatCard from '@/components/StatCard.vue'

// Emits
defineEmits<{
  navigate: [page: string, options?: any]
}>()

// 响应式数据
const loading = ref(false)
const poemsSection = ref<HTMLElement>()

const dailyPoem = ref({
  id: '1',
  title: '静夜思',
  author: '李白',
  dynasty: '唐代',
  content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'
})

const featuredPoems = ref<ClassicPoem[]>([])

const inspirationThemes = [
  '春日踏青', '秋夜思君', '山水田园', '离别相思',
  '边塞征战', '咏物抒怀', '节日庆典', '人生感悟'
]

const stats = ref({
  totalPoems: '10,000+',
  totalUsers: '50,000+',
  totalCreations: '100,000+',
  totalLikes: '500,000+'
})

// 方法
function scrollToPoems() {
  poemsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

function viewPoemDetail(poem: any) {
  $emit('navigate', 'poem-detail', { poemId: poem.id, poemType: 'classic' })
}

function startCreationWithTheme(theme: string) {
  // 跳转到创作页面并预填主题
  $emit('navigate', 'create', { theme })
}

async function loadMorePoems() {
  loading.value = true
  try {
    const { data } = await DatabaseService.getClassicPoems({
      limit: 6,
      offset: featuredPoems.value.length
    })
    featuredPoems.value.push(...data)
  } catch (error) {
    console.error('加载诗词失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(async () => {
  try {
    // 加载精选诗词
    const { data } = await DatabaseService.getClassicPoems({ limit: 6 })
    featuredPoems.value = data
    
    // 随机选择每日一诗
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      dailyPoem.value = data[randomIndex]
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.8;
  letter-spacing: 0.05em;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
