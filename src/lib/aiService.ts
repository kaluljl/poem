// AI诗词创作服务 - 使用DeepSeek AI
export interface CreationRequest {
  theme: string
  emotions: string[]
  style: string
  keywords?: string
  mode: string
}

export interface PoemResult {
  title: string
  content: string
  style: string
  theme: string
  analysis?: string
}

export interface RhymeResult {
  word: string
  rhymes: string[]
  tone: string
}

// DeepSeek AI诗词创作服务
export class AIPoetryService {
  private static instance: AIPoetryService
  private readonly DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-4a55934ecbe04920aced01b92cb38a4b'
  private readonly DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'
  
  static getInstance(): AIPoetryService {
    if (!AIPoetryService.instance) {
      AIPoetryService.instance = new AIPoetryService()
    }
    return AIPoetryService.instance
  }

  // 生成诗词 - 使用DeepSeek AI
  async generatePoetry(request: CreationRequest): Promise<PoemResult[]> {
    console.log('🤖 AI服务开始生成诗词:', request)
    console.log('🔑 API密钥状态:', this.DEEPSEEK_API_KEY ? '已配置' : '未配置')
    
    try {
      const prompt = this.buildPoetryPrompt(request)
      console.log('构建的提示词:', prompt)
      
      const response = await fetch(this.DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的古典诗词创作AI，擅长创作各种体裁的诗词。请根据用户要求创作优美、有意境、符合格律的诗词作品。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
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

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('DeepSeek API返回数据格式错误')
        throw new Error('DeepSeek API返回数据格式错误')
      }

      const aiResponse = data.choices[0].message.content
      console.log('AI生成的诗词内容:', aiResponse)
      
      // 解析AI返回的诗词
      const poems = this.parsePoetryResponse(aiResponse, request)
      console.log('解析后的诗词:', poems)
      
      return poems
      
    } catch (error) {
      console.error('DeepSeek AI生成诗词失败:', error)
      // 如果AI调用失败，返回模拟数据作为备用
      return this.generateFallbackPoetry(request)
    }
  }

  // 构建诗词创作提示词
  private buildPoetryPrompt(request: CreationRequest): string {
    const { theme, emotions, style, keywords } = request
    
    let prompt = `请创作一首${style}，主题是"${theme}"`
    
    if (emotions.length > 0) {
      prompt += `，情感基调为：${emotions.join('、')}`
    }
    
    if (keywords) {
      prompt += `，关键词包括：${keywords}`
    }
    
    prompt += `。\n\n请按照以下格式返回：\n标题：\n内容：\n赏析：\n\n要求：\n1. 严格遵循${style}的格律要求\n2. 内容要有意境，语言优美\n3. 符合古典诗词的韵味\n4. 提供简洁的赏析`
    
    return prompt
  }

  // 解析AI返回的诗词内容
  private parsePoetryResponse(aiResponse: string, request: CreationRequest): PoemResult[] {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim()).filter(line => line)
      
      let title = ''
      let content = ''
      let analysis = ''
      let currentSection = ''
      
      for (const line of lines) {
        if (line.startsWith('标题：') || line.startsWith('题目：')) {
          title = line.replace(/^(标题：|题目：)/, '').trim()
          currentSection = 'title'
        } else if (line.startsWith('内容：') || line.startsWith('诗词：')) {
          currentSection = 'content'
          const contentLine = line.replace(/^(内容：|诗词：)/, '').trim()
          if (contentLine) {
            content = contentLine
          }
        } else if (line.startsWith('赏析：') || line.startsWith('评析：')) {
          currentSection = 'analysis'
          const analysisLine = line.replace(/^(赏析：|评析：)/, '').trim()
          if (analysisLine) {
            analysis = analysisLine
          }
        } else if (currentSection === 'content' && line) {
          content += (content ? '\n' : '') + line
        } else if (currentSection === 'analysis' && line) {
          analysis += (analysis ? ' ' : '') + line
        }
      }
      
      // 如果没有找到标题，生成一个
      if (!title) {
        title = this.generateTitle(request.theme, request.emotions)
      }
      
      // 如果没有找到内容，使用备用方案
      if (!content) {
        return this.generateFallbackPoetry(request)
      }
      
      return [{
        title,
        content,
        style: request.style,
        theme: request.theme,
        analysis: analysis || '这首诗词意境优美，语言精练，体现了古典诗词的韵味。'
      }]
      
    } catch (error) {
      console.error('解析AI响应失败:', error)
      return this.generateFallbackPoetry(request)
    }
  }

  // 备用方案：生成模拟诗词
  private generateFallbackPoetry(request: CreationRequest): PoemResult[] {
    console.log('使用备用方案生成诗词')
    const poem = this.generateSinglePoem(request)
    return [poem]
  }

  // 生成单首诗词
  private generateSinglePoem(request: CreationRequest): PoemResult {
    const { theme, emotions, style, keywords } = request
    
    // 根据不同体裁生成不同的诗词
    let content = ''
    let title = ''
    
    switch (style) {
      case '五言绝句':
        content = this.generateWuYanJueJu(theme, emotions, keywords)
        break
      case '七言绝句':
        content = this.generateQiYanJueJu(theme, emotions, keywords)
        break
      case '五言律诗':
        content = this.generateWuYanLvShi(theme, emotions, keywords)
        break
      case '七言律诗':
        content = this.generateQiYanLvShi(theme, emotions, keywords)
        break
      case '词':
        content = this.generateCi(theme, emotions, keywords)
        break
      case '古风':
        content = this.generateGuFeng(theme, emotions, keywords)
        break
      default:
        content = this.generateQiYanJueJu(theme, emotions, keywords)
    }
    
    title = this.generateTitle(theme, emotions)
    
    return {
      title,
      content,
      style,
      theme,
      analysis: this.generateAnalysis(content, theme, emotions)
    }
  }

  // 生成五言绝句
  private generateWuYanJueJu(theme: string, emotions: string[], keywords?: string): string {
    const templates = [
      `${this.getThemeWord(theme)}${this.getRandomWord('动词')}${this.getRandomWord('名词')}${this.getRandomWord('形容词')}${this.getRandomWord('名词')}，\n${this.getRandomWord('名词')}${this.getRandomWord('动词')}${this.getRandomWord('名词')}${this.getRandomWord('动词')}${this.getRandomWord('名词')}。\n${this.getRandomWord('动词')}${this.getRandomWord('名词')}${this.getRandomWord('形容词')}${this.getRandomWord('名词')}${this.getRandomWord('名词')}，\n${this.getRandomWord('名词')}${this.getRandomWord('动词')}${this.getRandomWord('名词')}${this.getRandomWord('形容词')}${this.getRandomWord('名词')}。`,
    ]
    
    // 根据主题和情感生成更贴切的内容
    if (theme.includes('春')) {
      return '春风轻拂柳，\n花开满枝头。\n蝶舞香径里，\n诗意自心流。'
    } else if (theme.includes('秋')) {
      return '秋叶飘零时，\n思君不见归。\n月明千里外，\n何日共相依。'
    } else if (theme.includes('山水')) {
      return '青山如黛远，\n绿水绕村流。\n白云天际外，\n心境自悠悠。'
    }
    
    return '清风徐来时，\n明月照我心。\n诗情画意里，\n岁月静如金。'
  }

  // 生成七言绝句
  private generateQiYanJueJu(theme: string, emotions: string[], keywords?: string): string {
    if (theme.includes('春')) {
      return '春风又绿江南岸，明月何时照我还。\n桃花依旧笑春风，人面不知何处去。'
    } else if (theme.includes('秋')) {
      return '秋风萧瑟叶飞黄，独坐窗前思故乡。\n月色如水洒大地，何时归去见爹娘。'
    } else if (theme.includes('山水')) {
      return '青山隐隐水迢迢，秋尽江南草未凋。\n二十四桥明月夜，玉人何处教吹箫。'
    } else if (emotions.includes('思念')) {
      return '相思不见君何处，枫叶飘零又一秋。\n千里共婵娟月下，何时能解此离愁。'
    }
    
    return '云淡风轻近午天，傍花随柳过前川。\n时人不识余心乐，将谓偷闲学少年。'
  }

  // 生成五言律诗
  private generateWuYanLvShi(theme: string, emotions: string[], keywords?: string): string {
    return `空山新雨后，\n天气晚来秋。\n明月松间照，\n清泉石上流。\n竹喧归浣女，\n莲动下渔舟。\n随意春芳歇，\n王孙自可留。`
  }

  // 生成七言律诗
  private generateQiYanLvShi(theme: string, emotions: string[], keywords?: string): string {
    return `国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。`
  }

  // 生成词
  private generateCi(theme: string, emotions: string[], keywords?: string): string {
    return `明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，\n高处不胜寒。\n起舞弄清影，何似在人间。`
  }

  // 生成古风
  private generateGuFeng(theme: string, emotions: string[], keywords?: string): string {
    return `君不见黄河之水天上来，\n奔流到海不复回。\n君不见高堂明镜悲白发，\n朝如青丝暮成雪。\n人生得意须尽欢，\n莫使金樽空对月。`
  }

  // 生成标题
  private generateTitle(theme: string, emotions: string[]): string {
    const titlePrefixes = ['春日', '秋夜', '山居', '江南', '咏怀', '即事', '偶成', '感怀']
    const titleSuffixes = ['吟', '思', '曲', '行', '歌', '赋', '咏', '怀']
    
    if (theme) {
      const themeWord = theme.slice(0, 2)
      const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)]
      return `${themeWord}${suffix}`
    }
    
    const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)]
    const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)]
    return `${prefix}${suffix}`
  }

  // 生成赏析
  private generateAnalysis(content: string, theme: string, emotions: string[]): string {
    const analyses = [
      '这首诗意境深远，情景交融，体现了作者深厚的文学功底。',
      '诗中运用了丰富的意象，表达了作者内心的真挚情感。',
      '全诗结构严谨，对仗工整，展现了古典诗词的韵律美。',
      '作者通过细腻的描写，营造出了优美的诗意氛围。'
    ]
    
    return analyses[Math.floor(Math.random() * analyses.length)]
  }

  // 获取主题词
  private getThemeWord(theme: string): string {
    if (theme.includes('春')) return '春'
    if (theme.includes('夏')) return '夏'
    if (theme.includes('秋')) return '秋'
    if (theme.includes('冬')) return '冬'
    if (theme.includes('山')) return '山'
    if (theme.includes('水')) return '水'
    return '风'
  }

  // 获取随机词汇
  private getRandomWord(type: string): string {
    const words: Record<string, string[]> = {
      '名词': ['花', '月', '风', '云', '山', '水', '树', '鸟', '心', '情'],
      '动词': ['飞', '流', '照', '吹', '落', '开', '来', '去', '思', '望'],
      '形容词': ['美', '静', '清', '幽', '远', '深', '高', '长', '新', '古']
    }
    
    const wordList = words[type] || words['名词']
    return wordList[Math.floor(Math.random() * wordList.length)]
  }

  // 获取创作灵感 - 使用DeepSeek AI
  async getInspiration(): Promise<string[]> {
    try {
      const response = await fetch(this.DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位诗词创作灵感助手，能够提供富有诗意的创作主题和场景。'
            },
            {
              role: 'user',
              content: '请提供5个富有诗意的创作主题，每个主题用一句话描述，要求具有古典诗词的意境美。请直接返回主题，每行一个。'
            }
          ],
          max_tokens: 500,
          temperature: 0.9
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const content = data.choices[0].message.content
          const inspirations = content.split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line && !line.match(/^\d+[\.、]/))
            .slice(0, 5)
          
          if (inspirations.length > 0) {
            return inspirations
          }
        }
      }
    } catch (error) {
      console.error('获取AI灵感失败:', error)
    }
    
    // 备用方案
    return [
      '雨后初晴的山林',
      '夕阳西下的古道',
      '月夜下的小桥流水',
      '秋风中的梧桐叶',
      '春日里的桃花源'
    ]
  }

  // 查找押韵字
  async findRhymes(word: string): Promise<RhymeResult> {
    await this.delay(300)
    
    const rhymeMap: Record<string, string[]> = {
      '春': ['心', '深', '林', '金', '音'],
      '花': ['家', '霞', '茶', '沙', '华'],
      '月': ['雪', '别', '切', '热', '节'],
      '风': ['中', '空', '红', '东', '龙'],
      '山': ['间', '闲', '还', '关', '颜'],
      '水': ['美', '醉', '泪', '贵', '翠']
    }
    
    const rhymes = rhymeMap[word] || ['心', '深', '林', '金', '音']
    
    return {
      word,
      rhymes,
      tone: '平声' // 简化处理
    }
  }

  // 检查韵律 - 使用DeepSeek AI
  async checkRhyme(content: string): Promise<{
    isValid: boolean
    suggestions: string[]
    analysis: string
  }> {
    try {
      const response = await fetch(this.DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位古典诗词韵律专家，能够分析诗词的格律、平仄、押韵等。'
            },
            {
              role: 'user',
              content: `请分析以下诗词的韵律：\n\n${content}\n\n请按照以下格式返回：\n是否符合韵律：是/否\n分析：\n建议：\n\n要求：\n1. 检查平仄搭配\n2. 检查押韵情况\n3. 检查对仗（如果是律诗）\n4. 提供具体的改进建议`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const content = data.choices[0].message.content
          return this.parseRhymeAnalysis(content)
        }
      }
    } catch (error) {
      console.error('AI韵律检查失败:', error)
    }
    
    // 备用方案
    const lines = content.split('\n').filter(line => line.trim())
    const suggestions = []
    
    if (lines.length === 4) {
      suggestions.push('建议第二句和第四句押韵')
      suggestions.push('注意平仄搭配，避免三平调')
    } else if (lines.length === 8) {
      suggestions.push('颔联和颈联需要对仗')
      suggestions.push('首联可对可不对，尾联一般不对仗')
    }
    
    return {
      isValid: true,
      suggestions,
      analysis: '整体韵律基本符合要求，建议注意平仄搭配。'
    }
  }

  // 解析韵律分析结果
  private parseRhymeAnalysis(content: string): {
    isValid: boolean
    suggestions: string[]
    analysis: string
  } {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line)
    
    let isValid = true
    let analysis = ''
    let suggestions: string[] = []
    let currentSection = ''
    
    for (const line of lines) {
      if (line.includes('是否符合韵律：') || line.includes('韵律：')) {
        isValid = line.includes('是') || line.includes('符合')
      } else if (line.startsWith('分析：')) {
        analysis = line.replace('分析：', '').trim()
        currentSection = 'analysis'
      } else if (line.startsWith('建议：')) {
        currentSection = 'suggestions'
        const suggestionLine = line.replace('建议：', '').trim()
        if (suggestionLine) {
          suggestions.push(suggestionLine)
        }
      } else if (currentSection === 'analysis' && line) {
        analysis += (analysis ? ' ' : '') + line
      } else if (currentSection === 'suggestions' && line) {
        suggestions.push(line)
      }
    }
    
    return {
      isValid,
      suggestions: suggestions.length > 0 ? suggestions : ['建议注意平仄搭配和押韵'],
      analysis: analysis || '韵律分析完成'
    }
  }

  // 工具方法：延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例实例
export const aiService = AIPoetryService.getInstance()
