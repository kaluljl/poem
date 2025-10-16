<template>
  <teleport to="body">
    <div 
      class="fixed inset-0 overflow-y-auto"
      style="position: fixed; inset: 0; z-index: 2147483647;"
      @click.self="$emit('close')"
    >
      <!-- 背景遮罩（柔和） -->
      <div style="position: fixed; left:0; top:0; width:100vw; height:100vh; background: rgba(2,6,23,0.55);"></div>

      <!-- 居中卡片（Glassmorphism） -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative z-10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.35)] border border-white/15 bg-white/10 backdrop-blur-lg text-white" style="width: 420px; max-width: calc(100vw - 32px);">
          <!-- 关闭按钮 -->
          <button
            @click="$emit('close')"
            class="absolute right-3 top-3 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 顶部标签栏 + 右侧主操作（注册/登录） -->
          <div class="px-6 pt-6">
            <div class="flex items-center justify-between border-b border-white/10">
              <button
                @click="activeTab = 'sms'"
                :class="['px-4 pb-3 text-sm font-medium', activeTab==='sms' ? 'text-white border-b-2 border-white/70' : 'text-white/70 hover:text-white']"
              >手机登录</button>
              <button
                @click="activeTab = 'email'"
                :class="['px-4 pb-3 text-sm font-medium', activeTab==='email' ? 'text-white border-b-2 border-white/70' : 'text-white/70 hover:text-white']"
              >邮箱登录</button>
              <button
                @click="activeTab = 'course'"
                :class="['px-4 pb-3 text-sm font-medium', activeTab==='course' ? 'text-white border-b-2 border-white/70' : 'text-white/70 hover:text-white']"
              >校园账号</button>
              <div class="ml-auto pb-3 flex items-center gap-2">
                <button v-if="!isRegister" @click="isRegister=true; activeTab='email'"
                        class="h-8 px-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">注册</button>
                <button v-else @click="isRegister=false; activeTab='email'"
                        class="h-8 px-3 rounded-lg text-sm font-medium text-white/90 border border-white/30 hover:bg-white/10">去登录</button>
              </div>
            </div>
          </div>

          <!-- 内容 -->
          <div class="px-6 py-5 space-y-4">
            <!-- 手机登录 -->
            <div v-if="activeTab==='sms'" class="space-y-4">
              <div class="rounded-xl border border-white/15 bg-white/10 p-5 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
                <h2 class="text-xl font-semibold mb-1">继续使用手机号登录</h2>
                <p class="text-sm text-white/80 mb-4">在所有设备上同步你的创作和设置。</p>
                <div>
                <label class="block text-sm text-white/80 mb-1">手机号</label>
                <input v-model="smsForm.phone" type="tel" maxlength="11"
                  class="w-full h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                  placeholder="请输入手机号">
                </div>
                <div class="mt-4">
                <label class="block text-sm text-white/80 mb-1">验证码</label>
                <div class="flex gap-2">
                  <input v-model="smsForm.code" type="text"
                         class="flex-1 h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                         placeholder="请输入验证码">
                  <button @click="sendSmsCode" :disabled="smsCountdown>0 || !smsForm.phone"
                          class="px-4 h-12 rounded-lg border text-sm"
                          :class="smsCountdown>0 ? 'bg-white/10 text-white/50 border-white/20' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'">
                    {{ smsCountdown>0 ? `${smsCountdown}s` : '获取验证码' }}
                  </button>
                </div>
                </div>
                <button @click="loginWithSms" :disabled="loading"
                        class="w-full h-12 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 mt-5">登 录</button>
              </div>
            </div>

            <!-- 邮箱登录/注册 -->
            <div v-else-if="activeTab==='email'" class="space-y-4">
              <div class="rounded-xl border border-white/15 bg-white/10 p-5 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
                <h2 class="text-xl font-semibold mb-1">{{ isRegister ? '创建你的账号' : '继续使用邮箱登录' }}</h2>
                <p class="text-sm text-white/80 mb-4">{{ isRegister ? '几秒钟即可开始创作与收藏。' : '更安全可靠的登录体验。' }}</p>
                <div>
                <label class="block text-sm text-white/80 mb-1">邮箱</label>
                <input v-model="emailForm.email" type="email"
                  class="w-full h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                  placeholder="请输入邮箱">
                </div>
                <div class="mt-4">
                <label class="block text-sm text-white/80 mb-1">密码</label>
                <input v-model="emailForm.password" :type="showPassword ? 'text' : 'password'"
                  class="w-full h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                  placeholder="请输入密码">
                </div>
                <div class="flex justify-between items-center text-xs text-white/80 mt-3">
                <label class="flex items-center gap-1"><input type="checkbox" v-model="remember"/> 10天内免登录</label>
                <button class="text-white hover:underline">忘记密码?</button>
                </div>
                <button v-if="!isRegister" @click="loginWithEmail" :disabled="loading"
                        class="w-full h-12 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 mt-5">登 录</button>
                <button v-else @click="registerWithEmail" :disabled="loading"
                        class="w-full h-12 rounded-lg text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 mt-5">注 册</button>
              </div>
            </div>

            <!-- 校园账号 -->
            <div v-else class="space-y-4">
              <div class="rounded-xl border border-white/15 bg-white/10 p-5 shadow-[0_10px_30px_rgba(0,0,0,.25)]">
                <h2 class="text-xl font-semibold mb-1">校园账号登录</h2>
                <p class="text-sm text-white/80 mb-4">请输入学校提供的用户名和密码。</p>
                <div>
                <label class="block text-sm text-white/80 mb-1">校园用户名</label>
                <input v-model="courseForm.username" type="text"
                  class="w-full h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                  placeholder="请输入校园用户名">
                </div>
                <div class="mt-4">
                <label class="block text-sm text-white/80 mb-1">密码</label>
                <input v-model="courseForm.password" :type="showPassword ? 'text' : 'password'"
                  class="w-full h-12 px-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
                  placeholder="请输入密码">
                </div>
                <button @click="loginWithCourse" :disabled="loading"
                        class="w-full h-12 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 mt-5">登 录</button>
              </div>
            </div>

            <div v-if="error" class="text-red-300 text-xs">{{ error }}</div>
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

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', payload: { user: any, session: any }): void
}>()

const activeTab = ref<'sms'|'email'|'course'>('sms')
const loading = ref(false)
const showPassword = ref(false)
const remember = ref(true)
const error = ref('')
const isRegister = ref(true)

const smsForm = ref({ phone: '', code: '' })
const emailForm = ref({ email: '', password: '' })
const courseForm = ref({ username: '', password: '' })

const smsCountdown = ref(0)
let timer: number | undefined

onUnmounted(() => { if (timer) window.clearInterval(timer) })

async function sendSmsCode() {
  if (!/^\d{11}$/.test(smsForm.value.phone)) { error.value = '请输入11位手机号'; return }
  try {
    error.value = ''
    loading.value = true
    // Supabase 需要 E.164；中国大陆以 +86 开头
    const phone = `+86${smsForm.value.phone}`
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone })
    if (otpError) throw otpError
    smsCountdown.value = 60
    timer = window.setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0 && timer) { window.clearInterval(timer); timer = undefined }
    }, 1000)
  } catch (e: any) {
    error.value = e?.message || '发送验证码失败'
  } finally {
    loading.value = false
  }
}

async function loginWithSms() {
  if (!smsForm.value.phone || !smsForm.value.code) { error.value = '请输入手机号和验证码'; return }
  try {
    loading.value = true
    const phone = `+86${smsForm.value.phone}`
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: smsForm.value.code,
      type: 'sms'
    })
    if (verifyError) throw verifyError
    persistAndNotify(data.session?.user, data.session)
  } catch (e: any) {
    error.value = e?.message || '短信登录失败'
  } finally {
    loading.value = false
  }
}

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