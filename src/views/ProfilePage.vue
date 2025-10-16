<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 用户信息卡片 -->
        <div class="card p-8 mb-8">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative">
              <img 
                :src="userProfile?.avatar_url || defaultAvatar" 
                :alt="userProfile?.display_name || '用户头像'"
                class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              >
              <button 
                @click="showAvatarUpload = true"
                class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div class="flex-1 text-center md:text-left">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ userProfile?.display_name || userProfile?.username || '诗词爱好者' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ userProfile?.bio || '这个人很懒，什么都没有留下...' }}
              </p>
              <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <span class="flex items-center gap-1">
                  <span class="text-blue-500">📝</span>
                  {{ userProfile?.total_poems || 0 }} 篇作品
                </span>
                <span class="flex items-center gap-1">
                  <span class="text-red-500">❤️</span>
                  {{ userProfile?.total_likes || 0 }} 获得点赞
                </span>
                <span class="flex items-center gap-1">
                  <span class="text-yellow-500">⭐</span>
                  {{ userProfile?.total_collections || 0 }} 被收藏
                </span>
              </div>
            </div>
            
            <div class="flex gap-3">
              <button @click="showEditProfile = true" class="btn btn-primary">
                编辑资料
              </button>
              <button @click="$emit('navigate', 'home')" class="btn btn-outline">
                返回首页
              </button>
            </div>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="card mb-8">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>
          
          <div class="p-6">
            <!-- 我的作品 -->
            <div v-if="activeTab === 'works'">
              <div v-if="userPoems.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <h3 class="text-xl font-semibold mb-2">还没有作品</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">开始您的诗词创作之旅吧！</p>
                <button @click="$emit('navigate', 'create')" class="btn btn-primary">
                  立即创作
                </button>
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="poem in userPoems" :key="poem.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 class="font-semibold mb-2">{{ poem.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ poem.style }} · {{ formatDate(poem.created_at) }}</p>
                  <p class="text-gray-800 dark:text-gray-200 serif line-clamp-3 mb-3">{{ poem.content }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                      <span>❤️ {{ poem.like_count }}</span>
                      <span>⭐ {{ poem.collection_count }}</span>
                      <span>👁️ {{ poem.view_count }}</span>
                    </div>
                    <span :class="getStatusClass(poem.status)">{{ getStatusText(poem.status) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 收藏夹 -->
            <div v-else-if="activeTab === 'collections'">
              <div v-if="collections.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">⭐</div>
                <h3 class="text-xl font-semibold mb-2">还没有收藏</h3>
                <p class="text-gray-600 dark:text-gray-400">去发现一些优秀的作品吧！</p>
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="item in collections" :key="item.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="font-semibold mb-2">{{ item.classic_poem?.title || item.user_poem?.title }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {{ item.classic_poem?.author || item.user_poem?.user_profile?.display_name }} · 
                        {{ formatDate(item.created_at) }}
                      </p>
                      <p class="text-gray-800 dark:text-gray-200 serif line-clamp-2">
                        {{ item.classic_poem?.content || item.user_poem?.content }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 设置 -->
            <div v-else-if="activeTab === 'settings'">
              <div class="max-w-2xl space-y-6">
                <!-- 账号设置 -->
                <div>
                  <h3 class="text-lg font-semibold mb-4">账号设置</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">邮箱地址</label>
                      <input 
                        :value="currentUser?.email" 
                        type="email" 
                        class="input" 
                        disabled
                      >
                      <p class="text-xs text-gray-500 mt-1">邮箱地址不可修改</p>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium mb-2">用户名</label>
                      <input 
                        v-model="settings.username"
                        type="text" 
                        class="input"
                        placeholder="设置您的用户名"
                      >
                    </div>
                  </div>
                </div>
                
                <!-- 隐私设置 -->
                <div>
                  <h3 class="text-lg font-semibold mb-4">隐私设置</h3>
                  <div class="space-y-4">
                    <label class="flex items-center">
                      <input 
                        v-model="settings.allowFollow"
                        type="checkbox" 
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      <span class="ml-2 text-sm">允许其他用户关注我</span>
                    </label>
                    
                    <label class="flex items-center">
                      <input 
                        v-model="settings.showStats"
                        type="checkbox" 
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      <span class="ml-2 text-sm">公开显示我的创作统计</span>
                    </label>
                  </div>
                </div>
                
                <!-- 通知设置 -->
                <div>
                  <h3 class="text-lg font-semibold mb-4">通知设置</h3>
                  <div class="space-y-4">
                    <label class="flex items-center">
                      <input 
                        v-model="settings.emailNotifications"
                        type="checkbox" 
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      <span class="ml-2 text-sm">接收邮件通知</span>
                    </label>
                    
                    <label class="flex items-center">
                      <input 
                        v-model="settings.likeNotifications"
                        type="checkbox" 
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      >
                      <span class="ml-2 text-sm">作品被点赞时通知我</span>
                    </label>
                  </div>
                </div>
                
                <div class="pt-4">
                  <button @click="saveSettings" class="btn btn-primary">
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <EditProfileModal 
      v-if="showEditProfile"
      :user-profile="userProfile"
      @close="showEditProfile = false"
      @success="handleProfileUpdate"
    />

    <!-- 头像上传弹窗 -->
    <AvatarUploadModal 
      v-if="showAvatarUpload"
      @close="showAvatarUpload = false"
      @success="handleAvatarUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentUser, getUserProfile } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'
import type { UserProfile } from '@/lib/database'
import EditProfileModal from '@/components/EditProfileModal.vue'
import AvatarUploadModal from '@/components/AvatarUploadModal.vue'

// Emits
defineEmits<{
  navigate: [page: string]
}>()

// 响应式数据
const userProfile = ref<UserProfile | null>(null)
const activeTab = ref('works')
const showEditProfile = ref(false)
const showAvatarUpload = ref(false)
const userPoems = ref([])
const collections = ref([])

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const tabs = [
  { id: 'works', name: '我的作品' },
  { id: 'collections', name: '收藏夹' },
  { id: 'settings', name: '设置' }
]

const settings = ref({
  username: '',
  allowFollow: true,
  showStats: true,
  emailNotifications: true,
  likeNotifications: true
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

function handleProfileUpdate(updatedProfile: UserProfile) {
  userProfile.value = updatedProfile
  showEditProfile.value = false
}

function handleAvatarUpdate(avatarUrl: string) {
  if (userProfile.value) {
    userProfile.value.avatar_url = avatarUrl
  }
  showAvatarUpload.value = false
}

async function saveSettings() {
  try {
    // 这里应该调用API保存设置
    alert('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存失败，请稍后重试')
  }
}

// 生命周期
onMounted(async () => {
  if (!currentUser.value) {
    alert('请先登录')
    return
  }

  try {
    // 加载用户资料
    userProfile.value = await getUserProfile(currentUser.value.id)
    
    if (userProfile.value) {
      settings.value.username = userProfile.value.username
    }
    
    // 加载用户作品
    const { data: poems } = await DatabaseService.getUserPoems({
      userId: currentUser.value.id,
      limit: 20
    })
    userPoems.value = poems
    
    // 加载收藏
    collections.value = await DatabaseService.getUserCollections(currentUser.value.id)
    
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
