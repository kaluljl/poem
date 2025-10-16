import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  // 其他路由可以根据需要添加
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router