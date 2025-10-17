// 认证服务
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'
import { ref, computed } from 'vue'

// 认证状态
export const currentUser = ref<User | null>(null)
export const currentSession = ref<Session | null>(null)
// 游客模式标记
export const isGuest = ref<boolean>(false)
export const isAuthenticated = computed(() => !!currentUser.value || isGuest.value)
export const isLoading = ref(true)

// 初始化认证状态
export async function initAuth() {
  try {
    // 获取当前会话
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话失败:', error)
    } else {
      currentSession.value = session
      currentUser.value = session?.user || null
    }
    
    // 初始化本地游客会话
    const guestRaw = localStorage.getItem('guest_session')
    if (guestRaw) {
      isGuest.value = true
    }

    // 监听认证状态变化
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('认证状态变化:', event, session?.user?.email)
      currentSession.value = session
      currentUser.value = session?.user || null
      if (session?.user) {
        // 一旦获得真实用户会话，清除游客状态
        isGuest.value = false
        localStorage.removeItem('guest_session')
      }
      
      if (event === 'SIGNED_IN') {
        console.log('用户已登录')
      } else if (event === 'SIGNED_OUT') {
        console.log('用户已登出')
      }
    })
    
  } catch (error) {
    console.error('初始化认证失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 邮箱注册
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0]
        }
      }
    })
    
    if (error) {
      throw error
    }
    
    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}

// 邮箱登录
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw error
    }
    
    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 第三方登录 (Google, GitHub等)
export async function signInWithProvider(provider: 'google' | 'github' | 'discord') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error(`${provider}登录失败:`, error)
    throw error
  }
}

// 登出
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    currentUser.value = null
    currentSession.value = null
    // 同时清除游客状态
    isGuest.value = false
    localStorage.removeItem('guest_session')
  } catch (error) {
    console.error('登出失败:', error)
    throw error
  }
}

// 重置密码
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('重置密码失败:', error)
    throw error
  }
}

// 更新密码
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('更新密码失败:', error)
    throw error
  }
}

// 更新用户信息
export async function updateUserMetadata(metadata: Record<string, any>) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: metadata
    })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
}

// 检查用户名是否可用
export async function checkUsernameAvailable(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single()
    
    // 如果没有找到记录，说明用户名可用
    return !data
  } catch (error) {
    // 如果是"没有找到记录"的错误，说明用户名可用
    return true
  }
}

// 获取用户配置
export async function getUserProfile(userId?: string) {
  const targetUserId = userId || currentUser.value?.id
  
  if (!targetUserId) {
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()
    
    if (error) {
      console.error('获取用户配置失败:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('获取用户配置失败:', error)
    return null
  }
}

// 更新用户配置
export async function updateUserProfile(updates: {
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
}) {
  if (!currentUser.value) {
    throw new Error('用户未登录')
  }
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', currentUser.value.id)
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('更新用户配置失败:', error)
    throw error
  }
}

// 上传头像
export async function uploadAvatar(file: File): Promise<string> {
  if (!currentUser.value) {
    throw new Error('用户未登录')
  }
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${currentUser.value.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    
    if (uploadError) {
      throw uploadError
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  } catch (error) {
    console.error('上传头像失败:', error)
    throw error
  }
}

// 认证守卫 - 检查是否需要登录
export function requireAuth(): boolean {
  if (!isAuthenticated.value) {
    // 可以在这里跳转到登录页面
    return false
  }
  return true
}

// 权限检查 - 检查是否是作者本人
export function canEditPoem(poemUserId: string): boolean {
  return currentUser.value?.id === poemUserId
}

// 获取当前用户ID
export function getCurrentUserId(): string | null {
  if (currentUser.value?.id) return currentUser.value.id
  if (isGuest.value) return 'guest'
  return null
}

// 游客登录（本地会话，不访问服务端）
export function signInAsGuest(): { user: any, session: null } {
  const guestProfile = {
    id: 'guest',
    username: 'guest',
    display_name: '游客',
    isGuest: true,
  }
  // 仅设置本地标志，供应用逻辑识别
  isGuest.value = true
  localStorage.setItem('guest_session', '1')
  // 兼容应用现有的本地会话检查
  try {
    localStorage.setItem('poetry_session', '1')
    localStorage.setItem('poetry_user', JSON.stringify(guestProfile))
  } catch {}
  return { user: guestProfile, session: null }
}
