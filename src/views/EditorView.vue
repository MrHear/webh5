<template>
  <div class="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] flex flex-col text-gray-800 dark:text-white font-sans transition-colors duration-300">
    <!-- 顶部栏 -->
    <div class="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="hover:text-emerald-500 transition-colors">
          <i class="ph ph-arrow-left text-xl"></i>
        </button>
        <span class="text-xs text-gray-500 tracking-widest font-mono">草稿模式 // 系统激活</span>
      </div>

      <div class="flex items-center gap-6">
        <!-- 模式切换器 -->
        <div class="flex bg-gray-200 dark:bg-gray-900 rounded p-1 border border-gray-300 dark:border-gray-800">
          <button 
            @click="currentMode = 'markdown'"
            class="px-4 py-1.5 text-xs rounded transition-all font-bold"
            :class="currentMode === 'markdown' ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
          >
            Markdown
          </button>
          <button 
            @click="currentMode = 'richtext'"
            class="px-4 py-1.5 text-xs rounded transition-all font-bold"
            :class="currentMode === 'richtext' ? 'bg-white dark:bg-purple-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
          >
            富文本
          </button>
        </div>

        <button 
          @click="handlePublish"
          class="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 text-sm font-bold rounded flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <i class="ph ph-paper-plane-right"></i>
          发布
        </button>
      </div>
    </div>

    <!-- 核心区域 -->
    <div class="flex-1 flex flex-col max-w-5xl mx-auto w-full p-8 gap-8">
      <!-- 标题输入 -->
      <input 
        v-model="title"
        type="text" 
        placeholder="输入信号标题..." 
        class="w-full bg-transparent text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-700 outline-none border-none py-4"
      />

      <!-- 编辑器 -->
      <div class="flex-1 min-h-[500px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-sm">
        <!-- Markdown 编辑器 -->
        <MdEditor 
          v-if="currentMode === 'markdown'"
          v-model="content" 
          :theme="isDarkMode ? 'dark' : 'light'" 
          language="zh-CN"
          class="h-full"
        />
        
        <!-- 富文本编辑器 -->
        <div v-else class="h-full flex flex-col">
          <div v-if="editor" class="border-b border-gray-200 dark:border-gray-800 p-2 flex gap-2 bg-gray-50 dark:bg-gray-900/50">
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'text-purple-500 bg-purple-100 dark:bg-purple-900/30': editor.isActive('bold') }" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
              <i class="ph ph-text-b"></i>
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'text-purple-500 bg-purple-100 dark:bg-purple-900/30': editor.isActive('italic') }" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
              <i class="ph ph-text-italic"></i>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'text-purple-500 bg-purple-100 dark:bg-purple-900/30': editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
              <i class="ph ph-text-h-two"></i>
            </button>
          </div>
          <editor-content :editor="editor" class="flex-1 p-6 prose dark:prose-invert prose-purple max-w-none overflow-y-auto focus:outline-none" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const router = useRouter()
const postsStore = usePostsStore()

const currentMode = ref<'markdown' | 'richtext'>('markdown')
const title = ref('')
const content = ref('')
const isDarkMode = ref(true) // 默认

// 检测当前主题
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
  // 监听主题变化（简单实现，如果需要响应式可以用 MutationObserver 或 Pinia 共享状态）
  const observer = new MutationObserver(() => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

// Tiptap setup
const editor = useEditor({
  content: '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[300px]',
    },
  },
  onUpdate: ({ editor }) => {
    if (currentMode.value === 'richtext') {
      content.value = editor.getHTML()
    }
  }
})

// Sync content when switching modes (Basic sync)
watch(currentMode, (newMode) => {
  if (newMode === 'richtext') {
    if (editor.value && !editor.value.getText()) {
      editor.value.commands.setContent(content.value)
    }
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const handlePublish = () => {
  if (!title.value.trim()) {
    alert('错误: 标题不能为空')
    return
  }
  
  let finalContent = content.value
  if (currentMode.value === 'richtext' && editor.value) {
    finalContent = editor.value.getHTML()
  }

  postsStore.addPost({
    title: title.value,
    content: finalContent,
    summary: finalContent.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...', 
    type: currentMode.value,
    tags: ['新信号']
  })

  router.push('/')
}
</script>

<style>
/* Global override for md-editor to match theme better if needed */
.md-editor-dark {
  --md-bk-color: #0a0a0a !important;
}
</style>
