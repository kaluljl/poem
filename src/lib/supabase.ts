// Supabase 客户端初始化（Vite 环境变量）
// 将你的 URL 和 ANON KEY 放到 .env.local：
// VITE_SUPABASE_URL="https://xxxxx.supabase.co"
// VITE_SUPABASE_ANON_KEY="xxxxxx"
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string || 'https://placeholder.supabase.co'
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder_anon_key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  // 开发期提示，避免生产暴露
  console.warn('[Supabase] 缺少环境变量 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY，使用占位符值')
  console.warn('[Supabase] 请创建 .env.local 文件并配置正确的 Supabase 凭据')
}

export const supabase = createClient(url, anonKey)