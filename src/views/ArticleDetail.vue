<template>
  <!-- 悬浮返回按钮 -->
  <button 
    @click="router.push('/')" 
    class="fixed left-6 top-24 z-40 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg border border-gray-200 dark:border-gray-700 text-slate-500 hover:text-indigo-600 hover:scale-110 transition-all duration-300 group hidden xl:block"
    title="返回首页"
  >
    <i class="ph ph-arrow-left text-xl"></i>
    <span class="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">返回首页</span>
  </button>

  <!-- 移动端顶部导航栏 -->
  <div class="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
    <button @click="router.push('/')" class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
      <i class="ph ph-arrow-left text-lg"></i>
      <span class="text-sm font-medium">返回</span>
    </button>
    <h1 class="text-sm font-bold truncate max-w-[200px]">{{ post?.title || '文章详情' }}</h1>
    <div class="w-12"></div>
  </div>

  <!-- 加载状态 -->
  <div v-if="loading" class="container mx-auto px-4 py-20 text-center">
    <div class="inline-block w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
    <p class="text-slate-400 mt-4">加载中...</p>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
    <i class="ph ph-warning-circle text-5xl text-red-400 mb-4 block"></i>
    <p class="text-slate-500 mb-4">{{ error }}</p>
    <button 
      @click="loadPost"
      class="text-indigo-500 hover:text-indigo-600"
    >
      重新加载
    </button>
  </div>

  <!-- 文章内容 -->
  <div class="container mx-auto px-4 py-8 max-w-4xl" v-else-if="post">
    <!-- 头部信息 -->
    <header class="mb-12 text-center relative">
      <!-- 显式返回链接 (移动端隐藏，中大屏显示) -->
      <div class="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
        <button 
          @click="router.push('/')"
          class="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
        >
          <i class="ph ph-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span>返回</span>
        </button>
      </div>

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
      <div class="flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm mb-6">
        <span class="flex items-center gap-1"><i class="ph ph-calendar-blank"></i> {{ formatDate(post.createdAt) }}</span>
        <span class="flex items-center gap-1"><i class="ph ph-eye"></i> {{ post.views }} 阅读</span>
        
        <!-- 管理员入口 -->
        <button 
          v-if="!authStore.isLoggedIn"
          @click="showLoginModal = true"
          class="text-slate-300 hover:text-slate-500 transition-colors"
          title="管理员登录"
        >
          <i class="ph ph-lock-key"></i>
        </button>
      </div>

      <!-- 管理员操作栏 -->
      <div v-if="authStore.isLoggedIn" class="flex justify-center gap-4 animate-fade-in">
        <button 
          @click="handleEdit"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <i class="ph ph-pencil-simple"></i>
          编辑文章
        </button>
        <button 
          @click="handleDelete"
          class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          <i v-if="deleting" class="ph ph-spinner animate-spin"></i>
          <i v-else class="ph ph-trash"></i>
          {{ deleting ? '删除中...' : '删除文章' }}
        </button>
      </div>
    </header>

    <!-- 文章内容 -->
    <GlassCard class="!p-8 md:!p-12 relative overflow-hidden">
      <!-- 装饰背景 -->
      <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <i class="ph ph-article text-9xl"></i>
      </div>

      <div class="prose dark:prose-invert prose-slate prose-lg max-w-none custom-markdown">
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

  <!-- 文章未找到 -->
  <div v-else class="text-center py-20 text-slate-500">
    <i class="ph ph-ghost text-4xl mb-4 block"></i>
    文章未找到
  </div>

  <!-- 登录弹窗 -->
  <LoginModal v-model="showLoginModal" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import GlassCard from '@/components/common/GlassCard.vue'
import LoginModal from '@/components/common/LoginModal.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { PostDetail } from '@/types/api'

const router = useRouter()
const route = useRoute()
const postsStore = usePostsStore()
const authStore = useAuthStore()
const isDarkMode = ref(false)

const post = ref<PostDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showLoginModal = ref(false)
const deleting = ref(false)

// 加载文章详情
const loadPost = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = '无效的文章ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  const result = await postsStore.fetchPostById(id)
  
  if (result) {
    post.value = result
  } else {
    error.value = postsStore.error || '文章未找到'
  }
  
  loading.value = false
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toISOString().substring(0, 10)
}

// 编辑文章
const handleEdit = () => {
  if (post.value) {
    router.push(`/editor?id=${post.value.id}`)
  }
}

// 删除文章
const handleDelete = async () => {
  if (!post.value || !confirm('确定要删除这篇文章吗？此操作不可恢复。')) return
  
  deleting.value = true
  const success = await postsStore.removePost(post.value.id)
  deleting.value = false
  
  if (success) {
    router.push('/')
  } else {
    alert(postsStore.error || '删除失败')
  }
}

// 监听路由变化重新加载
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadPost()
  }
})

onMounted(() => {
  // 检测主题
  const checkTheme = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  checkTheme()
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  // 加载文章
  loadPost()
})
</script>

<style scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

/* 增强 Markdown 样式 */
.custom-markdown :deep(h1),
.custom-markdown :deep(h2),
.custom-markdown :deep(h3) {
  color: #1e293b; /* slate-800 */
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 0.8em;
  line-height: 1.3;
}

.dark .custom-markdown :deep(h1),
.dark .custom-markdown :deep(h2),
.dark .custom-markdown :deep(h3) {
  color: #e2e8f0; /* slate-200 */
}

.custom-markdown :deep(p) {
  margin-bottom: 1.5em;
  line-height: 1.8;
  color: #475569; /* slate-600 */
}

.dark .custom-markdown :deep(p) {
  color: #cbd5e1; /* slate-300 */
}

.custom-markdown :deep(blockquote) {
  border-left-color: #6366f1; /* indigo-500 */
  background: rgba(99, 102, 241, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
  font-style: normal;
  color: #475569;
}

.dark .custom-markdown :deep(blockquote) {
  background: rgba(99, 102, 241, 0.1);
  color: #94a3b8;
}

.custom-markdown :deep(code) {
  color: #ef4444; /* red-500 */
  background: rgba(239, 68, 68, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.9em;
  font-weight: 500;
}

.dark .custom-markdown :deep(code) {
  color: #fca5a5; /* red-300 */
  background: rgba(239, 68, 68, 0.15);
}

.custom-markdown :deep(pre) {
  background: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-markdown :deep(pre code) {
  color: inherit;
  background: transparent;
  padding: 0;
}

.custom-markdown :deep(a) {
  color: #6366f1;
  text-decoration: none;
  border-bottom: 1px dashed #6366f1;
  transition: all 0.2s;
}

.custom-markdown :deep(a:hover) {
  color: #4f46e5;
  border-bottom-style: solid;
}

.custom-markdown :deep(ul),
.custom-markdown :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.5em;
}

.custom-markdown :deep(li) {
  margin-bottom: 0.5em;
  color: #475569;
}

.dark .custom-markdown :deep(li) {
  color: #cbd5e1;
}

/* Tiptap content styling matching prose */
.rich-text-content :deep(p) {
  margin-bottom: 1.5em;
  line-height: 1.8;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
