// AI聊天服务 - 支持DeepSeek和n8n
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'normal' | 'poetry'
}

// 聊天状态
export const chatState = {
  messages: [] as ChatMessage[],
  isLoading: false,
  error: null as string | null
}

// 使用云端AI API
const DEEPSEEK_API_KEY = 'sk-4a55934ecbe04920aced01b92cb38a4b' // DeepSeek API密钥
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'

// 备用：使用 n8n 工作流
const N8N_BASE = 'http://localhost:5678/webhook'
const POETRY_ENDPOINT = `${N8N_BASE}/poetry`

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

  // 设置加载状态
  chatState.isLoading = true
  chatState.error = null

  try {
    console.log('开始调用DeepSeek AI:', content.trim())

    // 优先使用DeepSeek AI
    if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'sk-your-deepseek-api-key') {
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
              content: '你是一位专业的诗词创作AI，擅长创作各种类型的诗词。请根据用户要求创作优美、有意境的诗词。'
            },
            {
              role: 'user',
              content: `请根据以下要求创作一首诗词：${content.trim()}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.8
        })
      })

      console.log('DeepSeek响应状态:', response.status)

      if (!response.ok) {
        throw new Error(`DeepSeek API调用失败: ${response.status}`)
      }

      const data = await response.json()
      console.log('DeepSeek响应数据:', data)

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('DeepSeek API返回数据格式错误')
      }

      const poetry = data.choices[0].message.content

      const poetryMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: poetry,
        timestamp: new Date(),
        type: 'poetry'
      }
      console.log('添加DeepSeek回复:', poetryMessage)
      chatState.messages.push(poetryMessage)
      console.log('最终消息数量:', chatState.messages.length)
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
    chatState.error = error.message || '诗词生成失败'

    // 添加错误提示消息
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '抱歉，诗词生成服务暂时不可用。请检查DeepSeek API密钥配置或n8n工作流状态。',
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
  if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'sk-your-deepseek-api-key') {
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
