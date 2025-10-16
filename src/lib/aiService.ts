// AI诗词创作服务
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

// 模拟AI创作服务
export class AIPoetryService {
  private static instance: AIPoetryService
  
  static getInstance(): AIPoetryService {
    if (!AIPoetryService.instance) {
      AIPoetryService.instance = new AIPoetryService()
    }
    return AIPoetryService.instance
  }

  // 生成诗词
  async generatePoetry(request: CreationRequest): Promise<PoemResult[]> {
    // 模拟API调用延迟
    await this.delay(1500 + Math.random() * 1000)
    
    const results: PoemResult[] = []
    const count = Math.floor(Math.random() * 2) + 2 // 生成2-3首
    
    for (let i = 0; i < count; i++) {
      results.push(this.generateSinglePoem(request))
    }
    
    return results
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
    const words = {
      '名词': ['花', '月', '风', '云', '山', '水', '树', '鸟', '心', '情'],
      '动词': ['飞', '流', '照', '吹', '落', '开', '来', '去', '思', '望'],
      '形容词': ['美', '静', '清', '幽', '远', '深', '高', '长', '新', '古']
    }
    
    const wordList = words[type] || words['名词']
    return wordList[Math.floor(Math.random() * wordList.length)]
  }

  // 获取创作灵感
  async getInspiration(): Promise<string[]> {
    await this.delay(500)
    
    const inspirations = [
      '雨后初晴的山林',
      '夕阳西下的古道',
      '月夜下的小桥流水',
      '秋风中的梧桐叶',
      '春日里的桃花源',
      '雪夜中的茅屋',
      '江南水乡的清晨',
      '塞外草原的黄昏',
      '古寺钟声的回响',
      '渔舟唱晚的湖面'
    ]
    
    // 随机返回3-5个灵感
    const count = Math.floor(Math.random() * 3) + 3
    const selected = []
    const used = new Set()
    
    while (selected.length < count) {
      const index = Math.floor(Math.random() * inspirations.length)
      if (!used.has(index)) {
        used.add(index)
        selected.push(inspirations[index])
      }
    }
    
    return selected
  }

  // 查找押韵字
  async findRhymes(word: string): Promise<RhymeResult> {
    await this.delay(300)
    
    const rhymeMap = {
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

  // 检查韵律
  async checkRhyme(content: string): Promise<{
    isValid: boolean
    suggestions: string[]
    analysis: string
  }> {
    await this.delay(800)
    
    // 简单的韵律检查逻辑
    const lines = content.split('\n').filter(line => line.trim())
    const suggestions = []
    
    if (lines.length === 4) {
      // 绝句检查
      suggestions.push('建议第二句和第四句押韵')
      suggestions.push('注意平仄搭配，避免三平调')
    } else if (lines.length === 8) {
      // 律诗检查
      suggestions.push('颔联和颈联需要对仗')
      suggestions.push('首联可对可不对，尾联一般不对仗')
    }
    
    return {
      isValid: Math.random() > 0.3, // 随机返回是否符合韵律
      suggestions,
      analysis: '整体韵律基本符合要求，建议注意平仄搭配。'
    }
  }

  // 工具方法：延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例实例
export const aiService = AIPoetryService.getInstance()
