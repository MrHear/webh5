<template>
  <div class="flex flex-col gap-10">
    
    <!-- 头部：极简的输入引导 -->
    <header class="flex flex-col items-start gap-6 py-8">
      <div class="w-full max-w-2xl">
        <h2 class="text-3xl font-light text-slate-800 dark:text-slate-100 mb-2 font-serif">
          想法，<span class="italic text-slate-400">稍纵即逝。</span>
        </h2>
      </div>
      
      <!-- 快速开始卡片 -->
      <button 
        @click="router.push('/editor')"
        class="group w-full max-w-2xl bg-white dark:bg-[#1a1a1c] border border-gray-100 dark:border-white/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
      >
        <span class="text-slate-400 dark:text-slate-500 pl-2">
          写点什么...
        </span>
        <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
          <i class="ph ph-plus"></i>
        </div>
      </button>
    </header>

    <!-- 内容流：时间轴样式 -->
    <section class="max-w-2xl">
      <div class="flex items-center justify-between mb-8 pb-2 border-b border-gray-100 dark:border-white/5">
        <span class="text-xs font-bold tracking-widest text-slate-400 uppercase">Recent</span>
        <!-- 简单的过滤器 -->
        <div class="flex gap-4">
           <button 
             @click="handleFilter(undefined)"
             class="text-xs font-medium transition-colors"
             :class="currentFilter === undefined ? 'text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600'"
           >
             All
           </button>
           <button 
             @click="handleFilter('markdown')"
             class="text-xs font-medium transition-colors"
             :class="currentFilter === 'markdown' ? 'text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600'"
           >
             Markdown
           </button>
           <button 
             @click="handleFilter('richtext')"
             class="text-xs font-medium transition-colors"
             :class="currentFilter === 'richtext' ? 'text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600'"
           >
             富文本
           </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="postsStore.loading" class="py-20 text-center">
        <div class="inline-block w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-slate-400 mt-4">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="postsStore.error" class="py-20 text-center">
        <i class="ph ph-warning-circle text-4xl text-red-400 mb-4 block"></i>
        <p class="text-slate-500">{{ postsStore.error }}</p>
        <button 
          @click="loadPosts"
          class="mt-4 text-indigo-500 hover:text-indigo-600 text-sm"
        >
          重新加载
        </button>
      </div>

      <!-- 文章列表 -->
      <div v-else class="space-y-6">
        <div 
          v-for="post in postsStore.posts" 
          :key="post.id"
          class="group relative pl-8 border-l border-gray-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors py-1"
        >
          <!-- 时间点装饰 -->
          <div class="absolute -left-[5px] top-3 w-[9px] h-[9px] rounded-full bg-white dark:bg-[#0f0f11] border-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-400 transition-colors"></div>

          <div 
            class="cursor-pointer transition-all duration-300 group-hover:translate-x-1"
            @click="router.push(`/post/${post.id}`)"
          >
            <div class="flex items-center gap-3 mb-1">
              <span class="text-xs font-mono text-slate-400">{{ formatDate(post.createdAt) }}</span>
              <span 
                class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"
              ></span>
              <span class="text-[10px] tracking-wide uppercase text-slate-400 border border-slate-100 dark:border-white/5 px-1.5 py-0.5 rounded">
                {{ post.type === 'markdown' ? 'MD' : 'RT' }}
              </span>
              <span class="text-[10px] text-slate-400 flex items-center gap-1">
                <i class="ph ph-eye"></i> {{ post.views }}
              </span>
            </div>

            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ post.title }}
            </h3>
            
            <p class="text-sm text-slate-500/80 dark:text-slate-400/80 line-clamp-2 leading-relaxed font-light">
              {{ cleanSummary(post.summary) }}
            </p>

            <!-- 标签 -->
            <div v-if="post.tags && post.tags.length > 0" class="flex gap-2 mt-2">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="text-[10px] text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 如果没有内容 -->
      <div v-if="!postsStore.loading && !postsStore.error && postsStore.posts.length === 0" class="py-20 text-center">
        <p class="text-slate-400 italic font-serif">一片荒原。</p>
      </div>

      <!-- 分页信息 -->
      <div v-if="postsStore.total > 0" class="mt-8 text-center text-xs text-slate-400">
        共 {{ postsStore.total }} 篇文章
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import type { PostType } from '@/types/api'

const router = useRouter()
const postsStore = usePostsStore()

const currentFilter = ref<PostType | undefined>(undefined)

// 加载文章
const loadPosts = () => {
  postsStore.fetchPosts({ type: currentFilter.value })
}

// 过滤切换
const handleFilter = (type: PostType | undefined) => {
  currentFilter.value = type
  loadPosts()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  // 处理 ISO 格式日期
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toISOString().substring(0, 10)
}

// 清洗摘要显示
const cleanSummary = (summary: string) => {
  if (!summary) return ''
  // 移除所有 Markdown 表格符号和分隔符
  let cleaned = summary.replace(/[|]/g, ' ')
  cleaned = cleaned.replace(/-{2,}/g, ' ')
  // 移除可能的其他符号
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  return cleaned || '暂无摘要'
}

// 页面加载时获取数据
onMounted(() => {
  loadPosts()
})
</script>
