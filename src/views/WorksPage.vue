<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 页面头部 -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span class="text-3xl mr-3">📚</span>
              我的作品
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">管理和展示您的诗词创作</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="$emit('navigate', 'create')"
              class="btn btn-primary"
            >
              <span class="mr-2">✨</span>
              创作新作品
            </button>
            <button 
              @click="$emit('navigate', 'home')"
              class="btn btn-outline"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">总作品数</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.totalPoems }}</p>
            </div>
            <div class="text-3xl">📝</div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">获得点赞</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.totalLikes }}</p>
            </div>
            <div class="text-3xl">❤️</div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">收藏次数</p>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.totalCollections }}</p>
            </div>
            <div class="text-3xl">⭐</div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">总浏览量</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.totalViews }}</p>
            </div>
            <div class="text-3xl">👁️</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 主内容区 -->
        <div class="lg:col-span-3">
          <!-- 筛选和排序 -->
          <div class="card p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">状态：</span>
                <select v-model="filterStatus" class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                  <option value="">全部状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="private">私密</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">体裁：</span>
                <select v-model="filterStyle" class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                  <option value="">全部体裁</option>
                  <option value="五言绝句">五言绝句</option>
                  <option value="七言绝句">七言绝句</option>
                  <option value="五言律诗">五言律诗</option>
                  <option value="七言律诗">七言律诗</option>
                  <option value="词">词</option>
                  <option value="古风">古风</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">排序：</span>
                <select v-model="sortBy" class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                  <option value="created_at">创作时间</option>
                  <option value="updated_at">更新时间</option>
                  <option value="like_count">点赞数</option>
                  <option value="view_count">浏览数</option>
                </select>
              </div>
              <div class="flex-1">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="搜索作品..." 
                  class="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                >
              </div>
            </div>
          </div>

          <!-- 作品列表 -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 6" :key="i" class="card p-6 animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredPoems.length === 0" class="card p-12 text-center">
            <div class="text-6xl mb-4">📝</div>
            <h3 class="text-xl font-semibold mb-2">还没有作品</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">开始您的诗词创作之旅吧！</p>
            <button @click="$emit('navigate', 'create')" class="btn btn-primary">
              立即创作
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article 
              v-for="poem in filteredPoems" 
              :key="poem.id"
              class="card p-6 hover:shadow-lg transition-all group"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ poem.title }}
                </h3>
                <div class="relative">
                  <button @click="togglePoemMenu(poem.id)" class="text-gray-400 hover:text-gray-600 p-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  <!-- 作品菜单 -->
                  <transition name="fade">
                    <div v-if="activePoemMenu === poem.id" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10">
                      <button @click="editPoem(poem)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">编辑</button>
                      <button @click="togglePoemStatus(poem)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                        {{ poem.status === 'published' ? '设为私密' : '发布' }}
                      </button>
                      <button @click="sharePoem(poem)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">分享</button>
                      <button @click="exportPoem(poem)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">导出</button>
                      <hr class="my-1 border-gray-200 dark:border-gray-600">
                      <button @click="deletePoem(poem)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">删除</button>
                    </div>
                  </transition>
                </div>
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-4">
                <span>{{ poem.style }}</span>
                <span>{{ formatDate(poem.created_at) }}</span>
                <span :class="getStatusClass(poem.status)">{{ getStatusText(poem.status) }}</span>
              </div>
              
              <div class="text-gray-800 dark:text-gray-200 leading-relaxed serif mb-4 line-clamp-4">
                {{ poem.content }}
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <span class="text-red-500">❤️</span>
                    {{ poem.like_count }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="text-yellow-500">⭐</span>
                    {{ poem.collection_count }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="text-blue-500">👁️</span>
                    {{ poem.view_count }}
                  </span>
                </div>
                <button @click="viewPoemDetail(poem)" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  查看详情 →
                </button>
              </div>
            </article>
          </div>
          
          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" class="text-center mt-8">
            <button @click="loadMore" class="btn btn-outline">
              加载更多
            </button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 创作统计 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">📊</span>
              创作统计
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">本月创作</span>
                <span class="font-medium">{{ monthlyStats.poems }}首</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">平均点赞</span>
                <span class="font-medium">{{ monthlyStats.avgLikes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">创作天数</span>
                <span class="font-medium">{{ monthlyStats.activeDays }}天</span>
              </div>
            </div>
          </div>

          <!-- 常用标签 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">🏷️</span>
              常用主题
            </h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in popularTags" 
                :key="tag.name"
                class="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                @click="searchQuery = tag.name"
              >
                {{ tag.name }} ({{ tag.count }})
              </span>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">🔔</span>
              最近活动
            </h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="text-sm">
                <div class="text-gray-800 dark:text-gray-200">{{ activity.content }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ activity.time }}</div>
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
import type { UserPoem } from '@/lib/database'

// Emits
defineEmits<{
  navigate: [page: string]
}>()

// 响应式数据
const loading = ref(true)
const poems = ref<UserPoem[]>([])
const filterStatus = ref('')
const filterStyle = ref('')
const sortBy = ref('created_at')
const searchQuery = ref('')
const activePoemMenu = ref<string | null>(null)
const hasMore = ref(true)

const stats = ref({
  totalPoems: 0,
  totalLikes: 0,
  totalCollections: 0,
  totalViews: 0
})

const monthlyStats = ref({
  poems: 0,
  avgLikes: 0,
  activeDays: 0
})

const popularTags = ref([
  { name: '春日', count: 3 },
  { name: '思君', count: 2 },
  { name: '山水', count: 4 },
  { name: '田园', count: 2 }
])

const recentActivities = ref([
  { id: 1, content: '《春日即事》获得了新的点赞', time: '2小时前' },
  { id: 2, content: '《山居秋暝》被用户收藏', time: '1天前' },
  { id: 3, content: '完成了新作品《秋夜吟》', time: '3天前' }
])

// 计算属性
const filteredPoems = computed(() => {
  let result = [...poems.value]
  
  // 状态筛选
  if (filterStatus.value) {
    result = result.filter(poem => poem.status === filterStatus.value)
  }
  
  // 体裁筛选
  if (filterStyle.value) {
    result = result.filter(poem => poem.style === filterStyle.value)
  }
  
  // 搜索
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(poem => 
      poem.title.toLowerCase().includes(query) ||
      poem.content.toLowerCase().includes(query) ||
      poem.theme?.toLowerCase().includes(query)
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'like_count':
        return b.like_count - a.like_count
      case 'view_count':
        return b.view_count - a.view_count
      case 'updated_at':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })
  
  return result
})

// 方法
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'published':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs'
    case 'draft':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs'
    case 'private':
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 px-2 py-1 rounded-full text-xs'
    default:
      return ''
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'published': return '已发布'
    case 'draft': return '草稿'
    case 'private': return '私密'
    default: return status
  }
}

function togglePoemMenu(poemId: string) {
  activePoemMenu.value = activePoemMenu.value === poemId ? null : poemId
}

function editPoem(poem: UserPoem) {
  // 跳转到编辑页面
  console.log('编辑诗词:', poem)
  activePoemMenu.value = null
}

async function togglePoemStatus(poem: UserPoem) {
  const newStatus = poem.status === 'published' ? 'private' : 'published'
  
  try {
    const success = await DatabaseService.updateUserPoem(poem.id, { status: newStatus })
    if (success) {
      poem.status = newStatus
      alert(`作品已${newStatus === 'published' ? '发布' : '设为私密'}`)
    } else {
      alert('操作失败，请稍后重试')
    }
  } catch (error) {
    console.error('更新作品状态失败:', error)
    alert('操作失败，请稍后重试')
  }
  
  activePoemMenu.value = null
}

function sharePoem(poem: UserPoem) {
  const text = `《${poem.title}》\n${poem.content}\n\n来自诗境雅集`
  if (navigator.share) {
    navigator.share({ title: poem.title, text })
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('作品内容已复制到剪贴板')
    })
  }
  activePoemMenu.value = null
}

function exportPoem(poem: UserPoem) {
  const content = `《${poem.title}》\n\n${poem.content}\n\n体裁：${poem.style}\n创作时间：${formatDate(poem.created_at)}`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${poem.title}.txt`
  a.click()
  URL.revokeObjectURL(url)
  activePoemMenu.value = null
}

async function deletePoem(poem: UserPoem) {
  if (confirm(`确定要删除作品《${poem.title}》吗？此操作不可恢复。`)) {
    try {
      const success = await DatabaseService.deleteUserPoem(poem.id)
      if (success) {
        const index = poems.value.findIndex(p => p.id === poem.id)
        if (index > -1) {
          poems.value.splice(index, 1)
        }
        alert('作品已删除')
      } else {
        alert('删除失败，请稍后重试')
      }
    } catch (error) {
      console.error('删除作品失败:', error)
      alert('删除失败，请稍后重试')
    }
  }
  activePoemMenu.value = null
}

function viewPoemDetail(poem: UserPoem) {
  // 跳转到作品详情页
  console.log('查看作品详情:', poem)
}

async function loadMore() {
  // 加载更多作品
  try {
    const { data } = await DatabaseService.getUserPoems({
      userId: currentUser.value?.id,
      limit: 10,
      offset: poems.value.length
    })
    
    if (data.length === 0) {
      hasMore.value = false
    } else {
      poems.value.push(...data)
    }
  } catch (error) {
    console.error('加载更多失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  if (!isAuthenticated.value || !currentUser.value) {
    alert('请先登录')
    return
  }

  try {
    loading.value = true
    
    // 加载用户作品
    const { data } = await DatabaseService.getUserPoems({
      userId: currentUser.value.id,
      limit: 20
    })
    poems.value = data
    
    // 加载统计数据
    const userStats = await DatabaseService.getUserStats(currentUser.value.id)
    stats.value = userStats
    
    // 计算月度统计
    const thisMonth = new Date().getMonth()
    const thisMonthPoems = poems.value.filter(poem => 
      new Date(poem.created_at).getMonth() === thisMonth
    )
    
    monthlyStats.value = {
      poems: thisMonthPoems.length,
      avgLikes: thisMonthPoems.length > 0 
        ? Math.round(thisMonthPoems.reduce((sum, poem) => sum + poem.like_count, 0) / thisMonthPoems.length)
        : 0,
      activeDays: new Set(thisMonthPoems.map(poem => 
        new Date(poem.created_at).toDateString()
      )).size
    }
    
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
