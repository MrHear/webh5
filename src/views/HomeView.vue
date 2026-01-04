<template>
  <div class="min-h-screen">
    <NavBar />
    
    <main class="container mx-auto px-6 pt-24 pb-12">
      <!-- 打字机效果标题 -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-6xl font-bold cyber-text mb-4 min-h-[80px]">
          {{ displayText }}<span class="animate-pulse">|</span>
        </h1>
        <p class="text-gray-400 text-lg">
          探索、创造、连接 - 你的数字化未来从这里开始
        </p>
      </div>

      <!-- 状态面板 -->
      <StatusPanel />

      <!-- 工具箱 -->
      <ToolboxGrid />

      <!-- 生活时间轴 -->
      <LifeTimeline />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSystemStore } from '@/stores/system'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import StatusPanel from '@/components/dashboard/StatusPanel.vue'
import ToolboxGrid from '@/components/dashboard/ToolboxGrid.vue'
import LifeTimeline from '@/components/dashboard/LifeTimeline.vue'

const systemStore = useSystemStore()
const displayText = ref('')

// 打字机效果
onMounted(() => {
  const fullText = 'Welcome to Digital Command Center 🚀'
  let index = 0
  
  const typeInterval = setInterval(() => {
    if (index < fullText.length) {
      displayText.value += fullText[index]
      index++
    } else {
      clearInterval(typeInterval)
    }
  }, 100)
})
</script>

<style scoped>
</style>
