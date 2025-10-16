# 🚀 Supabase 配置指南

## 第一步：创建 Supabase 项目

1. **访问 Supabase**
   - 打开 [https://supabase.com](https://supabase.com)
   - 点击 "Start your project"

2. **登录账号**
   - 使用 GitHub 账号登录（推荐）
   - 或者创建新的 Supabase 账号

3. **创建新项目**
   - 点击 "New Project"
   - 选择组织（如果是第一次使用，会自动创建）
   - 输入项目信息：
     - **Name**: `poetry-ai-platform`
     - **Database Password**: 设置一个强密码（请记住）
     - **Region**: 选择离您最近的地区
   - 点击 "Create new project"

4. **等待项目初始化**
   - 项目创建需要1-2分钟
   - 等待状态变为 "Project is ready"

## 第二步：获取项目配置

1. **进入项目设置**
   - 在项目仪表板中，点击左侧边栏的 "Settings"
   - 点击 "API" 选项卡

2. **复制配置信息**
   - **Project URL**: 复制 "Project URL"（类似：`https://xxxxx.supabase.co`）
   - **API Key**: 复制 "anon public" key（很长的字符串）

## 第三步：配置环境变量

1. **创建环境文件**
   在项目根目录创建 `.env.local` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **替换占位符**
   - 将 `https://your-project-id.supabase.co` 替换为您的实际 Project URL
   - 将 `your-anon-key-here` 替换为您的实际 anon public key

## 第四步：设置数据库

1. **打开 SQL 编辑器**
   - 在 Supabase 项目中，点击左侧的 "SQL Editor"
   - 点击 "New query"

2. **执行数据库脚本**
   - 打开项目中的 `supabase-schema.sql` 文件
   - 复制所有 SQL 语句
   - 粘贴到 Supabase SQL 编辑器中
   - 点击 "Run" 按钮执行

3. **验证表创建**
   - 点击左侧的 "Table Editor"
   - 应该能看到以下表：
     - `profiles` - 用户资料
     - `poems` - 诗词作品
     - `community_posts` - 社区帖子
     - `likes` - 点赞记录
     - `comments` - 评论
     - `tags` - 标签

## 第五步：启用认证

1. **配置认证设置**
   - 点击左侧的 "Authentication"
   - 点击 "Settings" 选项卡
   - 在 "Site URL" 中添加：`http://localhost:5173`

2. **启用邮箱认证**
   - 在 "Auth Providers" 中确保 "Email" 已启用
   - 可选：启用 Google、GitHub 等第三方登录

## 第六步：测试连接

1. **重启开发服务器**
```bash
npm run dev
```

2. **测试功能**
   - 访问 http://localhost:5173
   - 点击 "登录" 按钮
   - 尝试注册新账号
   - 如果没有错误，说明配置成功！

## 🔧 常见问题

### 问题1：CORS 错误
**解决方案**：
- 在 Supabase Dashboard > Authentication > Settings
- 在 "Site URL" 中添加 `http://localhost:5173`

### 问题2：环境变量不生效
**解决方案**：
- 确保 `.env.local` 文件在项目根目录
- 重启开发服务器 (`npm run dev`)
- 检查变量名是否正确（必须以 `VITE_` 开头）

### 问题3：数据库连接失败
**解决方案**：
- 检查 Project URL 和 API Key 是否正确
- 确保项目状态为 "Active"
- 检查网络连接

## 📞 获取帮助

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 检查 Supabase 项目状态
3. 参考 [Supabase 官方文档](https://supabase.com/docs)

配置完成后，您就可以享受完整的诗词AI创作平台功能了！🎉
