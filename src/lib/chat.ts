// AI聊天服务 - 支持DeepSeek和n8n
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'normal' | 'poetry'
}

import { reactive } from 'vue'

// 聊天状态 - 使用reactive确保响应式
export const chatState = reactive({
  messages: [] as ChatMessage[],
  isLoading: false,
  error: null as string | null
})

// 使用云端AI API
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-4a55934ecbe04920aced01b92cb38a4b' // DeepSeek API密钥
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'

// 备用：使用 n8n 工作流
const N8N_BASE = 'http://localhost:5678/webhook'
const POETRY_ENDPOINT = `${N8N_BASE}/poetry`

// 判断是否为诗词创作请求
function isPoetryCreationRequest(content: string): boolean {
  const poetryKeywords = [
    '写诗', '作诗', '创作诗词', '写一首', '作一首', '诗词', '诗歌', '绝句', '律诗', '词',
    '五言', '七言', '古诗', '古风', '唐诗', '宋词', '元曲', '现代诗', '自由诗',
    '押韵', '格律', '平仄', '对仗', '意境', '诗情画意'
  ]
  
  const requestPatterns = [
    /请.*写.*诗/i,
    /请.*作.*诗/i,
    /创作.*诗词/i,
    /写一首.*诗/i,
    /作一首.*诗/i,
    /帮我.*诗/i,
    /想要.*诗/i,
    /需要.*诗/i
  ]
  
  // 检查关键词
  const hasKeyword = poetryKeywords.some(keyword => content.includes(keyword))
  
  // 检查模式
  const hasPattern = requestPatterns.some(pattern => pattern.test(content))
  
  return hasKeyword || hasPattern
}

// 判断内容是否为诗词
function isPoetryContent(content: string): boolean {
  // 诗词特征模式
  const poetryPatterns = [
    // 古典诗词格式
    /^[\u4e00-\u9fa5]{5,7}，[\u4e00-\u9fa5]{5,7}。[\u4e00-\u9fa5]{5,7}，[\u4e00-\u9fa5]{5,7}。$/,
    /^[\u4e00-\u9fa5]{7}，[\u4e00-\u9fa5]{7}。[\u4e00-\u9fa5]{7}，[\u4e00-\u9fa5]{7}。$/,
    // 包含诗词关键词
    /(?:诗|词|绝句|律诗|古风|唐诗|宋词|元曲|现代诗|自由诗)/,
    // 包含诗词标点
    /[，。！？；：]/
  ]
  
  // 检查是否包含诗词格式
  const hasPoetryFormat = poetryPatterns.some(pattern => pattern.test(content))
  
  // 检查行数（诗词通常有固定行数）
  const lines = content.split('\n').filter(line => line.trim())
  const isStructured = lines.length >= 2 && lines.length <= 8
  
  // 检查每行长度（诗词每行通常有固定字数）
  const hasConsistentLength = lines.every(line => {
    const cleanLine = line.replace(/[，。！？；：\s]/g, '')
    return cleanLine.length >= 4 && cleanLine.length <= 14
  })
  
  return hasPoetryFormat || (isStructured && hasConsistentLength)
}

// 发送消息到诗词生成 API
export async function sendMessage(content: string): Promise<void> {
  if (!content.trim()) return

  // 添加用户消息
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date(),
    type: 'normal'
  }
  console.log('添加用户消息:', userMessage)
  chatState.messages.push(userMessage)
  console.log('当前消息数量:', chatState.messages.length)
  console.log('chatState.messages:', chatState.messages)

  // 设置加载状态
  chatState.isLoading = true
  chatState.error = null

  try {
    console.log('开始调用DeepSeek AI:', content.trim())
    console.log('DeepSeek API Key:', DEEPSEEK_API_KEY ? '已配置' : '未配置')

  // 优先使用DeepSeek AI
  if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 20) {
    // 判断用户是否想要创作诗词
    const isPoetryRequest = isPoetryCreationRequest(content.trim())
    
    const systemPrompt = isPoetryRequest 
      ? '你是一位专业的诗词创作AI，擅长创作各种类型的诗词。请根据用户要求创作优美、有意境的诗词。'
      : '你是一位友好的AI助手，擅长诗词文学、古典文化、现代文学等话题。你可以与用户进行日常对话，也可以创作诗词。当用户明确要求创作诗词时，请创作优美的诗词作品。'
    
    const userPrompt = isPoetryRequest 
      ? `请根据以下要求创作一首诗词：${content.trim()}`
      : content.trim()

    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
      })
    })

      console.log('DeepSeek响应状态:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('DeepSeek API错误响应:', errorText)
        throw new Error(`DeepSeek API调用失败: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('DeepSeek响应数据:', data)
      console.log('DeepSeek choices:', data.choices)

      if (!data.choices || !data.choices[0]) {
        console.error('DeepSeek API返回数据格式错误: choices为空')
        throw new Error('DeepSeek API返回数据格式错误: choices为空')
      }

      if (!data.choices[0].message) {
        console.error('DeepSeek API返回数据格式错误: message为空')
        console.log('choices[0]:', data.choices[0])
        throw new Error('DeepSeek API返回数据格式错误: message为空')
      }

      const aiResponse = data.choices[0].message.content
      console.log('AI回复内容:', aiResponse)

      // 判断回复是否为诗词
      const isPoetryResponse = isPoetryContent(aiResponse)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: isPoetryResponse ? 'poetry' : 'normal'
      }
      console.log('添加DeepSeek回复:', aiMessage)
      chatState.messages.push(aiMessage)
      console.log('最终消息数量:', chatState.messages.length)
      console.log('chatState.messages after AI reply:', chatState.messages)
      return
    }

    // 备用：调用 n8n 工作流
    console.log('DeepSeek API未配置，使用n8n工作流:', content.trim())

    const response = await fetch(POETRY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: content.trim()
      })
    })

    console.log('n8n响应状态:', response.status)

    if (!response.ok) {
      throw new Error(`n8n工作流调用失败: ${response.status}`)
    }

    const data = await response.json()
    console.log('n8n响应数据:', data)

    if (!data.success) {
      throw new Error('n8n工作流返回失败状态')
    }

    if (!data.poetry) {
      throw new Error('n8n工作流没有返回诗词内容')
    }

    // 使用n8n返回的诗词
    const poetryMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.poetry,
      timestamp: new Date(),
      type: 'poetry'
    }
    console.log('添加n8n回复:', poetryMessage)
    chatState.messages.push(poetryMessage)
    console.log('最终消息数量:', chatState.messages.length)

  } catch (error: any) {
    console.error('诗词生成失败:', error)
    console.error('错误详情:', error.message)
    console.error('错误堆栈:', error.stack)
    chatState.error = error.message || '诗词生成失败'

    // 添加错误提示消息
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `抱歉，诗词生成失败：${error.message || '未知错误'}。请检查控制台获取详细信息。`,
      timestamp: new Date(),
      type: 'normal'
    }
    chatState.messages.push(errorMessage)
  } finally {
    chatState.isLoading = false
  }
}

// 检查诗词生成服务状态
export async function checkN8NStatus(): Promise<boolean> {
  // 如果DeepSeek API已配置，则认为服务可用
  if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 20) {
    return true
  }
  // 否则检查n8n状态
  try {
    const response = await fetch(`${N8N_BASE}/poetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'test'
      })
    })
    return response.ok
  } catch {
    return false
  }
}

// 清空聊天记录
export function clearMessages(): void {
  chatState.messages = []
  chatState.error = null
}

// 获取消息数量
export function getMessageCount(): number {
  return chatState.messages.length
}

// 测试网络连接
export async function testConnection(): Promise<void> {
  console.log('测试网络连接...')
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 10
      })
    })
    console.log('网络测试响应状态:', response.status)
    if (response.ok) {
      console.log('✅ 网络连接正常')
    } else {
      console.log('❌ 网络连接异常:', response.status)
    }
  } catch (error) {
    console.error('❌ 网络连接失败:', error)
  }
}
