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
           <button class="text-xs font-medium text-slate-800 dark:text-white">All</button>
           <button class="text-xs font-medium text-slate-400 hover:text-slate-600">Drafts</button>
        </div>
      </div>

      <div class="space-y-6">
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
              <span class="text-xs font-mono text-slate-400">{{ post.createdAt }}</span>
              <span 
                class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"
              ></span>
              <span class="text-[10px] tracking-wide uppercase text-slate-400 border border-slate-100 dark:border-white/5 px-1.5 py-0.5 rounded">
                {{ post.type === 'markdown' ? 'MD' : 'RT' }}
              </span>
            </div>

            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ post.title }}
            </h3>
            
            <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
              {{ post.summary }}
            </p>
          </div>
        </div>
      </div>

      <!-- 如果没有内容 -->
      <div v-if="postsStore.posts.length === 0" class="py-20 text-center">
        <p class="text-slate-400 italic font-serif">一片荒原。</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const router = useRouter()
const postsStore = usePostsStore()
</script>
