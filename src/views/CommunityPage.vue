<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fde68a 100%);">
    <!-- 调试信息 -->
    <div v-if="true" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; font-size: 12px; z-index: 9999;">
      社区页面已加载
    </div>
    <!-- 页面头部 -->
    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(229, 231, 235, 0.3);">
      <div style="max-width: 1200px; margin: 0 auto; padding: 24px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 2rem; font-weight: bold; color: #1f2937; display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 2.5rem; margin-right: 12px;">🌸</span>
              诗友社区
            </h1>
            <p style="color: #6b7280; font-size: 16px;">与诗词爱好者分享创作，交流心得</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button 
              @click="showPublishModal = true"
              style="padding: 12px 24px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);"
              @mouseover="$event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'"
              @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'"
            >
              <span style="margin-right: 8px;">📝</span>
              发布作品
            </button>
            <button 
              @click="$emit('navigate', 'home')"
              style="padding: 12px 20px; border-radius: 12px; border: 2px solid #e5e7eb; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
              @mouseover="$event.target.style.background = '#f9fafb'; $event.target.style.borderColor = '#3b82f6'"
              @mouseout="$event.target.style.background = 'white'; $event.target.style.borderColor = '#e5e7eb'"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="max-width: 1200px; margin: 0 auto; padding: 32px 16px;">
      <div :style="{ 
        display: 'grid', 
        gridTemplateColumns: isDesktop ? '3fr 1fr' : '1fr', 
        gap: '24px' 
      }">
        <!-- 主内容区 -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- 分类标签 -->
          <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
              <span style="font-size: 14px; font-weight: 500; color: #374151;">分类：</span>
              <button 
                v-for="category in categories" 
                :key="category.id"
                @click="selectedCategory = category.id"
                :style="{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedCategory === category.id ? '#e9d5ff' : '#f3f4f6',
                  color: selectedCategory === category.id ? '#7c3aed' : '#374151',
                  borderColor: selectedCategory === category.id ? '#a855f7' : '#d1d5db'
                }"
                @mouseover="$event.target.style.backgroundColor = selectedCategory === category.id ? '#d8b4fe' : '#e5e7eb'"
                @mouseout="$event.target.style.backgroundColor = selectedCategory === category.id ? '#e9d5ff' : '#f3f4f6'"
              >
                {{ category.icon }} {{ category.name }}
              </button>
              <button 
                v-if="selectedCategory"
                @click="selectedCategory = ''"
                style="padding: 6px 12px; border-radius: 20px; font-size: 14px; border: 1px solid #d1d5db; color: #6b7280; cursor: pointer; transition: all 0.3s ease; background: #f9fafb;"
                @mouseover="$event.target.style.backgroundColor = '#e5e7eb'"
                @mouseout="$event.target.style.backgroundColor = '#f9fafb'"
              >
                清空
              </button>
            </div>
          </div>

          <!-- 作品流 -->
          <div v-if="loading" style="display: flex; flex-direction: column; gap: 24px;">
            <div v-for="i in 3" :key="i" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); animation: pulse 2s infinite;">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          <div v-else style="display: flex; flex-direction: column; gap: 24px;">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id"
              style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;"
              @mouseover="$event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)'"
              @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'"
            >
              <!-- 作者信息 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <img :src="post.author.avatar_url || defaultAvatar" :alt="post.author.display_name" class="w-10 h-10 rounded-full object-cover">
                  <div>
                    <div class="font-medium">{{ post.author.display_name || post.author.username }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(post.created_at) }} · {{ post.category }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="getLevelClass(post.author.level)">
                    {{ post.author.level }}
                  </span>
                </div>
              </div>

              <!-- 作品内容 -->
              <div class="mb-4">
                <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ post.title }}</h2>
                <div class="text-gray-800 dark:text-gray-200 leading-relaxed serif whitespace-pre-line mb-4">{{ post.content }}</div>
                
                <!-- 标签 -->
                <div v-if="post.emotions && post.emotions.length > 0" class="flex flex-wrap gap-2 mb-4">
                  <span 
                    v-for="emotion in post.emotions" 
                    :key="emotion"
                    class="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    #{{ emotion }}
                  </span>
                </div>

                <!-- 互动按钮 -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-6">
                    <button 
                      @click="toggleLike(post)"
                      :class="[
                        'flex items-center gap-2 text-sm transition-colors',
                        post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                      ]"
                    >
                      <span class="text-lg">{{ post.isLiked ? '❤️' : '🤍' }}</span>
                      {{ post.like_count }}
                    </button>
                    <button 
                      @click="toggleComment(post.id)"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <span class="text-lg">💬</span>
                      {{ post.comment_count }}
                    </button>
                    <button 
                      @click="toggleCollect(post)"
                      :class="[
                        'flex items-center gap-2 text-sm transition-colors',
                        post.isCollected ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400 hover:text-yellow-500'
                      ]"
                    >
                      <span class="text-lg">{{ post.isCollected ? '⭐' : '☆' }}</span>
                      {{ post.collection_count }}
                    </button>
                    <button 
                      @click="sharePost(post)"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <span class="text-lg">📤</span>
                      分享
                    </button>
                  </div>
                </div>

                <!-- 评论区 -->
                <div v-if="expandedComments.includes(post.id)" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="space-y-3 mb-4">
                    <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
                      <img :src="comment.user_profile?.avatar_url || defaultAvatar" :alt="comment.user_profile?.display_name" class="w-8 h-8 rounded-full object-cover">
                      <div class="flex-1">
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div class="font-medium text-sm mb-1">{{ comment.user_profile?.display_name || comment.user_profile?.username }}</div>
                          <div class="text-sm text-gray-800 dark:text-gray-200">{{ comment.content }}</div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDate(comment.created_at) }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="isAuthenticated" class="flex gap-3">
                    <img :src="currentUserAvatar" alt="我" class="w-8 h-8 rounded-full object-cover">
                    <div class="flex-1 flex gap-2">
                      <input 
                        v-model="commentInputs[post.id]"
                        type="text" 
                        placeholder="写下你的评论..." 
                        class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        @keyup.enter="submitComment(post.id)"
                      >
                      <button 
                        @click="submitComment(post.id)"
                        class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" style="text-align: center;">
            <button 
              @click="loadMore" 
              style="padding: 12px 24px; border-radius: 12px; border: 2px solid #e5e7eb; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
              @mouseover="$event.target.style.background = '#f9fafb'; $event.target.style.borderColor = '#3b82f6'"
              @mouseout="$event.target.style.background = 'white'; $event.target.style.borderColor = '#e5e7eb'"
            >
              加载更多作品
            </button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- 热门话题 -->
          <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; color: #1f2937;">
              <span style="font-size: 18px; margin-right: 8px;">🔥</span>
              热门话题
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div v-for="topic in hotTopics" :key="topic.id" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255, 255, 255, 0.5); border-radius: 12px; transition: all 0.3s ease;" @mouseover="$event.target.style.background = 'rgba(255, 255, 255, 0.8)'" @mouseout="$event.target.style.background = 'rgba(255, 255, 255, 0.5)'">
                <div style="flex: 1;">
                  <div style="font-weight: 500; font-size: 14px; color: #374151;">#{{ topic.name }}</div>
                  <div style="font-size: 12px; color: #6b7280;">{{ topic.posts }}篇作品</div>
                </div>
                <div style="color: #f59e0b; font-size: 14px; font-weight: 500;">{{ topic.heat }}🔥</div>
              </div>
            </div>
          </div>

          <!-- 推荐诗友 -->
          <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; color: #1f2937;">
              <span style="font-size: 18px; margin-right: 8px;">👥</span>
              推荐诗友
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div v-for="user in recommendedUsers" :key="user.id" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.5); border-radius: 12px; transition: all 0.3s ease;" @mouseover="$event.target.style.background = 'rgba(255, 255, 255, 0.8)'" @mouseout="$event.target.style.background = 'rgba(255, 255, 255, 0.5)'">
                <img :src="user.avatar_url || defaultAvatar" :alt="user.display_name" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div style="flex: 1;">
                  <div style="font-weight: 500; font-size: 14px; color: #374151;">{{ user.display_name || user.username }}</div>
                  <div style="font-size: 12px; color: #6b7280;">{{ user.total_poems }}篇作品</div>
                </div>
                <button style="padding: 6px 12px; border-radius: 20px; font-size: 12px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); cursor: pointer; transition: all 0.3s ease;" @mouseover="$event.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'" @mouseout="$event.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'">
                  关注
                </button>
              </div>
            </div>
          </div>

          <!-- 创作挑战 -->
          <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; color: #1f2937;">
              <span style="font-size: 18px; margin-right: 8px;">🎯</span>
              创作挑战
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div v-for="challenge in challenges" :key="challenge.id" style="border: 1px solid rgba(229, 231, 235, 0.3); border-radius: 12px; padding: 16px; background: rgba(255, 255, 255, 0.5); transition: all 0.3s ease;" @mouseover="$event.target.style.background = 'rgba(255, 255, 255, 0.8)'" @mouseout="$event.target.style.background = 'rgba(255, 255, 255, 0.5)'">
                <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px; color: #374151;">{{ challenge.title }}</div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">{{ challenge.description }}</div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="font-size: 12px; color: #7c3aed; font-weight: 500;">{{ challenge.participant_count }}人参与</div>
                  <button style="padding: 6px 12px; border-radius: 20px; font-size: 12px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); cursor: pointer; transition: all 0.3s ease;" @mouseover="$event.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'" @mouseout="$event.target.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'">
                    参与
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布作品弹窗 -->
    <PublishModal 
      v-if="showPublishModal"
      @close="showPublishModal = false"
      @success="handlePublishSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isAuthenticated, currentUser } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'
import type { UserPoem, UserProfile } from '@/lib/database'
import PublishModal from '@/components/PublishModal.vue'

// Emits
defineEmits<{
  navigate: [page: string]
}>()

// 响应式数据
const loading = ref(true)
const isDesktop = ref(false)

// 检查屏幕尺寸
function checkScreenSize() {
  isDesktop.value = window.innerWidth >= 1024
}

// 监听窗口大小变化
function handleResize() {
  checkScreenSize()
}
const posts = ref<(UserPoem & { 
  author: UserProfile
  isLiked?: boolean
  isCollected?: boolean
  comments?: any[]
})[]>([])
const selectedCategory = ref('')
const expandedComments = ref<string[]>([])
const commentInputs = ref<Record<string, string>>({})
const showPublishModal = ref(false)
const hasMore = ref(true)

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
const currentUserAvatar = computed(() => currentUser.value?.user_metadata?.avatar_url || defaultAvatar)

// 分类数据
const categories = [
  { id: 'all', name: '全部', icon: '📜' },
  { id: 'original', name: '原创诗词', icon: '✍️' },
  { id: 'discussion', name: '诗词讨论', icon: '💭' },
  { id: 'learning', name: '学习心得', icon: '🎓' }
]

const hotTopics = ref([
  { id: 1, name: '春日诗词', posts: 128, heat: 95 },
  { id: 2, name: '思乡怀古', posts: 89, heat: 87 },
  { id: 3, name: '山水田园', posts: 156, heat: 82 }
])

const recommendedUsers = ref<UserProfile[]>([])
const challenges = ref([])

// 计算属性
const filteredPosts = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === 'all') {
    return posts.value
  }
  // 这里可以根据分类筛选
  return posts.value
})

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

function getLevelClass(level: string): string {
  const levelMap = {
    '诗词新秀': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs',
    '诗词才子': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs',
    '诗词大师': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full text-xs'
  }
  return levelMap[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 px-2 py-1 rounded-full text-xs'
}

async function toggleLike(post: any) {
  if (!isAuthenticated.value) {
    alert('请先登录')
    return
  }

  try {
    const success = await DatabaseService.toggleLike(currentUser.value!.id, post.id, 'user')
    if (success) {
      post.isLiked = !post.isLiked
      post.like_count += post.isLiked ? 1 : -1
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

async function toggleCollect(post: any) {
  if (!isAuthenticated.value) {
    alert('请先登录')
    return
  }

  try {
    const success = await DatabaseService.toggleCollection(currentUser.value!.id, post.id, 'user')
    if (success) {
      post.isCollected = !post.isCollected
      post.collection_count += post.isCollected ? 1 : -1
    }
  } catch (error) {
    console.error('收藏失败:', error)
  }
}

function toggleComment(postId: string) {
  const index = expandedComments.value.indexOf(postId)
  if (index > -1) {
    expandedComments.value.splice(index, 1)
  } else {
    expandedComments.value.push(postId)
    // 加载评论
    loadComments(postId)
  }
}

async function loadComments(postId: string) {
  try {
    const comments = await DatabaseService.getPoemComments(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.comments = comments
    }
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

async function submitComment(postId: string) {
  const content = commentInputs.value[postId]
  if (!content?.trim() || !isAuthenticated.value) return
  
  try {
    const comment = await DatabaseService.createComment({
      user_id: currentUser.value!.id,
      poem_id: postId,
      content: content.trim()
    })
    
    if (comment) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        if (!post.comments) post.comments = []
        post.comments.unshift(comment)
        post.comment_count++
      }
      commentInputs.value[postId] = ''
    }
  } catch (error) {
    console.error('发表评论失败:', error)
  }
}

function sharePost(post: any) {
  const text = `《${post.title}》\n${post.content}\n\n来自诗境雅集社区 - ${post.author.display_name || post.author.username}`
  if (navigator.share) {
    navigator.share({ title: post.title, text })
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('作品内容已复制到剪贴板')
    })
  }
}

async function loadMore() {
  try {
    const { data } = await DatabaseService.getUserPoems({
      status: 'published',
      limit: 10,
      offset: posts.value.length,
      includeProfile: true
    })
    
    if (data.length === 0) {
      hasMore.value = false
    } else {
      // 检查用户是否已点赞/收藏
      for (const poem of data) {
        if (isAuthenticated.value && currentUser.value) {
          poem.isLiked = await DatabaseService.checkUserLike(currentUser.value.id, poem.id, 'user')
        }
      }
      posts.value.push(...data)
    }
  } catch (error) {
    console.error('加载更多失败:', error)
  }
}

function handlePublishSuccess() {
  showPublishModal.value = false
  // 重新加载第一页数据
  loadInitialData()
}

async function loadInitialData() {
  try {
    loading.value = true
    
    // 加载社区作品
    const { data } = await DatabaseService.getUserPoems({
      status: 'published',
      limit: 20,
      includeProfile: true
    })
    
    // 检查用户是否已点赞/收藏
    for (const poem of data) {
      if (isAuthenticated.value && currentUser.value) {
        poem.isLiked = await DatabaseService.checkUserLike(currentUser.value.id, poem.id, 'user')
      }
    }
    
    posts.value = data
    
    // 加载推荐用户
    if (isAuthenticated.value && currentUser.value) {
      recommendedUsers.value = await DatabaseService.getRecommendedUsers(currentUser.value.id)
    }
    
    // 加载创作挑战
    challenges.value = await DatabaseService.getCreationChallenges('active')
    
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  console.log('🏘️ 社区页面已挂载')
  
  // 初始化屏幕尺寸检测
  checkScreenSize()
  window.addEventListener('resize', handleResize)
  
  loadInitialData()
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
