<template>
  <section id="dashboard" class="mb-12">
    <h2 class="text-2xl font-bold cyber-text mb-6">⚡ 系统状态</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- CPU 使用率 -->
      <GlassCard :hoverable="true">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">CPU 使用率</span>
          <span class="text-2xl">🖥️</span>
        </div>
        <div class="text-3xl font-bold cyber-text mb-2">{{ status.cpu }}%</div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-2 rounded-full transition-all duration-500"
            :style="{ width: status.cpu + '%' }"
          ></div>
        </div>
      </GlassCard>

      <!-- 内存使用率 -->
      <GlassCard :hoverable="true">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">内存使用率</span>
          <span class="text-2xl">💾</span>
        </div>
        <div class="text-3xl font-bold text-cyber-secondary mb-2">{{ status.memory }}%</div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-cyber-secondary to-cyber-accent h-2 rounded-full transition-all duration-500"
            :style="{ width: status.memory + '%' }"
          ></div>
        </div>
      </GlassCard>

      <!-- 磁盘使用率 -->
      <GlassCard :hoverable="true">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">磁盘使用率</span>
          <span class="text-2xl">📀</span>
        </div>
        <div class="text-3xl font-bold text-cyber-accent mb-2">{{ status.disk }}%</div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-cyber-accent to-cyber-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: status.disk + '%' }"
          ></div>
        </div>
      </GlassCard>

      <!-- 今日能量 -->
      <GlassCard :hoverable="true">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400">今日能量</span>
          <span class="text-2xl">⚡</span>
        </div>
        <div class="text-3xl font-bold cyber-text mb-2">{{ status.energy }}%</div>
        <div class="text-sm text-gray-400">
          运行时间: {{ status.uptime }}
        </div>
      </GlassCard>
    </div>

    <!-- 网络状态 -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <GlassCard>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-gray-400">上传速度</span>
            <div class="text-2xl font-bold text-cyber-primary mt-1">
              {{ status.network.upload }} MB/s
            </div>
          </div>
          <span class="text-3xl">⬆️</span>
        </div>
      </GlassCard>

      <GlassCard>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-gray-400">下载速度</span>
            <div class="text-2xl font-bold text-cyber-secondary mt-1">
              {{ status.network.download }} MB/s
            </div>
          </div>
          <span class="text-3xl">⬇️</span>
        </div>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { ServerStatus } from '@/types'

// Mock 数据
const status = ref<ServerStatus>({
  cpu: 45,
  memory: 62,
  disk: 78,
  network: {
    upload: 2.5,
    download: 8.3
  },
  uptime: '7d 12h 34m',
  energy: 85
})

// 模拟数据动态变化
onMounted(() => {
  setInterval(() => {
    status.value.cpu = Math.floor(Math.random() * 30) + 30
    status.value.memory = Math.floor(Math.random() * 20) + 50
    status.value.network.upload = Math.random() * 5
    status.value.network.download = Math.random() * 10
  }, 3000)
})
</script>

<style scoped>
</style>
