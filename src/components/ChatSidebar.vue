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
      <!-- 欢迎消息 -->
      <div v-if="chatState.messages.length === 0" style="text-align: center; padding: 32px 0;">
        <div style="width: 64px; height: 64px; background: linear-gradient(to bottom right, #a855f7, #ec4899); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 24px;">诗</span>
        </div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">欢迎使用AI助手</h3>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">我可以与您聊天，也可以帮您创作诗词。试试下面的快捷按钮开始对话吧！</p>
        
        <!-- 快捷按钮 -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
          <!-- 诗词创作 -->
          <div style="width: 100%; margin-bottom: 8px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-align: left;">🎨 诗词创作</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
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
          
          <!-- 普通对话 -->
          <div style="width: 100%;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-align: left;">💬 日常对话</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
              <button 
                @click="sendQuickMessage('你好，请介绍一下古典诗词的特点')"
                style="padding: 6px 12px; font-size: 12px; background: #f0fdf4; color: #166534; border-radius: 20px; border: none; cursor: pointer;"
              >
                诗词知识
              </button>
              <button 
                @click="sendQuickMessage('请推荐几首经典的唐诗')"
                style="padding: 6px 12px; font-size: 12px; background: #fef2f2; color: #dc2626; border-radius: 20px; border: none; cursor: pointer;"
              >
                经典推荐
              </button>
              <button 
                @click="sendQuickMessage('如何学习写诗？')"
                style="padding: 6px 12px; font-size: 12px; background: #fefce8; color: #ca8a04; border-radius: 20px; border: none; cursor: pointer;"
              >
                学习指导
              </button>
              <button 
                @click="sendQuickMessage('今天天气不错，有什么想聊的吗？')"
                style="padding: 6px 12px; font-size: 12px; background: #f3f4f6; color: #374151; border-radius: 20px; border: none; cursor: pointer;"
              >
                随便聊聊
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-for="message in chatState.messages" :key="`${message.id}-${forceUpdate}`" style="margin-bottom: 16px;">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
          <div style="background: #3b82f6; color: white; padding: 12px 16px; border-radius: 18px 18px 4px 18px; max-width: 80%; word-wrap: break-word;">
            {{ message.content }}
          </div>
        </div>

        <!-- AI回复 -->
        <div v-else style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
          <div :style="{
            background: message.type === 'poetry' ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(252, 211, 77, 0.8) 100%)' : 'white',
            color: '#1f2937',
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            maxWidth: '80%',
            wordWrap: 'break-word',
            border: message.type === 'poetry' ? '1px solid #fcd34d' : '1px solid #e5e7eb',
            boxShadow: message.type === 'poetry' ? '0 2px 8px rgba(252, 211, 77, 0.2)' : 'none'
          }">
            <div v-if="message.type === 'poetry'" style="font-family: 'Noto Serif SC', serif; line-height: 1.8; white-space: pre-line; font-size: 15px;">{{ message.content }}</div>
            <div v-else style="white-space: pre-line; line-height: 1.6;">{{ message.content }}</div>
            
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
            
            <!-- 普通对话操作按钮 -->
            <div v-else style="margin-top: 8px; display: flex; gap: 8px;">
              <button 
                @click="copyToClipboard(message.content)"
                style="padding: 4px 8px; font-size: 11px; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="chatState.isLoading" style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
        <div style="background: white; color: #1f2937; padding: 12px 16px; border-radius: 18px 18px 18px 4px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top-color: #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span style="font-size: 14px;">🤖 AI正在思考中...</span>
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            <span v-if="isPoetryRequest(inputMessage)">
              <span style="color: #d97706;">✨</span> 正在创作诗词<span class="loading-dots"></span>
            </span>
            <span v-else>
              <span style="color: #3b82f6;">💭</span> 正在组织回复<span class="loading-dots"></span>
            </span>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="chatState.error" style="background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
        ❌ {{ chatState.error }}
      </div>
    </div>

    <!-- 输入区域 -->
    <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
      <div style="display: flex; gap: 8px;">
              <input
                v-model="inputMessage"
                @keyup.enter="sendMessage"
                :disabled="chatState.isLoading"
                placeholder="输入消息... 可以聊天或要求创作诗词"
                style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 24px; outline: none; font-size: 14px;"
              />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || chatState.isLoading"
          :style="{
            padding: '12px 20px',
            background: chatState.isLoading ? '#9ca3af' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: chatState.isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }"
        >
          {{ chatState.isLoading ? (isPoetryRequest(inputMessage) ? '创作中...' : '思考中...') : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { chatState, sendMessage as sendChatMessage, checkN8NStatus, testConnection } from '../lib/chat'

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
const forceUpdate = ref(0)

  // 强制更新组件
  const triggerUpdate = () => {
    forceUpdate.value++
  }

  // 判断是否为诗词创作请求
  const isPoetryRequest = (content: string): boolean => {
    if (!content) return false
    
    const poetryKeywords = [
      '写诗', '作诗', '创作诗词', '写一首', '作一首', '诗词', '诗歌', '绝句', '律诗', '词',
      '五言', '七言', '古诗', '古风', '唐诗', '宋词', '元曲', '现代诗', '自由诗',
      '押韵', '格律', '平仄', '对仗', '意境', '诗情画意', '对联'
    ]
    
    const requestPatterns = [
      /请.*写.*诗/i,
      /请.*作.*诗/i,
      /创作.*诗词/i,
      /写一首.*诗/i,
      /作一首.*诗/i,
      /帮我.*诗/i,
      /想要.*诗/i,
      /需要.*诗/i
    ]
    
    // 检查关键词
    const hasKeyword = poetryKeywords.some(keyword => content.includes(keyword))
    
    // 检查模式
    const hasPattern = requestPatterns.some(pattern => pattern.test(content))
    
    return hasKeyword || hasPattern
  }

// 直接使用chatState，现在它是reactive的
// 不需要解构，直接使用chatState.messages等

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
watch(() => chatState.messages, () => {
  console.log('消息变化检测到:', chatState.messages.length)
  triggerUpdate() // 强制更新组件
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-dots {
  display: inline-block;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}
</style>
