<template>
  <div class="min-h-screen" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
    <!-- 英雄区域 -->
    <section class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);"></div>
      
      <!-- 内容 -->
      <div class="relative container mx-auto px-4 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <!-- 品牌标识 -->
          <div style="width: 80px; height: 80px; background: linear-gradient(to bottom right, #3b82f6, #8b5cf6); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);">
            <span style="color: white; font-size: 32px; font-weight: bold;">诗</span>
          </div>
          
          <h1 style="font-size: 3.5rem; font-weight: 800; color: #1f2937; margin-bottom: 16px; line-height: 1.1;">
            诗境雅集
            <span style="display: block; font-size: 1.5rem; font-weight: 400; color: #6b7280; margin-top: 8px;">
              AI诗词创作平台
            </span>
          </h1>
          
          <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 32px; line-height: 1.6;">
            在这里，传统诗词与现代AI相遇<br>
            让每一个人都能体验诗词创作的美妙
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 16px; justify-content: center; align-items: center;">
            <button 
              @click="$emit('navigate', 'create')"
              style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 16px 32px; border-radius: 12px; border: none; font-size: 18px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3); transition: all 0.3s ease; transform: translateY(0);"
              @mouseover="$event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)'"
              @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)'"
            >
              <span style="margin-right: 8px;">✨</span>
              开始AI创作
            </button>
            <button 
              @click="scrollToPoems"
              style="background: white; color: #374151; padding: 16px 32px; border-radius: 12px; border: 2px solid #e5e7eb; font-size: 18px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;"
              @mouseover="$event.target.style.background = '#f9fafb'; $event.target.style.borderColor = '#3b82f6'"
              @mouseout="$event.target.style.background = 'white'; $event.target.style.borderColor = '#e5e7eb'"
            >
              <span style="margin-right: 8px;">📜</span>
              欣赏经典
            </button>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div style="position: absolute; top: 80px; left: 40px; font-size: 48px; opacity: 0.1; animation: float 3s ease-in-out infinite;">🌸</div>
      <div style="position: absolute; top: 160px; right: 80px; font-size: 32px; opacity: 0.1; animation: float 3s ease-in-out infinite 1s;">🍃</div>
      <div style="position: absolute; bottom: 80px; left: 80px; font-size: 40px; opacity: 0.1; animation: float 3s ease-in-out infinite 2s;">🌙</div>
    </section>

    <!-- 特色功能 -->
    <section style="padding: 64px 0; background: white;">
      <div class="container mx-auto px-4">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 16px;">平台特色</h2>
          <p style="color: #6b7280; font-size: 1.125rem;">融合传统文化与现代科技，打造全新的诗词体验</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb; transition: all 0.3s ease;"
               @mouseover="$event.target.style.transform = 'translateY(-4px)'; $event.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)'"
               @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'">
            <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #3b82f6, #8b5cf6); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
              <span style="font-size: 28px;">🤖</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 12px;">AI智能创作</h3>
            <p style="color: #6b7280; line-height: 1.6;">先进的AI技术，根据您的主题和情感，生成优美的诗词作品</p>
          </div>
          
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb; transition: all 0.3s ease;"
               @mouseover="$event.target.style.transform = 'translateY(-4px)'; $event.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)'"
               @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'">
            <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #10b981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
              <span style="font-size: 28px;">📚</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 12px;">经典诗词库</h3>
            <p style="color: #6b7280; line-height: 1.6;">收录历代经典诗词，配有详细注释和赏析，传承文化精髓</p>
          </div>
          
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb; transition: all 0.3s ease;"
               @mouseover="$event.target.style.transform = 'translateY(-4px)'; $event.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)'"
               @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'">
            <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #f59e0b, #d97706); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
              <span style="font-size: 28px;">🌸</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 12px;">社区互动</h3>
            <p style="color: #6b7280; line-height: 1.6;">与诗词爱好者交流创作心得，分享作品，共同成长</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 今日推荐 -->
    <section style="padding: 64px 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
      <div class="container mx-auto px-4">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 16px;">今日推荐</h2>
          <p style="color: #6b7280; font-size: 1.125rem;">精选经典诗词，感受千年文化魅力</p>
        </div>
        
        <!-- 每日一诗 -->
        <div style="max-width: 800px; margin: 0 auto 48px;">
          <div style="background: white; border-radius: 20px; padding: 48px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; text-align: center;">
            <div style="font-size: 14px; color: #3b82f6; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">每日一诗</div>
            <h3 style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px;">{{ dailyPoem.title }}</h3>
            <p style="color: #6b7280; margin-bottom: 24px; font-size: 1.125rem;">{{ dailyPoem.author }} · {{ dailyPoem.dynasty }}</p>
            <div style="font-size: 1.25rem; line-height: 1.8; color: #374151; font-family: 'Noto Serif SC', serif; margin-bottom: 32px; white-space: pre-line;">
              {{ dailyPoem.content }}
            </div>
            <button 
              @click="viewPoemDetail(dailyPoem)"
              style="color: #3b82f6; font-weight: 600; background: none; border: none; cursor: pointer; font-size: 16px; transition: color 0.3s ease;"
              @mouseover="$event.target.style.color = '#1d4ed8'"
              @mouseout="$event.target.style.color = '#3b82f6'"
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
    <section style="padding: 64px 0; background: white;">
      <div class="container mx-auto px-4">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 2.5rem; font-weight: 700; color: #1f2937; margin-bottom: 16px;">创作灵感</h2>
          <p style="color: #6b7280; font-size: 1.125rem;">从这些主题开始，创作属于您的诗词</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-bottom: 32px;">
          <button
            v-for="theme in inspirationThemes"
            :key="theme"
            @click="startCreationWithTheme(theme)"
            style="padding: 12px 24px; background: white; color: #374151; border-radius: 50px; border: 2px solid #e5e7eb; font-weight: 500; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);"
            @mouseover="$event.target.style.background = '#f8fafc'; $event.target.style.borderColor = '#3b82f6'; $event.target.style.color = '#3b82f6'; $event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)'"
            @mouseout="$event.target.style.background = 'white'; $event.target.style.borderColor = '#e5e7eb'; $event.target.style.color = '#374151'; $event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'"
          >
            {{ theme }}
          </button>
        </div>
        
        <div style="text-align: center;">
          <button 
            @click="$emit('navigate', 'create')"
            style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 16px 32px; border-radius: 12px; border: none; font-size: 18px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;"
            @mouseover="$event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)'"
            @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)'"
          >
            立即开始创作
          </button>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section style="padding: 64px 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
      <div class="container mx-auto px-4">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">📜</div>
            <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 4px;">{{ stats.totalPoems }}</div>
            <div style="color: #6b7280; font-weight: 500;">收录诗词</div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">👥</div>
            <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 4px;">{{ stats.totalUsers }}</div>
            <div style="color: #6b7280; font-weight: 500;">注册用户</div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">✨</div>
            <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 4px;">{{ stats.totalCreations }}</div>
            <div style="color: #6b7280; font-weight: 500;">AI创作</div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">❤️</div>
            <div style="font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 4px;">{{ stats.totalLikes }}</div>
            <div style="color: #6b7280; font-weight: 500;">获得点赞</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部CTA -->
    <section style="padding: 64px 0; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white;">
      <div class="container mx-auto px-4" style="text-align: center;">
        <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 16px;">加入诗境雅集</h2>
        <p style="font-size: 1.25rem; margin-bottom: 32px; opacity: 0.9;">与千万诗词爱好者一起，探索诗词创作的无限可能</p>
        <button 
          @click="$emit('navigate', 'community')"
          style="background: white; color: #3b82f6; padding: 16px 32px; border-radius: 12px; border: none; font-size: 18px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;"
          @mouseover="$event.target.style.background = '#f8fafc'; $event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)'"
          @mouseout="$event.target.style.background = 'white'; $event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'"
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
