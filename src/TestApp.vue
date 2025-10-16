<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px;">
    <!-- 简单的头部 -->
    <header style="background: white; padding: 1rem; border-radius: 10px; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="color: #d97706; font-size: 1.5rem; margin: 0;">📜 诗境雅集</h1>
        <button 
          @click="showModal = true"
          style="background: #d97706; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;"
        >
          登录
        </button>
      </div>
    </header>

    <!-- 主要内容 -->
    <main style="background: white; padding: 2rem; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #374151; margin-bottom: 1rem;">AI诗词创作平台</h2>
      <p style="color: #6b7280; margin-bottom: 2rem;">在这里，传统诗词与现代AI相遇<br>让每一个人都能体验诗词创作的美妙</p>
      
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button style="background: #d97706; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          ✨ 开始AI创作
        </button>
        <button style="background: #f3f4f6; color: #374151; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          📚 欣赏经典
        </button>
      </div>
    </main>

    <!-- 登录弹窗 -->
    <div 
      v-if="showModal" 
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;"
      @click="showModal = false"
    >
      <div 
        style="background: white; padding: 2rem; border-radius: 10px; width: 90%; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);"
        @click.stop
      >
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📜</div>
          <h3 style="color: #374151; margin: 0;">欢迎回来</h3>
          <p style="color: #6b7280; margin: 0.5rem 0 0 0;">继续您的诗词之旅</p>
        </div>

        <form style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; color: #374151; margin-bottom: 0.5rem; font-weight: 500;">邮箱地址</label>
            <input 
              type="email" 
              placeholder="输入您的邮箱"
              style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 5px; font-size: 1rem;"
            >
          </div>
          
          <div>
            <label style="display: block; color: #374151; margin-bottom: 0.5rem; font-weight: 500;">密码</label>
            <input 
              type="password" 
              placeholder="输入您的密码"
              style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 5px; font-size: 1rem;"
            >
          </div>

          <button 
            type="submit"
            style="background: #d97706; color: white; padding: 0.75rem; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; margin-top: 0.5rem;"
          >
            登录
          </button>
        </form>

        <div style="text-align: center; margin-top: 1rem;">
          <span style="color: #6b7280;">还没有账号？</span>
          <a href="#" style="color: #d97706; text-decoration: none; font-weight: 500;">立即注册</a>
        </div>

        <button 
          @click="showModal = false"
          style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
</script>
