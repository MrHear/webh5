<template>
  <div class="min-h-screen font-sans selection:bg-cyber-primary selection:text-black">
    <NavBar />
    
    <main class="container mx-auto px-4 md:px-6 pt-32 pb-24 max-w-4xl">
      <!-- 头部 Hero 区域 -->
      <div class="text-center mb-16 relative">
        <!-- 装饰背景字 -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[120px] font-bold text-white/5 select-none pointer-events-none whitespace-nowrap blur-sm">
          SPACE LOG
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight relative z-10">
          <span class="cyber-text">My Digital</span> Sanctuary
        </h1>
        <p class="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed relative z-10 drop-shadow-md">
          在这片数字虚空中，记录稍纵即逝的灵感与生活。<br class="hidden md:block" />
          不需要复杂的仪表盘，只需要静静地记录。
        </p>
      </div>

      <!-- 树洞功能区 -->
      <TreeHole @submit="handleNewLog" />

      <!-- 日记时间轴 -->
      <div class="mt-20">
        <div class="flex items-center gap-4 mb-10">
           <h2 class="text-2xl font-bold text-white drop-shadow-lg">Memory Stream</h2>
           <div class="h-[1px] flex-1 bg-gradient-to-r from-gray-600 to-transparent"></div>
        </div>
        <LifeTimeline />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import LifeTimeline from '@/components/dashboard/LifeTimeline.vue'
import TreeHole from '@/components/feature/TreeHole.vue'

// 处理树洞提交的新日志
const handleNewLog = (data: any) => {
  console.log('New log submitted:', data)
  // 这里可以添加逻辑将新日志推送到 Timeline，或者调用 API
  alert('✨ 树洞已收到你的信号 (模拟)')
}
</script>