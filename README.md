# 诗光词影（MVP）- Vue 3 + Vite

本项目已按“.cursorrules”规范完成架构调整：
- 技术栈：Vue 3 + Vite + TypeScript
- 路由：Vue Router（src/router）
- 状态管理：Pinia（src/store）
- 入口：main.ts（index.html 引用 /src/main.ts）
- 别名：@ 指向 src（见 vite.config.js）
- 开发范式：Composition API + SFC

## 快速开始
```sh
npm install
npm run dev
```

## 目录结构
- src/main.ts：应用入口，注册 Pinia 与 Router
- src/router/index.ts：路由配置，内置 Home 路由
- src/store/index.ts：Pinia 示例 store
- src/views/HomeView.vue：示例页面
- src/env.d.ts：Vue SFC 类型声明
- vite.config.js：Vite 配置与 @ 别名

## 开发约定
- 使用 Composition API（<script setup lang="ts">）
- 组件化、可复用、注意注释与错误处理
- 后续可按 PRD 扩展诗词库、检索、个人空间等模块

## 构建与预览
```sh
npm run build
npm run preview