<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-1000 ease-in-out">
    <div class="relative min-h-screen bg-[#fcfcfc] dark:bg-[#0f0f11] flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 transition-colors duration-1000 overflow-hidden">
      
      <!-- 动态呼吸背景 (Mesh Gradient) -->
      <!-- 使用更优雅、大面积的渐变流转，而非独立的球体 -->
      <div class="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div class="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-sky-100/50 to-indigo-100/50 dark:from-rose-900/30 dark:via-slate-900/30 dark:to-indigo-900/30 animate-gradient-xy"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),transparent)] mix-blend-overlay"></div>
      </div>

      <!-- 极简侧边栏 -->
      <aside class="w-full md:w-[240px] flex-shrink-0 bg-white/40 dark:bg-black/20 backdrop-blur-sm border-r border-gray-100/50 dark:border-white/5 flex flex-col fixed md:relative z-30 transition-all duration-300">
        
        <!-- 品牌区 -->
        <div class="p-8 pb-4">
          <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            ONESPACE
          </h1>
        </div>

        <!-- 导航区 -->
        <nav class="flex-1 px-4 space-y-1 mt-4">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 group"
            active-class="bg-white/60 dark:bg-white/10 text-slate-900 dark:text-white font-medium shadow-sm"
            :class="{ 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200': $route.path !== item.path }"
          >
            <i :class="['ph text-lg', item.icon]"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- 底部功能区 -->
        <div class="p-6">
          <button 
            @click="toggleTheme" 
            class="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <i v-if="isDarkMode" class="ph ph-moon-stars"></i>
            <i v-else class="ph ph-sun"></i>
            <span>{{ isDarkMode ? 'Dark' : 'Light' }}</span>
          </button>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 min-h-screen relative z-10 flex flex-col">
        <!-- 路由视图 -->
        <div class="flex-1 w-full mx-auto p-6 md:p-12 max-w-5xl">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const navItems = [
  { name: 'Timeline', path: '/', icon: 'ph-clock-counter-clockwise' }, // 改名为时间轴，更像个人记录
  // { name: 'Collections', path: '/collections', icon: 'ph-folders' }, // 预留
]

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  updateTheme()
}

const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
  updateTheme()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes gradient-xy {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-xy {
  background-size: 200% 200%;
  animation: gradient-xy 15s ease infinite;
}
</style>
