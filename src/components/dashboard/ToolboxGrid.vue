<template>
  <section id="tools" class="mb-12">
    <h2 class="text-2xl font-bold cyber-text mb-6">🛠️ 工具箱</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <GlassCard
        v-for="tool in tools"
        :key="tool.id"
        :hoverable="true"
      >
        <a
          :href="tool.url"
          target="_blank"
          class="block group"
        >
          <div class="flex flex-col items-center text-center">
            <!-- 图标 -->
            <div 
              class="text-6xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-glow"
              :style="{ filter: `drop-shadow(0 0 10px ${tool.color})` }"
            >
              {{ tool.icon }}
            </div>
            
            <!-- 标题 -->
            <h3 class="text-xl font-bold mb-2 group-hover:text-cyber-primary transition-colors">
              {{ tool.name }}
            </h3>
            
            <!-- 描述 -->
            <p class="text-sm text-gray-400 mb-3">
              {{ tool.description }}
            </p>
            
            <!-- 分类标签 -->
            <span 
              class="text-xs px-3 py-1 rounded-full"
              :style="{ 
                backgroundColor: tool.color + '20', 
                color: tool.color,
                border: `1px solid ${tool.color}40`
              }"
            >
              {{ tool.category }}
            </span>
          </div>
        </a>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { ToolItem } from '@/types'

// Mock 数据
const tools = ref<ToolItem[]>([
  {
    id: 1,
    name: 'Claude 镜像',
    description: 'AI 助手对话平台',
    icon: '🤖',
    url: 'https://claude.ai',
    category: 'AI',
    color: '#00f0ff'
  },
  {
    id: 2,
    name: 'Web 终端',
    description: '在线 Shell 终端',
    icon: '💻',
    url: '#',
    category: '开发',
    color: '#ff00ff'
  },
  {
    id: 3,
    name: '云盘入口',
    description: '个人文件存储',
    icon: '☁️',
    url: '#',
    category: '存储',
    color: '#ffff00'
  },
  {
    id: 4,
    name: '代码仓库',
    description: 'GitHub / GitLab',
    icon: '📦',
    url: '#',
    category: '开发',
    color: '#00ff88'
  },
  {
    id: 5,
    name: '监控面板',
    description: '服务器实时监控',
    icon: '📊',
    url: '#',
    category: '运维',
    color: '#ff6600'
  },
  {
    id: 6,
    name: '文档中心',
    description: '技术文档与笔记',
    icon: '📚',
    url: '#',
    category: '知识',
    color: '#9900ff'
  },
  {
    id: 7,
    name: 'API 测试',
    description: 'Postman / Swagger',
    icon: '🔌',
    url: '#',
    category: '开发',
    color: '#ff0066'
  },
  {
    id: 8,
    name: '数据库管理',
    description: 'MySQL / MongoDB',
    icon: '🗄️',
    url: '#',
    category: '数据库',
    color: '#00ccff'
  }
])
</script>

<style scoped>
</style>
