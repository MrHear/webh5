<template>
  <section id="tools" class="mb-12">
    <div class="flex items-center gap-3 mb-6">
      <div class="h-8 w-1 bg-cyber-secondary rounded-full shadow-[0_0_10px_#ff00ff]"></div>
      <h2 class="text-2xl font-bold cyber-text tracking-wider">工具矩阵 <span class="text-gray-500 text-base font-normal">/ TOOLBOX</span></h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard
        v-for="tool in tools"
        :key="tool.id"
        :hoverable="true"
        class="group relative"
      >
        <a :href="tool.url" target="_blank" class="flex items-center gap-4 p-2">
          <!-- 图标容器 -->
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_currentColor]"
            :style="{ 
              backgroundColor: tool.color + '15', 
              color: tool.color,
              border: `1px solid ${tool.color}30`
            }"
          >
            <i :class="['ph', tool.icon]"></i>
          </div>
          
          <!-- 文字信息 -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white group-hover:text-cyber-primary transition-colors truncate">{{ tool.name }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ tool.description }}</p>
          </div>

          <!-- 箭头 -->
          <i class="ph ph-arrow-up-right text-gray-600 group-hover:text-white transition-colors"></i>
        </a>
      </GlassCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { ToolItem } from '@/types'

// 注意：这里把 icon 改成了 class 名
const tools = ref<ToolItem[]>([
  {
    id: 1,
    name: 'Claude 镜像',
    description: '私人 AI 助手',
    icon: 'ph-robot', // 对应 <i class="ph ph-robot"></i>
    url: 'https://claude.ai',
    category: 'AI',
    color: '#00f0ff'
  },
  {
    id: 2,
    name: 'Web 终端',
    description: 'SSH 远程管理',
    icon: 'ph-terminal-window',
    url: '#',
    category: 'Dev',
    color: '#ff00ff'
  },
  {
    id: 3,
    name: '文件传输',
    description: '私有云盘入口',
    icon: 'ph-cloud-arrow-up',
    url: '#',
    category: 'Storage',
    color: '#ffff00'
  },
  {
    id: 4,
    name: '代码仓库',
    description: 'GitLab / Gitea',
    icon: 'ph-git-branch',
    url: '#',
    category: 'Code',
    color: '#00ff88'
  },
  {
    id: 5,
    name: '数据库管理',
    description: 'Adminer / SQL',
    icon: 'ph-database',
    url: '#',
    category: 'DB',
    color: '#00ccff'
  },
  {
    id: 6,
    name: 'Docker 面板',
    description: 'Portainer',
    icon: 'ph-container', // 这是一个假设的图标，phosphor 里可以用 ph-package 代替
    url: '#',
    category: 'Ops',
    color: '#ff6600'
  }
])
</script>