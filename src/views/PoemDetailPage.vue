<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 返回按钮 -->
        <button 
          @click="$emit('navigate', 'home')"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <!-- 加载状态 -->
        <div v-if="loading" class="card p-8 animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>

        <!-- 诗词内容 -->
        <div v-else-if="poem" class="card p-8 mb-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 serif">{{ poem.title }}</h1>
            <div class="text-gray-600 dark:text-gray-400 mb-6">
              <span class="text-lg">{{ poem.author }}</span>
              <span class="mx-2">·</span>
              <span>{{ poem.dynasty }}</span>
              <span v-if="poem.category" class="mx-2">·</span>
              <span v-if="poem.category">{{ poem.category }}</span>
            </div>
          </div>

          <div class="max-w-2xl mx-auto">
            <!-- 诗词正文 -->
            <div class="text-center mb-8">
              <div class="text-xl leading-relaxed text-gray-800 dark:text-gray-200 serif whitespace-pre-line">
                {{ poem.content }}
              </div>
            </div>

            <!-- 互动按钮 -->
            <div class="flex items-center justify-center gap-6 mb-8 py-6 border-y border-gray-200 dark:border-gray-700">
              <button 
                @click="toggleLike"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isLiked ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <span class="text-xl">{{ isLiked ? '❤️' : '🤍' }}</span>
                <span>{{ likeCount }}</span>
              </button>
              
              <button 
                @click="toggleCollect"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isCollected ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <span class="text-xl">{{ isCollected ? '⭐' : '☆' }}</span>
                <span>{{ collectionCount }}</span>
              </button>
              
              <button 
                @click="sharePoem"
                class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="text-xl">📤</span>
                <span>分享</span>
              </button>
              
              <button 
                @click="copyPoem"
                class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="text-xl">📋</span>
                <span>复制</span>
              </button>
            </div>

            <!-- 注释和译文 -->
            <div v-if="poem.annotation || poem.translation" class="space-y-6">
              <div v-if="poem.translation" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">白话译文</h3>
                <p class="text-gray-800 dark:text-gray-200 leading-relaxed">{{ poem.translation }}</p>
              </div>
              
              <div v-if="poem.annotation" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">注释</h3>
                <p class="text-gray-800 dark:text-gray-200 leading-relaxed">{{ poem.annotation }}</p>
              </div>
            </div>

            <!-- 赏析 -->
            <div v-if="poem.appreciation" class="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3">赏析</h3>
              <p class="text-gray-800 dark:text-gray-200 leading-relaxed">{{ poem.appreciation }}</p>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else class="card p-8 text-center">
          <div class="text-6xl mb-4">😕</div>
          <h2 class="text-xl font-semibold mb-2">找不到这首诗词</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">可能已被删除或不存在</p>
          <button @click="$emit('navigate', 'home')" class="btn btn-primary">
            返回首页
          </button>
        </div>

        <!-- 评论区 -->
        <div v-if="poem" class="card p-6">
          <h3 class="text-lg font-semibold mb-4">评论 ({{ comments.length }})</h3>
          
          <!-- 发表评论 -->
          <div v-if="isAuthenticated" class="mb-6">
            <div class="flex gap-3">
              <img :src="currentUserAvatar" alt="我" class="w-10 h-10 rounded-full object-cover">
              <div class="flex-1">
                <textarea 
                  v-model="newComment"
                  rows="3"
                  placeholder="写下您的感想..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button 
                    @click="submitComment"
                    :disabled="!newComment.trim() || isSubmittingComment"
                    class="btn btn-primary"
                    :class="{ 'opacity-50 cursor-not-allowed': !newComment.trim() || isSubmittingComment }"
                  >
                    {{ isSubmittingComment ? '发布中...' : '发表评论' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="mb-6 text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-gray-600 dark:text-gray-400">登录后可以发表评论</p>
          </div>

          <!-- 评论列表 -->
          <div v-if="comments.length === 0" class="text-center py-8 text-gray-500">
            暂无评论，来发表第一条评论吧！
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
              <img 
                :src="comment.user_profile?.avatar_url || defaultAvatar" 
                :alt="comment.user_profile?.display_name" 
                class="w-10 h-10 rounded-full object-cover"
              >
              <div class="flex-1">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium text-sm">{{ comment.user_profile?.display_name || comment.user_profile?.username }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="text-gray-800 dark:text-gray-200">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isAuthenticated, currentUser } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'
import type { ClassicPoem, UserPoem, PoemComment } from '@/lib/database'

// Props
const props = defineProps<{
  poemId: string
  poemType: 'classic' | 'user'
}>()

// Emits
defineEmits<{
  navigate: [page: string]
}>()

// 响应式数据
const loading = ref(true)
const poem = ref<ClassicPoem | UserPoem | null>(null)
const comments = ref<PoemComment[]>([])
const newComment = ref('')
const isSubmittingComment = ref(false)
const isLiked = ref(false)
const isCollected = ref(false)
const likeCount = ref(0)
const collectionCount = ref(0)

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
const currentUserAvatar = computed(() => currentUser.value?.user_metadata?.avatar_url || defaultAvatar)

// 方法
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

async function toggleLike() {
  if (!isAuthenticated.value || !poem.value) {
    alert('请先登录')
    return
  }

  try {
    const success = await DatabaseService.toggleLike(
      currentUser.value!.id, 
      poem.value.id, 
      props.poemType
    )
    
    if (success) {
      isLiked.value = !isLiked.value
      likeCount.value += isLiked.value ? 1 : -1
    }
  } catch (error) {
    console.error('点赞失败:', error)
    alert('操作失败，请稍后重试')
  }
}

async function toggleCollect() {
  if (!isAuthenticated.value || !poem.value) {
    alert('请先登录')
    return
  }

  try {
    const success = await DatabaseService.toggleCollection(
      currentUser.value!.id, 
      poem.value.id, 
      props.poemType
    )
    
    if (success) {
      isCollected.value = !isCollected.value
      collectionCount.value += isCollected.value ? 1 : -1
    }
  } catch (error) {
    console.error('收藏失败:', error)
    alert('操作失败，请稍后重试')
  }
}

async function sharePoem() {
  if (!poem.value) return
  
  const text = `《${poem.value.title}》\n${poem.value.content}\n\n来自诗境雅集`
  
  if (navigator.share) {
    try {
      await navigator.share({ title: poem.value.title, text })
    } catch (error) {
      // 用户取消分享
    }
  } else {
    try {
      await navigator.clipboard.writeText(text)
      alert('内容已复制到剪贴板')
    } catch (error) {
      alert('分享失败，请稍后重试')
    }
  }
}

async function copyPoem() {
  if (!poem.value) return
  
  try {
    await navigator.clipboard.writeText(poem.value.content)
    alert('诗词内容已复制到剪贴板')
  } catch (error) {
    alert('复制失败，请稍后重试')
  }
}

async function submitComment() {
  if (!newComment.value.trim() || !isAuthenticated.value || !poem.value) return
  
  isSubmittingComment.value = true
  
  try {
    const comment = await DatabaseService.createComment({
      user_id: currentUser.value!.id,
      poem_id: poem.value.id,
      content: newComment.value.trim()
    })
    
    if (comment) {
      comments.value.unshift(comment)
      newComment.value = ''
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表失败，请稍后重试')
  } finally {
    isSubmittingComment.value = false
  }
}

// 生命周期
onMounted(async () => {
  try {
    loading.value = true
    
    // 加载诗词详情
    if (props.poemType === 'classic') {
      poem.value = await DatabaseService.getClassicPoemById(props.poemId, currentUser.value?.id)
    } else {
      // 加载用户诗词详情
      const { data } = await DatabaseService.getUserPoems({
        limit: 1,
        // 这里需要根据ID筛选，暂时用第一个
      })
      poem.value = data[0] || null
    }
    
    if (poem.value) {
      // 设置统计数据
      likeCount.value = poem.value.like_count
      collectionCount.value = poem.value.collection_count
      
      // 检查用户是否已点赞/收藏
      if (isAuthenticated.value && currentUser.value) {
        isLiked.value = await DatabaseService.checkUserLike(
          currentUser.value.id, 
          poem.value.id, 
          props.poemType
        )
        
        // 检查收藏状态
        const collections = await DatabaseService.getUserCollections(currentUser.value.id, props.poemType)
        isCollected.value = collections.some(c => 
          (props.poemType === 'classic' ? c.classic_poem?.id : c.user_poem?.id) === poem.value!.id
        )
      }
      
      // 加载评论
      if (props.poemType === 'user') {
        comments.value = await DatabaseService.getPoemComments(poem.value.id)
      }
    }
    
  } catch (error) {
    console.error('加载诗词详情失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.8;
  letter-spacing: 0.05em;
}
</style>
