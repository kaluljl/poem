<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-white text-gray-800 font-sans">
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="https://ai-public.mastergo.com/ai/img_res/d07c1e362295db3d80f132463fcc5dfd.jpg" alt="Logo" class="h-10 object-contain">
        </div>
        <ul class="hidden md:flex space-x-8">
          <li><RouterLink to="/" class="text-lg hover:text-amber-700 transition-colors">首页</RouterLink></li>
          <li><RouterLink to="/search" class="text-lg hover:text-amber-700 transition-colors">检索</RouterLink></li>
          <li><a href="#" class="text-lg hover:text-amber-700 transition-colors">诗词分类</a></li>
          <li><a href="#" class="text-lg hover:text-amber-700 transition-colors">诗人介绍</a></li>
          <li><a href="#" class="text-lg hover:text-amber-700 transition-colors">名句赏析</a></li>
          <li><a href="#" class="text-lg hover:text-amber-700 transition-colors">互动社区</a></li>
        </ul>
        <div class="relative w-64">
          <input 
            type="text" 
            placeholder="搜索诗词..." 
            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </nav>
    <!-- 路由切换：首页内容仅在 home 路由显示 -->
    <template v-if="$route.name === 'home'">

    <!-- Hero Section -->
    <section class="pt-24 pb-16 relative bg-cover bg-center" 
             style="background-image: url('https://ai-public.mastergo.com/ai/img_res/518c9dc5d30135be8819223802457231.jpg'); height: 600px;">
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center items-start">
        <h1 class="text-5xl font-bold text-white mb-4 tracking-wider">古韵诗香</h1>
        <p class="text-xl text-white mb-8 max-w-2xl">品味千年诗词之美</p>
        <div class="relative w-96">
          <input 
            type="text" 
            placeholder="请输入诗词名称或作者..." 
            class="w-full pl-10 pr-4 py-3 rounded-full bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
          >
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        </div>
      </div>
    </section>

    <!-- Featured Poems -->
    <section class="py-16 bg-amber-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">精选诗词</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Poem Card 1 -->
          <div class="bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">静夜思</h3>
              <p class="text-gray-600 mb-1">李白 · 唐代</p>
              <p class="text-gray-700 mt-4 italic">床前明月光，疑是地上霜。举头望明月，低头思故乡。</p>
              <button class="mt-6 !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors">
                查看详情
              </button>
            </div>
          </div>
          
          <!-- Poem Card 2 -->
          <div class="bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">水调歌头</h3>
              <p class="text-gray-600 mb-1">苏轼 · 宋代</p>
              <p class="text-gray-700 mt-4 italic">明月几时有？把酒问青天。不知天上宫阙，今夕是何年。</p>
              <button class="mt-6 !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors">
                查看详情
              </button>
            </div>
          </div>
          
          <!-- Poem Card 3 -->
          <div class="bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">春晓</h3>
              <p class="text-gray-600 mb-1">孟浩然 · 唐代</p>
              <p class="text-gray-700 mt-4 italic">春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。</p>
              <button class="mt-6 !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors">
                查看详情
              </button>
            </div>
          </div>
          
          <!-- Poem Card 4 -->
          <div class="bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">念奴娇·赤壁怀古</h3>
              <p class="text-gray-600 mb-1">苏轼 · 宋代</p>
              <p class="text-gray-700 mt-4 italic">大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。</p>
              <button class="mt-6 !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">诗词分类</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <img src="https://ai-public.mastergo.com/ai/img_res/f875f9896dc7b44a911d077d9380cb6c.jpg" alt="唐诗" class="w-12 h-12 object-contain">
            </div>
            <h3 class="text-xl font-medium">唐诗</h3>
          </div>
          
          <div class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <img src="https://ai-public.mastergo.com/ai/img_res/3d9b7c1c79bfd87568099bf64023ed49.jpg" alt="宋词" class="w-12 h-12 object-contain">
            </div>
            <h3 class="text-xl font-medium">宋词</h3>
          </div>
          
          <div class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <img src="https://ai-public.mastergo.com/ai/img_res/cf2c500027cf73bb8088e9b6facdbd14.jpg" alt="元曲" class="w-12 h-12 object-contain">
            </div>
            <h3 class="text-xl font-medium">元曲</h3>
          </div>
          
          <div class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <img src="https://ai-public.mastergo.com/ai/img_res/c9ad84cfdfd7663a53cb9d12b831c87e.jpg" alt="古风" class="w-12 h-12 object-contain">
            </div>
            <h3 class="text-xl font-medium">古风</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="py-16 bg-amber-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">最新赏析</h2>
        <div class="max-w-4xl mx-auto">
          <article class="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start">
              <img src="https://ai-public.mastergo.com/ai/img_res/7e6a4cc3b9ebe3abf1d9da0be376ba33.jpg" alt="文章配图" class="w-24 h-24 object-cover rounded-lg mr-6">
              <div>
                <h3 class="text-xl font-semibold mb-2">《静夜思》中的乡愁意象解析</h3>
                <div class="flex items-center text-gray-600 text-sm mb-3">
                  <span class="mr-4"><i class="fas fa-user mr-1"></i> 李文博</span>
                  <span><i class="far fa-clock mr-1"></i> 2023-05-15</span>
                </div>
                <p class="text-gray-700">李白的这首五言绝句通过月光、霜色等自然景象，巧妙地表达了游子的思乡之情...</p>
              </div>
            </div>
          </article>
          
          <article class="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start">
              <img src="https://ai-public.mastergo.com/ai/img_res/efb3bf7d9b45c0429a4fa26628e9ee36.jpg" alt="文章配图" class="w-24 h-24 object-cover rounded-lg mr-6">
              <div>
                <h3 class="text-xl font-semibold mb-2">苏轼《水调歌头》中秋情怀解读</h3>
                <div class="flex items-center text-gray-600 text-sm mb-3">
                  <span class="mr-4"><i class="fas fa-user mr-1"></i> 王雅琴</span>
                  <span><i class="far fa-clock mr-1"></i> 2023-09-22</span>
                </div>
                <p class="text-gray-700">这首词通过对月亮的追问，展现了词人复杂的情感世界和对人生的深刻思考...</p>
              </div>
            </div>
          </article>
          
          <article class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start">
              <img src="https://ai-public.mastergo.com/ai/img_res/ec0952c4edb11c991480eeff94ac77ac.jpg" alt="文章配图" class="w-24 h-24 object-cover rounded-lg mr-6">
              <div>
                <h3 class="text-xl font-semibold mb-2">孟浩然《春晓》的自然美学探析</h3>
                <div class="flex items-center text-gray-600 text-sm mb-3">
                  <span class="mr-4"><i class="fas fa-user mr-1"></i> 张明轩</span>
                  <span><i class="far fa-clock mr-1"></i> 2023-03-10</span>
                </div>
                <p class="text-gray-700">短短二十字描绘出春晨的美好景象，体现了诗人对自然的敏锐观察和深厚情感...</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    </template>
    <!-- 其它路由页面渲染出口 -->
    <RouterView v-else />
    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-16 pb-8">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 class="text-xl font-bold mb-4">古韵诗香</h3>
            <p class="text-gray-400">传承中华文化，品读千年诗词之美。我们致力于为广大诗词爱好者提供优质的内容和服务。</p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">快速链接</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">联系我们</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">版权声明</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">网站地图</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">友情链接</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">中华诗词网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">古诗文网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">诗词名句网</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">中国诗歌网</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">联系我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-start">
                <i class="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>北京市朝阳区文化路 123 号</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-phone-alt mr-3"></i>
                <span>010-12345678</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-envelope mr-3"></i>
                <span>contact@poetry.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; 2023 古韵诗香. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
</script>

<style scoped>
/* Custom styles if needed */
</style>

