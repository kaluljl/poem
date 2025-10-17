<template>
  <header style="position: sticky; top: 0; z-index: 50; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e7eb; transition: all 0.3s ease;">
    <div class="container mx-auto px-4">
      <div style="display: flex; align-items: center; justify-content: space-between; height: 64px;">
        <!-- Logo和品牌 -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <button 
            @click="$emit('navigate', 'home')"
            style="display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 700; color: #3b82f6; transition: color 0.3s ease; background: none; border: none; cursor: pointer;"
            @mouseover="$event.target.style.color = '#1d4ed8'"
            @mouseout="$event.target.style.color = '#3b82f6'"
          >
            <div style="width: 32px; height: 32px; background: linear-gradient(to bottom right, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 16px; font-weight: bold;">诗</span>
            </div>
            <span class="hidden sm:block">诗境雅集</span>
          </button>
          
          <!-- 导航菜单 -->
          <nav style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <NavButton 
              :active="currentPage === 'home'"
              @click="$emit('navigate', 'home')"
            >
              首页
            </NavButton>
            <NavButton 
              :active="currentPage === 'create'"
              @click="handleNavigate('create')"
            >
              AI创作
            </NavButton>
            <NavButton 
              :active="currentPage === 'works'"
              @click="handleNavigate('works')"
            >
              我的作品
            </NavButton>
            <NavButton 
              :active="currentPage === 'community'"
              @click="$emit('navigate', 'community')"
            >
              诗友社区
            </NavButton>
          </nav>
        </div>

        <!-- 搜索框 -->
        <div class="hidden lg:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索诗词、作者、主题..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              @keyup.enter="handleSearch"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg class="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-3">
          <!-- 搜索按钮（移动端） -->
          <button
            @click="showMobileSearch = !showMobileSearch"
            style="padding: 8px; border-radius: 8px; border: none; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; transition: all 0.3s ease;"
            @mouseover="$event.target.style.background = 'rgba(59, 130, 246, 0.2)'"
            @mouseout="$event.target.style.background = 'rgba(59, 130, 246, 0.1)'"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            style="padding: 8px; border-radius: 8px; border: none; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; transition: all 0.3s ease;"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @mouseover="$event.target.style.background = 'rgba(59, 130, 246, 0.2)'"
            @mouseout="$event.target.style.background = 'rgba(59, 130, 246, 0.1)'"
          >
            <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- 通知 -->
          <button
            v-if="isAuthenticated"
            @click="showNotifications = !showNotifications"
            class="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H7a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v4" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <!-- 用户菜单 -->
          <div v-if="isAuthenticated" class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                :src="userProfile?.avatar_url || defaultAvatar"
                :alt="userProfile?.display_name || '用户头像'"
                class="h-8 w-8 rounded-full object-cover"
              >
              <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ userProfile?.display_name || userProfile?.username }}
              </span>
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 用户下拉菜单 -->
            <transition name="fade">
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
              >
                <button
                  @click="$emit('navigate', 'profile'); showUserMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  个人中心
                </button>
                <button
                  @click="$emit('navigate', 'works'); showUserMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  我的作品
                </button>
                <hr class="my-2 border-gray-200 dark:border-gray-600">
                <button
                  @click="handleSignOut"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </transition>
          </div>

          <!-- 登录按钮 -->
          <button
            v-else
            @click="$emit('show-auth')"
            style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 8px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);"
            @mouseover="$event.target.style.transform = 'translateY(-1px)'; $event.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'"
            @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'"
          >
            登录
          </button>

          <!-- 移动端菜单按钮 -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            style="padding: 8px; border-radius: 8px; border: none; background: rgba(59, 130, 246, 0.1); color: #3b82f6; cursor: pointer; transition: all 0.3s ease;"
            @mouseover="$event.target.style.background = 'rgba(59, 130, 246, 0.2)'"
            @mouseout="$event.target.style.background = 'rgba(59, 130, 246, 0.1)'"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端搜索框 -->
      <transition name="slide">
        <div v-if="showMobileSearch" class="lg:hidden pb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索诗词、作者、主题..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              @keyup.enter="handleSearch"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </transition>

      <!-- 移动端导航菜单 -->
      <transition name="slide">
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
          <nav class="space-y-2">
            <MobileNavButton 
              :active="currentPage === 'home'"
              @click="$emit('navigate', 'home'); showMobileMenu = false"
            >
              首页
            </MobileNavButton>
            <MobileNavButton 
              :active="currentPage === 'create'"
              @click="handleNavigate('create'); showMobileMenu = false"
            >
              AI创作
            </MobileNavButton>
            <MobileNavButton 
              :active="currentPage === 'works'"
              @click="handleNavigate('works'); showMobileMenu = false"
            >
              我的作品
            </MobileNavButton>
            <MobileNavButton 
              :active="currentPage === 'community'"
              @click="$emit('navigate', 'community'); showMobileMenu = false"
            >
              诗友社区
            </MobileNavButton>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isAuthenticated, currentUser, signOut, getUserProfile } from '@/lib/auth'
import NavButton from './NavButton.vue'
import MobileNavButton from './MobileNavButton.vue'
import type { UserProfile } from '@/lib/database'

// Props
const props = defineProps<{
  currentPage: string
}>()

// Emits
const emit = defineEmits<{
  navigate: [page: string]
  'show-auth': []
}>()

// 响应式数据
const searchQuery = ref('')
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)
const isDark = ref(false)
const userProfile = ref<UserProfile | null>(null)
const unreadCount = ref(3) // 模拟未读通知数

// 默认头像
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

// 方法
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function handleNavigate(page: string) {
  if ((page === 'create' || page === 'works') && !isAuthenticated.value) {
    // 需要登录的页面，打开认证弹窗
    emit('show-auth')
    return
  }
  emit('navigate', page)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    // 实现搜索逻辑
    console.log('搜索:', searchQuery.value)
    showMobileSearch.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
}

async function handleSignOut() {
  try {
    await signOut()
    showUserMenu.value = false
    // 如果当前在需要登录的页面，跳转到首页
    if (['create', 'works', 'profile'].includes(props.currentPage)) {
      emit('navigate', 'home')
    }
  } catch (error) {
    console.error('登出失败:', error)
  }
}

// 点击外部关闭菜单
function handleClickOutside(event: Event) {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
    showNotifications.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // 跟随系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    document.documentElement.classList.toggle('dark', prefersDark)
  }

  // 获取用户配置
  if (isAuthenticated.value && currentUser.value) {
    userProfile.value = await getUserProfile(currentUser.value.id)
  }

  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
