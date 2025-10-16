// 在浏览器控制台中测试 Supabase 连接
import { supabase } from '../lib/supabase.js'

export async function testSupabaseConnection() {
  console.log('🔍 开始测试 Supabase 连接...')
  
  try {
    // 1. 测试基本连接
    console.log('1️⃣ 测试基本连接...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('poems')
      .select('count', { count: 'exact', head: true })
    
    if (healthError) {
      console.error('❌ 连接失败:', healthError)
      return false
    }
    console.log('✅ 基本连接成功')
    
    // 2. 测试认证系统
    console.log('2️⃣ 测试认证系统...')
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ 认证系统错误:', sessionError)
    } else {
      console.log('✅ 认证系统正常')
    }
    
    // 3. 测试数据读取
    console.log('3️⃣ 测试数据读取...')
    const { data: poems, error: poemsError } = await supabase
      .from('poems')
      .select('*')
      .limit(3)
    
    if (poemsError) {
      console.error('❌ 数据读取失败:', poemsError)
    } else {
      console.log('✅ 数据读取成功，找到', poems?.length || 0, '条记录')
      console.log('示例数据:', poems)
    }
    
    // 4. 测试表结构
    console.log('4️⃣ 检查表结构...')
    const tables = ['poems', 'user_poems', 'user_profiles', 'creation_challenges']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.warn(`⚠️ 表 ${table} 访问受限:`, error.message)
      } else {
        console.log(`✅ 表 ${table} 正常`)
      }
    }
    
    console.log('🎉 Supabase 连接测试完成！')
    return true
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error)
    return false
  }
}

// 如果在浏览器中运行，自动执行测试
if (typeof window !== 'undefined') {
  window.testSupabase = testSupabaseConnection
  console.log('💡 在控制台中输入 testSupabase() 来测试连接')
}
