<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass-panel">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center">
            <span class="text-2xl">🚀</span>
          </div>
          <h1 class="text-2xl font-bold cyber-text">Digital Command Center</h1>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#dashboard" class="hover:text-cyber-primary transition-colors">仪表盘</a>
          <a href="#tools" class="hover:text-cyber-primary transition-colors">工具箱</a>
          <a href="#timeline" class="hover:text-cyber-primary transition-colors">时间轴</a>
          <a href="#settings" class="hover:text-cyber-primary transition-colors">设置</a>
        </div>

        <!-- User Info -->
        <div class="flex items-center space-x-4">
          <div class="hidden md:block text-right">
            <p class="text-sm text-cyber-primary">Commander</p>
            <p class="text-xs text-gray-400">{{ currentTime }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-secondary to-cyber-accent flex items-center justify-center">
            <span class="text-xl">👨‍🚀</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

let timer: number

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
nav {
  backdrop-filter: blur(20px);
}
</style>
