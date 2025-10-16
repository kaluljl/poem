<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- 标题 -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">发布新作品</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 作品标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              作品标题 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.title"
              type="text" 
              placeholder="为您的作品起个好听的名字..."
              class="input"
              :class="{ 'border-red-500': errors.title }"
              required
            />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>
          
          <!-- 作品内容 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              作品内容 <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="form.content"
              rows="8"
              placeholder="在这里写下您的诗词作品..."
              class="input serif"
              :class="{ 'border-red-500': errors.content }"
              required
            ></textarea>
            <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ form.content.length }}/2000 字符</p>
          </div>
          
          <!-- 作品体裁 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              作品体裁 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.style"
              class="input"
              :class="{ 'border-red-500': errors.style }"
              required
            >
              <option value="">请选择体裁</option>
              <option value="五言绝句">五言绝句</option>
              <option value="七言绝句">七言绝句</option>
              <option value="五言律诗">五言律诗</option>
              <option value="七言律诗">七言律诗</option>
              <option value="词">词</option>
              <option value="古风">古风</option>
            </select>
            <p v-if="errors.style" class="text-red-500 text-sm mt-1">{{ errors.style }}</p>
          </div>
          
          <!-- 创作主题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              创作主题
            </label>
            <input 
              v-model="form.theme"
              type="text" 
              placeholder="例如：春日踏青、思君不见、山水田园..."
              class="input"
            />
          </div>
          
          <!-- 情感标签 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              情感标签
            </label>
            <div class="flex flex-wrap gap-2 mb-3">
              <button 
                v-for="emotion in availableEmotions" 
                :key="emotion"
                type="button"
                @click="toggleEmotion(emotion)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm border transition-colors',
                  form.emotions.includes(emotion)
                    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                ]"
              >
                {{ emotion }}
              </button>
            </div>
            <input 
              v-model="customEmotion"
              type="text" 
              placeholder="或输入自定义标签，按回车添加"
              class="input text-sm"
              @keyup.enter="addCustomEmotion"
            />
          </div>
          
          <!-- 关键词 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              关键意象
            </label>
            <input 
              v-model="form.keywords"
              type="text" 
              placeholder="例如：明月、青山、流水、梧桐（用逗号分隔）"
              class="input"
            />
          </div>
          
          <!-- 发布设置 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              发布设置
            </label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input 
                  v-model="form.isAiAssisted"
                  type="checkbox" 
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">这是AI辅助创作的作品</span>
              </label>
              
              <div class="flex items-center gap-4">
                <label class="flex items-center">
                  <input 
                    v-model="form.status"
                    type="radio" 
                    value="published"
                    class="text-purple-600 focus:ring-purple-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">立即发布</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="form.status"
                    type="radio" 
                    value="draft"
                    class="text-purple-600 focus:ring-purple-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">保存为草稿</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 错误信息 -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p class="text-red-600 dark:text-red-400 text-sm">{{ errorMessage }}</p>
          </div>
          
          <!-- 提交按钮 -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button"
              @click="$emit('close')"
              class="btn btn-outline"
            >
              取消
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="btn btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {{ form.status === 'published' ? '发布中...' : '保存中...' }}
              </span>
              <span v-else>
                {{ form.status === 'published' ? '发布作品' : '保存草稿' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isAuthenticated, currentUser } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

// Emits
defineEmits<{
  close: []
  success: []
}>()

// 响应式数据
const isSubmitting = ref(false)
const errorMessage = ref('')
const customEmotion = ref('')

const form = reactive({
  title: '',
  content: '',
  style: '',
  theme: '',
  emotions: [] as string[],
  keywords: '',
  isAiAssisted: false,
  status: 'published' as 'published' | 'draft'
})

const errors = reactive({
  title: '',
  content: '',
  style: ''
})

const availableEmotions = [
  '喜悦', '忧伤', '思念', '豪迈', '宁静', '激昂', '惆怅', '欣慰',
  '怀古', '咏物', '离别', '相思', '田园', '边塞', '山水', '节庆'
]

// 方法
function toggleEmotion(emotion: string) {
  const index = form.emotions.indexOf(emotion)
  if (index > -1) {
    form.emotions.splice(index, 1)
  } else {
    if (form.emotions.length < 5) { // 限制最多5个标签
      form.emotions.push(emotion)
    } else {
      alert('最多只能选择5个情感标签')
    }
  }
}

function addCustomEmotion() {
  const emotion = customEmotion.value.trim()
  if (emotion && !form.emotions.includes(emotion)) {
    if (form.emotions.length < 5) {
      form.emotions.push(emotion)
      customEmotion.value = ''
    } else {
      alert('最多只能选择5个情感标签')
    }
  }
}

function validateForm(): boolean {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  let isValid = true
  
  // 标题验证
  if (!form.title.trim()) {
    errors.title = '请输入作品标题'
    isValid = false
  } else if (form.title.length > 100) {
    errors.title = '标题不能超过100个字符'
    isValid = false
  }
  
  // 内容验证
  if (!form.content.trim()) {
    errors.content = '请输入作品内容'
    isValid = false
  } else if (form.content.length > 2000) {
    errors.content = '内容不能超过2000个字符'
    isValid = false
  }
  
  // 体裁验证
  if (!form.style) {
    errors.style = '请选择作品体裁'
    isValid = false
  }
  
  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return
  
  if (!isAuthenticated.value || !currentUser.value) {
    errorMessage.value = '请先登录'
    return
  }
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    const poemData = {
      title: form.title.trim(),
      content: form.content.trim(),
      style: form.style,
      theme: form.theme.trim() || undefined,
      emotions: form.emotions.length > 0 ? form.emotions : undefined,
      keywords: form.keywords.trim() ? form.keywords.split(',').map(k => k.trim()).filter(k => k) : undefined,
      is_ai_assisted: form.isAiAssisted,
      status: form.status,
      user_id: currentUser.value.id
    }
    
    const result = await DatabaseService.createUserPoem(poemData)
    
    if (result) {
      $emit('success')
      // 重置表单
      Object.assign(form, {
        title: '',
        content: '',
        style: '',
        theme: '',
        emotions: [],
        keywords: '',
        isAiAssisted: false,
        status: 'published'
      })
    } else {
      errorMessage.value = '发布失败，请稍后重试'
    }
  } catch (error: any) {
    console.error('发布作品失败:', error)
    errorMessage.value = error.message || '发布失败，请稍后重试'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.serif {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif;
  line-height: 1.8;
  letter-spacing: 0.02em;
}
</style>
