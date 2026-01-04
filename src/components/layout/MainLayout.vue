<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-300">
    <!-- 外层容器：控制整体背景色，设置为相对定位以便容纳绝对定位的背景 -->
    <div class="relative min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col md:flex-row font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 overflow-hidden">
      
      <!-- ✨ 背景微光特效 (新增) -->
      <!-- 使用 absolute 定位铺满屏幕，z-0 确保在最底层 -->
      <div class="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <!-- 光斑 1: 左上角，淡青色 -->
        <div class="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-emerald-900 dark:mix-blend-screen dark:opacity-20"></div>
        <!-- 光斑 2: 右上角，淡紫色 -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-purple-900 dark:mix-blend-screen dark:opacity-20"></div>
        <!-- 光斑 3: 底部中间，淡蓝色 -->
        <div class="absolute -bottom-32 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-blue-900 dark:mix-blend-screen dark:opacity-20"></div>
      </div>

      <!-- 左侧侧边栏 (固定) -->
      <!-- z-30 确保浮在背景之上 -->
      <aside class="w-full md:w-72 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-r border-gray-100 dark:border-gray-800 flex flex-col fixed md:h-screen z-30 shadow-sm md:shadow-none transition-colors duration-300">
        <!-- 个人信息区 -->
        <div class="p-8 text-center md:text-left">
          <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 mx-auto md:mx-0 overflow-hidden relative group cursor-pointer border-2 border-transparent dark:border-gray-600 transition-colors">
               <!-- 头像占位 -->
               <div class="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse group-hover:bg-gray-400 transition-colors"></div>
               <i class="ph ph-user absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-gray-500 dark:text-gray-400"></i>
          </div>
          <h1 class="text-xl font-bold font-serif text-gray-900 dark:text-white tracking-tight">我的精神角落</h1>
          <p class="text-xs text-gray-400 mt-2 font-light leading-relaxed">
            写代码，也写诗。<br>记录生活中的每一个微小瞬间。
          </p>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 px-4 space-y-1">
          <a 
            v-for="item in navItems" 
            :key="item.name"
            href="#" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="activeTab === item.id ? 'bg-gray-900 dark:bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'"
            @click.prevent="activeTab = item.id"
          >
            <i :class="['ph text-lg', item.icon, activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300']"></i>
            {{ item.name }}
          </a>
        </nav>

        <!-- 底部版权 -->
        <div class="p-6 text-xs text-gray-300 dark:text-gray-600 text-center md:text-left">
          &copy; 2026 Personal Space.
        </div>
      </aside>

      <!-- 右侧主体区域 -->
      <!-- z-10 确保在背景之上，但在侧边栏之下 -->
      <main class="flex-1 md:ml-72 min-h-screen flex flex-col relative z-10">
        
        <!-- 顶边栏 (Top Bar) -->
        <header class="h-16 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-300">
          
          <!-- 左侧：当前页面标题 -->
          <div class="flex items-center gap-2">
            <span class="text-gray-400 dark:text-gray-500 text-sm">当前位置 /</span>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ getCurrentPageName }}</span>
          </div>

          <!-- 右侧：功能菜单 -->
          <div class="flex items-center gap-3">
            <!-- 主题切换按钮 -->
            <button 
              @click="toggleTheme" 
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              :title="isDarkMode ? '切换到日间模式' : '切换到深夜模式'"
            >
              <Transition name="rotate" mode="out-in">
                <i v-if="isDarkMode" class="ph ph-moon-stars text-xl"></i>
                <i v-else class="ph ph-sun text-xl"></i>
              </Transition>
            </button>
            
            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <!-- 通知/设置 -->
            <button class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <i class="ph ph-bell text-xl"></i>
            </button>

             <!-- 移动端菜单按钮 -->
             <button class="md:hidden ml-2 text-gray-500 dark:text-gray-400" @click="toggleSidebar">
                <i class="ph ph-list text-2xl"></i>
             </button>
          </div>
        </header>

        <!-- 内容滚动区 -->
        <!-- 移除背景色，让 body 的背景光斑透出来 -->
        <div class="flex-1 max-w-4xl w-full mx-auto px-6 py-12 relative">
          <Transition name="fade" mode="out-in">
            <component :is="activeComponent" />
          </Transition>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import JournalList from '@/components/feature/JournalList.vue'
import TreeHolePanel from '@/components/feature/TreeHolePanel.vue'

const activeTab = ref('journal')
const isDarkMode = ref(false)

const navItems = [
  { name: '每日记录', id: 'journal', icon: 'ph-notebook' },
  { name: '树洞话题', id: 'treehole', icon: 'ph-tree-evergreen' },
  { name: '关于我', id: 'about', icon: 'ph-smiley' }
]

const activeComponent = computed(() => {
  switch (activeTab.value) {
    case 'journal': return JournalList
    case 'treehole': return TreeHolePanel
    default: return JournalList
  }
})

const getCurrentPageName = computed(() => {
  return navItems.find(item => item.id === activeTab.value)?.name || '未知'
})

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 模拟侧边栏开关
const toggleSidebar = () => {
  alert('移动端侧边栏展开 (模拟)')
}

// 初始化检查系统主题
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* 图标旋转动画 */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}
.rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}
.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>