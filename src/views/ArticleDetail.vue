<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl" v-if="post">
    <!-- 头部信息 -->
    <header class="mb-12 text-center">
      <div class="flex gap-2 justify-center mb-6">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
        {{ post.title }}
      </h1>
      <div class="flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
        <span class="flex items-center gap-1"><i class="ph ph-calendar-blank"></i> {{ post.createdAt }}</span>
        <span class="flex items-center gap-1"><i class="ph ph-eye"></i> {{ post.views }} 阅读</span>
      </div>
    </header>

    <!-- 文章内容 -->
    <GlassCard class="!p-8 md:!p-12">
      <div class="prose dark:prose-invert prose-slate prose-lg max-w-none">
        <MdPreview 
          v-if="post.type === 'markdown'" 
          :modelValue="post.content" 
          :theme="isDarkMode ? 'dark' : 'light'"
          class="!bg-transparent"
        />
        <div 
          v-else 
          v-html="post.content"
          class="rich-text-content"
        ></div>
      </div>
    </GlassCard>
  </div>
  <div v-else class="text-center py-20 text-slate-500">
    <i class="ph ph-ghost text-4xl mb-4 block"></i>
    文章未找到
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
const isDarkMode = ref(false)

const post = computed(() => postsStore.getPostById(route.params.id as string))

onMounted(() => {
  const checkTheme = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  checkTheme()
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>

<style scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

/* Tiptap content styling matching prose */
.rich-text-content :deep(p) {
  margin-bottom: 1.5em;
  line-height: 1.8;
}
</style>
