<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">编辑个人资料</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">显示名称</label>
          <input 
            v-model="form.display_name"
            type="text" 
            class="input"
            placeholder="输入您的显示名称"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用户名</label>
          <input 
            v-model="form.username"
            type="text" 
            class="input"
            placeholder="输入您的用户名"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人简介</label>
          <textarea 
            v-model="form.bio"
            rows="3"
            class="input"
            placeholder="介绍一下自己..."
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="btn btn-outline">
            取消
          </button>
          <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
            {{ isSubmitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { updateUserProfile } from '@/lib/auth'
import type { UserProfile } from '@/lib/database'

const props = defineProps<{
  userProfile: UserProfile | null
}>()

defineEmits<{
  close: []
  success: [profile: UserProfile]
}>()

const isSubmitting = ref(false)

const form = reactive({
  display_name: props.userProfile?.display_name || '',
  username: props.userProfile?.username || '',
  bio: props.userProfile?.bio || ''
})

async function handleSubmit() {
  isSubmitting.value = true
  
  try {
    await updateUserProfile({
      display_name: form.display_name,
      username: form.username,
      bio: form.bio
    })
    
    $emit('success', { ...props.userProfile!, ...form })
  } catch (error) {
    console.error('更新资料失败:', error)
    alert('更新失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>
