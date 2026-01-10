<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl" v-if="post">
    <!-- 头部信息 -->
    <header class="mb-8">
      <div class="flex gap-2 mb-4">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-2 py-1 text-xs font-mono bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded"
        >
          {{ tag }}
        </span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight glitch-text">
        {{ post.title }}
      </h1>
      <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm font-mono">
        <span>{{ post.createdAt }}</span>
        <span>阅读: {{ post.views }}</span>
      </div>
    </header>

    <!-- 文章内容 -->
    <GlassCard class="bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10">
      <div class="prose dark:prose-invert prose-emerald max-w-none">
        <MdPreview 
          v-if="post.type === 'markdown'" 
          :modelValue="post.content" 
          :theme="isDarkMode ? 'dark' : 'light'"
          class="bg-transparent"
        />
        <div 
          v-else 
          v-html="post.content"
          class="rich-text-content"
        ></div>
      </div>
    </GlassCard>
  </div>
  <div v-else class="text-center py-20 text-gray-500 font-mono">
    错误: 未找到数据
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import GlassCard from '@/components/common/GlassCard.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const postsStore = usePostsStore()
const isDarkMode = ref(true)

const post = computed(() => postsStore.getPostById(route.params.id as string))

onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
  const observer = new MutationObserver(() => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>

<style scoped>
.glitch-text {
  /* text-shadow: 0 0 5px rgba(16, 185, 129, 0.5); */
}
:global(.dark) .glitch-text {
  text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
}

:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

/* Tiptap content styling matching prose */
.rich-text-content :deep(p) {
  margin-bottom: 1.25em;
}
</style>
