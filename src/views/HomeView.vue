<template>
  <div class="h-full p-6 text-gray-800 dark:text-white overflow-y-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      <!-- 区域 A: 状态面板 -->
      <section class="lg:col-span-2">
        <GlassCard class="h-full flex flex-col justify-between min-h-[200px] relative overflow-hidden group border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/40">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div class="relative z-10">
            <h2 class="text-3xl font-bold mb-2 glitch-text">欢迎归来，指挥官。</h2>
            <p class="text-gray-500 dark:text-gray-400 font-mono text-sm">系统状态: 运行正常</p>
          </div>

          <div class="mt-8 relative z-10">
            <div class="flex justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2">
              <span>博客系统内核</span>
              <span>85%</span>
            </div>
            <div class="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 w-[85%] shadow-[0_0_10px_rgba(16,185,129,0.5)] relative">
                <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <!-- 区域 B: 快捷入口 -->
      <section class="lg:col-span-1 grid grid-rows-2 gap-6">
        <GlassCard 
          hoverable 
          class="flex items-center justify-between group border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/40 cursor-pointer"
          @click="router.push('/editor')"
        >
          <div>
            <div class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">新建信号</div>
            <div class="text-xs text-gray-500 font-mono mt-1">创建条目()</div>
          </div>
          <i class="ph ph-pen-nib text-3xl text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 transition-colors"></i>
        </GlassCard>

        <GlassCard class="flex items-center justify-between opacity-50 cursor-not-allowed grayscale border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/40">
          <div>
            <div class="text-xl font-bold text-gray-900 dark:text-white">实验室</div>
            <div class="text-xs text-gray-500 font-mono mt-1">访问拒绝</div>
          </div>
          <i class="ph ph-flask text-3xl text-gray-400 dark:text-gray-600"></i>
        </GlassCard>
      </section>

      <!-- 区域 C: 内容流 -->
      <section class="lg:col-span-3 mt-4">
        <div class="flex items-center gap-4 mb-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i class="ph ph-activity text-emerald-500"></i>
            数据流
          </h3>
          <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard 
            v-for="post in postsStore.posts" 
            :key="post.id"
            hoverable
            class="group h-full flex flex-col border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/40 cursor-pointer"
            @click="router.push(`/post/${post.id}`)"
          >
            <div class="flex justify-between items-start mb-4">
              <span class="text-xs font-mono px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                {{ post.type === 'markdown' ? '技术' : '随笔' }}
              </span>
              <span class="text-xs font-mono text-gray-500">{{ post.createdAt }}</span>
            </div>
            
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ post.title }}
            </h4>
            
            <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
              {{ post.summary }}
            </p>

            <div class="flex gap-2 flex-wrap">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded"
              >
                #{{ tag }}
              </span>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import GlassCard from '@/components/common/GlassCard.vue'

const router = useRouter()
const postsStore = usePostsStore()
</script>

<style scoped>
.glitch-text {
  position: relative;
  /* 仅在深色模式下显示发光 */
}
:global(.dark) .glitch-text {
  text-shadow: 2px 2px 0px rgba(16, 185, 129, 0.2);
}
</style>
