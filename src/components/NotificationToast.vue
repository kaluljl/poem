<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <transition-group name="toast" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            getTypeClass(notification.type)
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="getIcon(notification.type)" class="h-6 w-6" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeNotification(notification.id)"
                  class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">关闭</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const notifications = ref<Notification[]>([])

// 图标组件
const SuccessIcon = {
  template: `
    <svg class="text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg class="text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg class="text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg class="text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

function getIcon(type: string) {
  switch (type) {
    case 'success': return SuccessIcon
    case 'error': return ErrorIcon
    case 'warning': return WarningIcon
    case 'info': return InfoIcon
    default: return InfoIcon
  }
}

function getTypeClass(type: string) {
  switch (type) {
    case 'success': return 'border-l-4 border-green-400'
    case 'error': return 'border-l-4 border-red-400'
    case 'warning': return 'border-l-4 border-yellow-400'
    case 'info': return 'border-l-4 border-blue-400'
    default: return 'border-l-4 border-blue-400'
  }
}

function addNotification(notification: Omit<Notification, 'id'>) {
  const id = Date.now().toString()
  const newNotification = {
    id,
    duration: 5000,
    ...notification
  }
  
  notifications.value.push(newNotification)
  
  // 自动移除
  if (newNotification.duration && newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }
}

function removeNotification(id: string) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// 全局通知方法
const notificationService = {
  success: (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration })
  },
  error: (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration })
  },
  warning: (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration })
  },
  info: (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration })
  }
}

// 监听全局通知事件
function handleGlobalNotification(event: CustomEvent) {
  addNotification(event.detail)
}

onMounted(() => {
  // 将通知服务挂载到全局
  ;(window as any).notify = notificationService
  
  // 监听全局通知事件
  window.addEventListener('notify', handleGlobalNotification as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('notify', handleGlobalNotification)
})

// 注意：在 <script setup> 中不能使用 export
// 通知服务已通过 window.notify 全局挂载
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
