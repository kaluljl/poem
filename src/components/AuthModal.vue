<template>
  <teleport to="body">
    <div 
      class="fixed inset-0 overflow-y-auto"
      style="position: fixed; inset: 0; z-index: 2147483647;"
      @click.self="$emit('close')"
    >
      <!-- 背景遮罩（柔和渐变） -->
      <div style="position: fixed; left:0; top:0; width:100vw; height:100vh; background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));"></div>

      <!-- 居中卡片（现代风格） -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative z-10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.2)] border border-white/20" style="width: 420px; max-width: calc(100vw - 32px); background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px);">
          <!-- 关闭按钮 -->
          <button
            @click="$emit('close')"
            style="position: absolute; right: 16px; top: 16px; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border: 2px solid rgba(239, 68, 68, 0.2); color: #dc2626; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);"
            @mouseover="$event.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'; $event.target.style.borderColor = 'rgba(239, 68, 68, 0.4)'; $event.target.style.transform = 'scale(1.1)'; $event.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.2)'"
            @mouseout="$event.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'; $event.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; $event.target.style.transform = 'scale(1)'; $event.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.1)'"
            title="关闭登录窗口"
          >
            <svg style="width: 20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 顶部标题区域 -->
          <div class="px-6 pt-6 pb-4">
            <div class="text-center mb-6">
              <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #3b82f6, #8b5cf6); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px; font-weight: bold;">诗</span>
              </div>
              <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">诗境雅集</h2>
              <p style="color: #6b7280; font-size: 14px;">{{ isRegister ? '创建账号，开启诗词创作之旅' : '欢迎回来，继续您的诗词之旅' }}</p>
            </div>

            <!-- 标签栏 -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px; background: rgba(59, 130, 246, 0.05); border-radius: 12px; margin-bottom: 16px;">
              <button
                @click="activeTab = 'email'"
                :style="{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeTab === 'email' ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' : 'transparent',
                  color: activeTab === 'email' ? 'white' : '#6b7280',
                  boxShadow: activeTab === 'email' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                }"
                @mouseover="handleEmailTabHover"
                @mouseout="handleEmailTabOut"
              >邮箱登录</button>
              <button
                @click="activeTab = 'course'"
                :style="{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeTab === 'course' ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' : 'transparent',
                  color: activeTab === 'course' ? 'white' : '#6b7280',
                  boxShadow: activeTab === 'course' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                }"
                @mouseover="handleCourseTabHover"
                @mouseout="handleCourseTabOut"
              >校园账号</button>
            </div>
          </div>

          <!-- 内容 -->
          <div class="px-6 pb-6">
            <!-- 邮箱登录/注册 -->
            <div v-if="activeTab==='email'" class="space-y-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                  <input v-model="emailForm.email" type="email"
                    style="width: 100%; height: 48px; padding: 0 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%); color: #1f2937; placeholder-color: #9ca3af; outline: none; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                    @focus="$event.target.style.borderColor = '#3b82f6'; $event.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; $event.target.style.background = 'rgba(255, 255, 255, 0.95)'"
                    @blur="$event.target.style.borderColor = '#e5e7eb'; $event.target.style.boxShadow = 'none'; $event.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'"
                    placeholder="请输入您的邮箱地址">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
                  <div class="relative">
                    <input v-model="emailForm.password" :type="showPassword ? 'text' : 'password'"
                      style="width: 100%; height: 48px; padding: 0 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%); color: #1f2937; placeholder-color: #9ca3af; outline: none; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                      @focus="$event.target.style.borderColor = '#3b82f6'; $event.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; $event.target.style.background = 'rgba(255, 255, 255, 0.95)'"
                      @blur="$event.target.style.borderColor = '#e5e7eb'; $event.target.style.boxShadow = 'none'; $event.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'"
                      placeholder="请输入您的密码">
                    <button @click="showPassword = !showPassword" type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <label class="flex items-center gap-2 text-gray-600" style="cursor: pointer;">
                    <input type="checkbox" v-model="remember" style="width: 16px; height: 16px; border-radius: 4px; border: 2px solid #d1d5db; accent-color: #3b82f6; cursor: pointer;">
                    记住我
                  </label>
                  <button style="color: #3b82f6; background: none; border: none; cursor: pointer; font-weight: 500; transition: color 0.3s ease;" 
                          @mouseover="$event.target.style.color = '#1d4ed8'" 
                          @mouseout="$event.target.style.color = '#3b82f6'">忘记密码？</button>
                </div>
                <button v-if="!isRegister" @click="loginWithEmail" :disabled="loading"
                        class="w-full h-12 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
                  <span v-if="!loading">登录</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    登录中...
                  </span>
                </button>
                <button v-else @click="registerWithEmail" :disabled="loading"
                        :style="{
                          width: '100%',
                          height: '48px',
                          borderRadius: '12px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                          opacity: loading ? '0.5' : '1'
                        }"
                        @mouseover="handleRegisterHover"
                        @mouseout="handleRegisterOut">
                  <span v-if="!loading">注册</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    注册中...
                  </span>
                </button>
              </div>
            </div>

            <!-- 校园账号 -->
            <div v-else class="space-y-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">校园用户名</label>
                  <input v-model="courseForm.username" type="text"
                    style="width: 100%; height: 48px; padding: 0 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%); color: #1f2937; placeholder-color: #9ca3af; outline: none; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                    @focus="$event.target.style.borderColor = '#3b82f6'; $event.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; $event.target.style.background = 'rgba(255, 255, 255, 0.95)'"
                    @blur="$event.target.style.borderColor = '#e5e7eb'; $event.target.style.boxShadow = 'none'; $event.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'"
                    placeholder="请输入校园用户名">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
                  <div class="relative">
                    <input v-model="courseForm.password" :type="showPassword ? 'text' : 'password'"
                      style="width: 100%; height: 48px; padding: 0 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%); color: #1f2937; placeholder-color: #9ca3af; outline: none; transition: all 0.3s ease; backdrop-filter: blur(10px);"
                      @focus="$event.target.style.borderColor = '#3b82f6'; $event.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; $event.target.style.background = 'rgba(255, 255, 255, 0.95)'"
                      @blur="$event.target.style.borderColor = '#e5e7eb'; $event.target.style.boxShadow = 'none'; $event.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'"
                      placeholder="请输入密码">
                    <button @click="showPassword = !showPassword" type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button @click="loginWithCourse" :disabled="loading"
                        :style="{
                          width: '100%',
                          height: '48px',
                          borderRadius: '12px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                          opacity: loading ? '0.5' : '1'
                        }"
                        @mouseover="handleLoginHover"
                        @mouseout="handleLoginOut">
                  <span v-if="!loading">登录</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    登录中...
                  </span>
                </button>
              </div>
            </div>

            <!-- 切换登录/注册 -->
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <button @click="isRegister = !isRegister" 
                      style="color: #3b82f6; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 500; cursor: pointer; font-size: 14px; transition: all 0.3s ease; padding: 10px 20px; border-radius: 10px;"
                      @mouseover="$event.target.style.color = '#1d4ed8'; $event.target.style.background = 'rgba(59, 130, 246, 0.2)'; $event.target.style.borderColor = 'rgba(59, 130, 246, 0.4)'; $event.target.style.transform = 'translateY(-1px)'"
                      @mouseout="$event.target.style.color = '#3b82f6'; $event.target.style.background = 'rgba(59, 130, 246, 0.1)'; $event.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'; $event.target.style.transform = 'translateY(0)'">
                {{ isRegister ? '已有账号？去登录' : '没有账号？立即注册' }}
              </button>
            </div>

            <!-- 取消按钮 -->
            <div style="text-align: center; padding-top: 16px;">
              <button @click="$emit('close')" 
                      style="color: #6b7280; background: rgba(107, 114, 128, 0.1); border: 1px solid rgba(107, 114, 128, 0.2); font-weight: 500; cursor: pointer; font-size: 14px; transition: all 0.3s ease; padding: 10px 20px; border-radius: 10px;"
                      @mouseover="$event.target.style.color = '#374151'; $event.target.style.background = 'rgba(107, 114, 128, 0.2)'; $event.target.style.borderColor = 'rgba(107, 114, 128, 0.4)'; $event.target.style.transform = 'translateY(-1px)'"
                      @mouseout="$event.target.style.color = '#6b7280'; $event.target.style.background = 'rgba(107, 114, 128, 0.1)'; $event.target.style.borderColor = 'rgba(107, 114, 128, 0.2)'; $event.target.style.transform = 'translateY(0)'">
                取消登录
              </button>
            </div>
            <!-- 游客体验 -->
            <div style="text-align: center; padding-top: 12px;">
              <button @click="handleGuest"
                      style="width: 100%; height: 44px; border-radius: 12px; border: 1px dashed rgba(59,130,246,.4); background: rgba(59,130,246,.06); color: #2563eb; font-weight: 600; cursor: pointer; transition: all .3s ease;"
                      @mouseover="$event.target.style.background='rgba(59,130,246,.12)'"
                      @mouseout="$event.target.style.background='rgba(59,130,246,.06)'">
                先体验一下（游客模式）
              </button>
            </div>

            <!-- 错误提示 -->
            <div v-if="error" style="background: linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%); border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 12px; font-size: 14px; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { signInWithEmail } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { signInAsGuest } from '@/lib/auth'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', payload: { user: any, session: any }): void
}>()

const activeTab = ref<'email'|'course'>('email')
const loading = ref(false)
const showPassword = ref(false)
const remember = ref(true)
const error = ref('')
const isRegister = ref(true)
function handleGuest() {
  try {
    const { user } = signInAsGuest()
    // 向外广播成功事件，保持与正常登录一致
    emit('success', { user, session: null })
  } catch (e) {
    console.error('游客登录失败', e)
  }
}

// 事件处理函数
function handleRegisterHover(event: Event) {
  if (!loading.value) {
    const target = event.target as HTMLElement
    target.style.transform = 'translateY(-2px)'
    target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'
  }
}

function handleRegisterOut(event: Event) {
  if (!loading.value) {
    const target = event.target as HTMLElement
    target.style.transform = 'translateY(0)'
    target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'
  }
}

function handleLoginHover(event: Event) {
  if (!loading.value) {
    const target = event.target as HTMLElement
    target.style.transform = 'translateY(-2px)'
    target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'
  }
}

function handleLoginOut(event: Event) {
  if (!loading.value) {
    const target = event.target as HTMLElement
    target.style.transform = 'translateY(0)'
    target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'
  }
}

function handleEmailTabHover(event: Event) {
  if (activeTab.value !== 'email') {
    const target = event.target as HTMLElement
    target.style.color = '#3b82f6'
    target.style.background = 'rgba(59, 130, 246, 0.1)'
  }
}

function handleEmailTabOut(event: Event) {
  if (activeTab.value !== 'email') {
    const target = event.target as HTMLElement
    target.style.color = '#6b7280'
    target.style.background = 'transparent'
  }
}

function handleCourseTabHover(event: Event) {
  if (activeTab.value !== 'course') {
    const target = event.target as HTMLElement
    target.style.color = '#3b82f6'
    target.style.background = 'rgba(59, 130, 246, 0.1)'
  }
}

function handleCourseTabOut(event: Event) {
  if (activeTab.value !== 'course') {
    const target = event.target as HTMLElement
    target.style.color = '#6b7280'
    target.style.background = 'transparent'
  }
}

const emailForm = ref({ email: '', password: '' })
const courseForm = ref({ username: '', password: '' })


async function loginWithEmail() {
  if (!emailForm.value.email || !emailForm.value.password) { error.value = '请输入邮箱和密码'; return }
  try {
    loading.value = true
    const { user, session } = await signInWithEmail(emailForm.value.email, emailForm.value.password)
    persistAndNotify(user as any, session as any)
  } catch (e: any) {
    error.value = e?.message || '邮箱登录失败'
  } finally {
    loading.value = false
  }
}

async function registerWithEmail() {
  if (!emailForm.value.email || !emailForm.value.password) { error.value = '请输入邮箱和密码'; return }
  try {
    loading.value = true
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: emailForm.value.email,
      password: emailForm.value.password
    })
    if (signUpError) throw signUpError
    persistAndNotify(data.user as any, data.session as any)
  } catch (e: any) {
    error.value = e?.message || '注册失败'
  } finally {
    loading.value = false
  }
}

async function loginWithCourse() {
  if (!courseForm.value.username || !courseForm.value.password) { error.value = '请输入校园账号和密码'; return }
  // 这里没有真实后端，先提示
  error.value = '校园账号登录暂未开通'
}

function persistAndNotify(user: any, session: any) {
  try {
    // 兼容现有 App.vue 的本地检查
    if (user) localStorage.setItem('poetry_user', JSON.stringify(user))
    localStorage.setItem('poetry_session', '1')
  } catch {}
  emit('success', { user, session })
  document.dispatchEvent(new CustomEvent('auth-success', { detail: { user, session } }))
}
</script>

<style scoped>
/***** Glassmorphism 细节 *****/
/* 可以根据需要在此处增加柔和光影或发光边框 */
</style>