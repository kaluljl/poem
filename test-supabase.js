// 测试 Supabase 连接
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zluhmhtfbtmlnyyxoivx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdWhtaHRmYnRtbG55eXhvaXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDk2NjUsImV4cCI6MjA3NjA4NTY2NX0.EFORx5peRTRHfK6kPUhkzDlMVgE5Ir90YWp_QepDRV4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('测试 Supabase 连接...')
    
    // 测试基本连接
    const { data, error } = await supabase
      .from('poems')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('连接错误:', error)
    } else {
      console.log('✅ Supabase 连接成功!')
      console.log('poems 表记录数:', data)
    }
    
    // 测试认证
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.error('认证错误:', authError)
    } else {
      console.log('✅ 认证系统正常')
    }
    
  } catch (err) {
    console.error('测试失败:', err)
  }
}

testConnection()
