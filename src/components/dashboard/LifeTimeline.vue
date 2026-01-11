<template>
  <section id="timeline" class="relative">
    <!-- 装饰线条 -->
    <div class="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>

    <div class="space-y-12">
      <div
        v-for="(log, index) in logs"
        :key="log.id"
        class="relative pl-16 group"
        :style="{ animationDelay: `${index * 100}ms` }" 
      >
        <!-- 时间节点 -->
        <div 
          class="absolute left-0 top-1 w-[56px] flex flex-col items-center justify-center z-10 transition-all duration-300 group-hover:scale-110"
        >
           <div 
             class="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg"
             :class="getTypeColor(log.type)"
           >
             <span class="text-2xl">{{ getTypeIcon(log.type) }}</span>
           </div>
        </div>

        <!-- 内容卡片 -->
        <div class="glass-panel rounded-2xl p-6 hover:translate-x-2 transition-all duration-300">
          <div class="flex justify-between items-start mb-3">
             <div class="flex flex-col">
               <span class="text-sm text-gray-400 font-mono flex items-center gap-2">
                 {{ log.date }} <span class="w-1 h-1 rounded-full bg-gray-600"></span> {{ log.time }}
               </span>
               <h3 class="text-lg font-bold text-white mt-1 group-hover:text-cyber-primary transition-colors">
                 {{ getTypeLabel(log.type) }}时刻
               </h3>
             </div>
             <span v-if="log.mood" class="text-3xl opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all cursor-default" title="心情">{{ log.mood }}</span>
          </div>
          
          <p class="text-gray-300 leading-relaxed text-base tracking-wide">
            {{ log.content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LifeLog } from '@/types'

// Mock 数据
const logs = ref<LifeLog[]>([
  {
    id: 1,
    date: '2026-01-04',
    time: '23:40',
    content: '重构了个人主页的前端设计，去掉了繁琐的仪表盘，现在的界面看起来更像是一个能够安放思绪的树洞。深色的背景配上流动的光影，感觉很棒。',
    type: 'life',
    mood: '✨'
  },
  {
    id: 2,
    date: '2026-01-04',
    time: '14:30',
    content: '今天尝试了一种新的配色方案，灵感来自于极光。有时候做减法比做加法更难，但留白确实能让重点更突出。',
    type: 'work',
    mood: '🎨'
  },
  {
    id: 3,
    date: '2026-01-03',
    time: '22:15',
    content: '读完了《仿生人会梦见电子羊吗？》，对赛博朋克的内核有了更深的理解。高科技，低生活，但我们依然向往光。',
    type: 'thought',
    mood: '📚'
  }
])

const getTypeIcon = (type: LifeLog['type']) => {
  const icons = {
    work: '⚡',
    life: '🌿',
    study: '📖',
    thought: '💭'
  }
  return icons[type]
}

const getTypeLabel = (type: LifeLog['type']) => {
  const labels = {
    work: '工作流',
    life: '生活',
    study: '学习',
    thought: '思考'
  }
  return labels[type]
}

const getTypeColor = (type: LifeLog['type']) => {
  const colors = {
    work: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    life: 'bg-green-500/20 text-green-400 border-green-500/30',
    study: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    thought: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
  return colors[type]
}
</script>