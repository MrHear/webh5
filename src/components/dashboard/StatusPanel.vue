<template>
  <section id="dashboard" class="mb-12">
    <div class="flex items-center gap-3 mb-6">
      <div class="h-8 w-1 bg-cyber-primary rounded-full shadow-[0_0_10px_#00f0ff]"></div>
      <h2 class="text-2xl font-bold cyber-text tracking-wider">系统状态 <span class="text-gray-500 text-base font-normal">/ STATUS</span></h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- CPU -->
      <GlassCard :hoverable="true" class="group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400 text-sm font-mono">CPU_Pf</span>
          <i class="ph ph-cpu text-2xl text-cyber-primary group-hover:scale-110 transition-transform duration-300"></i>
        </div>
        <div class="text-3xl font-bold text-white mb-3 font-mono">{{ status.cpu }}<span class="text-sm text-gray-500 ml-1">%</span></div>
        <div class="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
          <div class="bg-cyber-primary h-full rounded-full shadow-[0_0_10px_#00f0ff]" :style="{ width: status.cpu + '%' }"></div>
        </div>
      </GlassCard>

      <!-- 内存 -->
      <GlassCard :hoverable="true" class="group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400 text-sm font-mono">RAM_Usg</span>
          <i class="ph ph-memory text-2xl text-cyber-secondary group-hover:scale-110 transition-transform duration-300"></i>
        </div>
        <div class="text-3xl font-bold text-white mb-3 font-mono">{{ status.memory }}<span class="text-sm text-gray-500 ml-1">%</span></div>
        <div class="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
          <div class="bg-cyber-secondary h-full rounded-full shadow-[0_0_10px_#ff00ff]" :style="{ width: status.memory + '%' }"></div>
        </div>
      </GlassCard>

      <!-- 磁盘 -->
      <GlassCard :hoverable="true" class="group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400 text-sm font-mono">DSK_Vol</span>
          <i class="ph ph-hard-drives text-2xl text-cyber-accent group-hover:scale-110 transition-transform duration-300"></i>
        </div>
        <div class="text-3xl font-bold text-white mb-3 font-mono">{{ status.disk }}<span class="text-sm text-gray-500 ml-1">%</span></div>
        <div class="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
          <div class="bg-cyber-accent h-full rounded-full shadow-[0_0_10px_#ffff00]" :style="{ width: status.disk + '%' }"></div>
        </div>
      </GlassCard>

      <!-- 能量 -->
      <GlassCard :hoverable="true" class="group relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-20 h-20 bg-cyber-primary/10 rounded-full blur-xl group-hover:bg-cyber-primary/20 transition-colors"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400 text-sm font-mono">ENERGY</span>
          <i class="ph ph-lightning text-2xl text-yellow-400 group-hover:scale-110 transition-transform duration-300"></i>
        </div>
        <div class="text-3xl font-bold text-white mb-1 font-mono">{{ status.energy }}%</div>
        <div class="text-xs text-cyber-primary/70 font-mono">UPTIME: {{ status.uptime }}</div>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { ServerStatus } from '@/types'

const status = ref<ServerStatus>({
  cpu: 45,
  memory: 62,
  disk: 78,
  network: { upload: 2.5, download: 8.3 },
  uptime: '7d 12h',
  energy: 85
})

onMounted(() => {
  // 模拟数据波动，让界面看起来是“活”的
  setInterval(() => {
    status.value.cpu = Math.min(100, Math.max(0, status.value.cpu + Math.floor(Math.random() * 10) - 5))
    status.value.memory = Math.min(100, Math.max(0, status.value.memory + Math.floor(Math.random() * 6) - 3))
  }, 2000)
})
</script>