<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-300">
    <div class="relative min-h-screen bg-[#f8f9fa] dark:bg-[#050505] flex flex-col md:flex-row font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 overflow-hidden">
      
      <!-- 动态星空背景 -->
      <StarBackground class="absolute inset-0 z-0" />

      <!-- 增强型背景光效 -->
      <div class="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow animation-delay-2000"></div>
        <!-- 网格覆盖层 (仅暗色模式可见) -->
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none"></div>
      </div>

      <!-- 侧边栏 -->
      <aside class="w-full md:w-72 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800 flex flex-col fixed md:h-screen z-30 shadow-sm md:shadow-none transition-colors duration-300">
        <div class="p-8 text-center md:text-left">
          <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 mx-auto md:mx-0 overflow-hidden relative group cursor-pointer border-2 border-transparent dark:border-emerald-500/30 transition-all hover:scale-105 shadow-lg shadow-emerald-500/10">
            <div class="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse group-hover:bg-gray-400 transition-colors"></div>
            <i class="ph ph-user-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-500 dark:text-emerald-400"></i>
          </div>
          <h1 class="text-2xl font-bold font-serif text-gray-900 dark:text-white tracking-tight glitch-effect" data-text="BLOG_OS">博客系统</h1>
          <p class="text-xs text-gray-500 dark:text-emerald-500/80 mt-2 font-mono tracking-widest">
            SYSTEM_ONLINE<br>V 2.0.77 CN
          </p>
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden"
            active-class="bg-gray-900 dark:bg-emerald-900/30 text-white dark:text-emerald-400 border border-transparent dark:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            :class="{ 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200': $route.path !== item.path }"
          >
            <i :class="['ph text-lg', item.icon, $route.path === item.path ? 'text-white dark:text-emerald-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300']"></i>
            <span class="relative z-10">{{ item.name }}</span>
            <!-- 激活时的扫描光效 -->
            <div v-if="$route.path === item.path" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-scan"></div>
          </router-link>
        </nav>

        <div class="p-6 text-xs text-gray-400 dark:text-gray-600 text-center md:text-left font-mono">
          &copy; 2077 网络行者
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 md:ml-72 min-h-screen flex flex-col relative z-10">
        
        <!-- 顶部导航栏 -->
        <header class="h-16 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-300">
          <div class="flex items-center gap-2">
            <span class="text-gray-400 dark:text-gray-500 text-sm font-mono">路径 //</span>
            <span class="text-sm font-bold text-gray-800 dark:text-emerald-400 font-mono tracking-wider">{{ $route.name?.toString().toUpperCase() }}</span>
          </div>

          <div class="flex items-center gap-4">
            <!-- 高级主题切换器 -->
            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-full border border-gray-200 dark:border-gray-700">
              <button 
                @click="setTheme(false)"
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                :class="!isDarkMode ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-200'"
              >
                <i class="ph ph-sun text-lg"></i>
              </button>
              <button 
                @click="setTheme(true)"
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                :class="isDarkMode ? 'bg-gray-800 text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              >
                <i class="ph ph-moon-stars text-lg"></i>
              </button>
            </div>
            
             <!-- 移动端菜单按钮 -->
             <button class="md:hidden ml-2 text-gray-500 dark:text-gray-400" @click="toggleSidebar">
                <i class="ph ph-list text-2xl"></i>
             </button>
          </div>
        </header>

        <!-- 路由视图 -->
        <div class="flex-1 w-full mx-auto relative overflow-hidden">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarBackground from '@/components/common/StarBackground.vue'

const isDarkMode = ref(true)

const navItems = [
  { name: '仪表盘', path: '/', icon: 'ph-squares-four' },
  // { name: '日志', path: '/journal', icon: 'ph-notebook' }, // 已移除
]

const setTheme = (isDark: boolean) => {
  isDarkMode.value = isDark
  updateTheme()
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleSidebar = () => {
  alert('移动端导航暂未实现')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // 默认暗色
    isDarkMode.value = true
  }
  updateTheme()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-scan {
  animation: scan 2s linear infinite;
}

@keyframes scan {
  from { transform: translateX(-100%); }
  to { transform: translateX(200%); }
}

.glitch-effect {
  position: relative;
}

.bg-grid-pattern {
  background-image: linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(90deg, currentColor 1px, transparent 1px);
  background-size: 30px 30px;
}
</style>
