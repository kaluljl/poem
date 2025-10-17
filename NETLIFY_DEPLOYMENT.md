# Netlify 部署配置指南

## 🔧 环境变量配置

在Netlify部署时需要配置以下环境变量：

### 必需的环境变量

1. **Supabase配置**（用于用户认证和数据库）
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **DeepSeek AI配置**（用于AI聊天和诗词创作）
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-deepseek-api-key
   ```

### 📋 在Netlify中配置环境变量的步骤

1. **登录Netlify控制台**
   - 进入你的项目设置

2. **添加环境变量**
   - 点击 "Site settings" → "Environment variables"
   - 点击 "Add variable" 按钮

3. **配置变量**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://your-project.supabase.co
   
   Key: VITE_SUPABASE_ANON_KEY  
   Value: your-anon-key
   
   Key: VITE_DEEPSEEK_API_KEY
   Value: sk-your-deepseek-api-key
   ```

### 🔑 如何获取这些密钥

#### Supabase配置
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目或选择现有项目
3. 在项目设置中找到：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **API Keys** → `anon public` → `VITE_SUPABASE_ANON_KEY`

#### DeepSeek AI配置
1. 访问 [DeepSeek](https://platform.deepseek.com)
2. 注册/登录账户
3. 在API Keys页面创建新的API密钥
4. 复制密钥到 `VITE_DEEPSEEK_API_KEY`

### 🚀 部署步骤

1. **连接GitHub仓库**
   - 在Netlify中连接你的GitHub仓库

2. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **添加环境变量**
   - 按照上述步骤添加所有必需的环境变量

4. **部署**
   - 点击 "Deploy site" 开始部署

### ⚠️ 注意事项

- 环境变量名称必须以 `VITE_` 开头才能在客户端代码中访问
- 确保API密钥的安全性，不要在代码中硬编码
- 部署后可以通过浏览器控制台检查环境变量是否正确加载

### 🔍 验证部署

部署完成后，可以通过以下方式验证：

1. **检查AI功能**
   - 打开AI聊天功能
   - 发送测试消息，确认AI能正常回复

2. **检查用户认证**
   - 尝试登录/注册功能
   - 确认Supabase连接正常

3. **检查控制台**
   - 打开浏览器开发者工具
   - 查看是否有环境变量相关的错误信息

### 🛠️ 故障排除

如果部署后出现问题：

1. **检查环境变量**
   - 确认所有环境变量都已正确配置
   - 检查变量名称是否正确（区分大小写）

2. **检查API密钥**
   - 确认API密钥有效且未过期
   - 检查API配额是否充足

3. **查看构建日志**
   - 在Netlify的构建日志中查看错误信息
   - 确认构建过程没有失败

4. **本地测试**
   - 在本地创建 `.env.local` 文件测试环境变量
   - 确认本地环境能正常工作后再部署

