<template>
  <section id="timeline" class="mb-12">
    <h2 class="text-2xl font-bold cyber-text mb-6">📝 碎碎念时间轴</h2>
    <div class="space-y-6">
      <div
        v-for="log in logs"
        :key="log.id"
        class="flex gap-6 group"
      >
        <!-- 左侧：日期时间 -->
        <div class="flex-shrink-0 w-32 text-right">
          <div class="text-cyber-primary font-bold">{{ log.date }}</div>
          <div class="text-gray-400 text-sm">{{ log.time }}</div>
        </div>

        <!-- 中间：时间线 -->
        <div class="flex-shrink-0 flex flex-col items-center">
          <div 
            class="w-4 h-4 rounded-full border-2 transition-all duration-300"
            :class="getTypeColor(log.type)"
          ></div>
          <div class="w-0.5 h-full bg-gradient-to-b from-cyber-primary to-transparent"></div>
        </div>

        <!-- 右侧：内容卡片 -->
        <GlassCard :hoverable="true" class="flex-1 mb-6">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getTypeIcon(log.type) }}</span>
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getTypeBadgeClass(log.type)"
              >
                {{ getTypeLabel(log.type) }}
              </span>
            </div>
            <span v-if="log.mood" class="text-2xl">{{ log.mood }}</span>
          </div>
          <p class="text-gray-300 leading-relaxed">{{ log.content }}</p>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { LifeLog } from '@/types'

// Mock 数据
const logs = ref<LifeLog[]>([
  {
    id: 1,
    date: '2026-01-04',
    time: '14:30',
    content: '完成了 Vue 3 + TypeScript 项目的基础架构搭建，采用了赛博朋克风格的 UI 设计，效果很酷！',
    type: 'work',
    mood: '😎'
  },
  {
    id: 2,
    date: '2026-01-04',
    time: '12:00',
    content: '午餐时间，品尝了新开的日料店，味道不错，环境也很舒适。',
    type: 'life',
    mood: '😋'
  },
  {
    id: 3,
    date: '2026-01-04',
    time: '10:15',
    content: '学习了 Tailwind CSS 的高级用法，特别是 @layer 指令和自定义工具类的创建方式。',
    type: 'study',
    mood: '🤓'
  },
  {
    id: 4,
    date: '2026-01-03',
    time: '22:45',
    content: '思考了一下技术架构的演进方向，微前端和 Serverless 可能是未来的趋势。',
    type: 'thought',
    mood: '🤔'
  },
  {
    id: 5,
    date: '2026-01-03',
    time: '18:00',
    content: '修复了生产环境的一个紧急 Bug，问题出在异步数据加载的竞态条件上。',
    type: 'work',
    mood: '💪'
  },
  {
    id: 6,
    date: '2026-01-03',
    time: '15:30',
    content: '下午茶时间，和同事讨论了新项目的技术选型，决定使用 Vue 3 + Vite。',
    type: 'life',
    mood: '☕'
  }
])

const getTypeIcon = (type: LifeLog['type']) => {
  const icons = {
    work: '💼',
    life: '🌟',
    study: '📖',
    thought: '💭'
  }
  return icons[type]
}

const getTypeLabel = (type: LifeLog['type']) => {
  const labels = {
    work: '工作',
    life: '生活',
    study: '学习',
    thought: '思考'
  }
  return labels[type]
}

const getTypeColor = (type: LifeLog['type']) => {
  const colors = {
    work: 'border-cyber-primary bg-cyber-primary group-hover:shadow-lg group-hover:shadow-cyber-primary',
    life: 'border-cyber-secondary bg-cyber-secondary group-hover:shadow-lg group-hover:shadow-cyber-secondary',
    study: 'border-cyber-accent bg-cyber-accent group-hover:shadow-lg group-hover:shadow-cyber-accent',
    thought: 'border-purple-500 bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500'
  }
  return colors[type]
}

const getTypeBadgeClass = (type: LifeLog['type']) => {
  const classes = {
    work: 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40',
    life: 'bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/40',
    study: 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/40',
    thought: 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
  }
  return classes[type]
}
</script>

<style scoped>
</style>
