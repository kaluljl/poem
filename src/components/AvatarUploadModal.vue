<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">更换头像</h3>
      
      <div class="text-center">
        <!-- 头像预览 -->
        <div class="mb-4">
          <img 
            :src="previewUrl || defaultAvatar" 
            alt="头像预览"
            class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-200 dark:border-gray-600"
          >
        </div>
        
        <!-- 上传按钮 -->
        <div class="mb-4">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          >
          <button 
            @click="fileInput?.click()"
            class="btn btn-outline w-full"
          >
            选择图片
          </button>
          <p class="text-xs text-gray-500 mt-2">支持 JPG、PNG 格式，大小不超过 2MB</p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-3">
          <button @click="$emit('close')" class="btn btn-outline flex-1">
            取消
          </button>
          <button 
            @click="handleUpload" 
            :disabled="!selectedFile || isUploading"
            class="btn btn-primary flex-1"
          >
            {{ isUploading ? '上传中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadAvatar } from '@/lib/auth'

defineEmits<{
  close: []
  success: [avatarUrl: string]
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const isUploading = ref(false)

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件大小
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过 2MB')
    return
  }
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  
  selectedFile.value = file
  
  // 生成预览
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function handleUpload() {
  if (!selectedFile.value) return
  
  isUploading.value = true
  
  try {
    const avatarUrl = await uploadAvatar(selectedFile.value)
    $emit('success', avatarUrl)
  } catch (error) {
    console.error('上传头像失败:', error)
    alert('上传失败，请稍后重试')
  } finally {
    isUploading.value = false
  }
}
</script>
