<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 页面头部 -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span class="text-3xl mr-3">✨</span>
              AI创作工坊
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">让AI成为您的诗词创作伙伴</p>
          </div>
          <button 
            @click="$emit('navigate', 'home')"
            class="btn btn-outline"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：创作面板 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- AI状态指示 -->
          <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <div style="width: 40px; height: 40px; background: linear-gradient(to bottom right, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                  <span style="color: white; font-size: 18px; font-weight: bold;">AI</span>
                </div>
                <div>
                  <div style="font-weight: 600; color: #1f2937; font-size: 16px;">DeepSeek AI 创作引擎</div>
                  <div style="color: #6b7280; font-size: 14px;">智能诗词创作，支持多种体裁和风格</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; color: #10b981; font-size: 14px; font-weight: 500;">
                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite;"></div>
                在线
              </div>
            </div>
          </div>

          <!-- AI接龙 面板 -->
          <div v-if="selectedMode==='ai-collab'" class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">🤝</span>
              与AI接龙创作
              <span style="margin-left: 12px; padding: 2px 10px; background: rgba(59,130,246,.08); color:#2563eb; border-radius: 999px; font-size: 12px; border:1px solid rgba(59,130,246,.25)">Beta</span>
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">接龙上下文</label>
                <textarea v-model="relayContext" rows="6" class="input" placeholder="可粘贴你已写的句子；也可留空从主题开始"></textarea>
                <p class="text-xs text-gray-500 mt-1">AI会在此基础上续写，保持体裁与意境一致</p>
              </div>
              <div class="flex items-center gap-3">
                <button @click="relayNext" :disabled="!creationForm.style || isGenerating"
                        style="padding: 10px 16px; border-radius: 10px; border:none; color:#fff; background:linear-gradient(to right,#3b82f6,#8b5cf6); font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(59,130,246,.3)"
                        :style="{ opacity: (!creationForm.style || isGenerating) ? 0.5 : 1, cursor: (!creationForm.style || isGenerating) ? 'not-allowed' : 'pointer' }">
                  让AI续写一句
                </button>
                <span class="text-xs text-gray-500">体裁以“创作参数”的选择为准</span>
              </div>
              <div v-if="relayLines.length" class="space-y-2">
                <div class="text-sm text-gray-500">已续写</div>
                <div v-for="(line,i) in relayLines" :key="i" class="px-3 py-2 rounded border border-gray-200 dark:border-gray-600">{{ line }}</div>
              </div>
              <div class="flex gap-3 pt-2">
                <button @click="() => { generatedPoems.splice(0,generatedPoems.length, { title: creationForm.theme || '接龙成稿', content: relayContext, style: creationForm.style, theme: creationForm.theme, analysis: '' }); }"
                        :disabled="!relayContext"
                        style="padding: 10px 16px; border-radius: 10px; border:none; color:#fff; background:linear-gradient(to right,#10b981,#34d399); font-weight:600; cursor:pointer"
                        :style="{ opacity: relayContext ? 1 : 0.5, cursor: relayContext ? 'pointer':'not-allowed' }">
                  合并为成稿
                </button>
                <button @click="() => { relayContext=''; relayLines.splice(0); }" class="btn btn-outline">清空接龙</button>
              </div>
            </div>
          </div>

          <!-- 创作模式选择 -->
          <div class="card p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <span class="text-2xl mr-2">🎨</span>
              创作模式
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                v-for="mode in creationModes" 
                :key="mode.id"
                @click="selectedMode = mode.id"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-left group',
                  selectedMode === mode.id 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                ]"
              >
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ mode.icon }}</div>
                <div class="font-medium text-sm">{{ mode.name }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ mode.desc }}</div>
              </button>
            </div>
          </div>

          <!-- 创作参数设置 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4">创作参数</h3>
            
            <div class="space-y-6">
              <!-- 主题输入 -->
              <div>
                <label class="block text-sm font-medium mb-2">创作主题</label>
                <input 
                  v-model="creationForm.theme"
                  type="text" 
                  placeholder="例如：春日踏青、思君不见、山水田园..."
                  class="input"
                />
                <p class="text-xs text-gray-500 mt-1">描述您想要表达的主题或场景</p>
              </div>

              <!-- 情感基调 -->
              <div>
                <label class="block text-sm font-medium mb-2">情感基调</label>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; position: relative; z-index: 1;">
                  <button 
                    v-for="emotion in emotions" 
                    :key="emotion"
                    @click="toggleEmotion(emotion)"
                    :style="{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: creationForm.emotions.includes(emotion) ? '#e9d5ff' : '#f3f4f6',
                      color: creationForm.emotions.includes(emotion) ? '#7c3aed' : '#374151',
                      borderColor: creationForm.emotions.includes(emotion) ? '#a855f7' : '#d1d5db',
                      zIndex: 10,
                      position: 'relative'
                    }"
                    @mouseover="$event.target.style.backgroundColor = creationForm.emotions.includes(emotion) ? '#d8b4fe' : '#e5e7eb'"
                    @mouseout="$event.target.style.backgroundColor = creationForm.emotions.includes(emotion) ? '#e9d5ff' : '#f3f4f6'"
                  >
                    {{ emotion }}
                  </button>
                </div>
              </div>

              <!-- 诗词体裁 -->
              <div>
                <label class="block text-sm font-medium mb-2">诗词体裁</label>
                <select 
                  v-model="creationForm.style"
                  class="input"
                >
                  <option value="">请选择体裁</option>
                  <option value="五言绝句">五言绝句</option>
                  <option value="七言绝句">七言绝句</option>
                  <option value="五言律诗">五言律诗</option>
                  <option value="七言律诗">七言律诗</option>
                  <option value="词">词</option>
                  <option value="古风">古风</option>
                </select>
              </div>

              <!-- 关键意象 -->
              <div>
                <label class="block text-sm font-medium mb-2">关键意象（可选）</label>
                <input 
                  v-model="creationForm.keywords"
                  type="text" 
                  placeholder="例如：明月、青山、流水、梧桐..."
                  class="input"
                />
                <p class="text-xs text-gray-500 mt-1">用逗号分隔多个关键词</p>
              </div>

              <!-- 创作按钮 -->
              <div class="flex gap-3 pt-4">
                <button 
                  @click="() => { console.log('🖱️ 按钮被点击了!'); generatePoetry(); }"
                  :disabled="isGenerating || !canGenerate"
                  style="flex: 1; padding: 12px 24px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);"
                  :style="{ 
                    opacity: (isGenerating || !canGenerate) ? 0.5 : 1,
                    cursor: (isGenerating || !canGenerate) ? 'not-allowed' : 'pointer',
                    transform: (isGenerating || !canGenerate) ? 'none' : 'translateY(0)'
                  }"
                  @mouseover="!isGenerating && canGenerate && ($event.target.style.transform = 'translateY(-2px)'); !isGenerating && canGenerate && ($event.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)')"
                  @mouseout="!isGenerating && canGenerate && ($event.target.style.transform = 'translateY(0)'); !isGenerating && canGenerate && ($event.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)')"
                >
                  <span v-if="isGenerating" style="display: flex; align-items: center; justify-content: center;">
                    <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    🤖 AI创作中...
                  </span>
                  <span v-else style="display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 18px; margin-right: 8px;">✨</span>
                    开始AI创作
                  </span>
                </button>
                <button 
                  @click="clearForm"
                  style="padding: 12px 20px; border-radius: 12px; border: 2px solid #e5e7eb; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
                  @mouseover="$event.target.style.background = '#f9fafb'; $event.target.style.borderColor = '#3b82f6'"
                  @mouseout="$event.target.style.background = 'white'; $event.target.style.borderColor = '#e5e7eb'"
                >
                  清空
                </button>
              </div>
            </div>
          </div>

          <!-- 创作结果 -->
          <div v-if="generatedPoems.length > 0" class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">📝</span>
              AI创作结果
              <span style="margin-left: 12px; padding: 4px 12px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; font-size: 12px; color: #3b82f6; font-weight: 500;">
                DeepSeek AI
              </span>
            </h3>
            <div class="space-y-4">
              <div 
                v-for="(poem, index) in generatedPoems" 
                :key="index"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-medium text-purple-700 dark:text-purple-400">{{ poem.title }}</h4>
                  <div class="flex gap-2">
                    <button @click="editPoem(poem, index)" class="text-blue-600 hover:text-blue-700 text-sm">编辑</button>
                    <button @click="savePoem(poem)" class="text-green-600 hover:text-green-700 text-sm">保存</button>
                    <button @click="copyText(poem.content)" class="text-gray-600 hover:text-gray-700 text-sm">复制</button>
                  </div>
                </div>
                <div class="text-gray-800 dark:text-gray-200 leading-relaxed serif whitespace-pre-line mb-3">{{ poem.content }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  体裁：{{ poem.style }} | 主题：{{ poem.theme }}
                </div>
                <div v-if="poem.analysis" class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div class="text-sm text-amber-800 dark:text-amber-300">
                    <strong>AI赏析：</strong>{{ poem.analysis }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：工具面板 -->
        <div class="space-y-6">
          <!-- AI助手 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">🤖</span>
              AI助手
              <span style="margin-left: 8px; padding: 2px 8px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; font-size: 10px; color: #3b82f6; font-weight: 500;">
                DeepSeek
              </span>
            </h3>
            <div class="space-y-3">
              <button 
                @click="getInspiration" 
                :disabled="isLoading"
                class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div class="font-medium text-sm">💡 获取灵感</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">随机推荐创作主题</div>
              </button>
              <button 
                @click="checkRhyme" 
                :disabled="isLoading || generatedPoems.length === 0"
                class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <div class="font-medium text-sm">🎵 韵律检查</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">检查平仄和押韵</div>
              </button>
              <button 
                @click="findRhymes" 
                :disabled="isLoading"
                class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div class="font-medium text-sm">📖 押韵词典</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">查找押韵字词</div>
              </button>
            </div>
          </div>

          <!-- 创作历史 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">📚</span>
              创作历史
            </h3>
            <div v-if="recentCreations.length === 0" class="text-center text-gray-500 py-4">
              暂无创作历史
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="creation in recentCreations.slice(0, 5)" 
                :key="creation.id"
                class="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                @click="loadCreation(creation)"
              >
                <div class="font-medium text-sm truncate">{{ creation.title }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ creation.created_at }}</div>
              </div>
            </div>
          </div>

          <!-- 社区入口 -->
          <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; color: #1f2937;">
              <span style="font-size: 18px; margin-right: 8px;">🌸</span>
              分享到社区
            </h3>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px; line-height: 1.5;">创作完成后，可以将作品分享到社区，与其他诗友交流心得</p>
            <button 
              @click="$emit('navigate', 'community')"
              style="width: 100%; padding: 12px 20px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);"
              @mouseover="$event.target.style.transform = 'translateY(-2px)'; $event.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'"
              @mouseout="$event.target.style.transform = 'translateY(0)'; $event.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'"
            >
              🌸 前往社区
            </button>
          </div>

          <!-- 创作技巧 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <span class="text-lg mr-2">💎</span>
              创作技巧
            </h3>
            <div class="space-y-3 text-sm">
              <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="font-medium text-purple-800 dark:text-purple-300 mb-1">意象选择</div>
                <div class="text-purple-700 dark:text-purple-400">选择具有象征意义的意象，如"明月"代表思念，"梧桐"代表离愁。</div>
              </div>
              <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="font-medium text-blue-800 dark:text-blue-300 mb-1">情景交融</div>
                <div class="text-blue-700 dark:text-blue-400">将个人情感融入自然景物的描写中，达到情景交融的效果。</div>
              </div>
              <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="font-medium text-green-800 dark:text-green-300 mb-1">对仗工整</div>
                <div class="text-green-700 dark:text-green-400">律诗要求颔联和颈联对仗，注意词性、结构的对应。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <transition name="fade">
      <div v-if="editingPoem" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="editingPoem = null"></div>
        <div class="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6">
          <h3 class="text-xl font-semibold mb-4">编辑作品</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">标题</label>
              <input 
                v-model="editingPoem.title"
                type="text" 
                class="input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">内容</label>
              <textarea 
                v-model="editingPoem.content"
                rows="8"
                class="input serif"
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button 
              @click="editingPoem = null"
              class="btn btn-outline"
            >
              取消
            </button>
            <button 
              @click="updatePoem"
              class="btn btn-primary"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isAuthenticated, requireAuth } from '@/lib/auth'
import { aiService, type CreationRequest, type PoemResult } from '@/lib/aiService'
import { DatabaseService } from '@/lib/database'

// Emits
defineEmits<{
  navigate: [page: string]
}>()

// 响应式数据
const selectedMode = ref('ai-assist')
const isGenerating = ref(false)
const isLoading = ref(false)
const editingPoem = ref<(PoemResult & { index: number }) | null>(null)

// 创作模式
const creationModes = [
  { id: 'ai-assist', name: 'AI辅助', desc: '智能创作建议', icon: '🤖' },
  { id: 'template', name: '模板填词', desc: '经典格律模板', icon: '📋' },
  { id: 'inspiration', name: '灵感激发', desc: '创意思维启发', icon: '💡' },
  { id: 'ai-collab', name: 'AI接龙', desc: '与AI轮流续写', icon: '🤝' }
]

// 情感基调选项
const emotions = ['喜悦', '忧伤', '思念', '豪迈', '宁静', '激昂', '惆怅', '欣慰']

// 创作表单
const creationForm = ref({
  theme: '',
  emotions: [] as string[],
  style: '',
  keywords: ''
})

// 生成的诗词
const generatedPoems = ref<PoemResult[]>([])
const relayContext = ref<string>('')
const relayLines = ref<string[]>([])

// 创作历史
const recentCreations = ref<Array<{
  id: string
  title: string
  created_at: string
}>>([])

// 计算属性
const canGenerate = computed(() => {
  const hasTheme = creationForm.value.theme.trim().length > 0
  const hasStyle = creationForm.value.style.length > 0
  console.log('📊 表单验证状态:', { hasTheme, hasStyle, theme: creationForm.value.theme, style: creationForm.value.style })
  return hasTheme && hasStyle
})

// 方法
function toggleEmotion(emotion: string) {
  console.log('🎭 点击情感基调:', emotion)
  console.log('📝 当前已选择的情感:', creationForm.value.emotions)
  
  const emotions = creationForm.value.emotions
  const index = emotions.indexOf(emotion)
  if (index > -1) {
    console.log('➖ 移除情感:', emotion)
    emotions.splice(index, 1)
  } else {
    console.log('➕ 添加情感:', emotion)
    emotions.push(emotion)
  }
  
  console.log('📝 更新后的情感:', creationForm.value.emotions)
}

function clearForm() {
  creationForm.value = {
    theme: '',
    emotions: [],
    style: '',
    keywords: ''
  }
}

// AI接龙：基于已有上下文续写一行
async function relayNext() {
  if (!creationForm.value.style) return
  isGenerating.value = true
  try {
    const next = await aiService.generateNextLine({
      previous: relayContext.value || creationForm.value.theme,
      style: creationForm.value.style,
      constraint: 'one-line'
    })
    relayLines.value.push(next)
    relayContext.value = (relayContext.value ? relayContext.value + '\n' : '') + next
  } finally {
    isGenerating.value = false
  }
}

async function generatePoetry() {
  console.log('🎨 开始创作按钮被点击')
  console.log('📝 表单数据:', creationForm.value)
  console.log('✅ 是否可以生成:', canGenerate.value)
  
  if (!canGenerate.value) {
    console.log('❌ 表单验证失败，无法生成')
    alert('请填写创作主题和选择诗词体裁')
    return
  }
  
  // 检查登录状态
  console.log('🔐 检查登录状态:', isAuthenticated.value)
  if (!requireAuth()) {
    console.log('❌ 用户未登录')
    alert('请先登录后再进行创作')
    return
  }
  
  console.log('🚀 开始AI创作...')
  isGenerating.value = true
  
  try {
    const request: CreationRequest = {
      theme: creationForm.value.theme,
      emotions: creationForm.value.emotions,
      style: creationForm.value.style,
      keywords: creationForm.value.keywords,
      mode: selectedMode.value
    }
    
    const results = await aiService.generatePoetry(request)
    
    // 添加到生成结果列表
    generatedPoems.value.unshift(...results)
    
    // 限制显示数量
    if (generatedPoems.value.length > 10) {
      generatedPoems.value = generatedPoems.value.slice(0, 10)
    }
    
  } catch (error) {
    console.error('生成失败:', error)
    alert('生成失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

function editPoem(poem: PoemResult, index: number) {
  editingPoem.value = { ...poem, index }
}

function updatePoem() {
  if (editingPoem.value) {
    const index = editingPoem.value.index
    generatedPoems.value[index] = { ...editingPoem.value }
    delete generatedPoems.value[index].index
    editingPoem.value = null
  }
}

async function savePoem(poem: PoemResult) {
  if (!isAuthenticated.value) {
    alert('请先登录')
    return
  }

  try {
    const poemData = {
      title: poem.title,
      content: poem.content,
      style: poem.style,
      theme: poem.theme,
      emotions: creationForm.value.emotions,
      keywords: creationForm.value.keywords ? creationForm.value.keywords.split(',').map(k => k.trim()) : [],
      is_ai_assisted: true,
      ai_prompt: `主题: ${creationForm.value.theme}, 体裁: ${poem.style}`,
      status: 'draft' as const,
      user_id: '' // 会在数据库服务中自动填充
    }

    const result = await DatabaseService.createUserPoem(poemData)
    
    if (result) {
      alert('作品已保存到草稿箱！')
      // 添加到创作历史
      recentCreations.value.unshift({
        id: result.id,
        title: result.title,
        created_at: new Date().toLocaleDateString()
      })
    } else {
      alert('保存失败，请稍后重试')
    }
  } catch (error) {
    console.error('保存作品失败:', error)
    alert('保存失败，请稍后重试')
  }
}

function loadCreation(creation: { id: string; title: string; created_at: string }) {
  // 加载历史创作到当前编辑器
  console.log('加载创作:', creation)
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch {
    alert('复制失败，请手动复制')
  }
}

async function getInspiration() {
  isLoading.value = true
  try {
    const inspirations = await aiService.getInspiration()
    const random = inspirations[Math.floor(Math.random() * inspirations.length)]
    creationForm.value.theme = random
    alert(`💡 灵感推荐：${random}`)
  } catch (error) {
    console.error('获取灵感失败:', error)
    alert('获取灵感失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

async function checkRhyme() {
  if (!generatedPoems.value.length) {
    alert('请先生成诗词作品')
    return
  }
  
  isLoading.value = true
  try {
    const latestPoem = generatedPoems.value[0]
    const result = await aiService.checkRhyme(latestPoem.content)
    
    let message = `韵律检查结果：${result.isValid ? '✅ 符合要求' : '❌ 需要调整'}\n\n`
    message += `分析：${result.analysis}\n\n`
    if (result.suggestions.length > 0) {
      message += '建议：\n' + result.suggestions.map(s => `• ${s}`).join('\n')
    }
    
    alert(message)
  } catch (error) {
    console.error('韵律检查失败:', error)
    alert('韵律检查失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

async function findRhymes() {
  const word = prompt('请输入要查找押韵的字：')
  if (!word?.trim()) return
  
  isLoading.value = true
  try {
    const result = await aiService.findRhymes(word.trim())
    const message = `"${result.word}" 的押韵字：\n${result.rhymes.join('、')}\n\n声调：${result.tone}`
    alert(message)
  } catch (error) {
    console.error('查找押韵失败:', error)
    alert('查找押韵失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 加载用户的创作历史
  if (isAuthenticated.value) {
    try {
      const { data } = await DatabaseService.getUserPoems({
        limit: 10,
        status: 'draft'
      })
      recentCreations.value = data.map(poem => ({
        id: poem.id,
        title: poem.title,
        created_at: new Date(poem.created_at).toLocaleDateString()
      }))
    } catch (error) {
      console.error('加载创作历史失败:', error)
    }
  }
})
</script>

<style scoped>
.serif { 
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "KaiTi", "Kaiti SC", serif; 
  line-height: 1.85; 
  letter-spacing: 0.01em; 
}

.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.25s ease; 
}

.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>
