<template>
  <div id="app">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center" style="background: linear-gradient(135deg, #fef3c7, #fed7aa);">
      <div class="text-center">
        <div style="width: 4rem; height: 4rem; border: 4px solid #fbbf24; border-top-color: #d97706; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p style="color: #6b7280;">诗境雅集加载中...</p>
      </div>
    </div>

    <!-- 主应用 -->
    <div v-else>
      <!-- 导航栏 -->
      <AppHeader 
        :current-page="currentPage" 
        @navigate="navigateTo"
        @show-auth="handleShowAuth"
      />

      <!-- 退出登录按钮（登录后显示） -->
      <div v-if="currentUser" style="position: fixed; right: 12px; top: 12px; z-index: 1000;">
        <button @click="logout" class="btn btn-outline" style="padding: 0.35rem 0.75rem; border-radius: 0.5rem;">
          退出登录
        </button>
      </div>

      <!-- 页面内容 -->
      <main class="min-h-screen">
        <!-- 首页 -->
        <HomePage 
          v-if="currentPage === 'home'" 
          @navigate="navigateTo"
        />
        
        <!-- AI创作页面 -->
        <CreatePage 
          v-else-if="currentPage === 'create'" 
          @navigate="navigateTo"
        />
        
        <!-- 我的作品页面 -->
        <WorksPage 
          v-else-if="currentPage === 'works'" 
          @navigate="navigateTo"
        />
        
        <!-- 社区页面 -->
        <CommunityPage 
          v-else-if="currentPage === 'community'" 
          @navigate="navigateTo"
        />

        <!-- 个人中心 -->
        <ProfilePage 
          v-else-if="currentPage === 'profile'" 
          @navigate="navigateTo"
        />

        <!-- 诗词详情页 -->
        <PoemDetailPage 
          v-else-if="currentPage === 'poem-detail'" 
          :poem-id="selectedPoemId"
          :poem-type="selectedPoemType"
          @navigate="navigateTo"
        />
      </main>

      <!-- 认证弹窗 -->
      <AuthModal 
        v-if="showAuthModal"
        @close="showAuthModal = false"
        @success="handleAuthSuccess"
      />

      <!-- AI 对话入口按钮与抽屉 -->
      <button @click="chatOpen = true" style="position: fixed; right: 20px; bottom: 20px; z-index: 9999; background: #3b82f6; color: white; padding: 15px 25px; border-radius: 10px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 16px; font-weight: bold;">
        🤖 AI对话
      </button>
      <ChatSidebar :open="chatOpen" @close="chatOpen=false" />
      
      <!-- 全局通知 -->
      <NotificationToast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import HomePage from '@/views/HomePage.vue'
import CreatePage from '@/views/CreatePage.vue'
import WorksPage from '@/views/WorksPage.vue'
import CommunityPage from '@/views/CommunityPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import PoemDetailPage from '@/views/PoemDetailPage.vue'
import AuthModal from '@/components/AuthModal.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import { initAuth, signOut } from '@/lib/auth'

// 应用状态
const currentPage = ref('home')
const showAuthModal = ref(false)
watch(showAuthModal, (v) => {
  console.log('[App] showAuthModal:', v)
  // 打开弹窗时禁止页面滚动，关闭时恢复
  if (v) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
const selectedPoemId = ref<string>('')
const selectedPoemType = ref<'classic' | 'user'>('classic')

// 环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 简化的加载状态
const isLoading = ref(true)
const currentUser = ref<any>(null)
const chatOpen = ref(false)

// 导航函数
function navigateTo(page: string, options?: { poemId?: string; poemType?: 'classic' | 'user' }) {
  currentPage.value = page
  
  if (options?.poemId) {
    selectedPoemId.value = options.poemId
    selectedPoemType.value = options.poemType || 'classic'
  }
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 显示认证弹窗
function handleShowAuth() {
  console.log('[App] handleShowAuth: open AuthModal')
  showAuthModal.value = true
}


// 认证成功处理
function handleAuthSuccess() {
  showAuthModal.value = false
  // 检查本地存储的用户信息
  checkUserSession()
}

// 检查用户会话
function checkUserSession() {
  const userData = localStorage.getItem('poetry_user')
  const hasSession = localStorage.getItem('poetry_session')
  
  if (userData && hasSession) {
    currentUser.value = JSON.parse(userData)
    console.log('用户已登录:', currentUser.value)
  }
}

// 登出功能
async function logout() {
  try {
    await signOut()
  } catch (e) {
    // 忽略 signOut 异常，继续清理本地
  }
  localStorage.removeItem('poetry_user')
  localStorage.removeItem('poetry_session')
  currentUser.value = null
  console.log('用户已登出')
}

// 提供全局导航函数
provide('navigate', navigateTo)

// 初始化
onMounted(async () => {
  await initAuth()
  // 暴露调试方法：在控制台执行 window.showLogin() 可手动打开登录弹窗
  ;(window as any).showLogin = () => {
    console.log('[App] window.showLogin invoked')
    showAuthModal.value = true
  }
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false
    checkUserSession()
  }, 1000)
  
  // 监听认证成功事件
  document.addEventListener('auth-success', (event: any) => {
    currentUser.value = event.detail
    showAuthModal.value = false
    console.log('认证成功:', event.detail)
  })
})
</script>

<style>
/* 全局样式重置 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 中文字体 */
.serif { 
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif; 
  line-height: 1.85; 
  letter-spacing: 0.01em; 
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s ease; 
}

.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* 焦点样式 */
:focus-visible { 
  outline: 2px solid #d97706; 
  outline-offset: 2px; 
}

/* 工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: colors 0.2s;
  outline: none;
}

.btn:focus {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(217, 119, 6, 0.5);
}

.btn-primary {
  background-color: #d97706;
  color: white;
}

.btn-primary:hover {
  background-color: #b45309;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
  background-color: transparent;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}

.input:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.5);
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dark .card {
  background-color: #1f2937;
  border-color: #374151;
}

/* 响应式断点 */
@media (max-width: 640px) {
  .container {
    padding: 0 0.75rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .dark-auto {
    background-color: #111827;
    color: #f3f4f6;
  }
}

/* 打印样式 */
@media print {
  .no-print {
    display: none !important;
  }
  
  .serif {
    font-size: 14pt;
    line-height: 1.6;
  }
}

/* 动画关键帧 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* 文本截断 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* 无障碍支持 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .btn-primary {
    border: 2px solid #92400e;
  }
  
  .input {
    border: 2px solid #4b5563;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
