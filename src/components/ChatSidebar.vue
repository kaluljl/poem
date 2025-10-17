<template>
  <div v-if="open" style="position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: white; color: #333; box-shadow: -5px 0 15px rgba(0,0,0,0.1); z-index: 10000; display: flex; flex-direction: column;">
    <!-- 头部 -->
    <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="color: #8b5cf6; font-weight: bold; font-size: 14px;">诗</span>
          </div>
          <div>
            <h3 style="font-weight: 600; margin: 0;">诗词AI助手</h3>
            <p style="font-size: 12px; opacity: 0.9; margin: 0;">专业诗词创作</p>
          </div>
        </div>
        <button @click="$emit('close')" style="color: white; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; padding: 4px; cursor: pointer;">
          <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- 服务状态 -->
      <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px; font-size: 12px;">
        <div :style="serviceStatus ? 'width: 8px; height: 8px; background: #10b981;' : 'width: 8px; height: 8px; background: #ef4444;'" style="border-radius: 50%;"></div>
        <span>{{ serviceStatus ? '诗词服务在线' : '诗词服务离线' }}</span>
      </div>
    </div>

    <!-- 消息区域 -->
    <div style="flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb;">
      <!-- 调试信息 -->
      <div style="background: #fef3c7; padding: 8px; margin-bottom: 16px; border-radius: 4px; font-size: 12px;">
        调试: 消息数量 = {{ messagesRef.length }}
      </div>
      <!-- 欢迎消息 -->
      <div v-if="messagesRef.length === 0" style="text-align: center; padding: 32px 0;">
        <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #a855f7, #ec4899); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 24px;">诗</span>
        </div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">欢迎使用诗词AI助手</h3>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">我可以帮您创作各种风格的诗词，包括古诗、现代诗、对联等</p>
        
        <!-- 快捷按钮 -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
          <button 
            @click="sendQuickMessage('写一首关于春天的古诗')"
            style="padding: 6px 12px; font-size: 12px; background: #f3e8ff; color: #7c3aed; border-radius: 20px; border: none; cursor: pointer;"
          >
            春天古诗
          </button>
          <button 
            @click="sendQuickMessage('创作一首现代诗，主题是梦想')"
            style="padding: 6px 12px; font-size: 12px; background: #fef3c7; color: #d97706; border-radius: 20px; border: none; cursor: pointer;"
          >
            梦想现代诗
          </button>
          <button 
            @click="sendQuickMessage('写一副对联，关于新年')"
            style="padding: 6px 12px; font-size: 12px; background: #fce7f3; color: #be185d; border-radius: 20px; border: none; cursor: pointer;"
          >
            新年对联
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-for="message in messagesRef" :key="message.id" style="margin-bottom: 16px;">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
          <div style="background: #3b82f6; color: white; padding: 12px 16px; border-radius: 18px 18px 4px 18px; max-width: 80%; word-wrap: break-word;">
            {{ message.content }}
          </div>
        </div>

        <!-- AI回复 -->
        <div v-else style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
          <div style="background: white; color: #1f2937; padding: 12px 16px; border-radius: 18px 18px 18px 4px; max-width: 80%; word-wrap: break-word; border: 1px solid #e5e7eb;">
            <div v-if="message.type === 'poetry'" style="font-family: 'Noto Serif SC', serif; line-height: 1.8; white-space: pre-line;">{{ message.content }}</div>
            <div v-else style="white-space: pre-line;">{{ message.content }}</div>
            
            <!-- 诗词操作按钮 -->
            <div v-if="message.type === 'poetry'" style="margin-top: 12px; display: flex; gap: 8px;">
              <button 
                @click="copyToClipboard(message.content)"
                style="padding: 4px 8px; font-size: 11px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;"
              >
                复制
              </button>
              <button 
                @click="sharePoetry(message.content)"
                style="padding: 4px 8px; font-size: 11px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
        <div style="background: white; color: #1f2937; padding: 12px 16px; border-radius: 18px 18px 18px 4px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span style="font-size: 14px;">AI正在创作中...</span>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" style="background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
        {{ error }}
      </div>
    </div>

    <!-- 输入区域 -->
    <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
      <div style="display: flex; gap: 8px;">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
          placeholder="请输入您的创作要求..."
          style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 24px; outline: none; font-size: 14px;"
        />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          style="padding: 12px 20px; background: #8b5cf6; color: white; border: none; border-radius: 24px; cursor: pointer; font-size: 14px; font-weight: 500;"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { chatState, sendMessage as sendChatMessage, checkN8NStatus } from '../lib/chat'

// Props
defineProps<{
  open: boolean
}>()

// Emits
defineEmits<{
  close: []
}>()

// 响应式数据
const inputMessage = ref('')
const serviceStatus = ref(false)

// 从 chat.ts 导入的状态
const { messages, isLoading, error } = chatState

// 确保响应式引用
const messagesRef = messages

// 检查服务状态
const checkService = async () => {
  serviceStatus.value = await checkN8NStatus()
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || chatState.isLoading) return

  const message = inputMessage.value.trim()
  console.log('准备发送消息:', message)
  inputMessage.value = ''

  try {
    await sendChatMessage(message)
    console.log('消息发送成功')
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 快速发送消息
const sendQuickMessage = (message: string) => {
  inputMessage.value = message
  sendMessage()
}

// 复制诗词到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('诗词已复制到剪贴板！')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}

// 分享诗词
const sharePoetry = (text: string) => {
  if (navigator.share) {
    navigator.share({
      title: '我的诗词创作',
      text: text,
    }).catch((error) => console.log('分享失败', error));
  } else {
    alert('您的浏览器不支持分享功能，请手动复制。');
  }
}

// 滚动到底部
watch(messagesRef, () => {
  setTimeout(() => {
    const container = document.querySelector('[style*="overflow-y: auto"]')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, 100)
}, { deep: true })

// 组件挂载时检查服务状态
onMounted(() => {
  checkService()
  // 定期检查服务状态
  setInterval(checkService, 30000)
})
</script>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
