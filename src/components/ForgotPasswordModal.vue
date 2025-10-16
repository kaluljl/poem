<template>
  <div class="fixed inset-0 z-60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="text-center mb-6">
        <div class="text-2xl mb-2">🔑</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">重置密码</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          输入您的邮箱地址，我们将发送重置链接
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="输入您的邮箱地址"
            class="input"
            :class="{ 'border-red-500': error }"
            required
          >
          <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
        >
          <span v-if="isLoading">发送中...</span>
          <span v-else>发送重置邮件</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { resetPassword } from '@/lib/auth'

defineEmits<{
  close: []
  success: []
}>()

const email = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!email.value) {
    error.value = '请输入邮箱地址'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await resetPassword(email.value)
    $emit('success')
  } catch (err: any) {
    error.value = err.message || '发送失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>
