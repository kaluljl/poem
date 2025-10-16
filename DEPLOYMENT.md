# 诗境雅集 - 部署指南

## 环境要求

- Node.js >= 20.19.0
- npm 或 yarn
- Supabase 账号

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd poetry-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FUNCTION_URL=your_supabase_functions_url
```

### 4. 设置 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL 编辑器中执行 `supabase-schema.sql` 中的所有SQL语句
3. 启用认证功能
4. 配置存储桶（用于头像上传）

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 6. 构建生产版本

```bash
npm run build
```

## Supabase 配置详情

### 数据库表结构

执行 `supabase-schema.sql` 将创建以下表：

- `user_profiles` - 用户配置信息
- `classic_poems` - 经典诗词库
- `user_poems` - 用户创作的诗词
- `poem_likes` - 诗词点赞记录
- `poem_collections` - 诗词收藏记录
- `poem_comments` - 诗词评论
- `user_follows` - 用户关注关系
- `creation_challenges` - 创作挑战
- `challenge_participations` - 挑战参与记录
- `notifications` - 系统通知

### 认证设置

1. 在 Supabase 控制台的 Authentication > Settings 中：
   - 启用 Email 认证
   - 可选：启用 Google、GitHub 等第三方登录
   - 设置重定向 URL

2. 在 Authentication > URL Configuration 中添加：
   - Site URL: `http://localhost:5173` (开发环境)
   - Redirect URLs: `http://localhost:5173/auth/callback`

### 存储设置

1. 在 Storage 中创建 `avatars` 存储桶
2. 设置存储桶为公开访问
3. 配置 RLS 策略允许用户上传和访问头像

### Row Level Security (RLS) 策略

数据库表已配置了 RLS 策略，确保：
- 用户只能访问自己的私有数据
- 公开内容对所有人可见
- 适当的权限控制

## 部署到生产环境

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Netlify 部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录上传到 Netlify
3. 配置环境变量
4. 设置重定向规则

### 自托管部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置 Nginx 或 Apache
4. 设置 HTTPS

## 功能特性

### ✨ AI 创作功能
- 多种创作模式（AI辅助、模板填词、灵感激发）
- 智能诗词生成
- 韵律检查和押韵查询
- 创作历史管理

### 📚 诗词管理
- 经典诗词库浏览
- 用户作品管理
- 收藏和点赞功能
- 作品分享和导出

### 🌸 社区互动
- 作品发布和展示
- 评论和互动
- 用户关注系统
- 创作挑战活动

### 👤 用户系统
- 邮箱注册登录
- 第三方登录支持
- 个人资料管理
- 头像上传功能

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **状态管理**: Pinia
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage

## 开发指南

### 项目结构

```
src/
├── components/     # 可复用组件
├── views/         # 页面组件
├── lib/           # 工具库和服务
├── assets/        # 静态资源
└── main.ts        # 应用入口
```

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 和 Prettier 进行代码格式化
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 故障排除

### 常见问题

1. **Supabase 连接失败**
   - 检查环境变量配置
   - 确认 Supabase 项目状态
   - 验证 API 密钥权限

2. **认证问题**
   - 检查重定向 URL 配置
   - 确认认证提供商设置
   - 验证 RLS 策略

3. **构建失败**
   - 清除 node_modules 重新安装
   - 检查 Node.js 版本兼容性
   - 验证依赖版本

### 获取帮助

- 查看 [Supabase 文档](https://supabase.com/docs)
- 查看 [Vue 3 文档](https://vuejs.org/guide/)
- 提交 Issue 到项目仓库

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。
